// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOtp';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from './components/ProtectedRoute';
import HowToUse       from './pages/HowToUse';
import PrivacyPolicy from './pages/PrivacyPolicy';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/register' element={<Register />} />
                <Route path='/verify' element={<VerifyOTP />} />
                <Route path='/login' element={<Login />} />
                <Route path="/how-to-use" element={<HowToUse />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                {/* <Route path='/dashboard' element={<Dashboard />} /> */}
                {/* <Route path='/analytics' element={<Analytics />} /> */}
                <Route path="/forgot-password" element={<ForgotPassword />} />
                {/* Protected routes — must be logged in */}
                <Route path='/dashboard' element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path='/analytics' element={
                    <ProtectedRoute>
                        <Analytics />
                    </ProtectedRoute>
                } />

                {/* Catch all — redirect to home */}
                <Route path='*' element={<Navigate to='/' />} />
            </Routes>
        </BrowserRouter>
    );
}