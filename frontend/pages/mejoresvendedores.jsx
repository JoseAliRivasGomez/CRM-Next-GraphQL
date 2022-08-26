import Layout from "../components/Layout"
import { useQuery, gql } from '@apollo/client';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect } from "react";

const MEJORES_VENDEDORES = gql`
    query mejoresVendedores {
        mejoresVendedores{
            vendedor{
                nombre
                apellido
                email
            }
            total
        }
    }
`;



const MejoresVendedores = () => {

    const {data, loading, error, startPolling, stopPolling} = useQuery(MEJORES_VENDEDORES);

    useEffect(() => {
      
        startPolling(1000); //only if changed
    
      return () => {
        stopPolling();
      }
    }, [startPolling, stopPolling])
    

    const vendedorGrafica = [];

    if(!loading && data?.mejoresVendedores[0]){
        //console.log(data);
        data.mejoresVendedores.map((vendedor, index) => {
            vendedorGrafica[index] = {
                ...vendedor.vendedor[0],
                total: vendedor.total
            }
        })
    }

  return (
    <div>
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Mejores Vendedores</h1>
            {
                !loading && data?.mejoresVendedores[0] && (
                    <ResponsiveContainer width={'99%'} height={650}>
                        <BarChart
                            className="mt-10"
                            width={1000}
                            height={600}
                            data={vendedorGrafica}
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

export default MejoresVendedores