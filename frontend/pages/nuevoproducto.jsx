import Layout from "../components/Layout"
import {useFormik} from 'formik'
import * as Yup from 'yup'
import { useMutation, gql } from '@apollo/client';
import { useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

const NUEVO_PRODUCTO = gql`
    mutation nuevoProducto($input: ProductoInput) {
        nuevoProducto(input: $input) {
            id
            nombre
            existencia
            precio
            creado
        }
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

const NuevoProducto = () => {

    const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
        update(cache, {data: {nuevoProducto}}){
            const {obtenerProductos} = cache.readQuery({query: OBTENER_PRODUCTOS});
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: [...obtenerProductos, nuevoProducto]
                }
            });
        }
    });
    const [mensaje, setMensaje] = useState(null);
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            nombre: '',
            existencia: '',
            precio: '',
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            existencia: Yup.number().required('La cantidad es obligatoria').positive('No se acepta una cantidad negativa').integer('La cantidad debe ser un numero entero'),
            precio: Yup.number().required('El precio es obligatorio').positive('No se acepta una cantidad negativa'),
        }),
        onSubmit: async valores => {
            //console.log(valores);
            const {nombre, existencia, precio} = valores;
            try {
                const {data} = await nuevoProducto({
                    variables: {
                        input: {
                            nombre,
                            existencia,
                            precio,
                        }
                    }
                });
                Swal.fire(
                    'Producto creado!',
                    'Producto creado correctamente!',
                    'success'
                )
                router.push('/productos');
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
            <h1 className='text-2xl text-gray-800 font-light'>Nuevo Producto</h1>
            {
                mensaje && mostrarMensaje()
            }
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre</label>
                            <input type="text" id="nombre" placeholder="Nombre producto" value={formik.values.nombre} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline focus:outline-offset-2 focus:outline-2" />
                        </div>
                        {formik.touched.nombre && formik.errors.nombre ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                <p className="font-bold">{formik.errors.nombre}</p>
                            </div>
                        ) : null}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existencia">Cantidad disponible</label>
                            <input type="number" id="existencia" placeholder="Cantidad disponible producto" value={formik.values.existencia} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline focus:outline-offset-2 focus:outline-2" />
                        </div>
                        {formik.touched.existencia && formik.errors.existencia ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                <p className="font-bold">{formik.errors.existencia}</p>
                            </div>
                        ) : null}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">Precio</label>
                            <input type="number" id="precio" placeholder="Precio producto" value={formik.values.precio} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline focus:outline-offset-2 focus:outline-2" />
                        </div>
                        {formik.touched.precio && formik.errors.precio ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                <p className="font-bold">{formik.errors.precio}</p>
                            </div>
                        ) : null}
                        <input type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 cursor-pointer" value="Crear producto" />
                    </form>
                </div>
            </div>
        </Layout>
    </div>
  )
}

export default NuevoProducto