import { useState, useEffect } from 'react';
import API from '../services/api';

export default function Analytics() {
    const [data,    setData]    = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState('');

    useEffect(() => {
        fetchAnalytics();
    }, []);

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

    const { overview, platforms, timeline, successRates, recentPosts, connectedPlatforms } = data;

    // platform config for display
    const PLATFORMS = [
        { key: 'linkedin',  label: 'LinkedIn',  icon: '💼', color: 'bg-blue-600',  light: 'bg-blue-50',  text: 'text-blue-700'  },
        { key: 'facebook',  label: 'Facebook',  icon: '📘', color: 'bg-blue-800',  light: 'bg-blue-50',  text: 'text-blue-900'  },
        { key: 'instagram', label: 'Instagram', icon: '📸', color: 'bg-pink-600',  light: 'bg-pink-50',  text: 'text-pink-700'  },
        { key: 'twitter',   label: 'Twitter',   icon: '🐦', color: 'bg-gray-800',  light: 'bg-gray-50',  text: 'text-gray-700'  },
    ];

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="bg-white border-b px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">SMMS</h1>
                        <p className="text-xs text-gray-500">Analytics Dashboard</p>
                    </div>
                    <div className="flex gap-4">
                        <a href="/dashboard" className="text-sm text-blue-600 hover:underline">← Back to Dashboard</a>
                        <button onClick={fetchAnalytics} className="text-sm text-blue-600 hover:underline">🔄 Refresh</button>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-8">

                {/* ── Overview Cards ─────────────────────── */}
                <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Posts',    value: overview.total,       color: 'border-blue-400',   bg: 'bg-blue-50',   icon: '📝' },
                        { label: 'Published',      value: overview.published,   color: 'border-green-400',  bg: 'bg-green-50',  icon: '✅' },
                        { label: 'Failed',         value: overview.failed,      color: 'border-red-400',    bg: 'bg-red-50',    icon: '❌' },
                        { label: 'Success Rate',   value: `${overview.successRate}%`, color: 'border-purple-400', bg: 'bg-purple-50', icon: '🎯' },
                    ].map((card, i) => (
                        <div key={i} className={`${card.bg} border-2 ${card.color} rounded-2xl p-5`}>
                            <p className="text-2xl mb-1">{card.icon}</p>
                            <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                            <p className="text-sm text-gray-600 mt-1">{card.label}</p>
                        </div>
                    ))}
                </div>

                {/* ── Platform Distribution ──────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                    <div className="bg-white rounded-2xl shadow-sm border p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">📱 Posts Per Platform</h3>
                        <div className="space-y-3">
                            {PLATFORMS.map(pl => {
                                const count = platforms[pl.key] || 0;
                                const total = overview.total || 1;
                                const pct   = Math.round((count / total) * 100);
                                return (
                                    <div key={pl.key}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{pl.icon} {pl.label}</span>
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
                        <h3 className="font-semibold text-gray-800 mb-4">🎯 Success Rate Per Platform</h3>
                        <div className="space-y-3">
                            {['linkedin', 'facebook', 'instagram'].map(key => {
                                const pl   = PLATFORMS.find(p => p.key === key);
                                const sr   = successRates[key];
                                const rate = sr?.rate || 0;
                                return (
                                    <div key={key}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{pl.icon} {pl.label}</span>
                                            <span className={`font-medium ${rate >= 80 ? 'text-green-600' : rate >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                                                {rate}%
                                                {rate < 80 && ' ⚠️'}
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
                    <h3 className="font-semibold text-gray-800 mb-4">📅 Posts Last 30 Days</h3>
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
                                            {/* Tooltip */}
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
                    <h3 className="font-semibold text-gray-800 mb-4">🕐 Recent Activity</h3>
                    {recentPosts.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-8">No posts yet</p>
                    ) : (
                        <div className="space-y-3">
                            {recentPosts.map((post, i) => (
                                <div key={i} className="flex items-center justify-between border border-gray-100 rounded-xl p-3">
                                    <div className="flex items-center gap-3">
                                        {/* Platform icons */}
                                        <div className="flex gap-1">
                                            {PLATFORMS.map(pl => (
                                                post.platforms[pl.key]?.enabled && (
                                                    <span key={pl.key} className="text-lg">{pl.icon}</span>
                                                )
                                            ))}
                                        </div>
                                        {/* Status */}
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                            post.overallStatus === 'published' ? 'bg-green-100 text-green-700' :
                                            post.overallStatus === 'failed'    ? 'bg-red-100 text-red-700'     :
                                            post.overallStatus === 'partial'   ? 'bg-orange-100 text-orange-700':
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