
import { useReducer } from "react";
import { types } from "../../types/types";
import { PedidoContext } from "./PedidoContext";
import { pedidoReducer } from "./pedidoReducer";

const initialState = {
    cliente: {},
    productos: [],
    total: 0
}

export const PedidoProvider = ({children}) => {

    const [state, dispatch] = useReducer(pedidoReducer, initialState);

    const agregarCliente = (cliente) => {
        dispatch({
            type: types.seleccionarCliente,
            payload: cliente
        })
    }

    const agregarProducto = (productosSeleccionados) => {

        let nuevoState;
        if(state.productos.length > 0){
            nuevoState = productosSeleccionados.map(producto => {
                const nuevoObjeto = state.productos.find(p => p.id === producto.id);
                return {...producto, ...nuevoObjeto};
            })
        }else{
            nuevoState = productosSeleccionados;
        }

        dispatch({
            type: types.seleccionarProducto,
            payload: nuevoState
        })
    }

    const cantidadProductos = (nuevoProducto) => {
        dispatch({
            type: types.cantidadProductos,
            payload: nuevoProducto
        })
    }

    const actualizarTotal = () => {
        dispatch({
            type: types.actualizarTotal,
        })
    }

    return (
        <PedidoContext.Provider value={{
            cliente: state.cliente,
            productos: state.productos,
            total: state.total,
            agregarCliente,
            agregarProducto,
            cantidadProductos,
            actualizarTotal
        }}>
            {children}
        </PedidoContext.Provider>
    )
}
