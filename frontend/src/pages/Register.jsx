// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm]       = useState({ name:'', email:'', password:'', role:'Admin' });
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        setError('');
        if (!form.name || !form.email || !form.password) {
            setError('All fields are required');
            return;
        }
        try {
            setLoading(true);
            await API.post('/api/auth/register', form);
            // store email for OTP page
            localStorage.setItem('pendingEmail', form.email);
            navigate('/verify');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">SMMS</h1>
                    <p className="text-gray-500 mt-1">Social Media Management System</p>
                    <h2 className="text-xl font-semibold text-gray-700 mt-4">Create Account</h2>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Min 6 characters"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Admin">Admin</option>
                            <option value="Superadmin">Superadmin</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full mt-6 py-3 rounded-lg text-white font-semibold transition ${
                        loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link>
                </p>
                <p className="text-center text-sm text-gray-500 mt-4">
                    <Link to="/forgot-password" className="text-blue-600 hover:underline font-medium">Forgot Password</Link>
                </p>
            </div>
        </div>
    );
}