import axios from "axios";

const API_BASE_URL = 'http://localhost:3000';

export const api = axios.create({
    baseURL: API_BASE_URL
});



type ApiRegisterData = Omit<RegisterFormInputs, 'confirmPassword'>;

import type { LoginFormInputs } from "../schemas/loginschema";
import type {RegisterFormInputs} from '../schemas/registerSchema';

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

export interface Task{
    id: string,
    title: string;
    description: string | null;
    status: 'pending' | 'in-progress' | 'done';
    createdAt: string;
    updatedAt: string;
}


export const apiGetTasks = async (): Promise<Task[]> => {
    const response = await api.get('/tasks');
    return response.data;
};


