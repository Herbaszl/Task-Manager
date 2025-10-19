import React from 'react'
import {useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
createTaskSchema, 
type CreateTaskFormValues
 } from '../schemas/task.schema'
import { apiCreateTask, type Task } from '../services/api'
import { SmallSpinner } from '../contexts/Spinner'
 

interface CreateTaskFormProps{
    onTaskCreated: (newTask: Task) => void;
}

export function CreateTaskForm({onTaskCreated}: CreateTaskFormProps){
    const{
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        reset
    } = useForm<CreateTaskFormValues>({
        resolver: zodResolver(createTaskSchema),
    });

    const onSubmit = async (data: CreateTaskFormValues) => {
        try {
            const newTask = await apiCreateTask(data);

            onTaskCreated(newTask);

            reset();
       
        } catch (error) {
            console.error("Erro ao criar tarefa", error);
            alert("Falha ao criar tarefa. verifique se o backend está ativo")
        }
    };

    return(
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className='text-xl font-semibold mb-4 text-gray-700'>Adicionar Tarefa</h3>
            
            <div className="space-y-4">

            
            <div>
            <input {...register('title')  }
                type="next"
                placeholder= "Título da Tarefa *"
                className={`w-full p-3 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-600`}
                />
                {errors.title && (
                    <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                )}
          </div>
            <div>
                <textarea {...register('description')}
                placeholder="Descrição"
                rows={2}
                className="w-full p-3 border border-gray rounded-md focus:ring-blue:500 focus:border-blue-500" />
                {errors.description && (
                    <p className='text-red-500 text-sm mt-1'>{errors.description.message}</p>
                )}
            </div>
            </div>
            <button type="submit" disabled={isSubmitting}
            className={`mt-4 w-full py-3 px-4 rounded-md text-white font-semibold transition duration-150 ${
                isSubmitting? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-800'
            }`} >
                 {isSubmitting ? (
                <>
                <SmallSpinner/>
                <span className="ml-2">Salvando...</span>
                 </>
                ) :( 'Criar Tarefa')} 
            </button>
          
            </form>
    )
}