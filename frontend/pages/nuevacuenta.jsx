import Layout from "../components/Layout"
import {useFormik} from 'formik'
import * as Yup from 'yup'
import { useMutation, gql } from '@apollo/client';
import { useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Link from 'next/link';

const NUEVA_CUENTA = gql`
    mutation nuevoUsuario($input: UsuarioInput) {
        nuevoUsuario(input: $input) {
            id
            nombre
            apellido
            email
            creado
        }
    }
`;

const NuevaCuenta = () => {

    const [nuevoUsuario] = useMutation(NUEVA_CUENTA);
    const [mensaje, setMensaje] = useState(null);
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            apellido: Yup.string().required('El apellido es obligatorio'),
            email: Yup.string().email('El correo no es valido').required('El correo es obligatorio'),
            password: Yup.string().required('La contraseña es obligatoria').min(8, 'La contraseña debe ser de al menos 8 caracteres'),
        }),
        onSubmit: async valores => {
            //console.log(valores);
            const {nombre, apellido, email, password} = valores;
            try {
                const {data} = await nuevoUsuario({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            email,
                            password,
                        }
                    }
                });
                // setMensaje(`Se creó correctamente el usuario: ${data.nuevoUsuario.nombre}`);
                // setTimeout(() => {
                //     setMensaje(null);
                //     router.push('/login');
                // }, 1000);
                Swal.fire(
                    'Usuario creado!',
                    'Usuario creado correctamente!',
                    'success'
                )
                router.push('/login');
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
    <Layout>
        {
            mensaje && mostrarMensaje()
        }
        <h1 className="text-center text-2xl text-white font-light">Nueva cuenta</h1>
        <div className="flex justify-center mt-5">
            <div className="w-full max-w-sm">
                <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre</label>
                        <input type="text" id="nombre" placeholder="Nombre usuario" value={formik.values.nombre} onChange={formik.handleChange} onBlur={formik.handleBlur}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline focus:outline-offset-2 focus:outline-2" />
                    </div>
                    {formik.touched.nombre && formik.errors.nombre ? (
                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                            <p className="font-bold">{formik.errors.nombre}</p>
                        </div>
                    ) : null}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">Apellido</label>
                        <input type="text" id="apellido" placeholder="Apellido usuario" value={formik.values.apellido} onChange={formik.handleChange} onBlur={formik.handleBlur}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline focus:outline-offset-2 focus:outline-2" />
                    </div>
                    {formik.touched.apellido && formik.errors.apellido ? (
                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                            <p className="font-bold">{formik.errors.apellido}</p>
                        </div>
                    ) : null}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Correo</label>
                        <input type="email" id="email" placeholder="Correo usuario" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline focus:outline-offset-2 focus:outline-2" />
                    </div>
                    {formik.touched.email && formik.errors.email ? (
                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                            <p className="font-bold">{formik.errors.email}</p>
                        </div>
                    ) : null}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Contraseña</label>
                        <input type="password" id="password" placeholder="Contraseña usuario" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline focus:outline-offset-2 focus:outline-2" />
                    </div>
                    {formik.touched.password && formik.errors.password ? (
                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                            <p className="font-bold">{formik.errors.password}</p>
                        </div>
                    ) : null}
                    <Link href='/login'>
                        <a className="underline float-right">Ingresar</a>
                    </Link>
                    <input type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 cursor-pointer" value="Crear cuenta" />
                </form>
            </div>
        </div>
    </Layout>
  )
}

export default NuevaCuenta