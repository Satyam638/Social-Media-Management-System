// src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { GlobalFonts, OSLogo, BtnPrimary, AlertError, AlertSuccess } from '../utils/design';

function getStrength(pw) {
    if (!pw) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 8)          score++;
    if (pw.length >= 12)         score++;
    if (/[A-Z]/.test(pw))        score++;
    if (/[0-9]/.test(pw))        score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { score, label: 'Too weak',  color: 'bg-red-400' };
    if (score <= 2) return { score, label: 'Weak',      color: 'bg-orange-400' };
    if (score <= 3) return { score, label: 'Fair',      color: 'bg-amber-400' };
    if (score <= 4) return { score, label: 'Good',      color: 'bg-[#89D7B7]' };
    return               { score, label: 'Strong',     color: 'bg-[#428475]' };
}

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

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [form, setForm]           = useState({ email: '', password: '', confirmPassword: '' });
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState('');
    const [success, setSuccess]     = useState('');
    const [showPass, setShowPass]   = useState(false);
    const [showConf, setShowConf]   = useState(false);

    const strength = getStrength(form.password);
    const match    = form.confirmPassword && form.password === form.confirmPassword;
    const mismatch = form.confirmPassword && form.password !== form.confirmPassword;

    const handleChange = e => { setError(''); setForm({ ...form, [e.target.name]: e.target.value }); };

    const handleSubmit = async () => {
        setError(''); setSuccess('');
        if (!form.email || !form.password || !form.confirmPassword) { setError('All fields are required'); return; }
        if (form.password !== form.confirmPassword)   { setError('Passwords do not match'); return; }
        if (form.password.length < 8)                 { setError('Password must be at least 8 characters'); return; }
        try {
            setLoading(true);
            await API.post('/api/auth/forgot-password', { email: form.email, password: form.password });
            setSuccess('Password updated! Redirecting to login…');
            setTimeout(() => navigate('/login'), 2200);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password. Please try again.');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-[#1A312C] flex items-center justify-center px-4 py-12">
            <GlobalFonts />
            <div className="w-full max-w-md">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-[#89D7B7]/60 hover:text-[#89D7B7] mb-6 transition-colors group">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
                        <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                    </svg>
                    Back to login
                </Link>

                <div className="bg-[#FFF4E1] rounded-3xl shadow-2xl shadow-black/30 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#1A312C] rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#89D7B7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                            </svg>
                        </div>
                        <h2 className="font-display text-2xl font-bold text-[#1A312C] mb-2">Reset your password</h2>
                        <p className="text-[#428475] text-sm">Enter your email and choose a new password.</p>
                    </div>

                    <div className="space-y-3 mb-4">
                        <AlertError msg={error} />
                        <AlertSuccess msg={success} />
                    </div>

                    <div className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1A312C] mb-1.5 font-display">Email address</label>
                            <input name="email" type="email" value={form.email} onChange={handleChange}
                                placeholder="Your registered email"
                                className="w-full px-4 py-3 border-2 border-[#1A312C]/15 rounded-xl text-sm text-[#1A312C] placeholder-[#428475]/50 outline-none focus:border-[#428475] focus:ring-2 focus:ring-[#89D7B7]/20 bg-white transition-all"
                            />
                        </div>
                        {/* New password */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1A312C] mb-1.5 font-display">New password</label>
                            <div className="relative">
                                <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange}
                                    placeholder="Min 8 characters"
                                    className="w-full pl-4 pr-11 py-3 border-2 border-[#1A312C]/15 rounded-xl text-sm text-[#1A312C] placeholder-[#428475]/50 outline-none focus:border-[#428475] focus:ring-2 focus:ring-[#89D7B7]/20 bg-white transition-all"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#428475] hover:text-[#1A312C] transition-colors">
                                    <EyeIcon open={showPass} />
                                </button>
                            </div>
                            {form.password.length > 0 && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[1,2,3,4,5].map(i => (
                                            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-[#1A312C]/10'}`} />
                                        ))}
                                    </div>
                                    <p className={`text-xs font-medium ${strength.score <= 2 ? 'text-orange-500' : strength.score <= 3 ? 'text-amber-500' : 'text-[#428475]'}`}>
                                        {strength.label}
                                    </p>
                                </div>
                            )}
                        </div>
                        {/* Confirm password */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1A312C] mb-1.5 font-display">Confirm new password</label>
                            <div className="relative">
                                <input name="confirmPassword" type={showConf ? 'text' : 'password'} value={form.confirmPassword} onChange={handleChange}
                                    placeholder="Repeat your new password"
                                    className={`w-full pl-4 pr-11 py-3 border-2 rounded-xl text-sm text-[#1A312C] placeholder-[#428475]/50 outline-none bg-white transition-all
                                        ${mismatch ? 'border-red-300 focus:ring-2 focus:ring-red-100' : match ? 'border-[#89D7B7] focus:ring-2 focus:ring-[#89D7B7]/20' : 'border-[#1A312C]/15 focus:border-[#428475] focus:ring-2 focus:ring-[#89D7B7]/20'}`}
                                />
                                <button type="button" onClick={() => setShowConf(!showConf)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#428475] hover:text-[#1A312C] transition-colors">
                                    <EyeIcon open={showConf} />
                                </button>
                            </div>
                            {mismatch && <p className="text-xs text-red-500 mt-1">Passwords don't match</p>}
                            {match    && <p className="text-xs text-[#428475] mt-1">Passwords match ✓</p>}
                        </div>
                    </div>

                    <BtnPrimary onClick={handleSubmit} disabled={!!success} loading={loading} className="w-full mt-6 py-3.5 text-base font-display">
                        {!loading && (success ? 'Password updated ✓' : 'Update password →')}
                    </BtnPrimary>

                    <p className="text-center text-sm text-[#428475] mt-5">
                        Remembered it?{' '}
                        <Link to="/login" className="text-[#1A312C] font-semibold hover:text-[#428475] transition-colors">Sign in instead</Link>
                    </p>
                </div>

                <div className="flex items-center justify-center gap-2 mt-8">
                    <OSLogo size={22} />
                    <span className="font-display text-sm text-[#89D7B7]/50">OneSocial</span>
                </div>
            </div>
        </div>
    );
}