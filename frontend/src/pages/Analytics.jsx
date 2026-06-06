import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

// ── SVG Icons ────────────────────────────────────────────────────────────────

const LinkedInIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#0A66C2"/>
        <path d="M7.5 9.5H5V19H7.5V9.5Z" fill="white"/>
        <circle cx="6.25" cy="6.75" r="1.5" fill="white"/>
        <path d="M19 19H16.5V14C16.5 12.9 15.85 12 14.75 12C13.65 12 13 12.9 13 14V19H10.5V9.5H13V10.75C13.55 9.9 14.6 9.25 15.75 9.25C17.6 9.25 19 10.65 19 12.75V19Z" fill="white"/>
    </svg>
);

const FacebookIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#1877F2"/>
        <path d="M13.5 12.5H15.5L16 10H13.5V8.5C13.5 7.8 13.8 7.25 14.75 7.25H16V5.1C15.45 5.05 14.7 5 13.9 5C11.8 5 10.5 6.2 10.5 8.25V10H8V12.5H10.5V19H13.5V12.5Z" fill="white"/>
    </svg>
);

const InstagramIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="ig-analytics-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFDC80"/>
                <stop offset="25%" stopColor="#FCAF45"/>
                <stop offset="50%" stopColor="#F77737"/>
                <stop offset="75%" stopColor="#C13584"/>
                <stop offset="100%" stopColor="#833AB4"/>
            </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#ig-analytics-grad)"/>
        <rect x="6" y="6" width="12" height="12" rx="4" stroke="white" strokeWidth="1.5" fill="none"/>
        <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" fill="none"/>
        <circle cx="16.5" cy="7.5" r="1" fill="white"/>
    </svg>
);

const TwitterXIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#000000"/>
        <path d="M17.5 5H19.5L14.5 11L20 19H15.5L12 14.5L8 19H6L11.5 12.5L6.5 5H11L14 9.5L17.5 5ZM16.5 17.5H17.5L9.5 6.5H8.5L16.5 17.5Z" fill="white"/>
    </svg>
);

const AnalyticsIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
);

const RefreshIcon = ({ size = 15 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"/>
        <polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
);

const ArrowLeftIcon = ({ size = 15 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"/>
        <polyline points="12 19 5 12 12 5"/>
    </svg>
);

const TotalPostsIcon = ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
    </svg>
);

const PublishedIcon = ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
);

const FailedIcon = ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
);

const TargetIcon = ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="12" r="2"/>
    </svg>
);

const MobileIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
);

const CalendarIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
);

const ClockIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
    </svg>
);

const WarningIcon = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
);

// ── Platform config ───────────────────────────────────────────────────────────

const PLATFORMS = [
    { key: 'linkedin',  label: 'LinkedIn',  Icon: LinkedInIcon,  color: 'bg-blue-600', light: 'bg-blue-50',  text: 'text-blue-700' },
    { key: 'facebook',  label: 'Facebook',  Icon: FacebookIcon,  color: 'bg-blue-800', light: 'bg-blue-50',  text: 'text-blue-900' },
    { key: 'instagram', label: 'Instagram', Icon: InstagramIcon, color: 'bg-pink-600', light: 'bg-pink-50',  text: 'text-pink-700' },
    { key: 'twitter',   label: 'Twitter',   Icon: TwitterXIcon,  color: 'bg-gray-800', light: 'bg-gray-50',  text: 'text-gray-700' },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Analytics() {
    const navigate = useNavigate();
    const [data,    setData]    = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState('');

    useEffect(() => { fetchAnalytics(); }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await API.get('/api/analytics/dashboard');
            setData(res.data.data);
        } catch (err) {
            setError('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-gray-500">Loading analytics...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-red-500">{error}</p>
        </div>
    );

    const { overview, platforms, timeline, successRates, recentPosts } = data;

    const overviewCards = [
        { label: 'Total Posts',  value: overview.total,              Icon: TotalPostsIcon, borderColor: 'border-blue-400',   bg: 'bg-blue-50',   iconColor: 'text-blue-500'   },
        { label: 'Published',    value: overview.published,          Icon: PublishedIcon,  borderColor: 'border-green-400',  bg: 'bg-green-50',  iconColor: 'text-green-500'  },
        { label: 'Failed',       value: overview.failed,             Icon: FailedIcon,     borderColor: 'border-red-400',    bg: 'bg-red-50',    iconColor: 'text-red-500'    },
        { label: 'Success Rate', value: `${overview.successRate}%`,  Icon: TargetIcon,     borderColor: 'border-purple-400', bg: 'bg-purple-50', iconColor: 'text-purple-500' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Navbar ──────────────────────────────────── */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">SMMS</h1>
                        <p className="text-xs text-gray-500">Analytics Dashboard</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-300 transition"
                        >
                            <ArrowLeftIcon size={14} /> Dashboard
                        </button>
                        <button
                            onClick={fetchAnalytics}
                            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition"
                        >
                            <RefreshIcon size={14} /> Refresh
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-8">

                {/* ── Overview Cards ─────────────────────── */}
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <AnalyticsIcon size={20} /> Overview
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {overviewCards.map((card, i) => (
                        <div key={i} className={`${card.bg} border-2 ${card.borderColor} rounded-2xl p-5`}>
                            <div className={`mb-2 ${card.iconColor}`}>
                                <card.Icon size={22} />
                            </div>
                            <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                            <p className="text-sm text-gray-600 mt-1">{card.label}</p>
                        </div>
                    ))}
                </div>

                {/* ── Platform Distribution ──────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                    {/* Posts per platform */}
                    <div className="bg-white rounded-2xl shadow-sm border p-6">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <MobileIcon size={17} /> Posts Per Platform
                        </h3>
                        <div className="space-y-3">
                            {PLATFORMS.map(pl => {
                                const count = platforms[pl.key] || 0;
                                const total = overview.total || 1;
                                const pct   = Math.round((count / total) * 100);
                                return (
                                    <div key={pl.key}>
                                        <div className="flex justify-between text-sm mb-1 items-center">
                                            <span className="flex items-center gap-1.5">
                                                <pl.Icon size={16} /> {pl.label}
                                            </span>
                                            <span className="font-medium">{count} posts ({pct}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                                            <div
                                                className={`${pl.color} h-2.5 rounded-full transition-all`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Success Rates */}
                    <div className="bg-white rounded-2xl shadow-sm border p-6">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <TargetIcon size={17} /> Success Rate Per Platform
                        </h3>
                        <div className="space-y-3">
                            {['linkedin', 'facebook', 'instagram'].map(key => {
                                const pl   = PLATFORMS.find(p => p.key === key);
                                const sr   = successRates[key];
                                const rate = sr?.rate || 0;
                                return (
                                    <div key={key}>
                                        <div className="flex justify-between text-sm mb-1 items-center">
                                            <span className="flex items-center gap-1.5">
                                                <pl.Icon size={16} /> {pl.label}
                                            </span>
                                            <span className={`font-medium flex items-center gap-1 ${rate >= 80 ? 'text-green-600' : rate >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                                                {rate}%
                                                {rate < 80 && <WarningIcon size={13} />}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                                            <div
                                                className={`h-2.5 rounded-full transition-all ${rate >= 80 ? 'bg-green-500' : rate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                style={{ width: `${rate}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {sr?.published || 0} of {sr?.total || 0} posts succeeded
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── Timeline ───────────────────────────── */}
                <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <CalendarIcon size={17} /> Posts Last 30 Days
                    </h3>
                    {timeline.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-8">No posts in last 30 days</p>
                    ) : (
                        <div className="flex items-end gap-2 h-32">
                            {timeline.map((day, i) => {
                                const maxCount = Math.max(...timeline.map(d => d.count));
                                const height   = Math.round((day.count / maxCount) * 100);
                                return (
                                    <div key={i} className="flex flex-col items-center flex-1 group">
                                        <div className="relative w-full">
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                                                {day.date}: {day.count}
                                            </div>
                                            <div
                                                className="bg-blue-500 rounded-t w-full transition-all hover:bg-blue-600"
                                                style={{ height: `${height}%`, minHeight: '4px' }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <p className="text-xs text-gray-400 mt-2 text-center">
                        Hover over bars to see details
                    </p>
                </div>

                {/* ── Recent Activity ─────────────────────── */}
                <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <ClockIcon size={17} /> Recent Activity
                    </h3>
                    {recentPosts.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-8">No posts yet</p>
                    ) : (
                        <div className="space-y-3">
                            {recentPosts.map((post, i) => (
                                <div key={i} className="flex items-center justify-between border border-gray-100 rounded-xl p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-1.5 items-center">
                                            {PLATFORMS.map(pl => (
                                                post.platforms[pl.key]?.enabled && (
                                                    <pl.Icon key={pl.key} size={18} />
                                                )
                                            ))}
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                            post.overallStatus === 'published' ? 'bg-green-100 text-green-700' :
                                            post.overallStatus === 'failed'    ? 'bg-red-100 text-red-700'     :
                                            post.overallStatus === 'partial'   ? 'bg-orange-100 text-orange-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {post.overallStatus}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}