import { useState } from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';

import { LoginPage } from './pages/LoginPage/LoginPage';
import { RegisterPage } from './pages/RegisterPage/RegisterPage';
import { DashBoardPage } from './pages/DashBoardPage/DashBoardPage';


function App() {
  return (
   <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />

    <Route path ="/login" element={<LoginPage />} />
    <Route path = "/register" element={<RegisterPage />}/>
   
    <Route path="/dashboard" element={<DashBoardPage />} />

   <Route path="*" element={
    <div className="flex h-screen items-center justify-center">
      <h1>Página Não Encontrada (404)</h1>
    </div>
   }/>
   
   </Routes>

  
  )
}

export default App


