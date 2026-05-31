// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register  from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import Login     from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/'          element={<Navigate to='/login' />} />
                <Route path='/register'  element={<Register />} />
                <Route path='/verify'    element={<VerifyOTP />} />
                <Route path='/login'     element={<Login />} />
                <Route path='/dashboard' element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
}