import Select from 'react-select'
import { useContext, useEffect, useState } from "react"
import { useQuery, gql } from '@apollo/client';
import { PedidoContext } from '../../context/pedidos/PedidoContext';

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

export const AsignarProductos = () => {

    const {agregarProducto} = useContext(PedidoContext);
    const {data, loading, error } = useQuery(OBTENER_PRODUCTOS);

    const [productos, setProductos] = useState([]);

    useEffect(() => {
        agregarProducto(productos);
    }, [productos])
    
    const seleccionarProducto = (productos) => {
      setProductos(productos);
    }

  return (
    <>
        <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>2. Selecciona o busca los productos</p>
        {
            !loading && data?.obtenerProductos[0] && (
            <Select 
                className='mt-3'
                options={data.obtenerProductos} 
                isMulti={true} 
                onChange={(productos) => seleccionarProducto(productos)} 
                noOptionsMessage={() => "No hay resultados"}
                placeholder="Busque o seleccione los productos"
                getOptionValue={(opciones) => opciones.id} 
                getOptionLabel={(opciones) => `${opciones.nombre} --- ${opciones.existencia} disponibles`} 
            />
            )
        }
        
    </>
  )
}
