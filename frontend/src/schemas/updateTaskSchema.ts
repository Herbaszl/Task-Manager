import { z } from 'zod';
import { createTaskSchema } from './task.schema';

type TaskStatus = 'Pendente' | 'A caminho' | 'Feita';

export const updateTaskSchema = createTaskSchema.partial().extend({
  
  status: z.enum(['Pendente', 'A caminho', 'Feita'] as [TaskStatus, ...TaskStatus[]], {
      message: "Selecione um status válido."
  }), 
  
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres").max(100, "O título não pode exceder 100 caracteres").optional(),
  description: z.string().max(500, "A descrição não pode exceder 500 caracteres").optional().or(z.literal('')),
});

export type UpdateTaskFormInputs = z.infer<typeof updateTaskSchema>;