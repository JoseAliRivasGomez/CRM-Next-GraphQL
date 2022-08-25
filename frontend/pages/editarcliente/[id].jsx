import { useRouter } from "next/router"
import Layout from "../../components/Layout";
import { useMutation, useQuery, gql } from '@apollo/client';
import {Formik} from 'formik';
import * as Yup from 'yup'
import Swal from "sweetalert2";

const OBTENER_CLIENTE = gql`
    query obtenerCliente($id: ID!){
        obtenerCliente(id: $id){
            nombre
            apellido
            empresa
            email
            telefono
        }
    }
`;

const ACTUALIZAR_CLIENTE = gql`
    mutation actualizarCliente($id: ID!, $input: ClienteInput){
        actualizarCliente(id: $id, input: $input){
            id
            nombre
            apellido
            empresa
            email
            telefono
        }
    }
`;

const EditarCliente = () => {

    const router = useRouter();
    const {query: {id}} = router;

    const {data, loading, error} = useQuery(OBTENER_CLIENTE, {
        variables: {
            id
        }
    });

    const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE);

    const schemaValidation = Yup.object({
        nombre: Yup.string().required('El nombre es obligatorio'),
        apellido: Yup.string().required('El apellido es obligatorio'),
        empresa: Yup.string().required('La empresa es obligatoria'),
        email: Yup.string().email('El correo no es valido').required('El correo es obligatorio'),
    });

    const actualizarInfoCliente = async (valores) => {
        const {nombre, apellido, empresa, email, telefono} = valores;
        try {
            
            const {data} = await actualizarCliente({
                variables: {
                    id,
                    input: {
                        nombre,
                        apellido,
                        empresa,
                        email,
                        telefono,
                    }
                }
            });

            //console.log(data);

            Swal.fire(
                'Actualizado!',
                'Cliente actualizado correctamente!',
                'success'
              )

            router.push('/');

        } catch (error) {
            console.log(error);
        }
    }
    
  return (
    <div>
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Editar Cliente</h1>
            {
                !loading && data?.obtenerCliente?.nombre && (
                    <div className="flex justify-center mt-5">
                        <div className="w-full max-w-lg">
                            <Formik 
                                validationSchema={schemaValidation}
                                enableReinitialize
                                initialValues={data.obtenerCliente}
                                onSubmit={(valores, funciones) => {
                                    actualizarInfoCliente(valores)
                                }}
                            >
                                {
                                    props => {
                                        //console.log(props);
                                        return (
                                <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={props.handleSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre</label>
                                        <input type="text" id="nombre" placeholder="Nombre cliente" value={props.values.nombre} onChange={props.handleChange} onBlur={props.handleBlur}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline focus:outline-offset-2 focus:outline-2" />
                                    </div>
                                    {props.touched.nombre && props.errors.nombre ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                            <p className="font-bold">{props.errors.nombre}</p>
                                        </div>
                                    ) : null}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">Apellido</label>
                                        <input type="text" id="apellido" placeholder="Apellido cliente" value={props.values.apellido} onChange={props.handleChange} onBlur={props.handleBlur}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline focus:outline-offset-2 focus:outline-2" />
                                    </div>
                                    {props.touched.apellido && props.errors.apellido ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                            <p className="font-bold">{props.errors.apellido}</p>
                                        </div>
                                    ) : null}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empresa">Empresa</label>
                                        <input type="text" id="empresa" placeholder="Empresa cliente" value={props.values.empresa} onChange={props.handleChange} onBlur={props.handleBlur}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline focus:outline-offset-2 focus:outline-2" />
                                    </div>
                                    {props.touched.empresa && props.errors.empresa ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                            <p className="font-bold">{props.errors.empresa}</p>
                                        </div>
                                    ) : null}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Correo</label>
                                        <input type="email" id="email" placeholder="Correo cliente" value={props.values.email} onChange={props.handleChange} onBlur={props.handleBlur}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline focus:outline-offset-2 focus:outline-2" />
                                    </div>
                                    {props.touched.email && props.errors.email ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                            <p className="font-bold">{props.errors.email}</p>
                                        </div>
                                    ) : null}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">Telefono</label>
                                        <input type="tel" id="telefono" placeholder="Telefono cliente" value={props.values.telefono} onChange={props.handleChange} onBlur={props.handleBlur}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline focus:outline-offset-2 focus:outline-2" />
                                    </div>
                                    <input type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 cursor-pointer" value="Actualizar cliente" />
                                </form>
                                        )
                                    }
                                }
                                
                            </Formik>
                        </div>
                    </div>
                )
            }
            
        </Layout>
    </div>
  )
}

export default EditarCliente