import React, {useState, useEffect} from 'react'

import { useAuth } from '../../contexts/AuthContext';
import { Spinner } from '../../contexts/Spinner';
import { apiGetTasks, type Task } from '../../services/api';


export function DashBoardPage(){
    const {logout} = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
       <div className="container mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Minhas Tarefas</h1>
            <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm">
                Sair
            </button>
        </header>
        {/* ... */}

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
                    <li key ={task.id} className='bg-white p-4 rounded-lg shadow flex justify-beetween items-center'>
                        <div>
                            <h2 className="font-semibold text-lg">{task.title}</h2>
                            {task.description} && <p className="text-gray-600 text-sm">{task.description}</p>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>{task.status}</span>
                        </div>
                         {/* Adicionar & Remover */}
                         <div className="flex space-x-2">   
                            <button className="text-sm text-blue-600 hover:text-blue-800">Editar</button>
                            <button className="text-sm text-red-600 hover:text-red-800">Remover</button>
                         </div>
                    </li>
                    )}
                </ul>
            )}
        </div>

       </div>
    );
}