// src/utils/design.js
// ── Electric Forest palette (colorhunt.co/palette/1a312c42847589d7b7fff4e1) ──
// #1A312C  forest  — dark backgrounds, main headings, sidebar
// #428475  teal    — secondary text, borders, mid elements
// #89D7B7  mint    — accent, CTAs on dark, highlights, icons
// #FFF4E1  cream   — light page backgrounds, section fills

export const C = {
    forest : '#1A312C',
    teal   : '#428475',
    mint   : '#89D7B7',
    cream  : '#FFF4E1',
};

// ── Inject Google Fonts once (add preconnect in index.html for speed) ────────
// <link rel="preconnect" href="https://fonts.googleapis.com">
// <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">

export const GlobalFonts = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
        :root {
            --c-forest : #1A312C;
            --c-teal   : #428475;
            --c-mint   : #89D7B7;
            --c-cream  : #FFF4E1;
        }
        body { font-family: 'Inter', sans-serif; background: #FFF4E1; color: #1A312C; }
        .font-display { font-family: 'Space Grotesk', sans-serif !important; }
        .font-mono-os { font-family: 'JetBrains Mono', monospace !important; }

        /* Shared animations */
        @keyframes os-pulse-ring {
            0%   { transform: scale(0.7); opacity: 0.6; }
            80%  { transform: scale(2.2); opacity: 0; }
            100% { transform: scale(2.2); opacity: 0; }
        }
        .os-ring   { animation: os-pulse-ring 2.8s cubic-bezier(.2,.6,.4,1) infinite; }
        .os-ring-d1 { animation-delay: 0s;   }
        .os-ring-d2 { animation-delay: 0.9s; }
        .os-ring-d3 { animation-delay: 1.8s; }

        @keyframes os-float {
            0%,100% { transform: translateY(0px);   }
            50%      { transform: translateY(-10px); }
        }
        .os-float { animation: os-float 5s ease-in-out infinite; }

        @keyframes os-draw-line {
            from { stroke-dashoffset: 240; }
            to   { stroke-dashoffset: 0;   }
        }
        .os-draw { stroke-dasharray: 240; animation: os-draw-line 1.4s ease-out forwards; }

        @keyframes os-node-pop {
            from { transform: scale(0.4); opacity: 0; }
            to   { transform: scale(1);   opacity: 1; }
        }
        .os-node-pop { animation: os-node-pop 0.5s cubic-bezier(.34,1.56,.64,1) forwards; opacity: 0; }

        @keyframes os-fade-in-up {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0);    }
        }
        .os-fade-in-up { animation: os-fade-in-up 0.5s ease-out forwards; }

        @media (prefers-reduced-motion: reduce) {
            .os-ring, .os-float, .os-draw, .os-node-pop, .os-fade-in-up {
                animation: none !important; opacity: 1 !important; stroke-dashoffset: 0 !important;
            }
        }
    `}</style>
);

// ── Shared platform icon components ─────────────────────────────────────────
export const LinkedInIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#0A66C2" />
        <path d="M7.5 9.5H5V19H7.5V9.5Z" fill="white" />
        <circle cx="6.25" cy="6.75" r="1.5" fill="white" />
        <path d="M19 19H16.5V14C16.5 12.9 15.85 12 14.75 12C13.65 12 13 12.9 13 14V19H10.5V9.5H13V10.75C13.55 9.9 14.6 9.25 15.75 9.25C17.6 9.25 19 10.65 19 12.75V19Z" fill="white" />
    </svg>
);
export const FacebookIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#1877F2" />
        <path d="M13.5 12.5H15.5L16 10H13.5V8.5C13.5 7.8 13.8 7.25 14.75 7.25H16V5.1C15.45 5.05 14.7 5 13.9 5C11.8 5 10.5 6.2 10.5 8.25V10H8V12.5H10.5V19H13.5V12.5Z" fill="white" />
    </svg>
);
export const InstagramIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
            <linearGradient id="os-ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#FFDC80" />
                <stop offset="50%"  stopColor="#F77737" />
                <stop offset="100%" stopColor="#833AB4" />
            </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#os-ig-grad)" />
        <rect x="6" y="6" width="12" height="12" rx="4" stroke="white" strokeWidth="1.5" fill="none" />
        <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" fill="none" />
        <circle cx="16.5" cy="7.5" r="1" fill="white" />
    </svg>
);
export const TwitterXIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#000" />
        <path d="M17.5 5H19.5L14.5 11L20 19H15.5L12 14.5L8 19H6L11.5 12.5L6.5 5H11L14 9.5L17.5 5ZM16.5 17.5H17.5L9.5 6.5H8.5L16.5 17.5Z" fill="white" />
    </svg>
);

// ── Shared UI atoms ──────────────────────────────────────────────────────────

// Logo mark
export const OSLogo = ({ size = 28, className = '' }) => (
    <div
        className={className}
        style={{
            width: size, height: size, borderRadius: Math.round(size * 0.28),
            background: '#89D7B7', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
    >
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: size * 0.36, color: '#1A312C' }}>
            OS
        </span>
    </div>
);

// Primary button — dark bg, mint text
export const BtnPrimary = ({ children, onClick, disabled, loading, className = '', type = 'button' }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200
            ${disabled || loading
                ? 'bg-[#428475] text-[#89D7B7]/60 cursor-not-allowed'
                : 'bg-[#1A312C] text-[#89D7B7] hover:brightness-110 hover:-translate-y-0.5 shadow-md shadow-[#1A312C]/20'
            } ${className}`}
    >
        {loading && (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
        )}
        {children}
    </button>
);

// Ghost button — forest border
export const BtnGhost = ({ children, onClick, disabled, className = '' }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border-2 border-[#1A312C]/20 text-[#1A312C] hover:border-[#428475] hover:bg-[#428475]/5 transition-all duration-200 ${className}`}
    >
        {children}
    </button>
);

// Mint CTA button — for dark backgrounds
export const BtnMint = ({ children, onClick, disabled, loading, className = '' }) => (
    <button
        onClick={onClick}
        disabled={disabled || loading}
        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200
            ${disabled || loading
                ? 'bg-[#89D7B7]/40 text-[#1A312C]/50 cursor-not-allowed'
                : 'bg-[#89D7B7] text-[#1A312C] hover:brightness-105 hover:-translate-y-0.5 shadow-lg shadow-black/20'
            } ${className}`}
    >
        {loading && (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
        )}
        {children}
    </button>
);

// Error alert
export const AlertError = ({ msg }) => msg ? (
    <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        {msg}
    </div>
) : null;

// Success alert
export const AlertSuccess = ({ msg }) => msg ? (
    <div className="flex items-start gap-2.5 bg-[#89D7B7]/15 border border-[#89D7B7]/40 text-[#1A312C] px-4 py-3 rounded-xl text-sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5 text-[#428475]">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        {msg}
    </div>
) : null;

// Input field
export const InputField = ({ label, name, type = 'text', value, onChange, onKeyDown, placeholder, autoComplete, icon, rightEl, error, className = '' }) => (
    <div className={className}>
        {label && <label className="block text-sm font-semibold text-[#1A312C] mb-1.5 font-display">{label}</label>}
        <div className="relative">
            {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#428475]">{icon}</span>}
            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className={`w-full ${icon ? 'pl-10' : 'pl-4'} ${rightEl ? 'pr-11' : 'pr-4'} py-3 border-2 rounded-xl text-sm text-[#1A312C] placeholder-[#428475]/50 outline-none transition-all duration-200
                    ${error
                        ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                        : 'border-[#1A312C]/15 bg-white focus:border-[#428475] focus:ring-2 focus:ring-[#89D7B7]/20'
                    }`}
            />
            {rightEl && <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightEl}</span>}
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
);

// Skeleton loader
export const Skeleton = ({ className = '' }) => (
    <div className={`animate-pulse bg-[#1A312C]/8 rounded-xl ${className}`} />
);

// Nav logo bar used on auth pages
export const AuthNavBar = ({ navigate }) => (
    <nav className="sticky top-0 z-50 bg-[#FFF4E1]/90 backdrop-blur-md border-b border-[#1A312C]/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center gap-2.5">
                <OSLogo size={30} />
                <span className="font-display font-semibold text-base text-[#1A312C]">OneSocial</span>
            </button>
        </div>
    </nav>
);