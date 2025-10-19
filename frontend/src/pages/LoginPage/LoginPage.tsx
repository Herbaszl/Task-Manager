import {useForm} from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import type { SubmitHandler} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema} from '../../schemas/loginschema';
import type {LoginFormInputs} from '../../schemas/loginschema'
import { Input } from '../../components/input'; 
import { apiLogin } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { SmallSpinner, Spinner } from '../../contexts/Spinner';
import { useLocation } from 'react-router-dom';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function LoginPage()
{

    const {login} = useAuth();
    const navigate = useNavigate();
    const [apiError, setApiError] = useState<string | null>(null);
    const location = useLocation();
    const successMessage = location.state?.message;

   useEffect(() => {
        if (successMessage) {
            
            const timer = setTimeout(() => {
                navigate(location.pathname, { replace: true, state: {} });
            }, 10000); 
            return () => clearTimeout(timer); 
        }
    }, [successMessage, location.pathname, navigate]);
     
    const{
        register, 
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
       setApiError(null);
       try{

        await wait(1500);

        const response = await apiLogin(data);

        if (response && response.access_token){
            login(response.access_token, null);

            navigate('/dashboard');
        } else{
            setApiError('Resposta inválida do servidor')
        }
       } catch (error: any){
        await wait(500);
        console.error('Erro no Login:', error);

        if(error.response && error.response.data && error.response.data.message){
            setApiError(error.response.data.message);
        } else{
            setApiError('Erro ao tentar fazer login. Tente novamente');
        }
       }
    };


    return(
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    Entrar
                </h1>
                {successMessage && (
                <div className="mb-4 rounded-md border border-green-300 bg-green-50 p-3 text-green-700 text-center text-sm">
                         {successMessage}
                    </div>
                )}
                {apiError&& (
                    <div className='mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-center text-sm text-red-700'>
                        {apiError}
                    </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                    label="Email"
                    fieldName="email"
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    register={register}
                    error={errors.email}/>

                     <Input
                    label="Senha"
                    fieldName="password"
                    type="password"
                    placeholder="*********"
                    register={register}
                    error={errors.password}/>

                    <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50">
                        {isSubmitting ? (
                            <>
                            <SmallSpinner/>
                            <span className="ml-2">Entrando...</span>
                            </>
                        ) :( 'Entrar')} 
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Não tem uma conta? {' '}
                    <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Criar Conta
                    </Link>
                </p>
            </div>

        </div>
    );
}