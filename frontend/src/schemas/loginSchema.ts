import {z} from 'zod';

export const loginSchema = z.object({
    email: z.string().min(1, 'O email é obrigatório').pipe(z.email('Por favor, insira um email válido')),
    password: z.string().min(1, 'A senha é obrigatória'),
});