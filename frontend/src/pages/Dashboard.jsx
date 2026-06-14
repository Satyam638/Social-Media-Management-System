// src/pages/Dashboard.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);


// ── Toast notification system ────────────────────────────────────────────────
function useToast() {
    const [toasts, setToasts] = useState([]);
    const add = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
    };
    return { toasts, success: msg => add(msg, 'success'), error: msg => add(msg, 'error'), info: msg => add(msg, 'info') };
}

function ToastContainer({ toasts }) {
    return (
        <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
            {toasts.map(t => (
                <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium pointer-events-auto animate-fade-in max-w-xs ${t.type === 'success' ? 'bg-green-600 text-white' :
                    t.type === 'error' ? 'bg-red-600 text-white' :
                        'bg-gray-800 text-white'
                    }`}>
                    <span className="text-base">
                        {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}
                    </span>
                    {t.message}
                </div>
            ))}
        </div>
    );
}

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
            <linearGradient id="ig-dash" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFDC80" />
                <stop offset="50%" stopColor="#F77737" />
                <stop offset="100%" stopColor="#833AB4" />
            </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#ig-dash)" />
        <rect x="6" y="6" width="12" height="12" rx="4" stroke="white" strokeWidth="1.5" fill="none" />
        <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" fill="none" />
        <circle cx="16.5" cy="7.5" r="1" fill="white" />
    </svg>
);
const TwitterXIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#000" />
        <path d="M17.5 5H19.5L14.5 11L20 19H15.5L12 14.5L8 19H6L11.5 12.5L6.5 5H11L14 9.5L17.5 5ZM16.5 17.5H17.5L9.5 6.5H8.5L16.5 17.5Z" fill="white" />
    </svg>
);
const Icon = ({ name, size = 18, className = '' }) => {
    const icons = {
        compose: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
        calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
        check: <polyline points="20 6 9 17 4 12" />,
        analytics: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>,
        logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
        refresh: <><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></>,
        rocket: <><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></>,
        sparkle: <><path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" /><path d="M19 16L19.75 18.25L22 19L19.75 19.75L19 22L18.25 19.75L16 19L18.25 18.25L19 16Z" /></>,
        image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>,
        x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
        menu: <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>,
        link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>,
    };
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            {icons[name]}
        </svg>
    );
};

const PLATFORM_ICON = { linkedin: LinkedInIcon, facebook: FacebookIcon, instagram: InstagramIcon, twitter: TwitterXIcon };

// ── Platform config ──────────────────────────────────────────────────────────
const PLATFORMS = [
    { key: 'linkedin', label: 'LinkedIn', color: 'bg-blue-600', border: 'border-blue-400', light: 'bg-blue-50', authUrl: `${import.meta.env.VITE_API_URL}/api/linkedin/auth`, statusApi: '/api/linkedin/status', disconnectUrl: '/api/linkedin/disconnect', charLimit: 3000, placeholder: 'Write professional content for LinkedIn...' },
    { key: 'facebook', label: 'Facebook', color: 'bg-blue-800', border: 'border-blue-700', light: 'bg-blue-50', authUrl: `${import.meta.env.VITE_API_URL}/api/facebook/auth`, statusApi: '/api/facebook/status', disconnectUrl: '/api/facebook/disconnect', charLimit: 63000, placeholder: 'Write conversational content for Facebook...' },
    { key: 'instagram', label: 'Instagram', color: 'bg-pink-600', border: 'border-pink-400', light: 'bg-pink-50', authUrl: `${import.meta.env.VITE_API_URL}/api/facebook/auth`, statusApi: '/api/instagram/status', disconnectUrl: '/api/facebook/disconnect', charLimit: 2200, placeholder: 'Write casual content with hashtags for Instagram...' },
    { key: 'twitter', label: 'Twitter/X', color: 'bg-gray-900', border: 'border-gray-600', light: 'bg-gray-50', authUrl: `${import.meta.env.VITE_API_URL}/api/twitter/auth`, statusApi: '/api/twitter/status', charLimit: 280, placeholder: 'Write short punchy content for Twitter...', comingSoon: true },
];

const TONES = [
    { key: 'professional', label: '💼 Professional' },
    { key: 'casual', label: '😊 Casual' },
    { key: 'funny', label: '😂 Funny' },
    { key: 'inspirational', label: '🌟 Inspirational' },
    { key: 'educational', label: '📚 Educational' },
];

const NAV_ITEMS = [
    { key: 'compose', label: 'Compose', icon: 'compose' },
    { key: 'scheduled', label: 'Scheduled', icon: 'calendar' },
    { key: 'published', label: 'Published', icon: 'check' },
];

// ── Skeleton loader ──────────────────────────────────────────────────────────
const Skeleton = ({ className }) => <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />;

// ── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard() {
    const navigate = useNavigate();
    const toast = useToast();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [connections, setConnections] = useState({
        linkedin: { isConnected: false, info: '' },
        facebook: { isConnected: false, info: '' },
        instagram: { isConnected: false, info: '' },
        twitter: { isConnected: false, info: '' },
    });
    // const [content, setContent] = useState({ linkedin: '', facebook: '', instagram: '', twitter: '' });
    const [selected, setSelected] = useState({ linkedin: false, facebook: false, instagram: false, twitter: false });
    const [content, setContent] = useState({
        linkedin: {
            content: '',
            imageUrl: ''
        },

        facebook: {
            content: '',
            imageUrl: ''
        },

        instagram: {
            content: '',
            imageUrl: ''
        },

        twitter: {
            content: '',
            imageUrl: ''
        }
    });
    const [scheduledAt, setScheduledAt] = useState('');
    const [postMode, setPostMode] = useState('immediate');
    const [statusLoading, setStatusLoading] = useState(true);
    const [postLoading, setPostLoading] = useState(false);
    const [postResult, setPostResult] = useState(null);
    const [activeTab, setActiveTab] = useState('compose');
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [aiTone, setAiTone] = useState('professional');
    const [aiPlatforms, setAiPlatforms] = useState([]);
    const [aiCaptions, setAiCaptions] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [activeComposePlatform, setActiveComposePlatform] = useState(null);
    // ── Add these new states ───────────────────────────────
    const [platformImages, setPlatformImages] = useState({
        linkedin: { file: null, preview: null, url: '' },
        facebook: { file: null, preview: null, url: '' },
        instagram: { file: null, preview: null, url: '' },
        twitter: { file: null, preview: null, url: '' },
    });
    const [uploadingImage, setUploadingImage] = useState({
        linkedin: false, facebook: false, instagram: false, twitter: false
    });

    // ── On mount ─────────────────────────────────────────────────────────────
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('linkedin') === 'connected') toast.success('LinkedIn connected successfully!');
        if (params.get('linkedin') === 'failed') toast.error('LinkedIn connection failed');
        if (params.get('facebook') === 'connected') toast.success('Facebook & Instagram connected!');
        if (params.get('facebook') === 'no_pages') toast.error('No Facebook Pages found. Create one first.');
        if (params.get('facebook') === 'failed') toast.error('Facebook connection failed');
        window.history.replaceState({}, document.title, '/dashboard');
        fetchAllStatuses();
        fetchCurrentUser();
    }, []);

    // ── API calls ─────────────────────────────────────────────────────────────
    const fetchAllStatuses = async () => {
        setStatusLoading(true);
        try {
            const [liRes, fbRes] = await Promise.allSettled([
                API.get('/api/linkedin/status'),
                API.get('/api/facebook/status'),
            ]);
            if (liRes.status === 'fulfilled') {
                const d = liRes.value.data;
                setConnections(prev => ({ ...prev, linkedin: { isConnected: d.isConnected, info: d.isConnected ? `Connected as ${d.name || 'LinkedIn User'}` : '' } }));
            }
            if (fbRes.status === 'fulfilled') {
                const d = fbRes.value.data;
                setConnections(prev => ({
                    ...prev,
                    facebook: { isConnected: d.isConnected, info: d.isConnected ? `Page: ${d.pageName || 'Facebook Page'}` : '' },
                    instagram: { isConnected: !!d.instagramAccountId, info: d.instagramAccountId ? `@${d.instagramUsername || 'Instagram'}` : '' },
                }));
            }
        } catch (err) {
            toast.error('Failed to refresh platform statuses');
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
            toast.error('Failed to load posts');
        } finally {
            setPostsLoading(false);
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const res = await API.get('/api/auth/me');
            console.log('User data:', res.data); // 👈 check browser console
            setCurrentUser(res.data.user);
        } catch (err) {
            console.error('Failed to fetch user', err);
        }
    };

    const disconnectPlatform = async (platformKey) => {
        const p = PLATFORMS.find(pl => pl.key === platformKey);
        if (!p?.disconnectUrl) return;
        try {
            await API.patch(p.disconnectUrl);
            await fetchAllStatuses();
            toast.success(`${p.label} disconnected`);
        } catch (err) {
            toast.error(`Failed to disconnect ${p.label}`);
        }
    };

    const handlePublish = async () => {
        const anySelected = Object.values(selected).some(v => v);
        if (!anySelected) { toast.error('Select at least one platform'); return; }
        for (const p of PLATFORMS) {
            if (
                selected[p.key] &&
                !content[p.key].content.trim()
            ) {
                toast.error(`Add content for ${p.label}`);
                return;
            }
        }
        if (postMode === 'schedule' && !scheduledAt) { toast.error('Pick a date and time to schedule'); return; }
        try {
            setPostLoading(true);
            setPostResult(null);
            // Instagram requires image URL
            if (
                selected.instagram &&
                !content.instagram.imageUrl.trim()
            ) {
                toast.error('Instagram requires an image URL');
                return;
            }
            const endpoint = postMode === 'schedule' ? '/api/posts/schedule-post' : '/api/posts/create-post';
            const platformsPayload = {};
            PLATFORMS.forEach(p => {
                platformsPayload[p.key] = {
                    enabled: selected[p.key] || false,
                    content: content[p.key].content || '',
                    imageUrl: content[p.key].imageUrl || ''
                };
            });
            const body = { platforms: platformsPayload };
            if (postMode === 'schedule') body.scheduledAt = scheduledAt;

            console.log(
                JSON.stringify(body, null, 2)
            );
            // if (image) body.imageUrl = image;
            const res = await API.post(endpoint, body);
            setPostResult(res.data);
            if (res.data.success) {
                toast.success(postMode === 'schedule' ? 'Post scheduled!' : 'Post published!');
                setContent({
                    linkedin: { content: '', imageUrl: '' },
                    facebook: { content: '', imageUrl: '' },
                    instagram: { content: '', imageUrl: '' },
                    twitter: { content: '', imageUrl: '' },
                });
                setSelected({ linkedin: false, facebook: false, instagram: false, twitter: false });
                setScheduledAt('');
                setActiveComposePlatform(null);

                // ✅ Reset images too
                setPlatformImages({
                    linkedin: { file: null, preview: null, url: '' },
                    facebook: { file: null, preview: null, url: '' },
                    instagram: { file: null, preview: null, url: '' },
                    twitter: { file: null, preview: null, url: '' },
                });
            } else {
                toast.error(res.data.message || 'Some platforms failed');
            }
        } catch (err) {
            const data = err.response?.data;

            toast.error(
                data?.error ||
                data?.errors?.join(', ') ||
                data?.message ||
                'Post failed'
            );
        } finally {
            setPostLoading(false);
        }
    };

    const handleLogout = async () => {
        try { await API.post('/api/auth/logout'); } catch (_) { }
        navigate('/login');
    };
    // ── Cancel scheduled post ──────────────────────────────
    const cancelScheduledPost = async (postId) => {
        if (!window.confirm('Cancel this scheduled post?')) return;
        try {
            await API.delete(`/api/posts/cancel/schedule/${postId}`);
            toast.success('Scheduled post cancelled ✅');
            fetchPosts('draft'); // refresh list
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to cancel post');
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSidebarOpen(false);
        if (tab === 'scheduled') fetchPosts('draft');
        if (tab === 'published') fetchPosts('published');
    };

    const handleGenerateCaptions = async () => {
        if (!aiTopic.trim()) { toast.error('Enter a topic first'); return; }
        if (aiPlatforms.length === 0) { toast.error('Select at least one platform'); return; }
        try {
            setAiLoading(true);
            setAiCaptions(null);
            const res = await API.post('/api/ai/generate-captions', { topic: aiTopic, tone: aiTone, platforms: aiPlatforms });
            setAiCaptions(res.data.captions);
            toast.success('Captions generated!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to generate captions');
        } finally {
            setAiLoading(false);
        }
    };

    const useCaption = (platform, caption) => {
        setContent(prev => ({
            ...prev,
            [platform]: {
                ...prev[platform],
                content: caption
            }
        }));
        setSelected(prev => ({ ...prev, [platform]: true }));
        setActiveComposePlatform(platform);
        toast.success(`Caption applied to ${platform}`);
    };

    const togglePlatform = (key) => {
        const conn = connections[key];
        if (!conn.isConnected) { toast.error(`Connect ${PLATFORMS.find(p => p.key === key)?.label} first`); return; }
        setSelected(prev => {
            const next = { ...prev, [key]: !prev[key] };
            if (next[key] && !activeComposePlatform) setActiveComposePlatform(key);
            if (!next[key] && activeComposePlatform === key) {
                const stillSelected = Object.keys(next).find(k => next[k]);
                setActiveComposePlatform(stillSelected || null);
            }
            return next;
        });
    };

    // ── Handle per-platform image upload ──────────────────
    const handleImageUpload = async (platformKey, file) => {
        if (!file) return;

        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowed.includes(file.type)) {
            toast.error('Only JPG, PNG, WebP or GIF allowed');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image must be under 10MB');
            return;
        }

        const preview = URL.createObjectURL(file);
        setPlatformImages(prev => ({
            ...prev,
            [platformKey]: { file, preview, url: '' }
        }));

        try {
            setUploadingImage(prev => ({ ...prev, [platformKey]: true }));

            const formData = new FormData();
            formData.append('image', file);

            const res = await API.post('/api/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setPlatformImages(prev => ({
                ...prev,
                [platformKey]: { file, preview, url: res.data.url }
            }));

            setContent(prev => ({
                ...prev,
                [platformKey]: {
                    ...prev[platformKey],
                    imageUrl: res.data.url
                }
            }));

            toast.success(`Image uploaded ✅`);

        } catch (err) {
            toast.error(err.response?.data?.error || 'Image upload failed');
            setPlatformImages(prev => ({
                ...prev,
                [platformKey]: { file: null, preview: null, url: '' }
            }));
        } finally {
            setUploadingImage(prev => ({ ...prev, [platformKey]: false }));
        }
    };

    // ── Remove platform image ──────────────────────────────
    const removeImage = (platformKey) => {
        setPlatformImages(prev => ({
            ...prev,
            [platformKey]: { file: null, preview: null, url: '' }
        }));
        setContent(prev => ({
            ...prev,
            [platformKey]: { ...prev[platformKey], imageUrl: '' }
        }));
    };

    // ▲▲▲ END OF NEW FUNCTIONS ▲▲▲

    // const connectedCount = Object.values(connections).filter(c => c.isConnected).length;

    const connectedCount = Object.values(connections).filter(c => c.isConnected).length;
    const selectedPlatforms = PLATFORMS.filter(p => selected[p.key]);

    // ── Sidebar content ──────────────────────────────────────────────────────
    const Sidebar = ({ mobile = false }) => (
        <div className={`flex flex-col h-full ${mobile ? 'p-6' : 'p-5'}`}>
            {/* Logo */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                    {currentUser?.profilePic ? (
                        <img
                            src={currentUser.profilePic}
                            alt={currentUser.name}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                            {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    )}
                    <div>
                        <p className="text-sm font-semibold text-gray-900 leading-none truncate max-w-[120px]">
                            {currentUser?.name || 'Loading...'}
                        </p>
                        <p className="text-xs text-gray-400 leading-none mt-0.5">
                            {currentUser?.email || 'Dashboard'}
                        </p>
                    </div>
                </div>
                {mobile && (
                    <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <Icon name="x" size={20} />
                    </button>
                )}
            </div>

            {/* Nav items */}
            <div className="mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-2">Menu</p>
                {NAV_ITEMS.map(item => (
                    <button
                        key={item.key}
                        onClick={() => handleTabChange(item.key)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 mb-1 ${activeTab === item.key
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Icon name={item.icon} size={16} />
                        {item.label}
                    </button>
                ))}
                <button
                    onClick={() => navigate('/analytics')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all duration-150 mb-1"
                >
                    <Icon name="analytics" size={16} />
                    Analytics
                </button>
            </div>

            {/* Platform connections */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2 px-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Platforms</p>
                    <button onClick={fetchAllStatuses} className="text-gray-400 hover:text-indigo-500 transition-colors">
                        <Icon name="refresh" size={13} />
                    </button>
                </div>
                {statusLoading ? (
                    <div className="space-y-2">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-10" />)}
                    </div>
                ) : (
                    PLATFORMS.filter(p => !p.comingSoon).map(p => {
                        const conn = connections[p.key];
                        const PIcon = PLATFORM_ICON[p.key];
                        return (
                            <div key={p.key} className="flex items-center justify-between px-3 py-2 rounded-xl mb-1 hover:bg-gray-50">
                                <div className="flex items-center gap-2.5">
                                    <PIcon size={18} />
                                    <div>
                                        <p className="text-xs font-medium text-gray-700">{p.label}</p>
                                        {conn.isConnected && <p className="text-xs text-gray-400 truncate max-w-[100px]">{conn.info}</p>}
                                    </div>
                                </div>
                                {conn.isConnected ? (
                                    <button
                                        onClick={() => disconnectPlatform(p.key)}
                                        className="text-xs text-red-400 hover:text-red-600 transition-colors font-medium"
                                    >
                                        Disconnect
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => window.location.href = p.authUrl}
                                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                                    >
                                        Connect
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
                {!statusLoading && (
                    <div className="mt-2 mx-2">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-400">{connectedCount} of 3 connected</span>
                            <span className="text-xs font-medium text-indigo-600">{Math.round((connectedCount / 3) * 100)}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${(connectedCount / 3) * 100}%` }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom */}
            <div className="mt-auto pt-4 border-t border-gray-100 space-y-1">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-150"
                >
                    <Icon name="logout" size={16} />
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <ToastContainer toasts={toast.toasts} />

            {/* ── Desktop Sidebar ──────────────────────────────────────── */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 fixed top-0 left-0 h-screen overflow-y-auto z-30">
                <Sidebar />
            </aside>

            {/* ── Mobile Sidebar overlay ───────────────────────────────── */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-40 flex">
                    <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
                    <div className="relative w-72 bg-white h-full overflow-y-auto z-50">
                        <Sidebar mobile />
                    </div>
                </div>
            )}

            {/* ── Main content ─────────────────────────────────────────── */}
            <main className="flex-1 lg:ml-64 min-h-screen">

                {/* ── Top bar (mobile only) ──────────────────────────── */}
                <div className="lg:hidden sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
                        <Icon name="menu" size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">OS</div>
                        <span className="font-semibold text-sm text-gray-900">{currentUser?.name || 'OneSocial'}</span>

                    </div>
                    <div className="w-8" />
                </div>

                <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">

                    {/* ── Page header ───────────────────────────────── */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {activeTab === 'compose' ? 'Compose Post' :
                                    activeTab === 'scheduled' ? 'Scheduled Posts' :
                                        'Published Posts'}
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {activeTab === 'compose' ? 'Create and publish to your connected platforms' :
                                    activeTab === 'scheduled' ? 'Posts waiting to be published' :
                                        'Your publishing history'}
                            </p>
                        </div>
                        {activeTab === 'compose' && (
                            <div className="hidden sm:flex items-center gap-2">
                                {PLATFORMS.filter(p => !p.comingSoon).map(p => {
                                    const conn = connections[p.key];
                                    const PIcon = PLATFORM_ICON[p.key];
                                    return (
                                        <div key={p.key} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${conn.isConnected ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-400'
                                            }`}>
                                            <PIcon size={14} />
                                            {conn.isConnected ? '●' : '○'}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* ── COMPOSE TAB ───────────────────────────────── */}
                    {activeTab === 'compose' && (
                        <div className="space-y-6">

                            {/* ── AI Caption Generator ────────────── */}
                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gradient-to-r from-violet-50 to-indigo-50">
                                    <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                                        <Icon name="sparkle" size={16} className="text-white stroke-white fill-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-semibold text-gray-900">AI Caption Generator</h2>
                                        <p className="text-xs text-gray-500">Describe your idea and get captions for each platform</p>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    {/* Topic input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Your topic or idea</label>
                                        <input
                                            type="text"
                                            value={aiTopic}
                                            onChange={e => setAiTopic(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleGenerateCaptions()}
                                            placeholder="e.g. We just launched our new product!"
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400 transition-all"
                                        />
                                    </div>

                                    {/* Tone selector */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                                        <div className="flex flex-wrap gap-2">
                                            {TONES.map(t => (
                                                <button
                                                    key={t.key}
                                                    onClick={() => setAiTone(t.key)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${aiTone === t.key
                                                        ? 'border-violet-500 bg-violet-50 text-violet-700'
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                        }`}
                                                >
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Platform checkboxes */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Generate for</label>
                                        <div className="flex flex-wrap gap-2">
                                            {PLATFORMS.filter(p => !p.comingSoon).map(p => {
                                                const PIcon = PLATFORM_ICON[p.key];
                                                const checked = aiPlatforms.includes(p.key);
                                                return (
                                                    <button
                                                        key={p.key}
                                                        onClick={() => setAiPlatforms(prev => prev.includes(p.key) ? prev.filter(x => x !== p.key) : [...prev, p.key])}
                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${checked ? `${p.border} ${p.light} text-gray-800` : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <PIcon size={14} />
                                                        {p.label}
                                                        {checked && <Icon name="check" size={12} className="text-green-600" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleGenerateCaptions}
                                        disabled={aiLoading}
                                        className={`w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${aiLoading ? 'bg-violet-300 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700 shadow-sm shadow-violet-200 hover:-translate-y-0.5'
                                            }`}
                                    >
                                        {aiLoading ? (
                                            <>
                                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                                                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Generating captions...
                                            </>
                                        ) : (
                                            <>✨ Generate captions</>
                                        )}
                                    </button>

                                    {/* Generated captions */}
                                    {aiCaptions && (
                                        <div className="space-y-5 pt-2">
                                            {Object.entries(aiCaptions).map(([platform, captions]) => {
                                                const p = PLATFORMS.find(pl => pl.key === platform);
                                                const PIcon = PLATFORM_ICON[platform];
                                                return (
                                                    <div key={platform}>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <PIcon size={16} />
                                                            <span className="text-sm font-semibold text-gray-800">{p?.label} captions</span>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {captions.map(c => (
                                                                <div key={c.id} className="border border-gray-200 rounded-xl p-4 hover:border-indigo-200 transition-colors group">
                                                                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">{c.caption}</p>
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-xs text-gray-400">{c.charCount} chars</span>
                                                                        <button
                                                                            onClick={() => useCaption(platform, c.caption)}
                                                                            className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                                                        >
                                                                            Use this →
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
                            </div>

                            {/* ── Post Composer ───────────────────── */}
                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100">
                                    <h2 className="text-sm font-semibold text-gray-900">Create Post</h2>
                                    <p className="text-xs text-gray-500 mt-0.5">Select platforms and write your content</p>
                                </div>
                                <div className="p-6 space-y-5">

                                    {/* Platform selector */}
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">Post to:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {PLATFORMS.map(p => {
                                                const conn = connections[p.key];
                                                const PIcon = PLATFORM_ICON[p.key];
                                                const isSelected = selected[p.key];
                                                return (
                                                    <button
                                                        key={p.key}
                                                        onClick={() => !p.comingSoon && togglePlatform(p.key)}
                                                        disabled={p.comingSoon || !conn.isConnected}
                                                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-150 ${p.comingSoon
                                                            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                                            : !conn.isConnected
                                                                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60'
                                                                : isSelected
                                                                    ? `${p.border} ${p.light} text-gray-800`
                                                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <PIcon size={16} />
                                                        {p.label}
                                                        {p.comingSoon && <span className="text-xs bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full">Soon</span>}
                                                        {!p.comingSoon && !conn.isConnected && <span className="text-xs text-gray-400">· not connected</span>}
                                                        {isSelected && <Icon name="check" size={13} className="text-green-600" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Per-platform tab composer */}
                                    {selectedPlatforms.length > 0 && (
                                        <div>
                                            {/* Tab strip */}
                                            {selectedPlatforms.length > 1 && (
                                                <div className="flex gap-1 mb-3 bg-gray-100 p-1 rounded-xl w-fit">
                                                    {selectedPlatforms.map(p => {
                                                        const PIcon = PLATFORM_ICON[p.key];
                                                        return (
                                                            <button
                                                                key={p.key}
                                                                onClick={() => setActiveComposePlatform(p.key)}
                                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeComposePlatform === p.key
                                                                    ? 'bg-white shadow-sm text-gray-800'
                                                                    : 'text-gray-500 hover:text-gray-700'
                                                                    }`}
                                                            >
                                                                <PIcon size={13} />
                                                                {p.label}
                                                                {content[p.key].content && <span className="w-1.5 h-1.5 rounded-full bg-green-500 ml-0.5" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* Active textarea */}
                                            {selectedPlatforms
                                                .filter(p => !selectedPlatforms.length > 1 || p.key === (activeComposePlatform || selectedPlatforms[0].key))
                                                .map(p => {
                                                    const PIcon = PLATFORM_ICON[p.key];
                                                    const showThis = selectedPlatforms.length === 1 || activeComposePlatform === p.key || (!activeComposePlatform && p.key === selectedPlatforms[0].key);
                                                    if (!showThis) return null;
                                                    return (
                                                        <div key={p.key}>
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div className="flex items-center gap-1.5">
                                                                    <PIcon size={15} />
                                                                    <span className="text-xs font-medium text-gray-600">{p.label} content</span>
                                                                </div>
                                                                <span className={`text-xs font-medium ${content[p.key].content.length > p.charLimit * 0.9 ? 'text-red-500' : 'text-gray-400'
                                                                    }`}>
                                                                    {content[p.key].content.length} / {p.charLimit.toLocaleString()}
                                                                </span>
                                                            </div>
                                                            <textarea
                                                                value={content[p.key].content}
                                                                onChange={e =>
                                                                    setContent(prev => ({
                                                                        ...prev,
                                                                        [p.key]: {
                                                                            ...prev[p.key],
                                                                            content: e.target.value
                                                                        }
                                                                    }))
                                                                }
                                                                placeholder={p.placeholder}
                                                                maxLength={p.charLimit}
                                                                rows={5}
                                                                className={`w-full border-2 ${p.border} rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-300 resize-none placeholder-gray-400 transition-all`}
                                                            />
                                                            {/* ── Image Upload Section ──────────────────────────── */}
                                                            <div className="mt-3">
                                                                <label className="block text-xs font-medium text-gray-600 mb-2">
                                                                    Image
                                                                    {p.key === 'instagram' && (
                                                                        <span className="text-red-500 ml-1">* required</span>
                                                                    )}
                                                                    {p.key !== 'instagram' && (
                                                                        <span className="text-gray-400 ml-1">(optional)</span>
                                                                    )}
                                                                </label>

                                                                {platformImages[p.key]?.preview ? (
                                                                    // ── Show preview after image selected ──────────
                                                                    <div className="relative rounded-xl overflow-hidden border border-gray-200">
                                                                        <img
                                                                            src={platformImages[p.key].preview}
                                                                            alt="Preview"
                                                                            className="w-full h-40 object-cover"
                                                                        />

                                                                        {/* Uploading overlay */}
                                                                        {uploadingImage[p.key] && (
                                                                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                                                                                <svg className="animate-spin w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                                                                                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                                                </svg>
                                                                                <span className="text-white text-xs font-medium">Uploading...</span>
                                                                            </div>
                                                                        )}

                                                                        {/* Success badge */}
                                                                        {!uploadingImage[p.key] && platformImages[p.key]?.url && (
                                                                            <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-lg font-medium flex items-center gap-1">
                                                                                ✅ Ready
                                                                            </div>
                                                                        )}

                                                                        {/* Remove button */}
                                                                        {!uploadingImage[p.key] && (
                                                                            <button
                                                                                onClick={() => removeImage(p.key)}
                                                                                className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors text-xs font-bold"
                                                                            >
                                                                                ✕
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    // ── Show upload area when no image selected ─────
                                                                    <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all group ${p.key === 'instagram'
                                                                        ? 'border-pink-300 hover:border-pink-400 hover:bg-pink-50'
                                                                        : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                                                                        }`}>
                                                                        <input
                                                                            type="file"
                                                                            accept="image/jpeg,image/png,image/webp,image/gif"
                                                                            className="hidden"
                                                                            onChange={e => handleImageUpload(p.key, e.target.files[0])}
                                                                        />
                                                                        <div className="text-2xl mb-1">🖼️</div>
                                                                        <p className={`text-xs font-medium transition-colors ${p.key === 'instagram'
                                                                            ? 'text-pink-500 group-hover:text-pink-600'
                                                                            : 'text-gray-500 group-hover:text-indigo-600'
                                                                            }`}>
                                                                            Click to upload image
                                                                        </p>
                                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                                            JPG, PNG, WebP · Max 10MB
                                                                        </p>
                                                                    </label>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    )}

                                    {selectedPlatforms.length === 0 && (
                                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                                            <div className="text-3xl mb-2">👆</div>
                                            <p className="text-sm text-gray-500">Select a platform above to start writing</p>
                                        </div>
                                    )}

                                    {/* Image URL */}
                                    {/* <div>
                                        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                                            <Icon name="image" size={14} className="text-gray-400" />
                                            Image URL
                                            <span className="text-xs text-gray-400 font-normal">(required for Instagram)</span>
                                        </label>
                                        <input
                                            type="url"
                                            value={image}
                                            onChange={e => setImage(e.target.value)}
                                            placeholder="https://example.com/image.jpg"
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition-all"
                                        />
                                    </div> */}

                                    {/* Post mode */}
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">When to post:</p>
                                        <div className="flex gap-2">
                                            {[
                                                { key: 'immediate', label: 'Post now', icon: 'rocket' },
                                                { key: 'schedule', label: 'Schedule', icon: 'calendar' },
                                            ].map(mode => (
                                                <button
                                                    key={mode.key}
                                                    onClick={() => setPostMode(mode.key)}
                                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${postMode === mode.key
                                                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <Icon name={mode.icon} size={14} />
                                                    {mode.label}
                                                </button>
                                            ))}
                                        </div>
                                        {postMode === 'schedule' && (
                                            <div className="mt-3">
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Schedule date & time</label>
                                                <input
                                                    type="datetime-local"
                                                    value={scheduledAt}
                                                    onChange={e => setScheduledAt(e.target.value)}
                                                    min={new Date().toISOString().slice(0, 16)}
                                                    className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Post result */}
                                    {postResult && (
                                        <div className={`rounded-xl p-4 text-sm border ${postResult.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
                                            }`}>
                                            <p className="font-semibold mb-1">{postResult.message}</p>
                                            {postResult.platforms && (
                                                <div className="space-y-0.5 mt-2">
                                                    {Object.entries(postResult.platforms).map(([key, val]) => {
                                                        if (!val?.status) return null;
                                                        const PIcon = PLATFORM_ICON[key];
                                                        return (
                                                            <p key={key} className="text-xs flex items-center gap-1.5">
                                                                {PIcon && <PIcon size={12} />}
                                                                {key}: {val.status === 'published' ? '✅' : '❌'} {val.status}
                                                                {val.error && ` — ${val.error}`}
                                                            </p>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Publish button */}
                                    <button
                                        onClick={handlePublish}
                                        disabled={postLoading}
                                        className={`w-full py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${postLoading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:-translate-y-0.5'
                                            }`}
                                    >
                                        {postLoading ? (
                                            <>
                                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                                                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                {postMode === 'schedule' ? 'Scheduling...' : 'Publishing...'}
                                            </>
                                        ) : postMode === 'schedule' ? (
                                            <><Icon name="calendar" size={16} /> Schedule post</>
                                        ) : (
                                            <><Icon name="rocket" size={16} /> Publish now</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── SCHEDULED / PUBLISHED TABS ────────────────── */}
                    {(activeTab === 'scheduled' || activeTab === 'published') && (
                        <div className="bg-white rounded-2xl border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-gray-900">
                                    {activeTab === 'scheduled' ? 'Scheduled Posts' : 'Published Posts'}
                                </h2>
                                <button onClick={() => fetchPosts(activeTab === 'scheduled' ? 'draft' : 'published')} className="text-gray-400 hover:text-indigo-500 transition-colors">
                                    <Icon name="refresh" size={16} />
                                </button>
                            </div>
                            <div className="p-6">
                                {postsLoading ? (
                                    <div className="space-y-3">
                                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20" />)}
                                    </div>
                                ) : posts.length === 0 ? (
                                    <div className="text-center py-16">
                                        <div className="text-4xl mb-3">{activeTab === 'scheduled' ? '📅' : '✅'}</div>
                                        <p className="text-gray-500 text-sm font-medium">No {activeTab} posts yet</p>
                                        <p className="text-gray-400 text-xs mt-1">
                                            {activeTab === 'scheduled' ? 'Schedule a post from the Compose tab' : 'Your published posts will appear here'}
                                        </p>
                                        <button
                                            onClick={() => setActiveTab('compose')}
                                            className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
                                        >
                                            Go to Compose →
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {posts.map(post => (
                                            <div key={post._id} className="border border-gray-200 rounded-xl p-4 hover:border-indigo-200 transition-colors">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex gap-2">
                                                        {PLATFORMS.map(p => {
                                                            const PIcon = PLATFORM_ICON[p.key];
                                                            return post.platforms[p.key]?.enabled ? <PIcon key={p.key} size={18} /> : null;
                                                        })}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${post.overallStatus === 'published' ? 'bg-green-100 text-green-700' :
                                                            post.overallStatus === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                                                                post.overallStatus === 'partial' ? 'bg-orange-100 text-orange-700' :
                                                                    'bg-red-100 text-red-700'
                                                            }`}>
                                                            {post.overallStatus}
                                                        </span>
                                                        {post.scheduledAt && (
                                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                                <Icon name="calendar" size={11} />
                                                                {new Date(post.scheduledAt).toLocaleString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {PLATFORMS.map(p => {
                                                    if (!post.platforms[p.key]?.content) return null;
                                                    const PIcon = PLATFORM_ICON[p.key];
                                                    return (
                                                        <p key={p.key} className="text-sm text-gray-600 truncate flex items-center gap-1.5 mb-1">
                                                            <PIcon size={13} />
                                                            <span className="font-medium text-gray-700">{p.label}:</span>
                                                            {post.platforms[p.key].content}
                                                        </p>
                                                    );
                                                })}
                                                <p className="text-xs text-gray-400 mt-2">
                                                    Created {new Date(post.createdAt).toLocaleString()}
                                                </p>

                                                {/* Cancel button — only for scheduled draft posts */}
                                                {activeTab === 'scheduled' && post.overallStatus === 'draft' && (
                                                    <button
                                                        onClick={() => cancelScheduledPost(post._id)}
                                                        className="mt-3 w-full text-xs py-2 rounded-lg text-red-500 border border-red-200 hover:bg-red-50 transition-colors font-medium flex items-center justify-center gap-1.5"
                                                    >
                                                        🗑️ Cancel scheduled post
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}