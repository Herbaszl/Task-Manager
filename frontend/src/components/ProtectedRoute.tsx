import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Spinner } from "../contexts/Spinner";

interface ProtectedRouteProps{
    children: React.ReactNode; 
}

export function ProtectedRoute({children}: ProtectedRouteProps){
    const{isAuthenticated, isLoading} = useAuth();
    const location = useLocation();

    if(isLoading){
        return(
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <Spinner />
            </div>
        );
    }


    if(!isAuthenticated){
        return <Navigate to="/login" replace state = {{from: location}} />

    }

    return <>{children}</>
}
