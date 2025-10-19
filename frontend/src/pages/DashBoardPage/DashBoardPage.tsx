import React, {useState, useEffect, useCallback} from 'react'

import { useAuth } from '../../contexts/AuthContext';
import { Spinner } from '../../contexts/Spinner';
import { apiGetTasks, type Task } from '../../services/api';

import { CreateTaskForm } from '../../components/CreateTaskForm';
import { FiEdit2, FiLogOut, FiTrash2 } from 'react-icons/fi';
import { LogoutModal } from '../../components/LogoutModal';


const StatusStyles: Record<Task['status'], string> = {
    'Pendente': 'bg-yellow-100 text-yellow-800',
    'A caminho': 'bg-blue-100 text-blue-800',
    'Feita': 'bg-green-100 text-green-800',
};

export function DashBoardPage(){
    
    const {logout} = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const handleTaskCreated = useCallback((newTask: Task) => {
        setTasks((prevTasks) => [newTask, ...prevTasks]);
    }, []);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleConfirmLogout = () => {
        setIsLogoutModalOpen(false);
        logout();
    };


    useEffect(() => {
        const fetchTasks = async () => {
            setIsLoading(true);
            setError(null);
            try{
                const fetchedTasks = await apiGetTasks();
                setTasks(fetchedTasks);
            } catch (err: any){
                console.error("Erro ao buscar tarefas:", err);
                setError("Não foi possível carregar as tarefas. Tente Recarregar a página.")
                if(err.response && err.response.status === 401){
                    logout();
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, [logout]);

    return(
        <div className="min-h-screen bg-gray-50">
       <div className="max-w-3xl mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Minhas Tarefas</h1>
            <button 
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="hover:bg-red-400 text-black py-2 px-4 rounded-md text-sm flex items-center justify-center space-x-2" 
                    title="Sair da aplicação"
                >
                    <FiLogOut className="text-lg" />
                    
                </button>
        </header>
       <CreateTaskForm onTaskCreated={handleTaskCreated} />

        <div className="mt-8">
            {isLoading && (
                <div className="flex justify-center p-10"> 
                <Spinner/>
                </div>
            )}

            {error && (
                <div className="rounded-md border-red-300 bg-red-50 p-4 text-center text-red-700"> {error} 
                </div>
            )}
            {!isLoading && !error && tasks.length === 0 && (
                <p className="text-center text-gray-500">Nenhuma tarefa encontrada. Crie uma nova tarefa! </p>
            )}

            {!isLoading && !error && tasks.length > 0 && (
                <ul className="space-y-4">
                    {tasks.map((task) => 
                  <li key={task.id} className='bg-white p-6 rounded-lg shadow flex flex-col'> 
        
        <div className='flex justify-between items-start mb-2'> 
            
            <h2 className="font-semibold text-lg flex items-center mr-4">
                {task.title}
            </h2>
            
            <div className="flex space-x-1">
                <button 
                    className="text-blue-600 hover:text-blue-800 transition duration-150 p-1"
                    title="Editar Tarefa"
                >
                    <FiEdit2 className='w-4 h-4' />
                </button>
                
                <button 
                    className="text-red-600 hover:text-red-800 transition duration-150 p-1"
                    title="Remover Tarefa"
                >
                    <FiTrash2 className='w-4 h-4' />
                </button>
            </div>
        </div>

                    
                    {task.description && (
                        <p className="text-gray-600 text-sm mb-3">
                            {task.description}
                        </p>
                    )}


            <div className='flex justify-start items-center mt-auto pt-2 border-t border-gray-100'> 

        
            <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${StatusStyles[task.status]}`}>
                {task.status}
            </span>
             </div>
         </li>
          )}
    </ul>
            )}
</div>

       </div>
       <LogoutModal 
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleConfirmLogout}
            />
        </div>
    );
}