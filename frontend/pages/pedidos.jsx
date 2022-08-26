import Link from "next/link"
import Layout from "../components/Layout"
import { useQuery, gql } from '@apollo/client';
import { Pedido } from "../components/Pedido";
import { useEffect } from "react";

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

const Pedidos = () => {

    const {data, loading, error, refetch} = useQuery(OBTENER_PEDIDOS_USUARIO);

    useEffect(() => {
        if(localStorage.getItem('reloadPedidos') === 'yes'){
            localStorage.setItem('reloadPedidos', 'no');
            refetch();
            //console.log('Pedidos recargados');
        }
    }, []);

    if(data){
      //console.log(data);
    }

  return (
    <div>
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Pedidos</h1>
            <Link href='/nuevopedido'>
              <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Nuevo Pedido</a>
            </Link>
            {
              !loading && data?.obtenerPedidosVendedor[0] && (
                data.obtenerPedidosVendedor.map(pedido => (
                  <Pedido key={pedido.id} pedido={pedido} />
                ))
              )
            }
            {
              !loading && !data?.obtenerPedidosVendedor[0] && (
                <p className="mt-5 text-center text-2xl">No tienes pedidos aun</p>
              )
            }
        </Layout>
    </div>
  )
}

export default Pedidos