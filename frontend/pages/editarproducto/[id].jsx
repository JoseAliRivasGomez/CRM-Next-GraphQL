import { useRouter } from "next/router"
import Layout from "../../components/Layout"
import { useMutation, useQuery, gql } from '@apollo/client';
import {Formik} from 'formik';
import * as Yup from 'yup'
import Swal from "sweetalert2";

const OBTENER_PRODUCTO = gql`
    query obtenerProducto($id: ID!){
        obtenerProducto(id: $id){
            nombre
            precio
            existencia
        }
    }
`;

const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id: ID!, $input: ProductoInput){
        actualizarProducto(id: $id, input: $input){
            id
            nombre
            precio
            existencia
            creado
        }
    }
`;

const EditarProducto = () => {

    const router = useRouter();
    const {query: {id}} = router;

    const {data, loading, error} = useQuery(OBTENER_PRODUCTO, {
        variables: {
            id
        }
    });

    const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO);

    const schemaValidation = Yup.object({
        nombre: Yup.string().required('El nombre es obligatorio'),
        existencia: Yup.number().required('La cantidad es obligatoria').positive('No se acepta una cantidad negativa').integer('La cantidad debe ser un numero entero'),
        precio: Yup.number().required('El precio es obligatorio').positive('No se acepta una cantidad negativa'),
    });

    const actualizarInfoProducto = async (valores) => {
        const {nombre, existencia, precio} = valores;
        try {
            
            const {data} = await actualizarProducto({
                variables: {
                    id,
                    input: {
                        nombre,
                        existencia,
                        precio,
                    }
                }
            });

            //console.log(data);

            Swal.fire(
                'Actualizado!',
                'Producto actualizado correctamente!',
                'success'
              )

            router.push('/productos');

        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div>
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Editar Producto</h1>
            {
                !loading && data?.obtenerProducto?.nombre && (
                    <div className="flex justify-center mt-5">
                        <div className="w-full max-w-lg">
                            <Formik 
                                validationSchema={schemaValidation}
                                enableReinitialize
                                initialValues={data.obtenerProducto}
                                onSubmit={(valores, funciones) => {
                                    actualizarInfoProducto(valores)
                                }}
                            >
                                {
                                    props => {
                                        //console.log(props);
                                        return (
                                <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={props.handleSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre</label>
                                        <input type="text" id="nombre" placeholder="Nombre producto" value={props.values.nombre} onChange={props.handleChange} onBlur={props.handleBlur}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline focus:outline-offset-2 focus:outline-2" />
                                    </div>
                                    {props.touched.nombre && props.errors.nombre ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                            <p className="font-bold">{props.errors.nombre}</p>
                                        </div>
                                    ) : null}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existencia">Cantidad disponible</label>
                                        <input type="number" id="existencia" placeholder="Cantidad disponible producto" value={props.values.existencia} onChange={props.handleChange} onBlur={props.handleBlur}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline focus:outline-offset-2 focus:outline-2" />
                                    </div>
                                    {props.touched.existencia && props.errors.existencia ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                            <p className="font-bold">{props.errors.existencia}</p>
                                        </div>
                                    ) : null}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">Precio</label>
                                        <input type="number" id="precio" placeholder="Precio producto" value={props.values.precio} onChange={props.handleChange} onBlur={props.handleBlur}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline focus:outline-offset-2 focus:outline-2" />
                                    </div>
                                    {props.touched.precio && props.errors.precio ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                            <p className="font-bold">{props.errors.precio}</p>
                                        </div>
                                    ) : null}
                                    <input type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 cursor-pointer" value="Actualizar producto" />
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

export default EditarProducto