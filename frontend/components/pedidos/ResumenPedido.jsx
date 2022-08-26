import { useContext } from "react";
import { PedidoContext } from "../../context/pedidos/PedidoContext";
import { ResumenProducto } from "./ResumenProducto";




export const ResumenPedido = () => {

    const {productos} = useContext(PedidoContext);



  return (
    <>
        <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>3. Ajusta las cantidades de los productos</p>
        {
            productos[0] ? (
                <>
                    {productos.map((producto) => (
                        <ResumenProducto key={producto.id} producto={producto} />
                    ))}
                </>
            ) : (
                <p className="mt-5 text-sm">Aun no hay productos seleccionados</p>
            )
        }
    </>
  )
}
