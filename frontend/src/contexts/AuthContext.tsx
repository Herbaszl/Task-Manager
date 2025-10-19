import React, {createContext, useState, useContext, useEffect} from 'react';
import type { ReactNode } from 'react'
import { api } from '../services/api';
import { Spinner } from './Spinner';

interface User {
    id: string;
    email: string;
    name: string;
}


interface AuthContextType{
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    login: (token: string, userData?: User | null) => void;
    logout: () => void;
    isLoading: boolean;
}



const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps{
    children: ReactNode;
}


export function AuthProvider({children}: AuthProviderProps){
    const[user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('authToken');
        const storedUser = sessionStorage.getItem('authUser');

        const timer = setTimeout(() => {
            if(storedToken){
                api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                setToken(storedToken);
                if(storedUser){
                    try{
                        setUser(JSON.parse(storedUser));
                    } catch {
                        sessionStorage.removeItem('authUser');
                    }
                }
                //...
            }
            setIsLoading(false);
        }, 2000)

        
    }, []);


    const login = (newToken: string, userData?: User | null) => {
        setToken(newToken);
        sessionStorage.setItem('authToken', newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        console.log('Token adicionado ao header Axios', newToken);
    
        if(userData){
            setUser(userData);
            sessionStorage.setItem('authUser', JSON.stringify(userData));

        } else {
            setUser(null);
            sessionStorage.removeItem('authUser')
        }
    };


    const logout = ( ) => {
        setToken(null);
        setUser(null);
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('authUser');
        
        delete api.defaults.headers.common['Authorization'];
        console.log('Token removido do header Axios.')
    };

    const value = {
        isAuthenticated: !!token,
        user,
        token,
        login,
        logout,
        isLoading,

    };

    if(isLoading){
        return(
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <Spinner/>
            </div>
        );
    }

    return <AuthContext.Provider value = {value}>{children}</AuthContext.Provider>
}


export function useAuth(){
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }

    return context;
}