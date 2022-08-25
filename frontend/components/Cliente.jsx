import Swal from 'sweetalert2'
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';

const ELIMINAR_CLIENTE = gql`
    mutation eliminarCliente($id: ID!){
        eliminarCliente(id: $id)
    }
`;

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor{
    obtenerClientesVendedor{
      id
      nombre
      apellido
      empresa
      email
    }
  }
`;

export const Cliente = ({cliente}) => {

    const {nombre, apellido, empresa, email, id} = cliente;
    const router = useRouter();

    const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE, {
        update(cache) {
            const {obtenerClientesVendedor} = cache.readQuery({query: OBTENER_CLIENTES_USUARIO});
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data: {
                    obtenerClientesVendedor: obtenerClientesVendedor.filter(cliente => cliente.id !== id)
                }
            });
        }
    });

    const editarCliente = () => {
        router.push({
            pathname: "/editarcliente/[id]",
            query: {id}
        })
    }

    const confirmarEliminarCliente = () => {
        
        Swal.fire({
            title: '¿Deseas eliminar este cliente?',
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

                    const {data} = await eliminarCliente({
                        variables: {
                            id
                        }
                    });
                    //console.log(data);

                    Swal.fire(
                        'Eliminado!',
                        data.eliminarCliente,
                        'success'
                      )
                    
                } catch (error) {
                    console.log(error);
                    Swal.fire(
                        'Error',
                        'Error al eliminar cliente',
                        'error'
                      )
                }

            }
          })

    }

  return (
    <tr>
        <td className='border px-4 py-2'>{nombre} {apellido}</td>
        <td className='border px-4 py-2'>{empresa}</td>
        <td className='border px-4 py-2'>{email}</td>
        <td className='border px-4 py-2'>
            <button type="button" onClick={() => editarCliente()}
                className="flex justify-center items-center bg-green-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                Editar
            </button>
        </td>
        <td className='border px-4 py-2'>
            <button type="button" onClick={() => confirmarEliminarCliente()}
                className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Eliminar
            </button>
        </td>
    </tr>
  )
}
