import Layout from "../components/Layout"
import { useQuery, gql } from '@apollo/client';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect } from "react";

const MEJORES_CLIENTES = gql`
  query mejoresClientes {
    mejoresClientes{
      cliente{
        nombre
        apellido
        empresa
      }
      total
    }
  }
`;

const MejoresClientes = () => {

  const {data, loading, error, startPolling, stopPolling} = useQuery(MEJORES_CLIENTES);

  useEffect(() => {
    
      startPolling(1000); //only if changed
  
    return () => {
      stopPolling();
    }
  }, [startPolling, stopPolling])
  

  const clienteGrafica = [];

  if(!loading && data?.mejoresClientes[0]){
      //console.log(data);
      data.mejoresClientes.map((cliente, index) => {
          clienteGrafica[index] = {
              ...cliente.cliente[0],
              total: cliente.total
          }
      })
      //console.log(clienteGrafica);
  }

  return (
    <div>
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Mejores Clientes</h1>
            {
                !loading && data?.mejoresClientes[0] && (
                    <ResponsiveContainer width={'99%'} height={650}>
                      <BarChart
                          className="mt-10"
                          width={1000}
                          height={600}
                          data={clienteGrafica}
                          margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                          }}
                      >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="nombre" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="total" fill="#3182ce" />
                      </BarChart>
                    </ResponsiveContainer>
                )
            }
        </Layout>
    </div>
  )
}

export default MejoresClientes