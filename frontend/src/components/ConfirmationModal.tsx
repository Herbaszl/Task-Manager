import React from 'react';
import { FiLogOut, FiAlertTriangle, FiTrash2 } from 'react-icons/fi';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void; 
    onConfirm: () => void; 
    title: string;
    message: React.ReactNode;
    confirmButtonText: string;
    icon: 'logout' | 'delete';
    isSubmitting?: boolean;
}

export function ConfirmationModal({ isOpen,
   onClose,
   onConfirm,
   title,
   message,
   confirmButtonText,
   icon,
   isSubmitting = false}: ConfirmationModalProps){
  

   
    if(!isOpen){
        return null;
    }
    const ActionIconComponent = icon === 'delete' ? FiTrash2 : FiLogOut;
    const confirmButtonColor = icon === 'delete' 
        ? 'bg-red-600 hover:bg-red-700' 
        : 'bg-indigo-600 hover:bg-indigo-700';
    return (
        <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50"
            onClick={onClose} 
        >
            <div 
                className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm flex flex-col" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center mb-4">

                    <FiAlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                    
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                        {title}
                    </h3>
                    
                    <p className="text-sm text-gray-500">
                        {message}
                    </p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                     <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none disabled:opacity-50"                         >
                        Cancelar
                    </button>
                    
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none disabled:opacity-50 flex items-center justify-center ${confirmButtonColor}`}                    >
                        {isSubmitting ? 'Aguarde...' : confirmButtonText}
                        <ActionIconComponent className="ml-2 h-5 w-5" /> 
                    </button>
                </div>
            </div>
        </div>
    );
}