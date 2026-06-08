// src/pages/Register.jsx
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
const UserIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
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
const EyeIcon = ({ open }) => open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
);
const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
    </svg>
);

// ── Left panel features ──────────────────────────────────────────────────────
const leftFeatures = [
    { icon: '🔗', text: 'Post to LinkedIn, Facebook & Instagram at once' },
    { icon: '🤖', text: 'AI generates optimized captions for each platform' },
    { icon: '📅', text: 'Schedule posts to go live at any time' },
    { icon: '📊', text: 'Track your publishing analytics in real-time' },
];

// ── Component ────────────────────────────────────────────────────────────────
export default function Register() {
    const navigate = useNavigate();
    const [form, setForm]           = useState({ name: '', email: '', password: '' });
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const strength = getStrength(form.password);

    const handleChange = e => {
        setError('');
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setError('');
        if (!form.name.trim())     { setError('Full name is required'); return; }
        if (!form.email.trim())    { setError('Email address is required'); return; }
        if (!form.password)        { setError('Password is required'); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
        try {
            setLoading(true);
            await API.post('/api/auth/register', { ...form, role: 'Admin' });
            localStorage.setItem('pendingEmail', form.email);
            navigate('/verify');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = e => { if (e.key === 'Enter') handleSubmit(); };

    return (
        <div className="min-h-screen flex">

            {/* ── Left Panel ────────────────────────────────────────────── */}
            <div className="hidden lg:flex lg:w-5/12 bg-indigo-600 flex-col justify-between p-12 relative overflow-hidden">
                {/* Background circles */}
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
                        Manage all your socials in one place
                    </h2>
                    <p className="text-indigo-200 text-base leading-relaxed mb-10">
                        Join hundreds of creators who save hours every week by managing LinkedIn, Facebook and Instagram from a single dashboard.
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
                        "OneSocial saves me 3 hours every week. The AI captions are genuinely good — I barely edit them."
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-400 flex items-center justify-center text-xs font-bold text-white">AK</div>
                        <span className="text-indigo-200 text-xs">Amit K. — Content Creator</span>
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
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
                        <p className="text-sm text-gray-500">
                            Already have one?{' '}
                            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                                Sign in →
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

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                    <UserIcon />
                                </span>
                                <input
                                    name="name"
                                    type="text"
                                    value={form.name}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="John Doe"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                                />
                            </div>
                        </div>

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
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
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
                                    placeholder="Min 6 characters"
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

                            {/* Password strength bar */}
                            {form.password.length > 0 && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-xs font-medium ${
                                        strength.score <= 1 ? 'text-red-500' :
                                        strength.score <= 2 ? 'text-orange-500' :
                                        strength.score <= 3 ? 'text-amber-500' :
                                        'text-green-600'
                                    }`}>
                                        {strength.label}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit button */}
                    <button
                        onClick={handleSubmit}
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
                                Creating account...
                            </>
                        ) : (
                            'Create account →'
                        )}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400">or</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Login link */}
                    <p className="text-center text-sm text-gray-500">
                        Have an account?{' '}
                        <Link to="/login" className="text-indigo-600 font-medium hover:underline">Sign in</Link>
                    </p>

                    {/* Trust badges */}
                    <div className="flex justify-center gap-5 mt-6">
                        {['Free to use', 'No credit card', 'Secure OAuth'].map(t => (
                            <span key={t} className="flex items-center gap-1 text-xs text-gray-400">
                                <span className="text-green-500"><CheckIcon /></span>
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}