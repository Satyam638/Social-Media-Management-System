// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

// ── Icons ────────────────────────────────────────────────────────────────────
const MailIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
);
const LockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
);
const EyeIcon = ({ open }) => open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
);

// ── Quick facts shown on left panel ─────────────────────────────────────────
const leftFeatures = [
    { icon: '⚡', text: 'Post to 3 platforms in one click' },
    { icon: '🤖', text: 'AI captions tailored per platform' },
    { icon: '📅', text: 'Schedule posts for any date & time' },
    { icon: '📊', text: 'Analytics to track your growth' },
];

// ── Component ────────────────────────────────────────────────────────────────
export default function Login() {
    const navigate = useNavigate();
    const [form, setForm]           = useState({ email: '', password: '' });
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = e => {
        setError('');
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        setError('');
        if (!form.email.trim())  { setError('Email address is required'); return; }
        if (!form.password)      { setError('Password is required'); return; }
        try {
            setLoading(true);
            await API.post('/api/auth/login', form);
            localStorage.setItem('token', res.data.token); // save token
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Incorrect Credentials. Try After 15 min.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = e => { if (e.key === 'Enter') handleLogin(); };

    return (
        <div className="min-h-screen flex">

            {/* ── Left Panel ────────────────────────────────────────────── */}
            <div className="hidden lg:flex lg:w-5/12 bg-indigo-600 flex-col justify-between p-12 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-500 rounded-full opacity-50" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-700 rounded-full opacity-40" />

                <div className="relative z-10">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                            OS
                        </div>
                        <span className="text-white font-semibold text-lg">OneSocial</span>
                    </div>

                    {/* Headline */}
                    <h2 className="text-3xl font-bold text-white leading-snug mb-4">
                        Welcome back!
                    </h2>
                    <p className="text-indigo-200 text-base leading-relaxed mb-10">
                        Your social media dashboard is ready. Pick up right where you left off.
                    </p>

                    {/* Feature list */}
                    <div className="space-y-4">
                        {leftFeatures.map((f, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-sm flex-shrink-0">
                                    {f.icon}
                                </div>
                                <span className="text-indigo-100 text-sm leading-snug">{f.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Testimonial */}
                <div className="relative z-10 bg-white/10 border border-white/20 rounded-2xl p-5">
                    <div className="flex items-center gap-1 mb-3">
                        {'★★★★★'.split('').map((s, i) => <span key={i} className="text-amber-300 text-sm">{s}</span>)}
                    </div>
                    <p className="text-indigo-100 text-sm leading-relaxed mb-3">
                        "The scheduler is seamless. My posts go out perfectly timed without me even thinking about it."
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-400 flex items-center justify-center text-xs font-bold text-white">MJ</div>
                        <span className="text-indigo-200 text-xs">Mike J. — Social Media Manager</span>
                    </div>
                </div>
            </div>

            {/* ── Right Panel (Form) ─────────────────────────────────────── */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
                <div className="w-full max-w-md">

                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">OS</div>
                        <span className="font-semibold text-gray-900">OneSocial</span>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign in to your account</h1>
                        <p className="text-sm text-gray-500">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-indigo-600 font-medium hover:underline">
                                Create one free →
                            </Link>
                        </p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Form fields */}
                    <div className="space-y-4">

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                    <MailIcon />
                                </span>
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="john@example.com"
                                    autoComplete="email"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <Link to="/forgot-password" className="text-xs text-indigo-600 hover:underline font-medium">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                    <LockIcon />
                                </span>
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Your password"
                                    autoComplete="current-password"
                                    className="w-full pl-10 pr-11 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <EyeIcon open={showPassword} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Submit button */}
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className={`w-full mt-6 py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                            loading
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5'
                        }`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                </svg>
                                Signing in...
                            </>
                        ) : (
                            'Sign in →'
                        )}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400">or</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Register link */}
                    <p className="text-center text-sm text-gray-500">
                        New to OneSocial?{' '}
                        <Link to="/register" className="text-indigo-600 font-medium hover:underline">Create a free account</Link>
                    </p>

                    {/* Security note */}
                    <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                        Secured with OAuth. We never store your social media passwords.
                    </p>
                </div>
            </div>
        </div>
    );
}