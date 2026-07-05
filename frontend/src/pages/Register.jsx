// src/pages/Register.jsx
import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { GlobalFonts, OSLogo, BtnPrimary, AlertError, InputField } from '../utils/design';

export default function Register() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [form, setForm]       = useState({ name: '', email: '', password: '', role: 'Admin' });
    const [profilePic, setPic]  = useState(null);
    const [picPreview, setPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');

    const handleChange = e => { setError(''); setForm({ ...form, [e.target.name]: e.target.value }); };

    const handlePicSelect = e => {
        const file = e.target.files[0];
        if (!file) return;
        const allowed = ['image/jpeg','image/png','image/webp','image/gif'];
        if (!allowed.includes(file.type)) { setError('Only JPG, PNG, WebP or GIF allowed'); return; }
        if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB'); return; }
        setPic(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        setError('');
        if (!form.name || !form.email || !form.password) { setError('All fields are required'); return; }
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('email', form.email);
            formData.append('password', form.password);
            formData.append('role', form.role);
            if (profilePic) formData.append('profilePic', profilePic);
            await API.post('/api/auth/register', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            localStorage.setItem('pendingEmail', form.email);
            navigate('/verify');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-[#FFF4E1] flex">
            <GlobalFonts />

            {/* ── Left branding strip ─────────────────────────────────── */}
            <div className="hidden lg:flex lg:w-2/5 bg-[#1A312C] flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-[#89D7B7] opacity-5" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#428475] opacity-10" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-16">
                        <OSLogo size={36} />
                        <span className="font-display font-semibold text-lg text-white">OneSocial</span>
                    </div>
                    <h2 className="font-display text-3xl font-bold text-white leading-snug mb-4">
                        Start broadcasting<br />
                        <span className="text-[#89D7B7]">in minutes.</span>
                    </h2>
                    <p className="text-[#89D7B7]/60 text-base leading-relaxed mb-10">
                        Connect LinkedIn, Facebook and Instagram. Write once. Publish everywhere — or schedule it for later.
                    </p>
                    <div className="space-y-5">
                        {[
                            ['🔒', 'Secure OAuth — your passwords are never stored'],
                            ['🤖', 'AI captions for every platform in 60 seconds'],
                            ['📅', 'Schedule posts and walk away'],
                            ['📊', 'Track growth with 30-day analytics'],
                        ].map(([icon, text], i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#89D7B7]/10 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">{icon}</div>
                                <span className="text-[#89D7B7]/70 text-sm leading-relaxed">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative z-10 text-[#89D7B7]/30 text-xs font-mono-os">
                    © 2026 OneSocial · Free to use
                </div>
            </div>

            {/* ── Right form ──────────────────────────────────────────── */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <OSLogo size={28} />
                        <span className="font-display font-semibold text-[#1A312C]">OneSocial</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="font-display text-2xl font-bold text-[#1A312C] mb-1">Create your account</h1>
                        <p className="text-sm text-[#428475]">
                            Already have one?{' '}
                            <Link to="/login" className="text-[#1A312C] font-semibold hover:text-[#428475] transition-colors">Sign in →</Link>
                        </p>
                    </div>

                    <AlertError msg={error} />
                    {error && <div className="mb-4" />}

                    {/* Profile picture */}
                    <div className="flex flex-col items-center mb-7">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative w-20 h-20 rounded-full cursor-pointer group"
                        >
                            {picPreview ? (
                                <img src={picPreview} alt="Preview" className="w-full h-full rounded-full object-cover ring-4 ring-[#89D7B7]/30" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-[#1A312C]/8 border-2 border-dashed border-[#428475]/30 flex items-center justify-center">
                                    <span className="text-3xl">👤</span>
                                </div>
                            )}
                            <div className="absolute inset-0 rounded-full bg-[#1A312C]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-xs font-medium">📷</span>
                            </div>
                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#89D7B7] rounded-full flex items-center justify-center">
                                <span className="text-[#1A312C] text-xs font-bold">+</span>
                            </div>
                        </div>
                        <p className="text-xs text-[#428475] mt-2">{picPreview ? 'Click to change photo' : 'Add profile picture (optional)'}</p>
                        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handlePicSelect} className="hidden" />
                    </div>

                    <div className="space-y-4">
                        <InputField label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
                        <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
                        <InputField label="Password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 8 characters" />
                        <div>
                            <label className="block text-sm font-semibold text-[#1A312C] mb-1.5 font-display">Role</label>
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="w-full border-2 border-[#1A312C]/15 rounded-xl px-4 py-3 text-sm text-[#1A312C] outline-none focus:border-[#428475] focus:ring-2 focus:ring-[#89D7B7]/20 bg-white transition-all"
                            >
                                <option value="Admin">Admin</option>
                                {/* <option value="Superadmin">Superadmin</option> */}
                            </select>
                        </div>
                    </div>

                    <BtnPrimary onClick={handleSubmit} loading={loading} className="w-full mt-6 py-3.5 text-base font-display">
                        {!loading && 'Create Account →'}
                    </BtnPrimary>

                    <p className="text-center text-xs text-[#428475]/60 mt-5">
                        By creating an account, you agree to our{' '}
                        <Link to="/privacy" className="underline hover:text-[#1A312C] transition-colors">Privacy Policy</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}