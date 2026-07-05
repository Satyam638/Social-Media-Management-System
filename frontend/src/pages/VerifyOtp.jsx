// src/pages/VerifyOtp.jsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { GlobalFonts, OSLogo, BtnPrimary, AlertError, AlertSuccess } from '../utils/design';

export default function VerifyOTP() {
    const navigate = useNavigate();
    const [otp, setOtp]         = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');
    const [success, setSuccess] = useState('');
    const inputs = useRef([]);
    const email  = localStorage.getItem('pendingEmail');

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const next = [...otp];
        next[index] = value;
        setOtp(next);
        if (value && index < 5) inputs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) inputs.current[index - 1]?.focus();
    };

    const handleVerify = async () => {
        const val = otp.join('');
        if (val.length !== 6) { setError('Please enter all 6 digits'); return; }
        try {
            setLoading(true); setError('');
            await API.post('/api/auth/verify-otp', { email, otp: Number(val) });
            setSuccess('Email verified! Redirecting…');
            localStorage.removeItem('pendingEmail');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally { setLoading(false); }
    };

    const handleResend = async () => {
        try {
            await API.post('/api/auth/resend-otp', { email });
            setSuccess('OTP resent to your email'); setError('');
        } catch { setError('Failed to resend OTP'); }
    };

    return (
        <div className="min-h-screen bg-[#1A312C] flex items-center justify-center px-4">
            <GlobalFonts />
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-[#FFF4E1] rounded-3xl shadow-2xl shadow-black/30 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#1A312C] rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">📧</span>
                        </div>
                        <h2 className="font-display text-2xl font-bold text-[#1A312C]">Verify your email</h2>
                        <p className="text-[#428475] mt-2 text-sm leading-relaxed">
                            We sent a 6-digit code to<br />
                            <span className="font-semibold text-[#1A312C]">{email}</span>
                        </p>
                    </div>

                    <div className="space-y-3 mb-6">
                        <AlertError msg={error} />
                        <AlertSuccess msg={success} />
                    </div>

                    {/* OTP inputs */}
                    <div className="flex justify-center gap-2.5 mb-7">
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                ref={el => inputs.current[i] = el}
                                type="text" maxLength={1} value={digit}
                                onChange={e => handleChange(i, e.target.value)}
                                onKeyDown={e => handleKeyDown(i, e)}
                                className="w-12 h-14 text-center text-xl font-bold font-display border-2 border-[#1A312C]/15 rounded-xl outline-none focus:border-[#428475] focus:ring-2 focus:ring-[#89D7B7]/25 bg-white text-[#1A312C] transition-all"
                            />
                        ))}
                    </div>

                    <BtnPrimary onClick={handleVerify} loading={loading} className="w-full py-3.5 text-base font-display">
                        {!loading && 'Verify Email →'}
                    </BtnPrimary>

                    <p className="text-center text-sm text-[#428475] mt-5">
                        Didn't receive it?{' '}
                        <button onClick={handleResend} className="text-[#1A312C] font-semibold hover:text-[#428475] transition-colors">
                            Resend OTP
                        </button>
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