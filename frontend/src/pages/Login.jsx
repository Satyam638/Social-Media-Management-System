// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { GlobalFonts, OSLogo, BtnMint, AlertError, InputField } from '../utils/design';

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
const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
    </svg>
);

const LEFT_FEATURES = [
    { icon: '⚡', text: 'Post to 3 platforms in one click' },
    { icon: '🤖', text: 'AI captions tailored per platform' },
    { icon: '📅', text: 'Schedule posts for any date & time' },
    { icon: '📊', text: 'Analytics to track your growth' },
];

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm]             = useState({ email: '', password: '' });
    const [loading, setLoading]       = useState(false);
    const [error, setError]           = useState('');
    const [showPassword, setShowPass] = useState(false);

    const handleChange = e => { setError(''); setForm({ ...form, [e.target.name]: e.target.value }); };

    const handleLogin = async () => {
        setError('');
        if (!form.email.trim()) { setError('Email address is required'); return; }
        if (!form.password)     { setError('Password is required'); return; }
        try {
            setLoading(true);
            const res = await API.post('/api/auth/login', form);
            if (res.data.success) navigate('/dashboard');
        } catch (err) {
            const status = err.response?.status;
            const message = err.response?.data?.message;
            if (status === 429) setError('Too many attempts. Please wait 15 minutes.');
            else if (status === 401) setError('Incorrect email or password.');
            else setError(message || 'Something went wrong. Please try again.');
        } finally { setLoading(false); }
    };

    const handleKeyDown = e => { if (e.key === 'Enter') handleLogin(); };

    return (
        <div className="min-h-screen flex bg-[#FFF4E1]">
            <GlobalFonts />

            {/* ── Left panel (dark) ──────────────────────────────────── */}
            <div className="hidden lg:flex lg:w-5/12 bg-[#1A312C] flex-col justify-between p-12 relative overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#89D7B7] opacity-5" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#428475] opacity-10" />
                <div className="relative z-10">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-16">
                        <OSLogo size={36} />
                        <span className="font-display font-semibold text-lg text-white">OneSocial</span>
                    </div>
                    {/* Headline */}
                    <h2 className="font-display text-3xl font-bold text-white leading-snug mb-4">
                        Welcome back!
                    </h2>
                    <p className="text-[#89D7B7]/65 text-base leading-relaxed mb-10">
                        Your social media dashboard is ready.<br />Pick up right where you left off.
                    </p>
                    {/* Feature list */}
                    <div className="space-y-4">
                        {LEFT_FEATURES.map((f, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#89D7B7]/10 flex items-center justify-center text-sm flex-shrink-0">
                                    {f.icon}
                                </div>
                                <span className="text-[#89D7B7]/75 text-sm">{f.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Testimonial card */}
                <div className="relative z-10 bg-[#89D7B7]/8 border border-[#89D7B7]/15 rounded-2xl p-5">
                    <div className="flex items-center gap-1 mb-3">
                        {'★★★★★'.split('').map((s, i) => <span key={i} className="text-[#89D7B7] text-sm">{s}</span>)}
                    </div>
                    <p className="text-[#89D7B7]/70 text-sm leading-relaxed mb-3">
                        "The scheduler is seamless. My posts go out perfectly timed without me even thinking about it."
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#428475] flex items-center justify-center text-xs font-bold text-white font-display">MJ</div>
                        <span className="text-[#89D7B7]/45 text-xs">Mike J. — Social Media Manager</span>
                    </div>
                </div>
            </div>

            {/* ── Right panel (form) ─────────────────────────────────── */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#FFF4E1]">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <OSLogo size={28} />
                        <span className="font-display font-semibold text-[#1A312C]">OneSocial</span>
                    </div>
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="font-display text-2xl font-bold text-[#1A312C] mb-1">Sign in to your account</h1>
                        <p className="text-sm text-[#428475]">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-[#1A312C] font-semibold hover:text-[#428475] transition-colors">
                                Create one free →
                            </Link>
                        </p>
                    </div>

                    <AlertError msg={error} />
                    {error && <div className="mb-4" />}

                    <div className="space-y-4">
                        <InputField
                            label="Email address"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder="john@example.com"
                            autoComplete="email"
                            icon={<MailIcon />}
                        />
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-semibold text-[#1A312C] font-display">Password</label>
                                <Link to="/forgot-password" className="text-xs text-[#428475] hover:text-[#1A312C] font-medium transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#428475]"><LockIcon /></span>
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Your password"
                                    autoComplete="current-password"
                                    className="w-full pl-10 pr-11 py-3 border-2 border-[#1A312C]/15 rounded-xl text-sm text-[#1A312C] placeholder-[#428475]/50 outline-none focus:border-[#428475] focus:ring-2 focus:ring-[#89D7B7]/20 bg-white transition-all"
                                />
                                <button type="button" onClick={() => setShowPass(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#428475] hover:text-[#1A312C] transition-colors">
                                    <EyeIcon open={showPassword} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <BtnMint onClick={handleLogin} loading={loading} className="w-full mt-6 py-3.5 text-base font-display">
                        {!loading && 'Sign in →'}
                    </BtnMint>

                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-[#1A312C]/10" />
                        <span className="text-xs text-[#428475]">or</span>
                        <div className="flex-1 h-px bg-[#1A312C]/10" />
                    </div>

                    <p className="text-center text-sm text-[#428475]">
                        New to OneSocial?{' '}
                        <Link to="/register" className="text-[#1A312C] font-semibold hover:text-[#428475] transition-colors">Create a free account</Link>
                    </p>

                    <p className="text-center text-xs text-[#428475]/60 mt-6 flex items-center justify-center gap-1.5">
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