import {z} from 'zod';

export const createTaskSchema = z.object({
  title: z.string({
      message: "Escolha um título para sua tarefa." 
    })
    .nonempty("Escolha um título para sua tarefa.")
    .min(3, "O título deve ter pelo menos 3 caracteres")
    .max(100, "O título não pode exceder 100 caracteres"),

    description: z.string().
    max(500, "A descrição não pode exceder 500 caracteres").
    optional().or(z.literal('')),
});
    
export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;