import { useContext } from "react";
import { PedidoContext } from "../../context/pedidos/PedidoContext";




export const Total = () => {

    const {total} = useContext(PedidoContext);

  return (
    <div className="flex items-center mt-5 justify-between bg-white p-3">
        <h2 className="text-gray-800 text-lg">Total a pagar: </h2>
        <p className="text-gray-800 mt-0">${total}</p>
    </div>
  )
}
