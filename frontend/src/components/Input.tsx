import React from 'react';
import type { UseFormRegister, FieldError } from 'react-hook-form'

interface InputProps extends React.inputHTMLAttributes<HTMLInputElement>{
    label: string;
    fieldName: string;
    register: UseFormRegister<any>
    error?: FieldError;
}

export function Input({ label, fieldName, register, error, ...rest }: InputProps) {
  return (
    <div className="mb-4">
      <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={fieldName}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
          error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
        }`}
        {...register(fieldName)} // Registra o input no RHF
        {...rest} // Outras props (type, placeholder, etc.)
      />
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
}