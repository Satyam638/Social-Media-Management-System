// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

// ── SVG Icon Components ──────────────────────────────────────────────────────

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
            <linearGradient id="ig-dash-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFDC80"/>
                <stop offset="25%" stopColor="#FCAF45"/>
                <stop offset="50%" stopColor="#F77737"/>
                <stop offset="75%" stopColor="#C13584"/>
                <stop offset="100%" stopColor="#833AB4"/>
            </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#ig-dash-grad)"/>
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

const AISparkIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="#7C3AED"/>
        <path d="M19 16L19.75 18.25L22 19L19.75 19.75L19 22L18.25 19.75L16 19L18.25 18.25L19 16Z" fill="#A78BFA"/>
    </svg>
);

const LogoutIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
);

const RefreshIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"/>
        <polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
);

const AnalyticsIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
);

const CalendarIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
);

const CheckIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
    </svg>
);

const RocketIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    </svg>
);

const PencilIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
);

// Platform icon map helper
const PLATFORM_ICON_MAP = {
    linkedin: LinkedInIcon,
    facebook: FacebookIcon,
    instagram: InstagramIcon,
    twitter: TwitterXIcon,
};

// ── Platform config ──────────────────────────────────────────────────────────

const PLATFORMS = [
    {
        key: 'linkedin',
        label: 'LinkedIn',
        color: 'bg-blue-600',
        borderColor: 'border-blue-500',
        bgColor: 'bg-blue-50',
        authUrl: 'http://localhost:3000/api/linkedin/auth',
        statusApi: '/api/linkedin/status',
        charLimit: 3000,
        disconnectUrl: '/api/linkedin/disconnect',
        placeholder: 'Write professional content for LinkedIn...',
    },
    {
        key: 'facebook',
        label: 'Facebook',
        color: 'bg-blue-800',
        borderColor: 'border-blue-800',
        bgColor: 'bg-blue-50',
        authUrl: 'http://localhost:3000/api/facebook/auth',
        statusApi: '/api/facebook/status',
        disconnectUrl: '/api/facebook/disconnect',
        charLimit: 63000,
        placeholder: 'Write conversational content for Facebook...',
    },
    {
        key: 'instagram',
        label: 'Instagram',
        color: 'bg-pink-600',
        borderColor: 'border-pink-500',
        bgColor: 'bg-pink-50',
        authUrl: 'http://localhost:3000/api/facebook/auth',
        statusApi: '/api/instagram/status',
        disconnectUrl: '/api/facebook/disconnect',
        charLimit: 2200,
        placeholder: 'Write casual content with hashtags for Instagram...',
    },
    {
        key: 'twitter',
        label: 'Twitter/X',
        color: 'bg-gray-900',
        borderColor: 'border-gray-700',
        bgColor: 'bg-gray-50',
        authUrl: 'http://localhost:3000/api/twitter/auth',
        statusApi: '/api/twitter/status',
        charLimit: 280,
        placeholder: 'Write short punchy content for Twitter...',
        comingSoon: true,
    },
];

const TONES = [
    { key: 'professional', label: '💼 Professional' },
    { key: 'casual',       label: '😊 Casual' },
    { key: 'funny',        label: '😂 Funny' },
    { key: 'inspirational',label: '🌟 Inspirational' },
    { key: 'educational',  label: '📚 Educational' },
];

// ── Dashboard Component ──────────────────────────────────────────────────────

export default function Dashboard() {
    const navigate = useNavigate();

    const [connections, setConnections] = useState({
        linkedin:  { isConnected: false, info: '' },
        facebook:  { isConnected: false, info: '' },
        instagram: { isConnected: false, info: '' },
        twitter:   { isConnected: false, info: '' },
    });

    const [content, setContent] = useState({
        linkedin: '', facebook: '', instagram: '', twitter: ''
    });
    const [selected, setSelected] = useState({
        linkedin: false, facebook: false, instagram: false, twitter: false
    });

    const [image, setImage]           = useState(null);
    const [scheduledAt, setScheduledAt] = useState('');
    const [postMode, setPostMode]     = useState('immediate');
    const [statusLoading, setStatusLoading] = useState(true);
    const [postLoading, setPostLoading]     = useState(false);
    const [postResult, setPostResult]       = useState(null);
    const [activeTab, setActiveTab]   = useState('compose');
    const [posts, setPosts]           = useState([]);
    const [postsLoading, setPostsLoading] = useState(false);

    const [aiTopic, setAiTopic]       = useState('');
    const [aiTone, setAiTone]         = useState('professional');
    const [aiPlatforms, setAiPlatforms] = useState([]);
    const [aiCaptions, setAiCaptions] = useState(null);
    const [aiLoading, setAiLoading]   = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const linkedin = params.get('linkedin');
        const facebook = params.get('facebook');
        if (linkedin === 'connected') alert('LinkedIn connected ✅');
        if (linkedin === 'failed')    alert('LinkedIn connection failed ❌');
        if (facebook === 'connected') alert('Facebook/Instagram connected ✅');
        if (facebook === 'no_pages')  alert('No Facebook Pages found. Create one first.');
        if (facebook === 'failed')    alert('Facebook connection failed ❌');
        window.history.replaceState({}, document.title, '/dashboard');
        fetchAllStatuses();
    }, []);

    const fetchAllStatuses = async () => {
        setStatusLoading(true);
        try {
            const [liRes, fbRes] = await Promise.allSettled([
                API.get('/api/linkedin/status'),
                API.get('/api/facebook/status'),
            ]);
            if (liRes.status === 'fulfilled') {
                const d = liRes.value.data;
                setConnections(prev => ({
                    ...prev,
                    linkedin: { isConnected: d.isConnected, info: d.isConnected ? `Connected as ${d.name || 'LinkedIn User'}` : '' }
                }));
            }
            if (fbRes.status === 'fulfilled') {
                const d = fbRes.value.data;
                setConnections(prev => ({
                    ...prev,
                    facebook:  { isConnected: d.isConnected, info: d.isConnected ? `Page: ${d.pageName || 'Facebook Page'}` : '' },
                    instagram: { isConnected: !!d.instagramAccountId, info: d.instagramAccountId ? `@${d.instagramUsername || 'Instagram Account'}` : '' }
                }));
            }
        } catch (err) {
            console.error('Status fetch error:', err);
        } finally {
            setStatusLoading(false);
        }
    };

    const fetchPosts = async (status) => {
        setPostsLoading(true);
        try {
            const res = await API.get(`/api/posts/status/${status}`);
            setPosts(res.data.posts || []);
        } catch (err) {
            console.error('Fetch posts error:', err);
        } finally {
            setPostsLoading(false);
        }
    };

    const connectPlatform    = (authUrl) => { window.location.href = authUrl; };
    const togglePlatform     = (key)     => setSelected(prev => ({ ...prev, [key]: !prev[key] }));

    const handlePublish = async () => {
        const anySelected = Object.values(selected).some(v => v);
        if (!anySelected) { alert('Select at least one platform'); return; }
        for (const p of PLATFORMS) {
            if (selected[p.key] && !content[p.key].trim()) { alert(`Write content for ${p.label}`); return; }
        }
        if (postMode === 'schedule' && !scheduledAt) { alert('Pick a date and time to schedule'); return; }
        try {
            setPostLoading(true);
            setPostResult(null);
            const endpoint = postMode === 'schedule' ? '/api/posts/schedule' : '/api/posts/create-post';
            const platformsPayload = {};
            PLATFORMS.forEach(p => { platformsPayload[p.key] = { enabled: selected[p.key] || false, content: content[p.key] || '' }; });
            const body = { platforms: platformsPayload };
            if (postMode === 'schedule') body.scheduledAt = scheduledAt;
            if (image) body.imageUrl = image;
            const res = await API.post(endpoint, body);
            setPostResult(res.data);
            if (res.data.success) {
                setContent({ linkedin: '', facebook: '', instagram: '', twitter: '' });
                setSelected({ linkedin: false, facebook: false, instagram: false, twitter: false });
                setScheduledAt('');
                setImage(null);
            }
        } catch (err) {
            setPostResult({ success: false, message: err.response?.data?.error || 'Post failed' });
        } finally {
            setPostLoading(false);
        }
    };

    const handleLogout = async () => {
        try { await API.post('/api/auth/logout'); } catch (_) {}
        navigate('/login');
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'scheduled') fetchPosts('draft');
        if (tab === 'published') fetchPosts('published');
    };

    const handleGenerateCaptions = async () => {
        if (!aiTopic.trim()) { alert('Enter a topic first'); return; }
        if (aiPlatforms.length === 0) { alert('Select at least one platform'); return; }
        try {
            setAiLoading(true);
            setAiCaptions(null);
            const res = await API.post('/api/ai/generate-captions', { topic: aiTopic, tone: aiTone, platforms: aiPlatforms });
            setAiCaptions(res.data.captions);
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to generate captions');
        } finally {
            setAiLoading(false);
        }
    };

    const useCaption = (platform, caption) => {
        setContent(prev => ({ ...prev, [platform]: caption }));
        setSelected(prev => ({ ...prev, [platform]: true }));
        alert(`Caption copied to ${platform} content box ✅`);
    };

    const disconnectPlatform = async (platform) => {
        const p = PLATFORMS.find(pl => pl.key === platform);
        if (!window.confirm(`Disconnect ${p.label}?`)) return;
        try {
            await API.patch(p.disconnectUrl);
            await fetchAllStatuses();
            alert(`${p.label} disconnected ✅`);
        } catch (err) {
            alert(err.response?.data?.error || `Failed to disconnect ${p.label}`);
        }
    };

    // Helper: render platform icon inline
    const PlatformIcon = ({ platformKey, size = 20 }) => {
        const IconComponent = PLATFORM_ICON_MAP[platformKey];
        return IconComponent ? <IconComponent size={size} /> : null;
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Navbar ──────────────────────────────────── */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">SMMS</h1>
                        <p className="text-xs text-gray-500">Social Media Management</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Refresh */}
                        <button
                            onClick={fetchAllStatuses}
                            title="Refresh platform statuses"
                            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition"
                        >
                            <RefreshIcon size={14} /> Refresh
                        </button>

                        {/* Analytics */}
                        <button
                            onClick={() => navigate('/analytics')}
                            className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-300 transition"
                        >
                            <AnalyticsIcon size={15} /> Analytics
                        </button>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                        >
                            <LogoutIcon size={15} /> Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-8">

                {/* ── Platform Connections ─────────────────── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Connected Platforms</h2>

                    {statusLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {PLATFORMS.map(p => (
                                <div key={p.key} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {PLATFORMS.map(p => {
                                const conn = connections[p.key];
                                return (
                                    <div
                                        key={p.key}
                                        className={`relative border-2 rounded-xl p-4 transition ${conn.isConnected ? `${p.borderColor} ${p.bgColor}` : 'border-gray-200 bg-white'}`}
                                    >
                                        {p.comingSoon && (
                                            <span className="absolute top-2 right-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                                                Soon
                                            </span>
                                        )}

                                        <div className="flex items-center gap-2 mb-2">
                                            <PlatformIcon platformKey={p.key} size={22} />
                                            <span className="font-semibold text-sm text-gray-800">{p.label}</span>
                                        </div>

                                        {conn.isConnected ? (
                                            <>
                                                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                                    <CheckIcon size={12} /> Connected
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1 truncate">{conn.info}</p>
                                                {!p.comingSoon && (
                                                    <button
                                                        onClick={() => disconnectPlatform(p.key)}
                                                        className="mt-2 w-full text-xs py-1.5 rounded-lg text-red-600 border border-red-200 hover:bg-red-50 transition font-medium"
                                                    >
                                                        Disconnect
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => !p.comingSoon && connectPlatform(p.authUrl)}
                                                disabled={p.comingSoon}
                                                className={`mt-2 w-full text-xs py-2 rounded-lg text-white font-medium transition ${p.comingSoon ? 'bg-gray-300 cursor-not-allowed' : `${p.color} hover:opacity-90`}`}
                                            >
                                                {p.comingSoon ? 'Coming Soon' : `Connect ${p.label}`}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── Tabs ────────────────────────────────── */}
                <div className="flex gap-2 mb-6">
                    {[
                        { key: 'compose',   label: 'Compose',   Icon: PencilIcon },
                        { key: 'scheduled', label: 'Scheduled', Icon: CalendarIcon },
                        { key: 'published', label: 'Published', Icon: CheckIcon },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => handleTabChange(tab.key)}
                            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.key
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            <tab.Icon size={14} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── COMPOSE TAB ─────────────────────────── */}
                {activeTab === 'compose' && (
                    <>
                        {/* ── AI Caption Generator ──────────── */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <AISparkIcon size={22} />
                                AI Caption Generator
                            </h2>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Topic or Idea</label>
                                <input
                                    type="text"
                                    value={aiTopic}
                                    onChange={e => setAiTopic(e.target.value)}
                                    placeholder="e.g. We just launched our new product!"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                                <div className="flex flex-wrap gap-2">
                                    {TONES.map(t => (
                                        <button
                                            key={t.key}
                                            onClick={() => setAiTone(t.key)}
                                            className={`px-4 py-2 rounded-lg text-sm border-2 transition ${aiTone === t.key ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium' : 'border-gray-200 text-gray-600'}`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Generate for Platforms</label>
                                <div className="flex flex-wrap gap-2">
                                    {PLATFORMS.filter(p => !p.comingSoon).map(p => (
                                        <label
                                            key={p.key}
                                            className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border-2 text-sm transition ${aiPlatforms.includes(p.key) ? `${p.borderColor} ${p.bgColor} font-medium` : 'border-gray-200'}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={aiPlatforms.includes(p.key)}
                                                onChange={() => setAiPlatforms(prev =>
                                                    prev.includes(p.key) ? prev.filter(x => x !== p.key) : [...prev, p.key]
                                                )}
                                                className="w-4 h-4"
                                            />
                                            <PlatformIcon platformKey={p.key} size={16} />
                                            {p.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleGenerateCaptions}
                                disabled={aiLoading}
                                className={`w-full py-3 rounded-lg text-white font-semibold transition flex items-center justify-center gap-2 ${aiLoading ? 'bg-purple-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                            >
                                <AISparkIcon size={18} />
                                {aiLoading ? 'Generating...' : 'Generate Captions'}
                            </button>

                            {aiCaptions && (
                                <div className="mt-6 space-y-6">
                                    {Object.entries(aiCaptions).map(([platform, captions]) => {
                                        const p = PLATFORMS.find(pl => pl.key === platform);
                                        return (
                                            <div key={platform}>
                                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                                    <PlatformIcon platformKey={platform} size={18} />
                                                    {p?.label} Captions
                                                </h3>
                                                <div className="space-y-3">
                                                    {captions.map(c => (
                                                        <div key={c.id} className="border border-gray-200 rounded-xl p-4">
                                                            <p className="text-sm text-gray-700 mb-3">{c.caption}</p>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs text-gray-400">{c.charCount} chars</span>
                                                                <button
                                                                    onClick={() => useCaption(platform, c.caption)}
                                                                    className="flex items-center gap-1.5 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
                                                                >
                                                                    <CheckIcon size={12} /> Use This
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* ── Post Composer ─────────────────── */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-6">Create Post</h2>

                            {/* Platform selection */}
                            <div className="mb-6">
                                <p className="text-sm font-medium text-gray-700 mb-3">Post to:</p>
                                <div className="flex flex-wrap gap-3">
                                    {PLATFORMS.filter(p => !p.comingSoon).map(p => {
                                        const conn = connections[p.key];
                                        const isSelected = selected[p.key];
                                        return (
                                            <label
                                                key={p.key}
                                                className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border-2 text-sm transition ${isSelected ? `${p.borderColor} ${p.bgColor} font-medium` : 'border-gray-200 bg-white'} ${!conn.isConnected ? 'opacity-40 cursor-not-allowed' : ''}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    disabled={!conn.isConnected}
                                                    onChange={() => togglePlatform(p.key)}
                                                    className="w-4 h-4"
                                                />
                                                <PlatformIcon platformKey={p.key} size={16} />
                                                <span>{p.label}</span>
                                                {!conn.isConnected && <span className="text-xs text-gray-400">(not connected)</span>}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Content textareas */}
                            {PLATFORMS.filter(p => selected[p.key]).map(p => (
                                <div key={p.key} className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <PlatformIcon platformKey={p.key} size={16} />
                                            {p.label} Content
                                        </label>
                                        <span className={`text-xs ${content[p.key].length > p.charLimit * 0.9 ? 'text-red-500' : 'text-gray-400'}`}>
                                            {content[p.key].length}/{p.charLimit}
                                        </span>
                                    </div>
                                    <textarea
                                        value={content[p.key]}
                                        onChange={e => setContent(prev => ({ ...prev, [p.key]: e.target.value }))}
                                        placeholder={p.placeholder}
                                        maxLength={p.charLimit}
                                        className={`w-full border-2 ${p.borderColor} p-4 rounded-xl h-32 outline-none focus:ring-2 focus:ring-blue-300 resize-none text-sm`}
                                    />
                                </div>
                            ))}

                            {/* Image upload */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Image URL (required for Instagram)
                                </label>
                                <input
                                    type="text"
                                    value={image || ''}
                                    onChange={e => setImage(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Post mode toggle */}
                            <div className="mb-6">
                                <p className="text-sm font-medium text-gray-700 mb-3">When to post:</p>
                                <div className="flex gap-3">
                                    {[
                                        { key: 'immediate', label: 'Post Now',  Icon: RocketIcon },
                                        { key: 'schedule',  label: 'Schedule',  Icon: CalendarIcon },
                                    ].map(mode => (
                                        <button
                                            key={mode.key}
                                            onClick={() => setPostMode(mode.key)}
                                            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium border-2 transition ${postMode === mode.key ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600'}`}
                                        >
                                            <mode.Icon size={14} /> {mode.label}
                                        </button>
                                    ))}
                                </div>

                                {postMode === 'schedule' && (
                                    <div className="mt-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            value={scheduledAt}
                                            onChange={e => setScheduledAt(e.target.value)}
                                            min={new Date().toISOString().slice(0, 16)}
                                            className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Result message */}
                            {postResult && (
                                <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${postResult.success ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                                    <p className="font-semibold">{postResult.message}</p>
                                    {postResult.platforms && (
                                        <div className="mt-2 space-y-1">
                                            {Object.entries(postResult.platforms).map(([key, val]) => (
                                                val?.status && (
                                                    <p key={key} className="text-xs flex items-center gap-1">
                                                        <PlatformIcon platformKey={key} size={12} />
                                                        {key}: {val.status === 'published' ? <CheckIcon size={12} /> : '❌'} {val.status}
                                                        {val.error && ` — ${val.error}`}
                                                    </p>
                                                )
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Publish button */}
                            <button
                                onClick={handlePublish}
                                disabled={postLoading}
                                className={`w-full py-3 rounded-xl text-white font-semibold text-base transition flex items-center justify-center gap-2 ${postLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {postLoading ? (
                                    'Publishing...'
                                ) : postMode === 'schedule' ? (
                                    <><CalendarIcon size={16} /> Schedule Post</>
                                ) : (
                                    <><RocketIcon size={16} /> Publish Now</>
                                )}
                            </button>
                        </div>
                    </>
                )}

                {/* ── SCHEDULED / PUBLISHED TABS ──────────── */}
                {(activeTab === 'scheduled' || activeTab === 'published') && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            {activeTab === 'scheduled' ? <><CalendarIcon size={18} /> Scheduled Posts</> : <><CheckIcon size={18} /> Published Posts</>}
                        </h2>

                        {postsLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <div className="flex justify-center mb-3">
                                    {activeTab === 'scheduled' ? <CalendarIcon size={40} /> : <CheckIcon size={40} />}
                                </div>
                                <p className="text-sm">No {activeTab} posts yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {posts.map(post => (
                                    <div key={post._id} className="border border-gray-200 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex gap-2">
                                                {PLATFORMS.map(p => (
                                                    post.platforms[p.key]?.enabled && (
                                                        <PlatformIcon key={p.key} platformKey={p.key} size={20} />
                                                    )
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                    post.overallStatus === 'published' ? 'bg-green-100 text-green-700' :
                                                    post.overallStatus === 'draft'     ? 'bg-yellow-100 text-yellow-700' :
                                                    post.overallStatus === 'partial'   ? 'bg-orange-100 text-orange-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                    {post.overallStatus}
                                                </span>
                                                {post.scheduledAt && (
                                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                                        <CalendarIcon size={12} />
                                                        {new Date(post.scheduledAt).toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {PLATFORMS.map(p => (
                                            post.platforms[p.key]?.content && (
                                                <p key={p.key} className="text-sm text-gray-600 truncate flex items-center gap-1.5">
                                                    <PlatformIcon platformKey={p.key} size={14} />
                                                    <span className="font-medium text-gray-800">{p.label}:</span>{' '}
                                                    {post.platforms[p.key].content}
                                                </p>
                                            )
                                        ))}

                                        <p className="text-xs text-gray-400 mt-2">
                                            Created: {new Date(post.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}