import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { useMutation, gql } from '@apollo/client';

const ELIMINAR_PRODUCTO = gql`
    mutation eliminarProducto($id: ID!){
        eliminarProducto(id: $id)
    }
`;

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos{
    obtenerProductos{
      id
      nombre
      precio
      existencia
    }
  }
`;

export const Producto = ({producto}) => {

    const {nombre, existencia, precio, id} = producto;
    const router = useRouter();

    const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
        update(cache) {
            const {obtenerProductos} = cache.readQuery({query: OBTENER_PRODUCTOS});
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: obtenerProductos.filter(producto => producto.id !== id)
                }
            });
        }
    });

    const editarProducto = () => {
        router.push({
            pathname: "/editarproducto/[id]",
            query: {id}
        })
    }

    const confirmarEliminarProducto = () => {
        
        Swal.fire({
            title: '¿Deseas eliminar este producto?',
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

                    const {data} = await eliminarProducto({
                        variables: {
                            id
                        }
                    });
                    //console.log(data);

                    Swal.fire(
                        'Eliminado!',
                        data.eliminarProducto,
                        'success'
                      )
                    
                } catch (error) {
                    console.log(error);
                    Swal.fire(
                        'Error',
                        'Error al eliminar producto',
                        'error'
                      )
                }

            }
          })

    }

  return (
    <tr>
        <td className='border px-4 py-2'>{nombre}</td>
        <td className='border px-4 py-2'>{existencia} unidades</td>
        <td className='border px-4 py-2'>${precio}</td>
        <td className='border px-4 py-2'>
            <button type="button" onClick={() => editarProducto()}
                className="flex justify-center items-center bg-green-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                Editar
            </button>
        </td>
        <td className='border px-4 py-2'>
            <button type="button" onClick={() => confirmarEliminarProducto()}
                className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Eliminar
            </button>
        </td>
    </tr>
  )
}
