// src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

// ── Password strength helper ─────────────────────────────────────────────────
function getStrength(password) {
    if (!password) return { score: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8)  score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { score, label: 'Too weak',  color: 'bg-red-500' };
    if (score <= 2) return { score, label: 'Weak',       color: 'bg-orange-400' };
    if (score <= 3) return { score, label: 'Fair',       color: 'bg-amber-400' };
    if (score <= 4) return { score, label: 'Good',       color: 'bg-lime-500' };
    return               { score, label: 'Strong',      color: 'bg-green-500' };
}

// ── Icons ────────────────────────────────────────────────────────────────────
const MailIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
    </svg>
);
const LockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
);
const EyeIcon = ({ open }) => open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
);
const KeyIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
);

// ── Component ────────────────────────────────────────────────────────────────
export default function ForgotPassword() {
    const navigate = useNavigate();
    const [form, setForm]       = useState({ email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');
    const [success, setSuccess] = useState('');
    const [showPass, setShowPass]         = useState(false);
    const [showConfirm, setShowConfirm]   = useState(false);

    const strength = getStrength(form.password);

    const handleChange = e => {
        setError('');
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setError('');
        setSuccess('');
        if (!form.email || !form.password || !form.confirmPassword) {
            setError('All fields are required');
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (form.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }
        try {
            setLoading(true);
            await API.post('/api/auth/forgot-password', {
                email:    form.email,
                password: form.password,
            });
            setSuccess('Password updated! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2200);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = e => { if (e.key === 'Enter') handleSubmit(); };

    const passwordsMatch = form.confirmPassword && form.password === form.confirmPassword;
    const passwordsMismatch = form.confirmPassword && form.password !== form.confirmPassword;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">

                {/* Back link */}
                <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors group"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
                        <line x1="19" y1="12" x2="5" y2="12"/>
                        <polyline points="12 19 5 12 12 5"/>
                    </svg>
                    Back to login
                </Link>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border border-gray-100 p-8">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                            <KeyIcon />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset your password</h2>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Enter your email and choose a new password below.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="flex items-start gap-2.5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-5 text-sm">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                            {success}
                        </div>
                    )}

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
                                    placeholder="Enter your registered email"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* New password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                    <LockIcon />
                                </span>
                                <input
                                    name="password"
                                    type={showPass ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Min 8 characters"
                                    className="w-full pl-10 pr-11 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <EyeIcon open={showPass} />
                                </button>
                            </div>
                            {/* Strength bar */}
                            {form.password.length > 0 && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-gray-200'}`} />
                                        ))}
                                    </div>
                                    <p className={`text-xs font-medium ${
                                        strength.score <= 1 ? 'text-red-500' :
                                        strength.score <= 2 ? 'text-orange-500' :
                                        strength.score <= 3 ? 'text-amber-500' : 'text-green-600'
                                    }`}>{strength.label}</p>
                                </div>
                            )}
                        </div>

                        {/* Confirm password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm new password</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                    <LockIcon />
                                </span>
                                <input
                                    name="confirmPassword"
                                    type={showConfirm ? 'text' : 'password'}
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Repeat your new password"
                                    className={`w-full pl-10 pr-11 py-3 border rounded-xl text-sm outline-none transition-all placeholder-gray-400 ${
                                        passwordsMismatch
                                            ? 'border-red-300 focus:ring-2 focus:ring-red-400'
                                            : passwordsMatch
                                            ? 'border-green-400 focus:ring-2 focus:ring-green-400'
                                            : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <EyeIcon open={showConfirm} />
                                </button>
                                {/* Match indicator */}
                                {form.confirmPassword && (
                                    <div className={`absolute right-10 top-1/2 -translate-y-1/2 ${passwordsMatch ? 'text-green-500' : 'text-red-400'}`}>
                                        {passwordsMatch ? (
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"/>
                                            </svg>
                                        ) : (
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                            </svg>
                                        )}
                                    </div>
                                )}
                            </div>
                            {passwordsMismatch && (
                                <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                            )}
                            {passwordsMatch && (
                                <p className="text-xs text-green-600 mt-1">Passwords match ✓</p>
                            )}
                        </div>
                    </div>

                    {/* Submit button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !!success}
                        className={`w-full mt-6 py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                            loading || success
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
                                Updating password...
                            </>
                        ) : success ? (
                            'Password updated ✓'
                        ) : (
                            'Update password →'
                        )}
                    </button>

                    {/* Login link */}
                    <p className="text-center text-sm text-gray-500 mt-5">
                        Remembered it?{' '}
                        <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                            Sign in instead
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}