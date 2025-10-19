import axios from "axios";

const API_BASE_URL = 'http://localhost:3000';

export const api = axios.create({
    baseURL: API_BASE_URL
});


// export const setAuthToken = (token: string | null) => {
// if(token){
// api.defaults.headers.common['Authorization] = `Bearer ${token}`;
// console.log('Token adicionado ao header Axios: ', token);
// }else{
//     delete.api.defaults.headers.common['Authorization'];
//     console.log('Token removido do header Axios')
// }
// };

import type { LoginFormInputs } from "../schemas/loginschema";
import type {RegisterFormInputs} from '../schemas/registerSchema';
import { data } from "react-router-dom";

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

export const apiRegister = async (data: RegisterFormInputs) => {
    const response = await api.post('/auth/register', data);
    return response.data;
}
