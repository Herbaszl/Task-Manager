import {useForm} from 'react-hook-form';
import { Link } from 'react-router-dom'; 
import type { SubmitHandler} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { registerSchema } from '../../schemas/registerSchema';
import type { RegisterFormInputs } from '../../schemas/registerSchema'; 
import { Input } from '../../components/Input';

import { apiRegister } from '../../services/api';



export function RegisterPage (){

    const navigate = useNavigate();
    const [apiError, setApiError] = useState<string | null>(null);


    const{
        register, 
        handleSubmit,
         formState:{errors, isSubmitting},
    } = useForm<RegisterFormInputs>({
        resolver:zodResolver(registerSchema),
    });


    const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
        setApiError(null);
        
        const{confirmPassword, ...apiData} = data;

        try{
        await apiRegister(apiData)
        navigate('/login', { state: { message: 'Conta criada com sucesso! Faça o login.' } });
            } catch (error: any) {
            
            console.error('Erro no registro', error);

            if(error.response && error.response.data && error.response.data.message){
                setApiError(error.response.data.message);
            } else {
                setApiError('Erro ao tentar registrar. Tente novamente!');
            }
        } 
    
    };
    



    return (
        <div className ="flex min-h-screen items-center justify-center bg-gray-100">
            <div className= "w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    Registrar
                </h1>
                {apiError && (
                    <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-red-700 text-center text-sm">
                        {apiError}
                    </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                    label="Nome Completo"
                    fieldName="name"
                    type="text"
                    placeholder="Seu Nome"
                    register={register}
                    error={errors.name}/>

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
                    placeholder="A Senha tem que ter no mínimo 8 caracteres"
                    register={register}
                    error={errors.password}/>
                    
                     <Input
                    label="Confirmar Senha"
                    fieldName="confirmPassword"
                    type="password"
                    placeholder="Confirme sua Senha"
                    register={register}
                    error={errors.confirmPassword}/>
                    
                    <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50">
                        {isSubmitting ? 'Registrando...' : 'Registrar'}
                    </button>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Já tem uma conta?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Entrar
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}