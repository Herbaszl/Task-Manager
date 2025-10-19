import {useForm} from 'react-hook-form';
import type { SubmitHandler} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema} from '../../schemas/loginschema';
import type {LoginFormInputs} from '../../schemas/loginschema'
import { Input } from '../../components/input'; 
import { Link } from 'react-router-dom'; 


export function LoginPage(){
     
    const{
        register, 
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
        console.log('Dados do Login:', data);
    };









    return(
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    Entrar
                </h1>
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
                        {isSubmitting ? 'Entrando...' : 'Entrar'}
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