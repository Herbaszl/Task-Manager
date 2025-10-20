import  { useState } from 'react';
import { FiX, FiEdit2 } from 'react-icons/fi';
import { apiUpdateTask, type Task} from '../services/api'; 
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTaskSchema } from '../schemas/task.schema';


type TaskStatus = 'Pendente' | 'Em Andamento' | 'Finalizada';

export const updateTaskSchema = createTaskSchema.partial().extend({
    status: z.enum(['Pendente', 'Em Andamento', 'Finalizada'] as [TaskStatus, ...TaskStatus[]], {
        message: "Selecione um status válido."
    }).default('Pendente'),
    title: z.string().min(3, "O título deve ter pelo menos 3 caracteres").max(100, "O título não pode exceder 100 caracteres").optional(),
    description: z.string().max(500, "A descrição não pode exceder 500 caracteres").optional().or(z.literal('')),
});

type UpdateTaskPayload = z.infer<typeof updateTaskSchema>;

type EditTaskFormInputs = {
    title: string;
    description: string;
    status: TaskStatus;
}


const statusOptions: {value: TaskStatus; label: string}[] = [
    { value: 'Pendente', label: 'Pendente' },
    { value: 'Em Andamento', label: 'Em Andamento'},
    { value: 'Finalizada', label: 'Finalizada'},
];

interface EditTaskModalProps{
    isOpen: boolean;
    onClose: () => void;
    task: Task;
    onTaskUpdated: (updatedTask: Task) => void;
}


export function EditTaskModal ({isOpen, onClose, task, onTaskUpdated}: EditTaskModalProps){

    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EditTaskFormInputs>({
        resolver: zodResolver(updateTaskSchema) as any, // Solução final para o erro de overload
        defaultValues: {
            title: task.title,
            description: task.description || '', 
            status: task.status,
        } as EditTaskFormInputs,
    });

    if (!isOpen) return null;
    
    const onSubmit: SubmitHandler<EditTaskFormInputs> = async (data) => {
        
        const updateData: Partial<UpdateTaskPayload> = {};
        
        if (data.title !== task.title) updateData.title = data.title;
        if (data.description !== (task.description || '')) updateData.description = data.description;
        if (data.status !== task.status) updateData.status = data.status;

        if (Object.keys(updateData).length === 0) {
            onClose();
            return;
        }

        setIsSubmitting(true);
        try {
            const updatedTask = await apiUpdateTask(task.id, updateData);
            onTaskUpdated(updatedTask);
            onClose();
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
            alert('Falha ao salvar alterações. Verifique o console.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50"
            onClick={onClose} 
        >
            <div 
                className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden" 
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <FiEdit2 className="mr-2" /> Editar Tarefa
                    </h2>
                    <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-900">
                        <FiX className="h-6 w-6" />
                    </button>
                </header>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título da Tarefa *</label>
                        <input
                            id="title"
                            type="text"
                            {...register("title")}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                        <textarea
                            id="description"
                            rows={3}
                            {...register("description")}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status *</label>
                        <select
                            id="status"
                            {...register("status")}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200" disabled={isSubmitting}>
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 flex items-center justify-center space-x-2 disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            <span>{isSubmitting ? 'Salvando...' : 'Salvar Alterações'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}