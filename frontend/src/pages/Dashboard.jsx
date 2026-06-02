// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import API                     from '../services/api';

// Platform config — add new platforms here only
const PLATFORMS = [
    {
        key:         'linkedin',
        label:       'LinkedIn',
        icon:        '💼',
        color:       'bg-blue-600',
        borderColor: 'border-blue-500',
        bgColor:     'bg-blue-50',
        authUrl:     'http://localhost:3000/api/linkedin/auth',
        statusApi:   '/api/linkedin/status',
        charLimit:   3000,
        placeholder: 'Write professional content for LinkedIn...',
    },
    {
        key:         'facebook',
        label:       'Facebook',
        icon:        '📘',
        color:       'bg-blue-800',
        borderColor: 'border-blue-800',
        bgColor:     'bg-blue-50',
        authUrl:     'http://localhost:3000/api/facebook/auth',
        statusApi:   '/api/facebook/status',
        charLimit:   63000,
        placeholder: 'Write conversational content for Facebook...',
    },
    {
        key:         'instagram',
        label:       'Instagram',
        icon:        '📸',
        color:       'bg-pink-600',
        borderColor: 'border-pink-500',
        bgColor:     'bg-pink-50',
        authUrl:     'http://localhost:3000/api/facebook/auth',
        // ↑ Instagram uses Facebook OAuth
        statusApi:   '/api/instagram/status',
        charLimit:   2200,
        placeholder: 'Write casual content with hashtags for Instagram...',
    },
    {
        key:         'twitter',
        label:       'Twitter/X',
        icon:        '🐦',
        color:       'bg-gray-900',
        borderColor: 'border-gray-700',
        bgColor:     'bg-gray-50',
        authUrl:     'http://localhost:3000/api/twitter/auth',
        statusApi:   '/api/twitter/status',
        charLimit:   280,
        placeholder: 'Write short punchy content for Twitter...',
        comingSoon:  true,
        // ↑ shows "coming soon" badge
    },
];

const TONES = [
    { key: 'professional',  label: '💼 Professional' },
    { key: 'casual',        label: '😊 Casual' },
    { key: 'funny',         label: '😂 Funny' },
    { key: 'inspirational', label: '🌟 Inspirational' },
    { key: 'educational',   label: '📚 Educational' },
];

export default function Dashboard() {
    const navigate = useNavigate();

    // connection status per platform
    const [connections, setConnections] = useState({
        linkedin:  { isConnected: false, info: '' },
        facebook:  { isConnected: false, info: '' },
        instagram: { isConnected: false, info: '' },
        twitter:   { isConnected: false, info: '' },
    });

    // per-platform content
    const [content, setContent] = useState({
        linkedin: '', facebook: '', instagram: '', twitter: ''
    });

    // which platforms selected for posting
    const [selected, setSelected] = useState({
        linkedin: false, facebook: false, instagram: false, twitter: false
    });

    const [image,          setImage]          = useState(null);
    const [scheduledAt,    setScheduledAt]    = useState('');
    const [postMode,       setPostMode]       = useState('immediate');
    // postMode: 'immediate' or 'schedule'

    const [statusLoading,  setStatusLoading]  = useState(true);
    const [postLoading,    setPostLoading]    = useState(false);
    const [postResult,     setPostResult]     = useState(null);
    const [activeTab,      setActiveTab]      = useState('compose');
    // activeTab: 'compose' | 'scheduled' | 'published'

    const [posts,          setPosts]          = useState([]);
    const [postsLoading,   setPostsLoading]   = useState(false);

    // ── AI Caption Generator states ────────────────────────
    const [aiTopic,     setAiTopic]     = useState('');
    const [aiTone,      setAiTone]      = useState('professional');
    const [aiPlatforms, setAiPlatforms] = useState([]);
    const [aiCaptions,  setAiCaptions]  = useState(null);
    const [aiLoading,   setAiLoading]   = useState(false);

    // ── On load: check URL params + fetch status ───────────
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const linkedin = params.get('linkedin');
        const facebook = params.get('facebook');

        if (linkedin === 'connected') alert('LinkedIn connected ✅');
        if (linkedin === 'failed')    alert('LinkedIn connection failed ❌');
        if (facebook === 'connected') alert('Facebook/Instagram connected ✅');
        if (facebook === 'no_pages')  alert('No Facebook Pages found. Create one first.');
        if (facebook === 'failed')    alert('Facebook connection failed ❌');

        // clean URL
        window.history.replaceState({}, document.title, '/dashboard');

        // fetch all platform statuses
        fetchAllStatuses();
    }, []);

    // ── Fetch all platform statuses ────────────────────────
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
                    linkedin: {
                        isConnected: d.isConnected,
                        info: d.isConnected ? `Connected as ${d.name || 'LinkedIn User'}` : ''
                    }
                }));
            }

            if (fbRes.status === 'fulfilled') {
                const d = fbRes.value.data;
                setConnections(prev => ({
                    ...prev,
                    facebook: {
                        isConnected: d.isConnected,
                        info: d.isConnected ? `Page: ${d.pageName || 'Facebook Page'}` : ''
                    },
                    instagram: {
                        isConnected: !!d.instagramAccountId,
                        info: d.instagramAccountId
                            ? `@${d.instagramUsername || 'Instagram Account'}`
                            : ''
                    }
                }));
            }
        } catch (err) {
            console.error('Status fetch error:', err);
        } finally {
            setStatusLoading(false);
        }
    };

    // ── Fetch posts for history tab ────────────────────────
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

    // ── Connect platform ───────────────────────────────────
    const connectPlatform = (authUrl) => {
        window.location.href = authUrl;
    };

    // ── Toggle platform selection ──────────────────────────
    const togglePlatform = (key) => {
        setSelected(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // ── Publish post ───────────────────────────────────────
    const handlePublish = async () => {
        const anySelected = Object.values(selected).some(v => v);
        if (!anySelected) {
            alert('Select at least one platform');
            return;
        }

        // validate content for selected platforms
        for (const p of PLATFORMS) {
            if (selected[p.key] && !content[p.key].trim()) {
                alert(`Write content for ${p.label}`);
                return;
            }
        }

        if (postMode === 'schedule' && !scheduledAt) {
            alert('Pick a date and time to schedule');
            return;
        }

        try {
            setPostLoading(true);
            setPostResult(null);

            const endpoint = postMode === 'schedule'
                ? '/api/posts/schedule'
                : '/api/posts/create-post';

            const platformsPayload = {};
            PLATFORMS.forEach(p => {
                platformsPayload[p.key] = {
                    enabled: selected[p.key] || false,
                    content: content[p.key] || ''
                };
            });

            const body = { platforms: platformsPayload };
            if (postMode === 'schedule') body.scheduledAt = scheduledAt;
            if (image) body.imageUrl = image;

            const res = await API.post(endpoint, body);
            setPostResult(res.data);

            // clear form on success
            if (res.data.success) {
                setContent({ linkedin:'', facebook:'', instagram:'', twitter:'' });
                setSelected({ linkedin:false, facebook:false, instagram:false, twitter:false });
                setScheduledAt('');
                setImage(null);
            }

        } catch (err) {
            setPostResult({
                success: false,
                message: err.response?.data?.error || 'Post failed'
            });
        } finally {
            setPostLoading(false);
        }
    };

    // ── Logout ─────────────────────────────────────────────
    const handleLogout = async () => {
        try {
            await API.post('/api/auth/logout');
        } catch (_) {}
        navigate('/login');
    };

    // ── Tab change ─────────────────────────────────────────
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'scheduled')  fetchPosts('draft');
        if (tab === 'published')  fetchPosts('published');
    };

    // ── Generate AI captions ───────────────────────────────
    const handleGenerateCaptions = async () => {
        if (!aiTopic.trim()) {
            alert('Enter a topic first');
            return;
        }
        if (aiPlatforms.length === 0) {
            alert('Select at least one platform');
            return;
        }
        try {
            setAiLoading(true);
            setAiCaptions(null);
            const res = await API.post('/api/ai/generate-captions', {
                topic:     aiTopic,
                tone:      aiTone,
                platforms: aiPlatforms
            });
            setAiCaptions(res.data.captions);
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to generate captions');
        } finally {
            setAiLoading(false);
        }
    };

    // ── Use AI caption — fills it into post composer ───────
    const useCaption = (platform, caption) => {
        setContent(prev => ({ ...prev, [platform]: caption }));
        setSelected(prev => ({ ...prev, [platform]: true }));
        alert(`Caption copied to ${platform} content box ✅`);
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
                    <div className="flex items-center gap-4">
                        <button
                            onClick={fetchAllStatuses}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            🔄 Refresh
                        </button>
                        <button
                            onClick={handleLogout}
                            className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-8">

                {/* ── Platform Connections ─────────────────── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Connected Platforms
                    </h2>

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
                                        className={`relative border-2 rounded-xl p-4 transition ${
                                            conn.isConnected
                                                ? `${p.borderColor} ${p.bgColor}`
                                                : 'border-gray-200 bg-white'
                                        }`}
                                    >
                                        {/* Coming soon badge */}
                                        {p.comingSoon && (
                                            <span className="absolute top-2 right-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                                                Soon
                                            </span>
                                        )}

                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xl">{p.icon}</span>
                                            <span className="font-semibold text-sm text-gray-800">{p.label}</span>
                                        </div>

                                        {conn.isConnected ? (
                                            <>
                                                <p className="text-xs text-green-600 font-medium">✅ Connected</p>
                                                <p className="text-xs text-gray-500 mt-1 truncate">{conn.info}</p>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => !p.comingSoon && connectPlatform(p.authUrl)}
                                                disabled={p.comingSoon}
                                                className={`mt-2 w-full text-xs py-2 rounded-lg text-white font-medium transition ${
                                                    p.comingSoon
                                                        ? 'bg-gray-300 cursor-not-allowed'
                                                        : `${p.color} hover:opacity-90`
                                                }`}
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
                        { key: 'compose',   label: '✏️ Compose' },
                        { key: 'scheduled', label: '📅 Scheduled' },
                        { key: 'published', label: '✅ Published' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => handleTabChange(tab.key)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
                                activeTab === tab.key
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── COMPOSE TAB ─────────────────────────── */}
                {activeTab === 'compose' && (
                    <>
                        {/* ── AI Caption Generator ──────────── */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                🤖 AI Caption Generator
                            </h2>

                            {/* Topic input */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Topic or Idea
                                </label>
                                <input
                                    type="text"
                                    value={aiTopic}
                                    onChange={e => setAiTopic(e.target.value)}
                                    placeholder="e.g. We just launched our new product!"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            {/* Tone selection */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tone
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {TONES.map(t => (
                                        <button
                                            key={t.key}
                                            onClick={() => setAiTone(t.key)}
                                            className={`px-4 py-2 rounded-lg text-sm border-2 transition ${
                                                aiTone === t.key
                                                    ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium'
                                                    : 'border-gray-200 text-gray-600'
                                            }`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Platform selection for AI */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Generate for Platforms
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {PLATFORMS.filter(p => !p.comingSoon).map(p => (
                                        <label
                                            key={p.key}
                                            className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border-2 text-sm transition ${
                                                aiPlatforms.includes(p.key)
                                                    ? `${p.borderColor} ${p.bgColor} font-medium`
                                                    : 'border-gray-200'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={aiPlatforms.includes(p.key)}
                                                onChange={() => {
                                                    setAiPlatforms(prev =>
                                                        prev.includes(p.key)
                                                            ? prev.filter(x => x !== p.key)
                                                            : [...prev, p.key]
                                                    );
                                                }}
                                                className="w-4 h-4"
                                            />
                                            {p.icon} {p.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Generate button */}
                            <button
                                onClick={handleGenerateCaptions}
                                disabled={aiLoading}
                                className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                                    aiLoading
                                        ? 'bg-purple-300 cursor-not-allowed'
                                        : 'bg-purple-600 hover:bg-purple-700'
                                }`}
                            >
                                {aiLoading ? '🤖 Generating...' : '✨ Generate Captions'}
                            </button>

                            {/* Generated captions */}
                            {aiCaptions && (
                                <div className="mt-6 space-y-6">
                                    {Object.entries(aiCaptions).map(([platform, captions]) => {
                                        const p = PLATFORMS.find(pl => pl.key === platform);
                                        return (
                                            <div key={platform}>
                                                <h3 className="font-semibold text-gray-800 mb-3">
                                                    {p?.icon} {p?.label} Captions
                                                </h3>
                                                <div className="space-y-3">
                                                    {captions.map(c => (
                                                        <div
                                                            key={c.id}
                                                            className="border border-gray-200 rounded-xl p-4"
                                                        >
                                                            <p className="text-sm text-gray-700 mb-3">
                                                                {c.caption}
                                                            </p>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs text-gray-400">
                                                                    {c.charCount} chars
                                                                </span>
                                                                <button
                                                                    onClick={() => useCaption(platform, c.caption)}
                                                                    className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
                                                                >
                                                                    Use This ✅
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
                                                className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border-2 text-sm transition ${
                                                    isSelected
                                                        ? `${p.borderColor} ${p.bgColor} font-medium`
                                                        : 'border-gray-200 bg-white'
                                                } ${!conn.isConnected ? 'opacity-40 cursor-not-allowed' : ''}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    disabled={!conn.isConnected}
                                                    onChange={() => togglePlatform(p.key)}
                                                    className="w-4 h-4"
                                                />
                                                <span>{p.icon} {p.label}</span>
                                                {!conn.isConnected && (
                                                    <span className="text-xs text-gray-400">(not connected)</span>
                                                )}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Content textareas — show only for selected platforms */}
                            {PLATFORMS.filter(p => selected[p.key]).map(p => (
                                <div key={p.key} className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            {p.icon} {p.label} Content
                                        </label>
                                        <span className={`text-xs ${
                                            content[p.key].length > p.charLimit * 0.9
                                                ? 'text-red-500'
                                                : 'text-gray-400'
                                        }`}>
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
                                        { key:'immediate', label:'🚀 Post Now' },
                                        { key:'schedule',  label:'📅 Schedule' },
                                    ].map(mode => (
                                        <button
                                            key={mode.key}
                                            onClick={() => setPostMode(mode.key)}
                                            className={`px-5 py-2 rounded-lg text-sm font-medium border-2 transition ${
                                                postMode === mode.key
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 bg-white text-gray-600'
                                            }`}
                                        >
                                            {mode.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Date picker for scheduling */}
                                {postMode === 'schedule' && (
                                    <div className="mt-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Schedule Date & Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={scheduledAt}
                                            onChange={e => setScheduledAt(e.target.value)}
                                            min={new Date().toISOString().slice(0,16)}
                                            className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Result message */}
                            {postResult && (
                                <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
                                    postResult.success
                                        ? 'bg-green-50 border border-green-200 text-green-700'
                                        : 'bg-red-50 border border-red-200 text-red-700'
                                }`}>
                                    <p className="font-semibold">{postResult.message}</p>
                                    {postResult.platforms && (
                                        <div className="mt-2 space-y-1">
                                            {Object.entries(postResult.platforms).map(([key, val]) => (
                                                val?.status && (
                                                    <p key={key} className="text-xs">
                                                        {key}: {val.status === 'published' ? '✅' : '❌'} {val.status}
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
                                className={`w-full py-3 rounded-xl text-white font-semibold text-base transition ${
                                    postLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {postLoading
                                    ? 'Publishing...'
                                    : postMode === 'schedule'
                                        ? '📅 Schedule Post'
                                        : '🚀 Publish Now'
                                }
                            </button>
                        </div>
                    </>
                )}

                {/* ── SCHEDULED / PUBLISHED TABS ──────────── */}
                {(activeTab === 'scheduled' || activeTab === 'published') && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            {activeTab === 'scheduled' ? '📅 Scheduled Posts' : '✅ Published Posts'}
                        </h2>

                        {postsLoading ? (
                            <div className="space-y-3">
                                {[1,2,3].map(i => (
                                    <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <p className="text-4xl mb-3">
                                    {activeTab === 'scheduled' ? '📅' : '✅'}
                                </p>
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
                                                        <span key={p.key} className="text-lg">{p.icon}</span>
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
                                                    <span className="text-xs text-gray-400">
                                                        📅 {new Date(post.scheduledAt).toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Show content preview */}
                                        {PLATFORMS.map(p => (
                                            post.platforms[p.key]?.content && (
                                                <p key={p.key} className="text-sm text-gray-600 truncate">
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