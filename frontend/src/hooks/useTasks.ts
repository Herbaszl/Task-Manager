import { useState, useEffect, useCallback } from 'react';
import { apiGetTasks, apiSoftDeleteTask, apiUpdateTask, type Task } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface UseTasksResult {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    fetchTasks: () => Promise<void>;
    addTask: (newTask: Task) => void;
    deleteTask: (taskId: string) => Promise<void>;
    updateTaskLocally: (updatedTask: Task) => void; 
}

export const useTasks = (): UseTasksResult => {
    const { logout } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedTasks = await apiGetTasks();
            setTasks(fetchedTasks);
        } catch (err: any) {
            console.error("Erro ao buscar tarefas:", err);
            setError("Não foi possível carregar as tarefas.");
            if (err.response && err.response.status === 401) {
                logout();
            }
        } finally {
            setIsLoading(false);
        }
    }, [logout]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]); 

    const addTask = useCallback((newTask: Task) => {
        setTasks((prevTasks) => [newTask, ...prevTasks]);
    }, []);

    const deleteTask = useCallback(async (taskId: string) => {
        try {
            await apiSoftDeleteTask(taskId);
            setTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId));
        } catch (err) {
            throw new Error("Falha ao remover tarefa.");
        }
    }, []);
    
    const updateTaskLocally = useCallback((updatedTask: Task) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === updatedTask.id ? updatedTask : task
            )
        );
    }, []);


    return {
        tasks,
        isLoading,
        error,
        fetchTasks,
        addTask,
        deleteTask,
        updateTaskLocally,
    };
};