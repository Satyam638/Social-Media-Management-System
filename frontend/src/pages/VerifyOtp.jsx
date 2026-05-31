// src/pages/VerifyOTP.jsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function VerifyOTP() {
    const navigate = useNavigate();
    const [otp, setOtp]         = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');
    const [success, setSuccess] = useState('');
    const inputs = useRef([]);
    const email  = localStorage.getItem('pendingEmail');

    // handle each digit input
    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // numbers only
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        // auto-focus next input
        if (value && index < 5) inputs.current[index + 1]?.focus();
    };

    // handle backspace
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }
        try {
            setLoading(true);
            setError('');
            await API.post('/api/auth/verify-otp', {
                email,
                otp: Number(otpValue)
            });
            setSuccess('Email verified! Redirecting...');
            localStorage.removeItem('pendingEmail');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            await API.post('/api/auth/resend-otp', { email });
            setSuccess('OTP resent to your email');
            setError('');
        } catch (err) {
            setError('Failed to resend OTP');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">📧</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Verify Your Email</h2>
                    <p className="text-gray-500 mt-2 text-sm">
                        We sent a 6-digit code to<br />
                        <span className="font-semibold text-gray-700">{email}</span>
                    </p>
                </div>

                {/* Error / Success */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm text-center">
                        {success}
                    </div>
                )}

                {/* OTP inputs */}
                <div className="flex justify-center gap-3 mb-6">
                    {otp.map((digit, i) => (
                        <input
                            key={i}
                            ref={el => inputs.current[i] = el}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleChange(i, e.target.value)}
                            onKeyDown={e => handleKeyDown(i, e)}
                            className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    ))}
                </div>

                <button
                    onClick={handleVerify}
                    disabled={loading}
                    className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                        loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {loading ? 'Verifying...' : 'Verify Email'}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Didn't receive code?{' '}
                    <button onClick={handleResend} className="text-blue-600 hover:underline font-medium">
                        Resend OTP
                    </button>
                </p>
            </div>
        </div>
    );
}