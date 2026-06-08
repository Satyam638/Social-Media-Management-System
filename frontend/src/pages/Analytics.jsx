// src/pages/Analytics.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

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
            <linearGradient id="ig-a" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFDC80"/>
                <stop offset="50%" stopColor="#F77737"/>
                <stop offset="100%" stopColor="#833AB4"/>
            </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#ig-a)"/>
        <rect x="6" y="6" width="12" height="12" rx="4" stroke="white" strokeWidth="1.5" fill="none"/>
        <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" fill="none"/>
        <circle cx="16.5" cy="7.5" r="1" fill="white"/>
    </svg>
);
const TwitterXIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#000"/>
        <path d="M17.5 5H19.5L14.5 11L20 19H15.5L12 14.5L8 19H6L11.5 12.5L6.5 5H11L14 9.5L17.5 5ZM16.5 17.5H17.5L9.5 6.5H8.5L16.5 17.5Z" fill="white"/>
    </svg>
);

const Icon = ({ name, size = 18, className = '' }) => {
    const paths = {
        arrowLeft:  <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
        refresh:    <><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></>,
        check:      <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
        x:          <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>,
        target:     <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
        file:       <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
        clock:      <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
        calendar:   <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
        warning:    <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
        bar:        <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    };
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            {paths[name]}
        </svg>
    );
};

const PLATFORM_ICON = { linkedin: LinkedInIcon, facebook: FacebookIcon, instagram: InstagramIcon, twitter: TwitterXIcon };

const PLATFORMS = [
    { key: 'linkedin',  label: 'LinkedIn',  color: 'bg-blue-500',  light: 'bg-blue-50',  text: 'text-blue-700',  border: 'border-blue-200' },
    { key: 'facebook',  label: 'Facebook',  color: 'bg-blue-700',  light: 'bg-blue-50',  text: 'text-blue-900',  border: 'border-blue-300' },
    { key: 'instagram', label: 'Instagram', color: 'bg-pink-500',  light: 'bg-pink-50',  text: 'text-pink-700',  border: 'border-pink-200' },
    { key: 'twitter',   label: 'Twitter',   color: 'bg-gray-800',  light: 'bg-gray-50',  text: 'text-gray-700',  border: 'border-gray-200' },
];

// ── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = ({ className }) => <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />;

// ── Animated bar ─────────────────────────────────────────────────────────────
function AnimatedBar({ pct, colorClass, delay = 0 }) {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const t = setTimeout(() => setWidth(pct), 100 + delay);
        return () => clearTimeout(t);
    }, [pct, delay]);
    return (
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
                className={`${colorClass} h-2.5 rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${width}%` }}
            />
        </div>
    );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, bg, iconColor, border, sub }) {
    return (
        <div className={`${bg} border-2 ${border} rounded-2xl p-5 flex flex-col justify-between`}>
            <div className={`${iconColor} mb-3`}>{icon}</div>
            <div>
                <p className="text-3xl font-bold text-gray-900 leading-none">{value}</p>
                <p className="text-sm text-gray-600 mt-1.5 font-medium">{label}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

// ── Loading skeleton layout ───────────────────────────────────────────────────
function LoadingSkeleton() {
    return (
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-8">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-32" />)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
            </div>
            <Skeleton className="h-48" />
            <Skeleton className="h-64" />
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Analytics() {
    const navigate = useNavigate();
    const [data,    setData]    = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState('');
    const [tooltip, setTooltip] = useState(null); // { index, x, y }

    useEffect(() => { fetchAnalytics(); }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await API.get('/api/analytics/dashboard');
            setData(res.data.data);
        } catch (err) {
            setError('Failed to load analytics. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Error state ──────────────────────────────────────────────────────────
    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
            <div className="text-center max-w-sm">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-500">
                    <Icon name="x" size={28} />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Couldn't load analytics</h2>
                <p className="text-sm text-gray-500 mb-6">{error}</p>
                <button
                    onClick={fetchAnalytics}
                    className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Navbar ──────────────────────────────────────────────── */}
            <nav className="sticky top-0 z-20 bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg border border-gray-200 hover:border-indigo-200 transition-all"
                        >
                            <Icon name="arrowLeft" size={14} /> Dashboard
                        </button>
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">OS</div>
                            <span className="text-sm font-semibold text-gray-700">Analytics</span>
                        </div>
                    </div>
                    <button
                        onClick={fetchAnalytics}
                        disabled={loading}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-all"
                    >
                        <Icon name="refresh" size={14} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>
            </nav>

            {/* ── Loading ─────────────────────────────────────────────── */}
            {loading && <LoadingSkeleton />}

            {/* ── Content ─────────────────────────────────────────────── */}
            {!loading && data && (() => {
                const { overview, platforms, timeline, successRates, recentPosts } = data;

                const statCards = [
                    {
                        label: 'Total posts',
                        value: overview.total,
                        sub: 'All time',
                        bg: 'bg-blue-50', border: 'border-blue-200', iconColor: 'text-blue-500',
                        icon: <Icon name="file" size={22} />,
                    },
                    {
                        label: 'Published',
                        value: overview.published,
                        sub: `${overview.total ? Math.round((overview.published/overview.total)*100) : 0}% of total`,
                        bg: 'bg-green-50', border: 'border-green-200', iconColor: 'text-green-500',
                        icon: <Icon name="check" size={22} />,
                    },
                    {
                        label: 'Failed',
                        value: overview.failed,
                        sub: overview.failed > 0 ? 'Needs attention' : 'All clear ✅',
                        bg: overview.failed > 0 ? 'bg-red-50' : 'bg-gray-50',
                        border: overview.failed > 0 ? 'border-red-200' : 'border-gray-200',
                        iconColor: overview.failed > 0 ? 'text-red-500' : 'text-gray-400',
                        icon: <Icon name="x" size={22} />,
                    },
                    {
                        label: 'Success rate',
                        value: `${overview.successRate}%`,
                        sub: overview.successRate >= 80 ? 'Great performance 🎉' : 'Room to improve',
                        bg: 'bg-purple-50', border: 'border-purple-200', iconColor: 'text-purple-500',
                        icon: <Icon name="target" size={22} />,
                    },
                ];

                const maxTimeline = Math.max(...(timeline.map(d => d.count)), 1);

                return (
                    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-8">

                        {/* ── Page header ───────────────────────────── */}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                            <p className="text-sm text-gray-500 mt-1">Your publishing performance at a glance</p>
                        </div>

                        {/* ── Stat cards ────────────────────────────── */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {statCards.map((card, i) => (
                                <StatCard key={i} {...card} />
                            ))}
                        </div>

                        {/* ── Platform distribution + success rates ─── */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Posts per platform */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <Icon name="bar" size={17} className="text-indigo-500" />
                                    <h3 className="text-sm font-semibold text-gray-900">Posts per platform</h3>
                                </div>
                                <div className="space-y-4">
                                    {PLATFORMS.map((pl, i) => {
                                        const count = platforms[pl.key] || 0;
                                        const pct   = overview.total ? Math.round((count / overview.total) * 100) : 0;
                                        const PIcon = PLATFORM_ICON[pl.key];
                                        return (
                                            <div key={pl.key}>
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <PIcon size={16} />
                                                        <span className="text-sm text-gray-700 font-medium">{pl.label}</span>
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {count} <span className="text-gray-400 font-normal text-xs">({pct}%)</span>
                                                    </span>
                                                </div>
                                                <AnimatedBar pct={pct} colorClass={pl.color} delay={i * 80} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Success rates */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <Icon name="target" size={17} className="text-indigo-500" />
                                    <h3 className="text-sm font-semibold text-gray-900">Success rate per platform</h3>
                                </div>
                                <div className="space-y-4">
                                    {['linkedin', 'facebook', 'instagram'].map((key, i) => {
                                        const pl   = PLATFORMS.find(p => p.key === key);
                                        const sr   = successRates[key];
                                        const rate = sr?.rate || 0;
                                        const PIcon = PLATFORM_ICON[key];
                                        const rateColor = rate >= 80 ? 'bg-green-500' : rate >= 50 ? 'bg-amber-500' : 'bg-red-500';
                                        const rateText  = rate >= 80 ? 'text-green-600' : rate >= 50 ? 'text-amber-600' : 'text-red-600';
                                        return (
                                            <div key={key}>
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <PIcon size={16} />
                                                        <span className="text-sm text-gray-700 font-medium">{pl.label}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`text-sm font-semibold ${rateText}`}>{rate}%</span>
                                                        {rate < 80 && <Icon name="warning" size={13} className={rateText} />}
                                                    </div>
                                                </div>
                                                <AnimatedBar pct={rate} colorClass={rateColor} delay={i * 80} />
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {sr?.published || 0} of {sr?.total || 0} posts succeeded
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* ── Timeline chart ────────────────────────── */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Icon name="calendar" size={17} className="text-indigo-500" />
                                    <h3 className="text-sm font-semibold text-gray-900">Posts — last 30 days</h3>
                                </div>
                                {timeline.length > 0 && (
                                    <div className="flex items-center gap-4 text-xs text-gray-400">
                                        <span>Total: <strong className="text-gray-700">{timeline.reduce((s,d)=>s+d.count,0)}</strong></span>
                                        <span>Peak: <strong className="text-gray-700">{maxTimeline}</strong></span>
                                    </div>
                                )}
                            </div>

                            {timeline.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-3xl mb-2">📭</div>
                                    <p className="text-sm text-gray-500">No posts in the last 30 days</p>
                                    <p className="text-xs text-gray-400 mt-1">Start posting to see your timeline here</p>
                                </div>
                            ) : (
                                <div className="relative">
                                    {/* Y-axis labels */}
                                    <div className="flex">
                                        <div className="flex flex-col justify-between text-right pr-3 py-1" style={{ width: '32px', height: '140px' }}>
                                            {[maxTimeline, Math.ceil(maxTimeline/2), 0].map((v, i) => (
                                                <span key={i} className="text-xs text-gray-300 leading-none">{v}</span>
                                            ))}
                                        </div>
                                        {/* Bars */}
                                        <div className="flex-1 relative" style={{ height: '140px' }}>
                                            {/* Grid lines */}
                                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                                {[0,1,2].map(i => (
                                                    <div key={i} className="w-full border-t border-gray-100" />
                                                ))}
                                            </div>
                                            {/* Bar columns */}
                                            <div className="absolute inset-0 flex items-end gap-px">
                                                {timeline.map((day, i) => {
                                                    const h = Math.round((day.count / maxTimeline) * 100);
                                                    return (
                                                        <div
                                                            key={i}
                                                            className="relative flex-1 flex items-end group cursor-pointer"
                                                            style={{ height: '100%' }}
                                                            onMouseEnter={() => setTooltip(i)}
                                                            onMouseLeave={() => setTooltip(null)}
                                                        >
                                                            {/* Tooltip */}
                                                            {tooltip === i && (
                                                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap z-10 shadow-lg">
                                                                    <p className="font-semibold">{day.count} post{day.count !== 1 ? 's' : ''}</p>
                                                                    <p className="text-gray-400">{day.date}</p>
                                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                                                                </div>
                                                            )}
                                                            <BarColumn pct={h} hasCount={day.count > 0} />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    {/* X-axis — show every 7 days */}
                                    <div className="flex mt-2 pl-8">
                                        {timeline.map((day, i) => (
                                            <div key={i} className="flex-1 text-center">
                                                {(i === 0 || i % 7 === 0 || i === timeline.length - 1) && (
                                                    <span className="text-xs text-gray-300 whitespace-nowrap">
                                                        {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Recent activity ───────────────────────── */}
                        <div className="bg-white rounded-2xl border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                                <Icon name="clock" size={17} className="text-indigo-500" />
                                <h3 className="text-sm font-semibold text-gray-900">Recent activity</h3>
                            </div>

                            {recentPosts.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-3xl mb-2">📭</div>
                                    <p className="text-sm text-gray-500">No posts yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {recentPosts.map((post, i) => {
                                        const statusStyle = {
                                            published: 'bg-green-100 text-green-700',
                                            failed:    'bg-red-100 text-red-700',
                                            partial:   'bg-orange-100 text-orange-700',
                                            draft:     'bg-yellow-100 text-yellow-700',
                                        }[post.overallStatus] || 'bg-gray-100 text-gray-600';

                                        const enabledPlatforms = PLATFORMS.filter(pl => post.platforms[pl.key]?.enabled);
                                        const previewText = enabledPlatforms
                                            .map(pl => post.platforms[pl.key]?.content)
                                            .filter(Boolean)[0] || '';

                                        return (
                                            <div key={i} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    {/* Platform icons */}
                                                    <div className="flex gap-1.5 flex-shrink-0">
                                                        {enabledPlatforms.map(pl => {
                                                            const PIcon = PLATFORM_ICON[pl.key];
                                                            return <PIcon key={pl.key} size={18} />;
                                                        })}
                                                    </div>
                                                    {/* Preview text */}
                                                    {previewText && (
                                                        <p className="text-sm text-gray-600 truncate hidden sm:block max-w-xs">{previewText}</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle}`}>
                                                        {post.overallStatus}
                                                    </span>
                                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                                        {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* ── Summary insight card ──────────────────── */}
                        {overview.total > 0 && (
                            <div className="bg-indigo-600 rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
                                <div>
                                    <p className="text-white font-semibold text-base mb-1">
                                        {overview.successRate >= 80
                                            ? '🎉 Great publishing record!'
                                            : overview.successRate >= 50
                                                ? '📈 Getting there — keep posting!'
                                                : '💡 Some posts are failing. Check your platform connections.'}
                                    </p>
                                    <p className="text-indigo-200 text-sm">
                                        {overview.published} posts published · {overview.successRate}% success rate · {overview.total} total
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="px-5 py-2.5 bg-white text-indigo-600 text-sm font-semibold rounded-xl hover:bg-indigo-50 transition-colors flex-shrink-0"
                                >
                                    Create new post →
                                </button>
                            </div>
                        )}

                    </div>
                );
            })()}
        </div>
    );
}

// ── Animated bar column (for timeline chart) ──────────────────────────────────
function BarColumn({ pct, hasCount }) {
    const [height, setHeight] = useState(0);
    useEffect(() => {
        const t = setTimeout(() => setHeight(pct), 150);
        return () => clearTimeout(t);
    }, [pct]);
    return (
        <div
            className={`w-full rounded-t transition-all duration-500 ease-out ${
                hasCount ? 'bg-indigo-400 group-hover:bg-indigo-600' : 'bg-gray-100'
            }`}
            style={{ height: `${Math.max(height, hasCount ? 4 : 2)}%` }}
        />
    );
}