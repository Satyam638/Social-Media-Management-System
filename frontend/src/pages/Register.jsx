// src/pages/Register.jsx
import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function Register() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [form, setForm]       = useState({
        name: '', email: '', password: '', role: 'Admin'
    });
    const [profilePic,   setProfilePic]   = useState(null);
    const [picPreview,   setPicPreview]   = useState('');
    const [loading,      setLoading]      = useState(false);
    const [error,        setError]        = useState('');

    const handleChange = e => {
        setError('');
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // handle profile pic selection
    const handlePicSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // validate type
        const allowed = ['image/jpeg','image/png','image/webp','image/gif'];
        if (!allowed.includes(file.type)) {
            setError('Only JPG, PNG, WebP or GIF allowed');
            return;
        }

        // validate size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be under 5MB');
            return;
        }

        setProfilePic(file);
        setPicPreview(URL.createObjectURL(file));
        // ↑ show preview instantly (no upload yet)
    };

    const handleSubmit = async () => {
        setError('');

        if (!form.name || !form.email || !form.password) {
            setError('All fields are required');
            return;
        }

        try {
            setLoading(true);

            // use FormData because we're sending a file
            const formData = new FormData();
            formData.append('name',     form.name);
            formData.append('email',    form.email);
            formData.append('password', form.password);
            formData.append('role',     form.role);

            // only append if user selected a picture
            if (profilePic) {
                formData.append('profilePic', profilePic);
                // ↑ field name must match upload.single('profilePic')
            }

            await API.post('/api/auth/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
                // ↑ required when sending FormData with file
            });

            localStorage.setItem('pendingEmail', form.email);
            navigate('/verify');

        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Registration failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
                    <p className="text-gray-500 mt-1 text-sm">Join SMMS today</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center mb-6">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="relative w-20 h-20 rounded-full cursor-pointer group"
                    >
                        {picPreview ? (
                            <img
                                src={picPreview}
                                alt="Preview"
                                className="w-full h-full rounded-full object-cover ring-4 ring-indigo-100"
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center ring-4 ring-indigo-50">
                                <span className="text-3xl">👤</span>
                            </div>
                        )}

                        {/* Camera overlay on hover */}
                        <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-medium">📷</span>
                        </div>

                        {/* Camera badge */}
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">+</span>
                        </div>
                    </div>

                    <p className="text-xs text-gray-400 mt-2">
                        {picPreview ? 'Click to change photo' : 'Add profile picture (optional)'}
                    </p>

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handlePicSelect}
                        className="hidden"
                    />
                </div>

                {/* Form */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
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
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Min 8 characters"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
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
                        loading
                            ? 'bg-indigo-300 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                >
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 hover:underline font-medium">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}