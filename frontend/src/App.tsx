import {Routes, Route, Navigate} from 'react-router-dom';

import { LoginPage } from './pages/LoginPage/LoginPage';
import { RegisterPage } from './pages/RegisterPage/RegisterPage';
import { DashBoardPage } from './pages/DashBoardPage/DashBoardPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import Robot from './assets/Robot.jpg'

function App() {
  return (
   <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />

    <Route path ="/login" element={<LoginPage />} />
    <Route path = "/register" element={<RegisterPage />}/>
   
    <Route path="/dashboard" element={<ProtectedRoute> <DashBoardPage /> </ProtectedRoute>} />

   <Route path="*" element={
        <div
          className="flex h-screen items-center justify-center bg-cover bg-center" 
          style={{ backgroundImage: `url(${Robot})` }} 
        >
          <div className="bg-indigo-700 bg-opacity-100 p-8 rounded-3xl">
            <h1 className="text-4xl font-bold text-white text-center">
              Página Não Encontrada (404)
            </h1>
          </div>
        </div>
      } />
   
   </Routes>

  
  )
}

export default App


