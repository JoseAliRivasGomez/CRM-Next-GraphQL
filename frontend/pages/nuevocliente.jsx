import Layout from "../components/Layout"
import {useFormik} from 'formik'
import * as Yup from 'yup'
import { useMutation, gql } from '@apollo/client';
import { useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

const NUEVO_CLIENTE = gql`
    mutation nuevoCliente($input: ClienteInput) {
        nuevoCliente(input: $input) {
            id
            nombre
            apellido
            empresa
            email
            telefono
            vendedor
            creado
        }
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

const NuevoCliente = () => {

    const [nuevoCliente] = useMutation(NUEVO_CLIENTE, {
        update(cache, {data: {nuevoCliente}}){
            const {obtenerClientesVendedor} = cache.readQuery({query: OBTENER_CLIENTES_USUARIO});
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data: {
                    obtenerClientesVendedor: [...obtenerClientesVendedor, nuevoCliente]
                }
            });
        }
    });
    const [mensaje, setMensaje] = useState(null);
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            empresa: '',
            email: '',
            telefono: '',
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            apellido: Yup.string().required('El apellido es obligatorio'),
            empresa: Yup.string().required('La empresa es obligatoria'),
            email: Yup.string().email('El correo no es valido').required('El correo es obligatorio'),
        }),
        onSubmit: async valores => {
            //console.log(valores);
            const {nombre, apellido, email, empresa, telefono} = valores;
            try {
                const {data} = await nuevoCliente({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            email,
                            empresa,
                            telefono
                        }
                    }
                });
                Swal.fire(
                    'Cliente creado!',
                    'Cliente creado correctamente!',
                    'success'
                )
                router.push('/');
                //console.log(data);
            } catch (error) {
                setMensaje(error.message.replace('GraphQL error: ', ''));
                setTimeout(() => {
                    setMensaje(null);
                }, 3000);
                //console.log(error);
            }
        }
    });

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
            <h1 className='text-2xl text-gray-800 font-light'>Nuevo Cliente</h1>
            {
                mensaje && mostrarMensaje()
            }
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre</label>
                            <input type="text" id="nombre" placeholder="Nombre cliente" value={formik.values.nombre} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline focus:outline-offset-2 focus:outline-2" />
                        </div>
                        {formik.touched.nombre && formik.errors.nombre ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                <p className="font-bold">{formik.errors.nombre}</p>
                            </div>
                        ) : null}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">Apellido</label>
                            <input type="text" id="apellido" placeholder="Apellido cliente" value={formik.values.apellido} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline focus:outline-offset-2 focus:outline-2" />
                        </div>
                        {formik.touched.apellido && formik.errors.apellido ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                <p className="font-bold">{formik.errors.apellido}</p>
                            </div>
                        ) : null}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empresa">Empresa</label>
                            <input type="text" id="empresa" placeholder="Empresa cliente" value={formik.values.empresa} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline focus:outline-offset-2 focus:outline-2" />
                        </div>
                        {formik.touched.empresa && formik.errors.empresa ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                <p className="font-bold">{formik.errors.empresa}</p>
                            </div>
                        ) : null}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Correo</label>
                            <input type="email" id="email" placeholder="Correo cliente" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline focus:outline-offset-2 focus:outline-2" />
                        </div>
                        {formik.touched.email && formik.errors.email ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                <p className="font-bold">{formik.errors.email}</p>
                            </div>
                        ) : null}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">Telefono</label>
                            <input type="tel" id="telefono" placeholder="Telefono cliente" value={formik.values.telefono} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline focus:outline-offset-2 focus:outline-2" />
                        </div>
                        <input type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 cursor-pointer" value="Crear cliente" />
                    </form>
                </div>
            </div>
        </Layout>
    </div>
  )
}

export default NuevoCliente