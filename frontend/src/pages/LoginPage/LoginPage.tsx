import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type  LoginFormInputs } from '../../schemas/loginSchema';
import { Input } from '../../components/Input'; 
import { SmallSpinner } from '../../contexts/Spinner';

import { useLogin } from '../../hooks/useLogin'; 

export function LoginPage() {

    const { apiError, isSubmitting, handleSubmitLogin } = useLogin(); 
    const location = useLocation();
    const navigate = useNavigate();
    const successMessage = location.state?.message;

    useEffect(() => {
        if (successMessage) {
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [successMessage, location.pathname, navigate]);
      
    const {
        register, 
        handleSubmit,
        formState: { errors }, 
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
        handleSubmitLogin(data);
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
                {apiError && (
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