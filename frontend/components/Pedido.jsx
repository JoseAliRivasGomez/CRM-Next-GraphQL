import { useEffect, useState } from "react";
import { useMutation, gql } from '@apollo/client';
import Swal from "sweetalert2";


const ACTUALIZAR_PEDIDO = gql`
    mutation actualizarPedido($id: ID!, $input: PedidoInput){
        actualizarPedido(id: $id, input: $input){
            estado
            id
        }
    }
`;

const ELIMINAR_PEDIDO = gql`
    mutation eliminarPedido($id: ID!){
        eliminarPedido(id: $id)
    }
`;

const OBTENER_PEDIDOS_USUARIO = gql`
  query obtenerPedidosVendedor{
    obtenerPedidosVendedor{
      id
    }
  }
`;

export const Pedido = ({pedido}) => {

    const {id, total, cliente: {nombre, apellido, telefono, email}, estado, cliente} = pedido;
    //console.log(pedido);

    const [actualizarPedido] = useMutation(ACTUALIZAR_PEDIDO);

    const [eliminarPedido] = useMutation(ELIMINAR_PEDIDO, {
        update(cache) {
            const {obtenerPedidosVendedor} = cache.readQuery({query: OBTENER_PEDIDOS_USUARIO});
            cache.writeQuery({
                query: OBTENER_PEDIDOS_USUARIO,
                data: {
                    obtenerPedidosVendedor: obtenerPedidosVendedor.filter(pedido => pedido.id !== id)
                }
            });
        }
    });

    const [estadoPedido, setEstadoPedido] = useState(estado);
    const [clase, setClase] = useState('');

    useEffect(() => {
      if(estadoPedido){
        setEstadoPedido(estadoPedido);
      }
      clasePedido();
    }, [estadoPedido])
    
    const clasePedido = () => {
        if(estadoPedido === 'PENDIENTE'){
            setClase('border-yellow-500');
        }else if(estadoPedido === 'COMPLETADO'){
            setClase('border-green-500');
        }else{
            setClase('border-red-800');
        }
    }

    const cambiarEstadoPedido = async (nuevoEstado) => {
        
        try {
            
            const {data} = await actualizarPedido({
                variables: {
                    id,
                    input: {
                        cliente: cliente.id,
                        estado: nuevoEstado
                    }
                }
            })

            setEstadoPedido(data.actualizarPedido.estado);

        } catch (error) {
            console.log(error);
        }

    }

    const confirmarEliminarPedido = () => {

        Swal.fire({
            title: '¿Deseas eliminar este pedido?',
            text: "Esta acción no se puede deshacer!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'No, cancelar'
          }).then(async (result) => {
            if (result.isConfirmed) {

                try {

                    const {data} = await eliminarPedido({
                        variables: {
                            id
                        }
                    });
                    //console.log(data);

                    Swal.fire(
                        'Eliminado!',
                        data.eliminarPedido,
                        'success'
                      )
                    
                } catch (error) {
                    console.log(error);
                    Swal.fire(
                        'Error',
                        'Error al eliminar pedido',
                        'error'
                      )
                }

            }
          })

    }

  return (
    <div className={`mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg border-t-4 ${clase}`}>
        <div>
            <p className="font-bold text-gray-800">Cliente: {nombre} {apellido}</p>
            <p className="flex items-center my-2">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                {email}
            </p>
            {
                telefono && (
                    <p className="flex items-center my-2">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        {telefono}
                    </p>
                )
            }
            <h2 className="text-gray-800 font-bold mt-10">Estado Pedido: </h2>
            <select value={estadoPedido} onChange={e => cambiarEstadoPedido(e.target.value)}
                className="mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline focus:outline-offset-2 focus:outline-2 focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold">
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="COMPLETADO">COMPLETADO</option>
                <option value="CANCELADO">CANCELADO</option>
            </select>
        </div>
        <div>
            <h2 className="text-gray-800 font-bold mt-2">Resumen del Pedido</h2>
            {
                pedido.pedido.map(producto => (
                    <div key={producto.nombre} className="mt-4">
                        <p className="text-sm text-gray-600">Producto: {producto.nombre}</p>
                        <p className="text-sm text-gray-600">Cantidad: {producto.cantidad}</p>
                    </div>
                ))
            }
            <p className="text-gray-800 mt-3 font-bold ">Total a pagar: 
                <span className="font-light"> ${total}</span>
            </p>

            <button onClick={() => confirmarEliminarPedido()} className="flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight uppercase text-xs font-bold">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Eliminar Pedido
            </button>
            
        </div>
    </div>
  )
}
