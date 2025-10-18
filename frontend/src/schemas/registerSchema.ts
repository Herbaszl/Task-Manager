import {z} from 'zod';

export const registerSchema = z.object({
    name: z.string().min(1, 'Digite seu nome'),
    email: z.string().min(1, 'Digite seu E-Mail').pipe(z.email('Por favor, insira um E-Mail válido')),
    password: z.string().min(8, 'A senha deve conter no mínimo 8 caracteres'),
    confirmPassword: z.string()})
    .refine( 
    (data) => data.password === data.confirmPassword, 
    {
      message: 'As senhas não coincidem',
      path: ['confirmPassword'], 
    },
  );


  export type RegisterFormInputs = z.infer<typeof registerSchema>; 