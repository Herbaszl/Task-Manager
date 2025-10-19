import React from 'react';
import { FiLogOut, FiAlertTriangle } from 'react-icons/fi';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void; 
    onConfirm: () => void; 
}

export function LogoutModal({isOpen, onClose, onConfirm}: LogoutModalProps){
    if(!isOpen){
        return null;
    }
    return(
            <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50"
            onClick={onClose} 
             >
                 <div 
                className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm flex flex-col" 
                onClick={(e) => e.stopPropagation()}
                >
           
                <div className="text-center mb-4">
                    <FiAlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4"/> 
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                        Confirmar Saída
                    </h3>
                    <p className="text-sm text-gray-500">
                        Você tem certeza que deseja sair da aplicação? <br></br> (Você será desconectado)
                    </p>
                </div>
                
            
                <div className="mt-4 sm:flex sm:flex-row-reverse space-x-3 space-x-reverse">
                    <button 
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={onConfirm}
                    >
                        Sair
                    </button>
                    <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
           
        </div>
    );
}