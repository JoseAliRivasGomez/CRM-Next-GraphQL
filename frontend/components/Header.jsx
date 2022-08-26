import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const OBTENER_USUARIO = gql`
    query obtenerUsuario{
        obtenerUsuario{
            id
            email
            nombre
            apellido
        }
    }
`;

export const Header = () => {

    const {data, loading, error, refetch } = useQuery(OBTENER_USUARIO);
    const router = useRouter();

    useEffect(() => {
        if(localStorage.getItem('reloadHeader') === 'yes'){
            localStorage.setItem('reloadHeader', 'no');
            refetch();
            //console.log('Header recargado');
        }
    }, [])
    

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        router.replace('/login');
    }

    if(!loading && !data?.obtenerUsuario){
        //console.log(loading);
        //console.log(data);
        router.push('/login');
    }

  return (
    <div className="sm:flex sm:justify-between mb-6">
        <p className="mr-2 mb-5 lg:mb-0">Hola: {data?.obtenerUsuario?.nombre} {data?.obtenerUsuario?.apellido}</p>
        <button className='bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-2 px-2 text-white shadow-md' type="button"
            onClick={cerrarSesion}>Cerrar sesion</button>
    </div>
  )
}
