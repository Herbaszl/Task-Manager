import React, {createContext, useState, useContext, useEffect} from 'react';
import type { ReactNode } from 'react'


interface User {
    id: string;
    email: string;
    name: string;
}


interface AuthContextType{
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    login: (token: string, userData: User) => void;
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
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');

        if(storedToken && storedUser){
            try{
                const parsedUser = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(parsedUser);
            } catch (error){
                console.error("Erro ao parsear dados do usuário do localStorage", error);
                localStorage.removeItem('authToken');
                localStorage.removeItem('authUser');
            }
        }
        setIsLoading(false);
    }, []);


    const login = (newToken: string, userData: User) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('authToken', newToken);
        localStorage.setItem('authUser', JSON.stringify(userData));
    };


    const logout = ( ) => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
    };

    const value = {
        isAuthenticated: !!token,
        user,
        token,
        login,
        logout,
        isLoading,

    };

    return <AuthContext.Provider value = {value}>{children}</AuthContext.Provider>
}


export function useAuth(){
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }

    return context;
}