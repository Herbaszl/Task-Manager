import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiLogin } from '../services/api';
import type { LoginFormInputs } from '../schemas/loginSchema';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useLogin = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitLogin = useCallback(async (data: LoginFormInputs) => {
        setApiError(null);
        setIsSubmitting(true);

        try {
            await wait(5000); 

            const response = await apiLogin(data);

            if (response && response.access_token) {
                login(response.access_token, null);
                navigate('/dashboard');
            } else {
                setApiError('Resposta inválida do servidor');
            }
        } catch (error: any) {
            console.error('Erro no Login:', error);

            if (error.response && error.response.data && error.response.data.message) {
                setApiError(error.response.data.message);
            } else {
                setApiError('Erro ao tentar fazer login. Tente novamente');
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [login, navigate]);

    return {
        apiError,
        isSubmitting,
        handleSubmitLogin,
    };
};