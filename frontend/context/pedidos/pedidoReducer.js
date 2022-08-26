import { types } from "../../types/types";



export const pedidoReducer = (state, action) => {
    
    switch (action.type) {
        
        case types.seleccionarCliente:
            return {
                ...state,
                cliente: action.payload,
            }

        case types.seleccionarProducto:
            return {
                ...state,
                productos: [...action.payload],
            }

        case types.cantidadProductos:
            return {
                ...state,
                productos: state.productos.map(producto => producto.id === action.payload.id ? producto = action.payload : producto),
            }

        case types.actualizarTotal:
            return {
                ...state,
                total: state.productos.reduce((nuevoTotal, producto) => nuevoTotal += producto.precio * producto.cantidad, 0),
            }

        default:
            return state;
    }

}