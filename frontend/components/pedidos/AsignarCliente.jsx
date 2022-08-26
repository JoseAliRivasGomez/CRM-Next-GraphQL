import Select from 'react-select'
import { useContext, useEffect, useState } from "react"
import { useQuery, gql } from '@apollo/client';
import { PedidoContext } from '../../context/pedidos/PedidoContext';

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

export const AsignarCliente = () => {

    const {agregarCliente} = useContext(PedidoContext);
    const {data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);

    const [cliente, setCliente] = useState({});

    useEffect(() => {
        agregarCliente(cliente);
    }, [cliente])
    
    const seleccionarCliente = (cliente) => {
      setCliente(cliente);
    }

  return (
    <>
        <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>1. Asigna un cliente al pedido</p>
        {
            !loading && data?.obtenerClientesVendedor[0] && (
            <Select 
                className='mt-3'
                options={data.obtenerClientesVendedor} 
                isMulti={false} 
                onChange={(cliente) => seleccionarCliente(cliente)} 
                noOptionsMessage={() => "No hay resultados"}
                placeholder="Busque o seleccione el cliente"
                getOptionValue={(opciones) => opciones.id} 
                getOptionLabel={(opciones) => `${opciones.nombre} ${opciones.apellido}`} 
            />
            )
        }
        
    </>
  )
}
