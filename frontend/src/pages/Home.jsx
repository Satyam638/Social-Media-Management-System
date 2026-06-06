import { useNavigate } from 'react-router-dom';

// ── SVG Icon Components ──────────────────────────────────────────────────────

const LinkedInIcon = ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#0A66C2"/>
        <path d="M7.5 9.5H5V19H7.5V9.5Z" fill="white"/>
        <circle cx="6.25" cy="6.75" r="1.5" fill="white"/>
        <path d="M19 19H16.5V14C16.5 12.9 15.85 12 14.75 12C13.65 12 13 12.9 13 14V19H10.5V9.5H13V10.75C13.55 9.9 14.6 9.25 15.75 9.25C17.6 9.25 19 10.65 19 12.75V19Z" fill="white"/>
    </svg>
);

const FacebookIcon = ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#1877F2"/>
        <path d="M13.5 12.5H15.5L16 10H13.5V8.5C13.5 7.8 13.8 7.25 14.75 7.25H16V5.1C15.45 5.05 14.7 5 13.9 5C11.8 5 10.5 6.2 10.5 8.25V10H8V12.5H10.5V19H13.5V12.5Z" fill="white"/>
    </svg>
);

const InstagramIcon = ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFDC80"/>
                <stop offset="25%" stopColor="#FCAF45"/>
                <stop offset="50%" stopColor="#F77737"/>
                <stop offset="75%" stopColor="#C13584"/>
                <stop offset="100%" stopColor="#833AB4"/>
            </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#ig-grad)"/>
        <rect x="6" y="6" width="12" height="12" rx="4" stroke="white" strokeWidth="1.5" fill="none"/>
        <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" fill="none"/>
        <circle cx="16.5" cy="7.5" r="1" fill="white"/>
    </svg>
);

const AIIcon = ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#7C3AED"/>
        <path d="M12 5L13.5 9.5H18L14.5 12.5L15.5 17L12 14.5L8.5 17L9.5 12.5L6 9.5H10.5L12 5Z" fill="white"/>
    </svg>
);

const ScheduleIcon = ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#0891B2"/>
        <rect x="5" y="7" width="14" height="12" rx="2" stroke="white" strokeWidth="1.5" fill="none"/>
        <path d="M8 5V7M16 5V7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M5 10H19" stroke="white" strokeWidth="1.5"/>
        <circle cx="12" cy="14" r="2.5" stroke="white" strokeWidth="1.5" fill="none"/>
        <path d="M12 12.5V14L13 15" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const AnalyticsIcon = ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#059669"/>
        <path d="M5 17L9 11L13 14L19 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 7H19V10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 19H19" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
);

// ── Home Component ───────────────────────────────────────────────────────────

export default function Home() {
    const navigate = useNavigate();

    const features = [
        {
            icon: <LinkedInIcon size={40} />,
            title: 'LinkedIn',
            desc: 'Post professional content to your LinkedIn profile',
        },
        {
            icon: <FacebookIcon size={40} />,
            title: 'Facebook',
            desc: 'Share updates to your Facebook page instantly',
        },
        {
            icon: <InstagramIcon size={40} />,
            title: 'Instagram',
            desc: 'Publish visual content with smart hashtags',
        },
        {
            icon: <AIIcon size={40} />,
            title: 'AI Captions',
            desc: 'Generate platform-optimized captions in seconds',
        },
        {
            icon: <ScheduleIcon size={40} />,
            title: 'Scheduling',
            desc: 'Schedule posts to go live at the perfect time',
        },
        {
            icon: <AnalyticsIcon size={40} />,
            title: 'Analytics',
            desc: 'Track your posting performance and consistency',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">

            {/* ── Navbar ──────────────────────────────────── */}
            <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10 shadow-sm">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">OneSocial</h1>
                        <p className="text-xs text-gray-500">Social Media Management System</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-5 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Hero ────────────────────────────────────── */}
            <section className="max-w-6xl mx-auto px-6 py-20 text-center">
                {/* Platform icons row */}
                <div className="flex justify-center gap-3 mb-8">
                    <LinkedInIcon size={36} />
                    <FacebookIcon size={36} />
                    <InstagramIcon size={36} />
                </div>

                <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    Social Media Management
                    <span className="text-blue-600"> Made Simple</span>
                </h1>
                <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
                    Post to LinkedIn, Facebook and Instagram simultaneously.
                    Generate AI-powered captions. Schedule posts.
                    Track your performance. All in one dashboard.
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => navigate('/register')}
                        className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition text-lg"
                    >
                        Start for Free →
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-3.5 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition text-lg"
                    >
                        Login
                    </button>
                </div>
            </section>

            {/* ── Features ────────────────────────────────── */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    Everything You Need
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((f, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="mb-4">{f.icon}</div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{f.title}</h3>
                            <p className="text-gray-500 text-sm">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ─────────────────────────────────────── */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <div className="bg-blue-600 rounded-3xl p-12 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Manage Your Social Media?
                    </h2>
                    <p className="text-blue-100 mb-8 text-lg">
                        Join and start posting smarter today.
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        className="px-8 py-3.5 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition text-lg"
                    >
                        Get Started Free →
                    </button>
                </div>
            </section>

            {/* ── Footer ──────────────────────────────────── */}
            <footer className="border-t border-gray-100 py-8 text-center text-gray-400 text-sm">
                <p>© 2026 SMMS — Social Media Management System</p>
            </footer>
        </div>
    );
}