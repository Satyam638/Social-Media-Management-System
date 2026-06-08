// src/pages/HowToUse.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Icons ────────────────────────────────────────────────────────────────────
const LinkedInIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#0A66C2"/>
        <path d="M7.5 9.5H5V19H7.5V9.5Z" fill="white"/>
        <circle cx="6.25" cy="6.75" r="1.5" fill="white"/>
        <path d="M19 19H16.5V14C16.5 12.9 15.85 12 14.75 12C13.65 12 13 12.9 13 14V19H10.5V9.5H13V10.75C13.55 9.9 14.6 9.25 15.75 9.25C17.6 9.25 19 10.65 19 12.75V19Z" fill="white"/>
    </svg>
);
const FacebookIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#1877F2"/>
        <path d="M13.5 12.5H15.5L16 10H13.5V8.5C13.5 7.8 13.8 7.25 14.75 7.25H16V5.1C15.45 5.05 14.7 5 13.9 5C11.8 5 10.5 6.2 10.5 8.25V10H8V12.5H10.5V19H13.5V12.5Z" fill="white"/>
    </svg>
);
const InstagramIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
            <linearGradient id="ig-htu" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFDC80"/>
                <stop offset="50%" stopColor="#F77737"/>
                <stop offset="100%" stopColor="#833AB4"/>
            </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#ig-htu)"/>
        <rect x="6" y="6" width="12" height="12" rx="4" stroke="white" strokeWidth="1.5" fill="none"/>
        <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" fill="none"/>
        <circle cx="16.5" cy="7.5" r="1" fill="white"/>
    </svg>
);

const CheckIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
    </svg>
);
const XIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
);
const ChevronIcon = ({ open }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
        <polyline points="6 9 12 15 18 9"/>
    </svg>
);

// ── FAQ accordion item ────────────────────────────────────────────────────────
function FAQItem({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${open ? 'border-indigo-200 bg-indigo-50/40' : 'border-gray-200 bg-white'}`}>
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
            >
                <span className={`text-sm font-medium ${open ? 'text-indigo-700' : 'text-gray-800'}`}>{q}</span>
                <span className={`flex-shrink-0 ${open ? 'text-indigo-500' : 'text-gray-400'}`}>
                    <ChevronIcon open={open} />
                </span>
            </button>
            {open && (
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-indigo-100">
                    <div className="pt-3">{a}</div>
                </div>
            )}
        </div>
    );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const platforms = [
    {
        icon: <LinkedInIcon size={28} />,
        name: 'LinkedIn',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        tag: 'Personal profile or Company page',
        tagColor: 'bg-blue-100 text-blue-700',
        needs: [
            { ok: true,  text: 'A personal LinkedIn account' },
            { ok: true,  text: 'Access to your LinkedIn profile or company page' },
            { ok: false, text: 'No special page required — your profile works' },
        ],
        note: 'OneSocial connects via LinkedIn OAuth. It posts on behalf of your personal profile or a company page you manage.',
    },
    {
        icon: <FacebookIcon size={28} />,
        name: 'Facebook',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        tag: 'Facebook PAGE required (not personal)',
        tagColor: 'bg-orange-100 text-orange-700',
        needs: [
            { ok: true,  text: 'A personal Facebook account (to log in)' },
            { ok: true,  text: 'A Facebook Page that YOU manage (business/creator)' },
            { ok: false, text: 'Cannot post to a personal timeline — Pages only' },
        ],
        note: '⚠️ Important: Facebook\'s API only allows posting to Pages, not personal profiles. If you don\'t have a Page, create one free at facebook.com/pages/create.',
    },
    {
        icon: <InstagramIcon size={28} />,
        name: 'Instagram',
        bg: 'bg-pink-50',
        border: 'border-pink-200',
        tag: 'Professional/Business account required',
        tagColor: 'bg-pink-100 text-pink-700',
        needs: [
            { ok: true,  text: 'Instagram account switched to Professional (Creator or Business)' },
            { ok: true,  text: 'Instagram account connected to a Facebook Page' },
            { ok: false, text: 'Cannot post to a personal Instagram account' },
        ],
        note: '⚠️ Important: Instagram\'s API requires a Professional account linked to a Facebook Page. Go to Instagram Settings → Account → Switch to Professional Account.',
    },
];

const steps = [
    {
        num: '01',
        icon: '📝',
        title: 'Create your OneSocial account',
        color: 'bg-indigo-50 border-indigo-200',
        numColor: 'text-indigo-400 bg-indigo-50',
        items: [
            'Click "Get Started Free" on the home page',
            'Enter your name, email and password',
            'Check your email for a 6-digit verification code',
            'Enter the code to verify your email',
            'You\'re in — login to reach your dashboard',
        ],
    },
    {
        num: '02',
        icon: '🔗',
        title: 'Connect your social platforms',
        color: 'bg-blue-50 border-blue-200',
        numColor: 'text-blue-400 bg-blue-50',
        items: [
            'Open your Dashboard and find the Platforms section in the sidebar',
            'Click "Connect" next to LinkedIn — you\'ll be redirected to LinkedIn to approve',
            'Click "Connect" next to Facebook — this also connects Instagram automatically if your Instagram is linked to that Page',
            'Wait for the green "Live" dot to appear next to each platform',
            'If a platform shows a warning, check the requirements below',
        ],
    },
    {
        num: '03',
        icon: '✍️',
        title: 'Write or generate your content',
        color: 'bg-violet-50 border-violet-200',
        numColor: 'text-violet-400 bg-violet-50',
        items: [
            'Go to the Compose tab on your dashboard',
            'Select the platforms you want to post to (LinkedIn, Facebook, Instagram)',
            'Write custom content for each platform — or use the AI Caption Generator',
            'For AI: type your topic (e.g. "New product launch"), pick a tone, select platforms, and click Generate',
            'Click "Use this" on any AI caption to auto-fill it into the compose box',
            'For Instagram posts, paste an image URL in the Image URL field (required)',
        ],
    },
    {
        num: '04',
        icon: '🚀',
        title: 'Publish or schedule',
        color: 'bg-green-50 border-green-200',
        numColor: 'text-green-400 bg-green-50',
        items: [
            'Choose "Post now" to publish immediately to all selected platforms',
            'Choose "Schedule" to pick a future date and time',
            'Click "Publish now" or "Schedule post"',
            'Check the Published or Scheduled tabs to see your posts',
            'View your Analytics page to track success rates and history',
        ],
    },
];

const faqs = [
    {
        q: 'Can I post to my personal Facebook profile?',
        a: 'No — Facebook\'s official API only allows posting to Facebook Pages (business or creator pages), not personal timelines. This is a Facebook limitation, not OneSocial\'s. You need to create a free Facebook Page at facebook.com/pages/create and manage it from your account.',
    },
    {
        q: 'Why does Instagram need a Facebook Page?',
        a: 'Instagram\'s Content Publishing API (used by all scheduling tools) requires your Instagram account to be a Professional account (Creator or Business) AND connected to a Facebook Page. This is a requirement set by Meta. Go to Instagram → Settings → Account → Switch to Professional Account, then link it to your Facebook Page.',
    },
    {
        q: 'What happens if I post to Instagram without an image?',
        a: 'Instagram requires an image for all feed posts via the API. If you don\'t include an image URL, the Instagram post will fail while LinkedIn and Facebook may succeed. Always add a publicly accessible image URL when posting to Instagram.',
    },
    {
        q: 'Can I connect multiple Facebook Pages?',
        a: 'Currently OneSocial connects to one Facebook Page at a time — whichever Page is returned first from your account. Multi-page support is on the roadmap.',
    },
    {
        q: 'Why is my LinkedIn connection showing as failed?',
        a: 'LinkedIn OAuth tokens expire after 60 days. If your connection stops working, go to the sidebar, click Disconnect next to LinkedIn, then reconnect. You\'ll be asked to approve access again.',
    },
    {
        q: 'Can I edit a post after scheduling it?',
        a: 'Not yet — post editing is coming soon. For now, if you need to change a scheduled post, contact support or wait for the update. You can see all scheduled posts in the Scheduled tab.',
    },
    {
        q: 'Is the AI caption generator free?',
        a: 'Yes — AI captions are included for free. You can generate captions for any platform in any tone (professional, casual, funny, inspirational, educational) as many times as you like.',
    },
    {
        q: 'What image formats work for Instagram?',
        a: 'Instagram supports JPEG and PNG images. The image must be hosted at a publicly accessible URL (not localhost, not a Google Drive link). Use services like Cloudinary, Imgur, or any public CDN. Minimum resolution is 320px, maximum is 1440px.',
    },
    {
        q: 'Does OneSocial store my social media passwords?',
        a: 'Never. OneSocial uses OAuth — you log in directly on LinkedIn or Facebook\'s website and they issue an access token to OneSocial. Your passwords are never seen or stored by us.',
    },
    {
        q: 'Can I use OneSocial for a client\'s social media accounts?',
        a: 'Yes — as long as you have admin access to their Facebook Page, LinkedIn Company Page, or Instagram Professional account, you can connect and post on their behalf.',
    },
];

const charLimits = [
    { platform: 'LinkedIn',  icon: <LinkedInIcon size={18} />,  limit: '3,000 characters',  tip: 'Best: 150–300 chars for feed posts. Longer posts work well for thought leadership.' },
    { platform: 'Facebook',  icon: <FacebookIcon size={18} />,  limit: '63,206 characters', tip: 'Best: 40–80 chars gets the most engagement. Short and punchy wins on Facebook.' },
    { platform: 'Instagram', icon: <InstagramIcon size={18} />, limit: '2,200 characters',  tip: 'Best: Caption + 3–5 hashtags. Always include an image — it\'s required by the API.' },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function HowToUse() {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('platforms');

    const sections = [
        { key: 'platforms', label: '📋 Platform requirements' },
        { key: 'steps',     label: '🪜 Step-by-step guide' },
        { key: 'limits',    label: '📏 Character limits' },
        { key: 'faq',       label: '❓ FAQ' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Navbar ────────────────────────────────────────────────── */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">OS</div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900 leading-none">OneSocial</p>
                            <p className="text-xs text-gray-400 leading-none mt-0.5">How to use</p>
                        </div>
                    </button>
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all">Login</button>
                        <button onClick={() => navigate('/register')} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all">Get started free</button>
                    </div>
                </div>
            </nav>

            {/* ── Hero ──────────────────────────────────────────────────── */}
            <section className="bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-6 py-16 text-center">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                        📖 Complete user guide
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">How to use OneSocial</h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Everything you need to know — what accounts to set up, how to connect platforms,
                        what the limits are, and answers to common questions.
                    </p>
                    {/* Quick jump buttons */}
                    <div className="flex flex-wrap justify-center gap-2 mt-8">
                        {sections.map(s => (
                            <button
                                key={s.key}
                                onClick={() => {
                                    setActiveSection(s.key);
                                    document.getElementById(s.key)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-all"
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">

                {/* ── Platform Requirements ─────────────────────────── */}
                <section id="platforms">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">📋</span>
                            <h2 className="text-2xl font-bold text-gray-900">Platform requirements</h2>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Before connecting a platform, make sure your account meets these requirements.
                            This is the most common reason connections fail.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
                        {platforms.map((p, i) => (
                            <div key={i} className={`${p.bg} border ${p.border} rounded-2xl p-5 flex flex-col`}>

                                {/* Header — icon + name on one line */}
                                <div className="flex items-center gap-2.5 mb-2">
                                    {p.icon}
                                    <h3 className="text-sm font-bold text-gray-900">{p.name}</h3>
                                </div>

                                {/* Badge on its own row so it never wraps awkwardly */}
                                <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${p.tagColor}`}>
                                    {p.tag}
                                </span>

                                {/* Requirements list — grows to fill card height */}
                                <ul className="space-y-2.5 mb-4 flex-1">
                                    {p.needs.map((n, j) => (
                                        <li key={j} className="flex items-start gap-2 text-xs text-gray-700 leading-relaxed">
                                            <span className={`mt-0.5 flex-shrink-0 ${n.ok ? 'text-green-600' : 'text-red-500'}`}>
                                                {n.ok ? <CheckIcon size={13} /> : <XIcon size={13} />}
                                            </span>
                                            {n.text}
                                        </li>
                                    ))}
                                </ul>

                                {/* Note — pinned to bottom of card */}
                                <p className="text-xs text-gray-500 leading-relaxed bg-white/70 rounded-xl p-3 border border-white">
                                    {p.note}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Big warning box */}
                    <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0">⚠️</span>
                            <div>
                                <h4 className="text-sm font-semibold text-amber-900 mb-2">Before you connect Facebook & Instagram</h4>
                                <div className="text-sm text-amber-800 space-y-1.5 leading-relaxed">
                                    <p><strong>1.</strong> Create a <strong>Facebook Page</strong> (not a personal profile) at <span className="font-mono bg-amber-100 px-1 rounded text-xs">facebook.com/pages/create</span></p>
                                    <p><strong>2.</strong> Switch your Instagram to a <strong>Professional account</strong> — go to Instagram → Settings → Account → Switch to Professional Account</p>
                                    <p><strong>3.</strong> <strong>Link your Instagram</strong> to that Facebook Page — go to Facebook Page Settings → Instagram → Connect account</p>
                                    <p><strong>4.</strong> Then come back and click Connect Facebook in OneSocial — this will connect both Facebook and Instagram in one step.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Step by step ──────────────────────────────────── */}
                <section id="steps">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">🪜</span>
                            <h2 className="text-2xl font-bold text-gray-900">Step-by-step guide</h2>
                        </div>
                        <p className="text-gray-500 text-sm">Follow these steps in order to go from zero to publishing your first post.</p>
                    </div>

                    <div className="space-y-5">
                        {steps.map((s, i) => (
                            <div key={i} className={`bg-white border ${s.color.split(' ')[1]} rounded-2xl overflow-hidden`}>
                                <div className={`px-6 py-4 ${s.color} flex items-center gap-4 border-b ${s.color.split(' ')[1]}`}>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${s.numColor}`}>{s.num}</span>
                                    <span className="text-xl">{s.icon}</span>
                                    <h3 className="text-sm font-semibold text-gray-900">{s.title}</h3>
                                </div>
                                <div className="px-6 py-4">
                                    <ol className="space-y-2.5">
                                        {s.items.map((item, j) => (
                                            <li key={j} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                                                <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    {j + 1}
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Character limits ──────────────────────────────── */}
                <section id="limits">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">📏</span>
                            <h2 className="text-2xl font-bold text-gray-900">Character limits & tips</h2>
                        </div>
                        <p className="text-gray-500 text-sm">Each platform has different limits and best practices for content length.</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-4 text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3 bg-gray-50 border-b border-gray-200">
                            <span>Platform</span>
                            <span>Max length</span>
                            <span className="col-span-2">Best practice</span>
                        </div>
                        {charLimits.map((row, i) => (
                            <div key={i} className={`grid grid-cols-4 items-center px-5 py-4 gap-3 ${i < charLimits.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                <div className="flex items-center gap-2">
                                    {row.icon}
                                    <span className="text-sm font-medium text-gray-800">{row.platform}</span>
                                </div>
                                <span className="text-sm font-semibold text-indigo-600 font-mono">{row.limit}</span>
                                <span className="col-span-2 text-sm text-gray-600 leading-relaxed">{row.tip}</span>
                            </div>
                        ))}
                    </div>

                    {/* Image requirement callout */}
                    <div className="mt-4 bg-pink-50 border border-pink-200 rounded-2xl p-5 flex items-start gap-3">
                        <InstagramIcon size={24} />
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">Instagram posts published through OneSocial require an image.</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                               Instagram posts require a
        publicly accessible image URL. Local files cannot be published through
        the Instagram API. Services like Cloudinary or Imgur work well.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ── FAQ ───────────────────────────────────────────── */}
                <section id="faq">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">❓</span>
                            <h2 className="text-2xl font-bold text-gray-900">Frequently asked questions</h2>
                        </div>
                        <p className="text-gray-500 text-sm">Answers to the most common questions from new users.</p>
                    </div>
                    <div className="space-y-2">
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} q={faq.q} a={faq.a} />
                        ))}
                    </div>
                </section>

                {/* ── CTA ───────────────────────────────────────────── */}
                <section className="bg-indigo-600 rounded-3xl p-10 text-center relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500 rounded-full opacity-40" />
                    <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-indigo-700 rounded-full opacity-30" />
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-white mb-3">Ready to get started?</h2>
                        <p className="text-indigo-200 text-sm mb-7 max-w-md mx-auto">
                            Create your free account, connect your platforms, and publish your first post in under 5 minutes.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => navigate('/register')}
                                className="px-7 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all text-sm shadow-lg"
                            >
                                Create free account →
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="px-7 py-3 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-400 transition-all text-sm border border-indigo-400"
                            >
                                Back to home
                            </button>
                        </div>
                    </div>
                </section>

            </div>

            {/* ── Footer ────────────────────────────────────────────────── */}
            <footer className="border-t border-gray-100 py-8 mt-8">
                <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">OS</div>
                        <span className="text-sm font-semibold text-gray-700">OneSocial</span>
                    </div>
                    <div className="flex items-center gap-5 text-sm text-gray-400">
                        <button onClick={() => navigate('/')} className="hover:text-indigo-600 transition-colors">Home</button>
                        <button onClick={() => navigate('/register')} className="hover:text-indigo-600 transition-colors">Register</button>
                        <button onClick={() => navigate('/login')} className="hover:text-indigo-600 transition-colors">Login</button>
                        <span>© 2026 OneSocial</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}