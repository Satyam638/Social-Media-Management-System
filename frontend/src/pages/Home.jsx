// src/pages/Home.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

// ── SVG Icons ────────────────────────────────────────────────────────────────
const LinkedInIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#0A66C2" />
        <path d="M7.5 9.5H5V19H7.5V9.5Z" fill="white" />
        <circle cx="6.25" cy="6.75" r="1.5" fill="white" />
        <path d="M19 19H16.5V14C16.5 12.9 15.85 12 14.75 12C13.65 12 13 12.9 13 14V19H10.5V9.5H13V10.75C13.55 9.9 14.6 9.25 15.75 9.25C17.6 9.25 19 10.65 19 12.75V19Z" fill="white" />
    </svg>
);
const FacebookIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#1877F2" />
        <path d="M13.5 12.5H15.5L16 10H13.5V8.5C13.5 7.8 13.8 7.25 14.75 7.25H16V5.1C15.45 5.05 14.7 5 13.9 5C11.8 5 10.5 6.2 10.5 8.25V10H8V12.5H10.5V19H13.5V12.5Z" fill="white" />
    </svg>
);
const InstagramIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
            <linearGradient id="ig-home" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFDC80" />
                <stop offset="50%" stopColor="#F77737" />
                <stop offset="100%" stopColor="#833AB4" />
            </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#ig-home)" />
        <rect x="6" y="6" width="12" height="12" rx="4" stroke="white" strokeWidth="1.5" fill="none" />
        <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" fill="none" />
        <circle cx="16.5" cy="7.5" r="1" fill="white" />
    </svg>
);

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

// ── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', duration = 1500 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const startTime = performance.now();
                    const animate = (now) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.floor(eased * target));
                        if (progress < 1) requestAnimationFrame(animate);
                        else setCount(target);
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
}

// ── Feature cards data ───────────────────────────────────────────────────────
const features = [
    {
        emoji: '🤖',
        title: 'AI Caption Generator',
        desc: 'Enter a topic and tone — get ready-to-post captions tailored for each platform in under 60 seconds.',
        color: 'from-violet-50 to-purple-50',
        border: 'border-violet-200',
        tag: 'Powered by AI',
        tagColor: 'bg-violet-100 text-violet-700',
    },
    {
        emoji: '📅',
        title: 'Smart Scheduler',
        desc: 'Pick a date and time, and your post goes live automatically — no need to be online when it publishes.',
        color: 'from-blue-50 to-cyan-50',
        border: 'border-blue-200',
        tag: 'Set & forget',
        tagColor: 'bg-blue-100 text-blue-700',
    },
    {
        emoji: '📊',
        title: 'Analytics Dashboard',
        desc: 'See how many posts you\'ve published per platform, track success rates, and view a 30-day history.',
        color: 'from-emerald-50 to-teal-50',
        border: 'border-emerald-200',
        tag: 'Track growth',
        tagColor: 'bg-emerald-100 text-emerald-700',
    },
    {
        emoji: '⚡',
        title: 'Simultaneous Posting',
        desc: 'Write once, select your platforms, and publish to all of them in a single click — no copy-pasting.',
        color: 'from-amber-50 to-orange-50',
        border: 'border-amber-200',
        tag: 'Save time',
        tagColor: 'bg-amber-100 text-amber-700',
    },
    {
        emoji: '🔗',
        title: 'Secure OAuth Login',
        desc: 'Connect LinkedIn, Facebook and Instagram via official OAuth — your passwords are never stored or seen.',
        color: 'from-rose-50 to-pink-50',
        border: 'border-rose-200',
        tag: 'Secure',
        tagColor: 'bg-rose-100 text-rose-700',
    },
    {
        emoji: '🎨',
        title: 'Per-Platform Content',
        desc: 'Write different captions for each platform in one composer — because what works on LinkedIn differs from Instagram.',
        color: 'from-indigo-50 to-blue-50',
        border: 'border-indigo-200',
        tag: 'Flexible',
        tagColor: 'bg-indigo-100 text-indigo-700',
    },
];

// ── Updated stats — honest and specific ─────────────────────────────────────
const stats = [
    { value: 3, suffix: '', label: 'Platforms in one place' },
    { value: 60, suffix: 's', label: 'To generate AI captions' },
    { value: 30, suffix: '+', label: 'Days of post history' },
    { value: 0, suffix: '₹', label: 'Cost to get started' },
];

// ── Home Component ───────────────────────────────────────────────────────────
export default function Home() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white font-sans">

            {/* ── Navbar ────────────────────────────────────────────────── */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                            OS
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900 leading-none">OneSocial</p>
                            <p className="text-xs text-gray-400 leading-none mt-0.5">Social Media Management</p>
                        </div>
                    </div>
                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={() => navigate('/how-to-use')}
                            className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200"
                        >
                            How it works
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-indigo-200 hover:shadow-md"
                        >
                            Get started free →
                        </button>
                    </div>
                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            {menuOpen
                                ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                                : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
                            }
                        </svg>
                    </button>
                </div>
                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden border-t border-gray-100 px-6 py-4 flex flex-col gap-3 bg-white">
                        <button onClick={() => navigate('/login')} className="w-full py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">Login</button>
                        <button onClick={() => navigate('/register')} className="w-full py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg">Get started free →</button>
                    </div>
                )}
            </nav>

            {/* ── Hero ──────────────────────────────────────────────────── */}
            <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
                {/* Platform chips */}
                <div className="flex justify-center flex-wrap gap-2 mb-8">
                    {[
                        { icon: <LinkedInIcon size={16} />, label: 'LinkedIn' },
                        { icon: <FacebookIcon size={16} />, label: 'Facebook' },
                        { icon: <InstagramIcon size={16} />, label: 'Instagram' },
                    ].map(p => (
                        <div key={p.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-600">
                            {p.icon} {p.label}
                        </div>
                    ))}
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
                    One post.{' '}
                    <span className="relative inline-block">
                        <span className="relative z-10 text-indigo-600">All your platforms.</span>
                        <span className="absolute inset-x-0 bottom-1 h-3 bg-indigo-100 -z-0 rounded" />
                    </span>
                </h1>

                {/* Subheading — honest, no fake claims */}
                <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
                    Stop switching between apps. Write once, customize per platform, and publish
                    everywhere — with AI captions, post scheduling, and analytics built in.
                    Free to use, no card required.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                    <button
                        onClick={() => navigate('/register')}
                        className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-200 text-lg shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5"
                    >
                        Create free account ✨
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-lg"
                    >
                        Sign in to your account
                    </button>
                </div>

                {/* Honest trust indicators — no fake user count */}
                <div className="flex items-center justify-center gap-6 flex-wrap">
                    {['No credit card', 'No setup fees', 'Instant access'].map(item => (
                        <span key={item} className="flex items-center gap-1.5 text-sm text-gray-500">
                            <span className="text-green-500"><CheckIcon /></span>
                            {item}
                        </span>
                    ))}
                </div>
            </section>

            {/* ── Stats Bar — honest numbers only ───────────────────────── */}
            <section className="border-y border-gray-100 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                        <div key={i} className="text-center">
                            <p className="text-4xl font-bold text-indigo-600">
                                {s.suffix === '₹'
                                    ? <span>₹0</span>
                                    : <AnimatedCounter target={s.value} suffix={s.suffix} />
                                }
                            </p>
                            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features ──────────────────────────────────────────────── */}
            <section className="max-w-6xl mx-auto px-6 py-20">
                <div className="text-center mb-14">
                    <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">Everything you need</p>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for creators & teams</h2>
                    <p className="text-lg text-gray-500 max-w-xl mx-auto">
                        Every tool you need to manage your social media — in one clean dashboard.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className={`relative bg-gradient-to-br ${f.color} border ${f.border} rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-default`}
                        >
                            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${f.tagColor}`}>
                                {f.tag}
                            </span>
                            <div className="text-3xl mb-3">{f.emoji}</div>
                            <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── How it works ──────────────────────────────────────────── */}
            <section className="bg-gray-50 border-y border-gray-100 py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">How it works</p>
                        <h2 className="text-4xl font-bold text-gray-900">Up and running in minutes</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Connect your accounts',
                                desc: 'Link LinkedIn, Facebook and Instagram using secure OAuth. No passwords stored — ever.',
                                icon: '🔗'
                            },
                            {
                                step: '02',
                                title: 'Write or generate content',
                                desc: 'Type your post manually or let AI generate platform-specific captions from a topic and tone.',
                                icon: '✍️'
                            },
                            {
                                step: '03',
                                title: 'Publish or schedule',
                                desc: 'Post immediately to all selected platforms, or pick a future date and let OneSocial handle it.',
                                icon: '🚀'
                            },
                        ].map((s, i) => (
                            <div key={i} className="relative">
                                {i < 2 && (
                                    <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-indigo-200 to-transparent z-0" style={{ width: 'calc(100% - 2rem)', left: 'calc(100% - 1rem)' }} />
                                )}
                                <div className="relative z-10 bg-white rounded-2xl p-7 border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all duration-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-xs font-bold text-indigo-400 bg-indigo-50 px-2 py-1 rounded-md">{s.step}</span>
                                        <span className="text-2xl">{s.icon}</span>
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-2">{s.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── What you can do — replaces fake testimonials ──────────── */}
            <section className="max-w-6xl mx-auto px-6 py-20">
                <div className="text-center mb-12">
                    <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">Use cases</p>
                    <h2 className="text-4xl font-bold text-gray-900">Who is OneSocial for?</h2>
                    <p className="text-lg text-gray-500 max-w-xl mx-auto mt-4">
                        Whether you manage one brand or many, OneSocial saves you time every week.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            emoji: '👤',
                            title: 'Solo Creators',
                            desc: 'Manage your personal brand across LinkedIn, Instagram and Facebook without juggling three different apps.',
                            bg: 'bg-violet-50',
                            border: 'border-violet-200',
                        },
                        {
                            emoji: '💼',
                            title: 'Small Businesses',
                            desc: 'Keep your business pages active and consistent. Schedule a week of content in one sitting.',
                            bg: 'bg-blue-50',
                            border: 'border-blue-200',
                        },
                        {
                            emoji: '📣',
                            title: 'Social Media Managers',
                            desc: 'Handle multiple platforms from one dashboard. Use AI to draft faster and scheduling to stay ahead.',
                            bg: 'bg-emerald-50',
                            border: 'border-emerald-200',
                        },
                    ].map((card, i) => (
                        <div key={i} className={`${card.bg} border ${card.border} rounded-2xl p-7 hover:shadow-md hover:-translate-y-1 transition-all duration-200`}>
                            <div className="text-4xl mb-4">{card.emoji}</div>
                            <h3 className="text-base font-semibold text-gray-900 mb-2">{card.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA Banner ────────────────────────────────────────────── */}
            <section className="max-w-6xl mx-auto px-6 pb-20">
                <div className="relative bg-indigo-600 rounded-3xl p-12 md:p-16 text-center overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500 rounded-full opacity-40" />
                    <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-700 rounded-full opacity-30" />
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to post smarter?
                        </h2>
                        <p className="text-indigo-200 text-lg mb-8 max-w-xl mx-auto">
                            Create your free account, connect your platforms, and start
                            publishing in minutes. No credit card, no setup fees.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/register')}
                                className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all duration-200 text-base shadow-lg"
                            >
                                Create free account →
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-8 py-4 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-400 transition-all duration-200 text-base border border-indigo-400"
                            >
                                Sign in
                            </button>
                        </div>
                        {/* Mini checklist */}
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8">
                            {['Free to use', 'No credit card', 'LinkedIn + Facebook + Instagram', 'AI captions included'].map((item) => (
                                <span key={item} className="flex items-center gap-1.5 text-indigo-200 text-sm">
                                    <span className="text-indigo-300"><CheckIcon /></span>
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ────────────────────────────────────────────────── */}
            <footer className="border-t border-gray-100 py-10">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">OS</div>
                        <span className="text-sm font-semibold text-gray-700">OneSocial</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-sm text-gray-400">Social Media Management</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-sm text-gray-400">© 2026 OneSocial</span>
                        <button onClick={() => navigate('/login')} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Login</button>
                        <button onClick={() => navigate('/register')} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Register</button>
                        {/* Add Privacy Policy route when ready */}
                        <button onClick={() => navigate('/privacy')} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Privacy Policy</button>
                    </div>
                </div>
            </footer>
        </div>
    );
}