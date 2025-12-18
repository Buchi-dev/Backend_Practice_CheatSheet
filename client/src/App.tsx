import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginForm from './feature/auth/components/forms/loginForm'
import RegisterForm from './feature/auth/components/forms/registerForm'

const App = () => {
  return (
    //impliment Routing using router
    <BrowserRouter>
      <h1>Auth Forms</h1>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </BrowserRouter>

 

  )
}

export default App