import axios from "axios";
import type { LoginFormInputs } from "../schemas/loginschema";
import type {RegisterFormInputs} from '../schemas/registerSchema';
import type { CreateTaskFormValues } from "../schemas/task.schema";

const API_BASE_URL = 'http://localhost:3000';

export const api = axios.create({
    baseURL: API_BASE_URL
});



type ApiRegisterData = Omit<RegisterFormInputs, 'confirmPassword'>;


/**
 
 * @param data 
 * @returns 
 */

export const apiLogin = async (data: LoginFormInputs) => {
    const response = await api.post('/auth/login', data);
    return response.data;
};



/**
 * @param data 
 * @returns 
 */

export const apiRegister = async (data: ApiRegisterData) => {
    const response = await api.post('/auth/register', data);
    return response.data;
}

export type TaskStatus = 'Pendente' | 'A caminho' | 'Feita';

export interface Task{
    id: string,
    title: string;
    description: string | null;
    status: TaskStatus;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateTaskData{
    title?: string;
    description?: string;
    status?: TaskStatus;
    deleted?: Boolean

}


export const apiGetTasks = async (): Promise<Task[]> => {
    const response = await api.get('/tasks');
    return response.data;
};


export const apiCreateTask = async (data: CreateTaskFormValues): Promise<Task> => {
    const response = await api.post('/tasks', data);
    return response.data;}

export async function apiUpdateTask(taskId: string, data:UpdateTaskData): Promise<Task>{
    const response = await api.patch(`/tasks/${taskId}`, data);
    return response.data;
}

export async function apiSoftDeleteTask(taskId: string): Promise<void> {
    await apiUpdateTask(taskId, { deleted: true });
}