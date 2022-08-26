import { useContext, useState } from "react"
import Layout from "../components/Layout"
import { AsignarCliente } from "../components/pedidos/AsignarCliente"
import { AsignarProductos } from "../components/pedidos/AsignarProductos"
import { ResumenPedido } from "../components/pedidos/ResumenPedido"
import { Total } from "../components/pedidos/Total"
import { PedidoContext } from "../context/pedidos/PedidoContext"
import { useMutation, gql } from '@apollo/client';
import Swal from "sweetalert2"
import { useRouter } from "next/router"

const NUEVO_PEDIDO = gql`
mutation nuevoPedido($input: PedidoInput) {
  nuevoPedido(input: $input) {
    id
  }
}
`;

//ERROR AL RECIBIR EL ID DE LOS PRODUCTOS, MEZCLA LAS CANTIDADES
const OBTENER_PEDIDOS_USUARIO = gql`
  query obtenerPedidosVendedor{
    obtenerPedidosVendedor{
      id
      pedido{
        cantidad
        nombre
        precio
      }
      total
      cliente{
        id
        nombre
        apellido
        email
        telefono
      }
      vendedor
      estado
      creado
    }
  }
`;

const NuevoPedido = () => {

    const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
      update(cache, {data: {nuevoPedido}}){
          const {obtenerPedidosVendedor} = cache.readQuery({query: OBTENER_PEDIDOS_USUARIO});
          cache.writeQuery({
              query: OBTENER_PEDIDOS_USUARIO,
              data: {
                obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido]
              }
          });
      }
  });
    const [mensaje, setMensaje] = useState(null);
    const router = useRouter();

    const {cliente, productos, total} = useContext(PedidoContext);

    const validarPedido = () => {
        return !productos.every(producto => producto.cantidad > 0 ) || total === 0 || !cliente?.nombre ? ' opacity-50 cursor-not-allowed ' : '';
    }

    const crearNuevoPedido = async () => {

        const pedido = productos.map(({existencia, __typename, ...producto}) => producto);

        try {
            const {data} = await nuevoPedido({
              variables: {
                input: {
                  cliente: cliente.id,
                  total,
                  pedido
                }
              }
            })

            Swal.fire(
                'Pedido creado!',
                'Pedido creado correctamente!',
                'success'
            )
            router.push('/pedidos');

        } catch (error) {
            setMensaje(error.message.replace('GraphQL error: ', ''));
            setTimeout(() => {
                setMensaje(null);
            }, 3000);
        }
    }

    const mostrarMensaje = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    }

  return (
    <div>
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Nuevo Pedido</h1>
            {
                mensaje && mostrarMensaje()
            }
            <div className="flex justify-center mt-5">
              <div className="w-full max-w-lg">
                <AsignarCliente />
                <AsignarProductos />
                <ResumenPedido />
                <Total />
                <button type="button" onClick={() => crearNuevoPedido()}
                  className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 cursor-pointer ${validarPedido()}`}>
                  Crear pedido
                </button>
              </div>
            </div>
        </Layout>
    </div>
  )
}

export default NuevoPedido