import Layout from "../components/Layout"

const Login = () => {
  return (
    <Layout>
        <h1 className="text-center text-2xl text-white font-light">Ingreso</h1>
        <div className="flex justify-center mt-5">
            <div className="w-full max-w-sm">
                <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Correo</label>
                        <input type="email" id="email" placeholder="Correo usuario"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline focus:outline-offset-2 focus:outline-2" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Contraseña</label>
                        <input type="password" id="password" placeholder="Contraseña usuario"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline focus:outline-offset-2 focus:outline-2" />
                    </div>
                    <input type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900" value="Iniciar sesión" />
                </form>
            </div>
        </div>
    </Layout>
  )
}

export default Login