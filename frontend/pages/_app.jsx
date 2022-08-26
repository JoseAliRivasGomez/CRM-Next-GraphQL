import '../styles/globals.css'
import {ApolloProvider} from '@apollo/client'
import client from '../config/apollo'
import { PedidoProvider } from '../context/pedidos/PedidoProvider'

function MyApp({ Component, pageProps }) {



  return (
    <ApolloProvider client={client}>
      <PedidoProvider>
        <Component {...pageProps} />
      </PedidoProvider>
    </ApolloProvider>
  )
}

export default MyApp
