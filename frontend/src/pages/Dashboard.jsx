// src/pages/Dashboard.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  GlobalFonts,
  OSLogo,
  Skeleton,
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterXIcon,
} from "../utils/design";

// ── Toast ─────────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3500,
    );
  };
  return {
    toasts,
    success: (m) => add(m, "success"),
    error: (m) => add(m, "error"),
    info: (m) => add(m, "info"),
  };
}
function ToastContainer({ toasts }) {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium pointer-events-auto max-w-xs font-display
                    ${
                      t.type === "success"
                        ? "bg-[#1A312C] text-[#89D7B7] border border-[#89D7B7]/20"
                        : t.type === "error"
                          ? "bg-red-600 text-white"
                          : "bg-[#428475] text-white"
                    }`}
        >
          <span>
            {t.type === "success" ? "✅" : t.type === "error" ? "❌" : "ℹ️"}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ── Icon helper ───────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, className = "" }) => {
  const icons = {
    compose: (
      <>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
    check: <polyline points="20 6 9 17 4 12" />,
    analytics: (
      <>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </>
    ),
    refresh: (
      <>
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </>
    ),
    rocket: (
      <>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </>
    ),
    sparkle: (
      <>
        <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
        <path d="M19 16L19.75 18.25L22 19L19.75 19.75L19 22L18.25 19.75L16 19L18.25 18.25L19 16Z" />
      </>
    ),
    image: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </>
    ),
    x: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
    menu: (
      <>
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {icons[name]}
    </svg>
  );
};

const PLATFORM_ICON = {
  linkedin: LinkedInIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  twitter: TwitterXIcon,
};

const PLATFORMS = [
  {
    key: "linkedin",
    label: "LinkedIn",
    authUrl: `${import.meta.env.VITE_API_URL}/api/linkedin/auth`,
    statusApi: "/api/linkedin/status",
    disconnectUrl: "/api/linkedin/disconnect",
    charLimit: 3000,
    placeholder: "Write professional content for LinkedIn…",
    accent: "border-blue-400",
    light: "bg-blue-50",
  },
  {
    key: "facebook",
    label: "Facebook",
    authUrl: `${import.meta.env.VITE_API_URL}/api/facebook/auth`,
    statusApi: "/api/facebook/status",
    disconnectUrl: "/api/facebook/disconnect",
    charLimit: 63000,
    placeholder: "Write conversational content for Facebook…",
    accent: "border-blue-600",
    light: "bg-blue-50",
  },
  {
    key: "instagram",
    label: "Instagram",
    authUrl: `${import.meta.env.VITE_API_URL}/api/facebook/auth`,
    statusApi: "/api/instagram/status",
    disconnectUrl: "/api/facebook/disconnect",
    charLimit: 2200,
    placeholder: "Write casual content with hashtags for Instagram…",
    accent: "border-pink-400",
    light: "bg-pink-50",
  },
  {
    key: "twitter",
    label: "Twitter/X",
    authUrl: `${import.meta.env.VITE_API_URL}/api/twitter/auth`,
    statusApi: "/api/twitter/status",
    charLimit: 280,
    placeholder: "Write short punchy content for Twitter…",
    accent: "border-gray-500",
    light: "bg-gray-50",
    comingSoon: true,
  },
];

const TONES = [
  { key: "professional", label: "💼 Professional" },
  { key: "casual", label: "😊 Casual" },
  { key: "funny", label: "😂 Funny" },
  { key: "inspirational", label: "🌟 Inspirational" },
  { key: "educational", label: "📚 Educational" },
];

const NAV_ITEMS = [
  { key: "compose", label: "Compose", icon: "compose" },
  { key: "scheduled", label: "Scheduled", icon: "calendar" },
  { key: "published", label: "Published", icon: "check" },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [connections, setConnections] = useState({
    linkedin: { isConnected: false, info: "" },
    facebook: { isConnected: false, info: "" },
    instagram: { isConnected: false, info: "" },
    twitter: { isConnected: false, info: "" },
  });
  const [selected, setSelected] = useState({
    linkedin: false,
    facebook: false,
    instagram: false,
    twitter: false,
  });
  const [content, setContent] = useState({
    linkedin: { content: "", imageUrl: "" },
    facebook: { content: "", imageUrl: "" },
    instagram: { content: "", imageUrl: "" },
    twitter: { content: "", imageUrl: "" },
  });
  const [scheduledAt, setScheduledAt] = useState("");
  const [postMode, setPostMode] = useState("immediate");
  const [statusLoading, setStatusLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(false);
  const [postResult, setPostResult] = useState(null);
  const [activeTab, setActiveTab] = useState("compose");
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiTone, setAiTone] = useState("professional");
  const [aiPlatforms, setAiPlatforms] = useState([]);
  const [aiCaptions, setAiCaptions] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeComposePlatform, setActiveComposePlatform] = useState(null);
  const [platformImages, setPlatformImages] = useState({
    linkedin: { file: null, preview: null, url: "" },
    facebook: { file: null, preview: null, url: "" },
    instagram: { file: null, preview: null, url: "" },
    twitter: { file: null, preview: null, url: "" },
  });
  const [uploadingImage, setUploadingImage] = useState({
    linkedin: false,
    facebook: false,
    instagram: false,
    twitter: false,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("linkedin") === "connected")
      toast.success("LinkedIn connected!");
    if (params.get("linkedin") === "failed")
      toast.error("LinkedIn connection failed");
    if (params.get("facebook") === "connected")
      toast.success("Facebook & Instagram connected!");
    if (params.get("facebook") === "no_pages")
      toast.error("No Facebook Pages found.");
    if (params.get("facebook") === "failed")
      toast.error("Facebook connection failed");
    window.history.replaceState({}, document.title, "/dashboard");
    fetchAllStatuses();
    fetchCurrentUser();
  }, []);

  const fetchAllStatuses = async () => {
    setStatusLoading(true);
    try {
      const [liRes, fbRes] = await Promise.allSettled([
        API.get("/api/linkedin/status"),
        API.get("/api/facebook/status"),
      ]);
      if (liRes.status === "fulfilled") {
        const d = liRes.value.data;
        setConnections((p) => ({
          ...p,
          linkedin: {
            isConnected: d.isConnected,
            info: d.isConnected
              ? `Connected as ${d.name || "LinkedIn User"}`
              : "",
          },
        }));
      }
      if (fbRes.status === "fulfilled") {
        const d = fbRes.value.data;
        setConnections((p) => ({
          ...p,
          facebook: {
            isConnected: d.isConnected,
            info: d.isConnected ? `Page: ${d.pageName || "Facebook Page"}` : "",
          },
          instagram: {
            isConnected: !!d.instagramAccountId,
            info: d.instagramAccountId
              ? `@${d.instagramUsername || "Instagram"}`
              : "",
          },
        }));
      }
    } catch {
      toast.error("Failed to refresh platform statuses");
    } finally {
      setStatusLoading(false);
    }
  };

  const fetchPosts = async (status) => {
    setPostsLoading(true);
    try {
      const res = await API.get(`/api/posts/status/${status}`);
      setPosts(res.data.posts || []);
    } catch {
      toast.error("Failed to load posts");
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await API.get("/api/auth/me");
      setCurrentUser(res.data.user);
    } catch {
      console.error("Failed to fetch user");
    }
  };

  const disconnectPlatform = async (key) => {
    const p = PLATFORMS.find((pl) => pl.key === key);
    if (!p?.disconnectUrl) return;
    try {
      await API.patch(p.disconnectUrl);
      await fetchAllStatuses();
      toast.success(`${p.label} disconnected`);
    } catch {
      toast.error(`Failed to disconnect ${p.label}`);
    }
  };

  const handlePublish = async () => {
    const anySelected = Object.values(selected).some((v) => v);
    if (!anySelected) {
      toast.error("Select at least one platform");
      return;
    }
    for (const p of PLATFORMS) {
      if (selected[p.key] && !content[p.key].content.trim()) {
        toast.error(`Add content for ${p.label}`);
        return;
      }
    }
    if (postMode === "schedule" && !scheduledAt) {
      toast.error("Pick a date and time to schedule");
      return;
    }
    if (selected.instagram && !content.instagram.imageUrl.trim()) {
      toast.error("Instagram requires an image URL");
      return;
    }
    try {
      setPostLoading(true);
      setPostResult(null);
      const endpoint =
        postMode === "schedule"
          ? "/api/posts/schedule-post"
          : "/api/posts/create-post";
      const platformsPayload = {};
      PLATFORMS.forEach((p) => {
        platformsPayload[p.key] = {
          enabled: selected[p.key] || false,
          content: content[p.key].content || "",
          imageUrl: content[p.key].imageUrl || "",
        };
      });
      const body = { platforms: platformsPayload };
      if (postMode === "schedule") body.scheduledAt = scheduledAt;
      const res = await API.post(endpoint, body);
      setPostResult(res.data);
      if (res.data.success) {
        toast.success(
          postMode === "schedule" ? "Post scheduled!" : "Post published!",
        );
        setContent({
          linkedin: { content: "", imageUrl: "" },
          facebook: { content: "", imageUrl: "" },
          instagram: { content: "", imageUrl: "" },
          twitter: { content: "", imageUrl: "" },
        });
        setSelected({
          linkedin: false,
          facebook: false,
          instagram: false,
          twitter: false,
        });
        setScheduledAt("");
        setActiveComposePlatform(null);
        setPlatformImages({
          linkedin: { file: null, preview: null, url: "" },
          facebook: { file: null, preview: null, url: "" },
          instagram: { file: null, preview: null, url: "" },
          twitter: { file: null, preview: null, url: "" },
        });
      } else {
        toast.error(res.data.message || "Some platforms failed");
      }
    } catch (err) {
      const d = err.response?.data;
      toast.error(
        d?.error || d?.errors?.join(", ") || d?.message || "Post failed",
      );
    } finally {
      setPostLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await API.post("/api/auth/logout");
    } catch {}
    navigate("/login");
  };

  const cancelScheduledPost = async (postId) => {
    if (!window.confirm("Cancel this scheduled post?")) return;
    try {
      await API.delete(`/api/posts/cancel/schedule/${postId}`);
      toast.success("Scheduled post cancelled");
      fetchPosts("draft");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to cancel post");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    if (tab === "scheduled") fetchPosts("draft");
    if (tab === "published") fetchPosts("published");
  };

  const handleGenerateCaptions = async () => {
    if (!aiTopic.trim()) {
      toast.error("Enter a topic first");
      return;
    }
    if (aiPlatforms.length === 0) {
      toast.error("Select at least one platform");
      return;
    }
    try {
      setAiLoading(true);
      setAiCaptions(null);
      const res = await API.post("/api/ai/generate-captions", {
        topic: aiTopic,
        tone: aiTone,
        platforms: aiPlatforms,
      });
      setAiCaptions(res.data.captions);
      toast.success("Captions generated!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to generate captions");
    } finally {
      setAiLoading(false);
    }
  };

  const useCaption = (platform, caption) => {
    setContent((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], content: caption },
    }));
    setSelected((prev) => ({ ...prev, [platform]: true }));
    setActiveComposePlatform(platform);
    toast.success(`Caption applied to ${platform}`);
  };

  const togglePlatform = (key) => {
    const conn = connections[key];
    if (!conn.isConnected) {
      toast.error(
        `Connect ${PLATFORMS.find((p) => p.key === key)?.label} first`,
      );
      return;
    }
    setSelected((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (next[key] && !activeComposePlatform) setActiveComposePlatform(key);
      if (!next[key] && activeComposePlatform === key) {
        const still = Object.keys(next).find((k) => next[k]);
        setActiveComposePlatform(still || null);
      }
      return next;
    });
  };

  const handleImageUpload = async (platformKey, file) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG, WebP or GIF");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      return;
    }
    const preview = URL.createObjectURL(file);
    setPlatformImages((p) => ({
      ...p,
      [platformKey]: { file, preview, url: "" },
    }));
    try {
      setUploadingImage((p) => ({ ...p, [platformKey]: true }));
      const fd = new FormData();
      fd.append("image", file);
      const res = await API.post("/api/upload/image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPlatformImages((p) => ({
        ...p,
        [platformKey]: { file, preview, url: res.data.url },
      }));
      setContent((p) => ({
        ...p,
        [platformKey]: { ...p[platformKey], imageUrl: res.data.url },
      }));
      toast.success("Image uploaded ✅");
    } catch (err) {
      toast.error(err.response?.data?.error || "Image upload failed");
      setPlatformImages((p) => ({
        ...p,
        [platformKey]: { file: null, preview: null, url: "" },
      }));
    } finally {
      setUploadingImage((p) => ({ ...p, [platformKey]: false }));
    }
  };

  const removeImage = (key) => {
    setPlatformImages((p) => ({
      ...p,
      [key]: { file: null, preview: null, url: "" },
    }));
    setContent((p) => ({ ...p, [key]: { ...p[key], imageUrl: "" } }));
  };

  const connectedCount = Object.values(connections).filter(
    (c) => c.isConnected,
  ).length;
  const selectedPlatforms = PLATFORMS.filter((p) => selected[p.key]);

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? "p-6" : "p-5"}`}>
      {/* Logo + user */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2.5">
          {currentUser?.profilePic ? (
            <img
              src={currentUser.profilePic}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#89D7B7]/30"
              onError={(e) => (e.target.style.display = "none")}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#89D7B7] flex items-center justify-center font-display font-bold text-[#1A312C]">
              {currentUser?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-white leading-none truncate max-w-[120px] font-display">
              {currentUser?.name || "Loading…"}
            </p>
            <p className="text-xs text-[#89D7B7]/45 leading-none mt-0.5">
              {currentUser?.email || "Dashboard"}
            </p>
          </div>
        </div>
        {mobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-[#89D7B7]/50 hover:text-[#89D7B7] transition-colors"
          >
            <Icon name="x" size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <div className="mb-6">
        <p className="font-mono-os text-[9px] text-[#89D7B7]/30 uppercase tracking-widest mb-2 px-2">
          Menu
        </p>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => handleTabChange(item.key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 mb-1
                            ${
                              activeTab === item.key
                                ? "bg-[#89D7B7] text-[#1A312C] font-semibold shadow-sm"
                                : "text-[#89D7B7]/60 hover:bg-[#89D7B7]/10 hover:text-[#89D7B7]"
                            }`}
          >
            <Icon name={item.icon} size={16} />
            {item.label}
          </button>
        ))}
        <button
          onClick={() => navigate("/analytics")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#89D7B7]/60 hover:bg-[#89D7B7]/10 hover:text-[#89D7B7] transition-all duration-150 mb-1"
        >
          <Icon name="analytics" size={16} />
          Analytics
        </button>
        {/* ── Superadmin Panel button — only visible to Superadmin ── */}
        {currentUser?.role === "Superadmin" && (
          <button
            onClick={() => navigate("/admin")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 mb-1 bg-[#89D7B7]/15 text-[#89D7B7] hover:bg-[#89D7B7]/25 border border-[#89D7B7]/20"
          >
            {/* crown icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 20h20M5 20V10l7-7 7 7v10" />
              <path d="M9 20v-5h6v5" />
            </svg>
            Superadmin Panel
            <span className="ml-auto text-[9px] bg-[#89D7B7] text-[#1A312C] px-1.5 py-0.5 rounded-full font-bold font-mono-os">
              SA
            </span>
          </button>
        )}
      </div>

      {/* Platforms */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2 px-2">
          <p className="font-mono-os text-[9px] text-[#89D7B7]/30 uppercase tracking-widest">
            Platforms
          </p>
          <button
            onClick={fetchAllStatuses}
            className="text-[#89D7B7]/30 hover:text-[#89D7B7] transition-colors"
          >
            <Icon name="refresh" size={13} />
          </button>
        </div>
        {statusLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 bg-[#89D7B7]/10" />
            ))}
          </div>
        ) : (
          PLATFORMS.filter((p) => !p.comingSoon).map((p) => {
            const conn = connections[p.key];
            const PIcon = PLATFORM_ICON[p.key];
            return (
              <div
                key={p.key}
                className="flex items-center justify-between px-3 py-2 rounded-xl mb-1 hover:bg-[#89D7B7]/8"
              >
                <div className="flex items-center gap-2.5">
                  <PIcon size={16} />
                  <div>
                    <p className="text-xs font-medium text-[#89D7B7]/80">
                      {p.label}
                    </p>
                    {conn.isConnected && (
                      <p className="text-[10px] text-[#89D7B7]/40 truncate max-w-[90px]">
                        {conn.info}
                      </p>
                    )}
                  </div>
                </div>
                {conn.isConnected ? (
                  <button
                    onClick={() => disconnectPlatform(p.key)}
                    className="text-[10px] text-red-400 hover:text-red-300 font-medium transition-colors"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => (window.location.href = p.authUrl)}
                    className="text-[10px] text-[#89D7B7] hover:text-white font-semibold transition-colors"
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
              <span className="text-[10px] text-[#89D7B7]/35">
                {connectedCount} of 3 connected
              </span>
              <span className="text-[10px] font-medium text-[#89D7B7]/60">
                {Math.round((connectedCount / 3) * 100)}%
              </span>
            </div>
            <div className="h-1 bg-[#89D7B7]/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#89D7B7] rounded-full transition-all duration-500"
                style={{ width: `${(connectedCount / 3) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="mt-auto pt-4 border-t border-[#89D7B7]/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          <Icon name="logout" size={16} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF4E1] flex">
      <GlobalFonts />
      <ToastContainer toasts={toast.toasts} />

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1A312C] fixed top-0 left-0 h-screen overflow-y-auto z-30">
        <div className="p-5 border-b border-[#89D7B7]/10">
          <div className="flex items-center gap-2">
            <OSLogo size={28} />
            <span className="font-display font-semibold text-white text-sm">
              OneSocial
            </span>
          </div>
        </div>
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-72 bg-[#1A312C] h-full overflow-y-auto z-50">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Mobile topbar */}
        <div className="lg:hidden sticky top-0 z-20 bg-[#FFF4E1] border-b border-[#1A312C]/10 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-[#1A312C]/8"
          >
            <Icon name="menu" size={20} className="text-[#1A312C]" />
          </button>
          <div className="flex items-center gap-2">
            <OSLogo size={24} />
            <span className="font-display font-semibold text-sm text-[#1A312C]">
              {currentUser?.name || "OneSocial"}
            </span>
          </div>
          <div className="w-8" />
        </div>

        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl font-bold text-[#1A312C]">
                {activeTab === "compose"
                  ? "Compose Post"
                  : activeTab === "scheduled"
                    ? "Scheduled Posts"
                    : "Published Posts"}
              </h1>
              <p className="text-sm text-[#428475] mt-1">
                {activeTab === "compose"
                  ? "Create and publish to your connected platforms"
                  : activeTab === "scheduled"
                    ? "Posts waiting to be published"
                    : "Your publishing history"}
              </p>
            </div>
            {activeTab === "compose" && (
              <div className="hidden sm:flex items-center gap-2">
                {PLATFORMS.filter((p) => !p.comingSoon).map((p) => {
                  const conn = connections[p.key];
                  const PIcon = PLATFORM_ICON[p.key];
                  return (
                    <div
                      key={p.key}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                                            ${conn.isConnected ? "border-[#89D7B7]/40 bg-[#89D7B7]/10 text-[#428475]" : "border-[#1A312C]/10 bg-[#1A312C]/5 text-[#428475]/40"}`}
                    >
                      <PIcon size={13} />
                      {conn.isConnected ? "●" : "○"}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── COMPOSE ────────────────────────────────────────── */}
          {activeTab === "compose" && (
            <div className="space-y-6">
              {/* AI generator */}
              <div className="bg-[#1A312C] rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-[#89D7B7]/10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#89D7B7] flex items-center justify-center">
                    <Icon
                      name="sparkle"
                      size={16}
                      className="text-[#1A312C] stroke-[#1A312C]"
                    />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white font-display">
                      AI Caption Generator
                    </h2>
                    <p className="text-xs text-[#89D7B7]/50">
                      Describe your idea, get captions for each platform
                    </p>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#89D7B7]/70 mb-1.5 font-display uppercase tracking-wide">
                      Your topic or idea
                    </label>
                    <input
                      type="text"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleGenerateCaptions()
                      }
                      placeholder="e.g. We just launched our new product!"
                      className="w-full bg-[#89D7B7]/8 border border-[#89D7B7]/15 rounded-xl px-4 py-3 text-sm text-white placeholder-[#89D7B7]/30 outline-none focus:border-[#89D7B7]/40 focus:ring-2 focus:ring-[#89D7B7]/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#89D7B7]/70 mb-2 font-display uppercase tracking-wide">
                      Tone
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TONES.map((t) => (
                        <button
                          key={t.key}
                          onClick={() => setAiTone(t.key)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                                                        ${aiTone === t.key ? "border-[#89D7B7] bg-[#89D7B7] text-[#1A312C]" : "border-[#89D7B7]/15 text-[#89D7B7]/55 hover:border-[#89D7B7]/30"}`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#89D7B7]/70 mb-2 font-display uppercase tracking-wide">
                      Generate for
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PLATFORMS.filter((p) => !p.comingSoon).map((p) => {
                        const PIcon = PLATFORM_ICON[p.key];
                        const checked = aiPlatforms.includes(p.key);
                        return (
                          <button
                            key={p.key}
                            onClick={() =>
                              setAiPlatforms((prev) =>
                                prev.includes(p.key)
                                  ? prev.filter((x) => x !== p.key)
                                  : [...prev, p.key],
                              )
                            }
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                                                            ${checked ? "border-[#89D7B7] bg-[#89D7B7]/15 text-[#89D7B7]" : "border-[#89D7B7]/15 text-[#89D7B7]/55 hover:border-[#89D7B7]/30"}`}
                          >
                            <PIcon size={13} />
                            {p.label}
                            {checked && (
                              <Icon
                                name="check"
                                size={11}
                                className="text-[#89D7B7]"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <button
                    onClick={handleGenerateCaptions}
                    disabled={aiLoading}
                    className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 font-display
                                            ${aiLoading ? "bg-[#89D7B7]/30 text-[#89D7B7]/50 cursor-not-allowed" : "bg-[#89D7B7] text-[#1A312C] hover:brightness-105 hover:-translate-y-0.5"}`}
                  >
                    {aiLoading ? (
                      <>
                        <svg
                          className="animate-spin w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Generating…
                      </>
                    ) : (
                      "✨ Generate captions"
                    )}
                  </button>
                  {aiCaptions && (
                    <div className="space-y-5 pt-2">
                      {Object.entries(aiCaptions).map(
                        ([platform, captions]) => {
                          const p = PLATFORMS.find((pl) => pl.key === platform);
                          const PIcon = PLATFORM_ICON[platform];
                          return (
                            <div key={platform}>
                              <div className="flex items-center gap-2 mb-2">
                                <PIcon size={15} />
                                <span className="text-sm font-semibold text-white font-display">
                                  {p?.label} captions
                                </span>
                              </div>
                              <div className="space-y-2">
                                {captions.map((c) => (
                                  <div
                                    key={c.id}
                                    className="border border-[#89D7B7]/15 rounded-xl p-4 hover:border-[#89D7B7]/30 transition-colors bg-[#89D7B7]/5"
                                  >
                                    <p className="text-sm text-[#89D7B7]/80 mb-3 leading-relaxed">
                                      {c.caption}
                                    </p>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-[#89D7B7]/35 font-mono-os">
                                        {c.charCount} chars
                                      </span>
                                      <button
                                        onClick={() =>
                                          useCaption(platform, c.caption)
                                        }
                                        className="text-xs bg-[#89D7B7] text-[#1A312C] px-3 py-1.5 rounded-lg hover:brightness-105 transition-colors font-semibold font-display"
                                      >
                                        Use this →
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Composer */}
              <div className="bg-white rounded-2xl border-2 border-[#1A312C]/8 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#1A312C]/8 bg-[#FFF4E1]">
                  <h2 className="text-sm font-semibold text-[#1A312C] font-display">
                    Create Post
                  </h2>
                  <p className="text-xs text-[#428475] mt-0.5">
                    Select platforms and write your content
                  </p>
                </div>
                <div className="p-6 space-y-5">
                  {/* Platform selector */}
                  <div>
                    <p className="text-sm font-semibold text-[#1A312C] mb-2 font-display">
                      Post to:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {PLATFORMS.map((p) => {
                        const conn = connections[p.key];
                        const PIcon = PLATFORM_ICON[p.key];
                        const isSel = selected[p.key];
                        return (
                          <button
                            key={p.key}
                            onClick={() =>
                              !p.comingSoon && togglePlatform(p.key)
                            }
                            disabled={p.comingSoon || !conn.isConnected}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-150
                                                            ${
                                                              p.comingSoon ||
                                                              !conn.isConnected
                                                                ? "border-[#1A312C]/8 bg-[#1A312C]/3 text-[#428475]/40 cursor-not-allowed"
                                                                : isSel
                                                                  ? "border-[#428475] bg-[#89D7B7]/15 text-[#1A312C]"
                                                                  : "border-[#1A312C]/12 bg-white text-[#428475] hover:border-[#428475]/40"
                                                            }`}
                          >
                            <PIcon size={15} />
                            {p.label}
                            {p.comingSoon && (
                              <span className="text-[9px] bg-[#1A312C]/8 text-[#428475]/60 px-1.5 py-0.5 rounded-full font-mono-os">
                                Soon
                              </span>
                            )}
                            {!p.comingSoon && !conn.isConnected && (
                              <span className="text-[10px] text-[#428475]/40">
                                · not connected
                              </span>
                            )}
                            {isSel && (
                              <Icon
                                name="check"
                                size={12}
                                className="text-[#428475]"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Per-platform composer */}
                  {selectedPlatforms.length > 0 && (
                    <div>
                      {selectedPlatforms.length > 1 && (
                        <div className="flex gap-1 mb-3 bg-[#1A312C]/5 p-1 rounded-xl w-fit">
                          {selectedPlatforms.map((p) => {
                            const PIcon = PLATFORM_ICON[p.key];
                            return (
                              <button
                                key={p.key}
                                onClick={() => setActiveComposePlatform(p.key)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                                                                    ${activeComposePlatform === p.key ? "bg-white shadow-sm text-[#1A312C]" : "text-[#428475] hover:text-[#1A312C]"}`}
                              >
                                <PIcon size={12} />
                                {p.label}
                                {content[p.key].content && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#89D7B7]" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {selectedPlatforms.map((p) => {
                        const showThis =
                          selectedPlatforms.length === 1 ||
                          activeComposePlatform === p.key ||
                          (!activeComposePlatform &&
                            p.key === selectedPlatforms[0].key);
                        if (!showThis) return null;
                        const PIcon = PLATFORM_ICON[p.key];
                        return (
                          <div key={p.key}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-1.5">
                                <PIcon size={14} />
                                <span className="text-xs font-medium text-[#428475] font-display">
                                  {p.label} content
                                </span>
                              </div>
                              <span
                                className={`text-xs font-mono-os ${content[p.key].content.length > p.charLimit * 0.9 ? "text-red-500" : "text-[#428475]/50"}`}
                              >
                                {content[p.key].content.length}/
                                {p.charLimit.toLocaleString()}
                              </span>
                            </div>
                            <textarea
                              value={content[p.key].content}
                              onChange={(e) =>
                                setContent((prev) => ({
                                  ...prev,
                                  [p.key]: {
                                    ...prev[p.key],
                                    content: e.target.value,
                                  },
                                }))
                              }
                              placeholder={p.placeholder}
                              maxLength={p.charLimit}
                              rows={5}
                              className="w-full border-2 border-[#1A312C]/12 rounded-xl p-4 text-sm text-[#1A312C] placeholder-[#428475]/40 outline-none focus:border-[#428475] focus:ring-2 focus:ring-[#89D7B7]/15 resize-none transition-all bg-[#FFF4E1]/50"
                            />
                            {/* Image upload */}
                            <div className="mt-3">
                              <label className="block text-xs font-semibold text-[#428475] mb-2 font-display">
                                Image{" "}
                                {p.key === "instagram" ? (
                                  <span className="text-red-500 ml-1">
                                    * required
                                  </span>
                                ) : (
                                  <span className="text-[#428475]/50 ml-1">
                                    (optional)
                                  </span>
                                )}
                              </label>
                              {platformImages[p.key]?.preview ? (
                                <div className="relative rounded-xl overflow-hidden border-2 border-[#1A312C]/12">
                                  <img
                                    src={platformImages[p.key].preview}
                                    alt="Preview"
                                    className="w-full h-40 object-cover"
                                  />
                                  {uploadingImage[p.key] && (
                                    <div className="absolute inset-0 bg-[#1A312C]/60 flex flex-col items-center justify-center gap-2">
                                      <svg
                                        className="animate-spin w-6 h-6 text-[#89D7B7]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                      >
                                        <circle
                                          className="opacity-25"
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          stroke="currentColor"
                                          strokeWidth="4"
                                        />
                                        <path
                                          className="opacity-75"
                                          fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                      </svg>
                                      <span className="text-[#89D7B7] text-xs font-medium">
                                        Uploading…
                                      </span>
                                    </div>
                                  )}
                                  {!uploadingImage[p.key] &&
                                    platformImages[p.key]?.url && (
                                      <div className="absolute bottom-2 left-2 bg-[#1A312C] text-[#89D7B7] text-xs px-2 py-1 rounded-lg font-medium flex items-center gap-1 font-display">
                                        ✅ Ready
                                      </div>
                                    )}
                                  {!uploadingImage[p.key] && (
                                    <button
                                      onClick={() => removeImage(p.key)}
                                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <label
                                  className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all group
                                                                    ${p.key === "instagram" ? "border-[#89D7B7]/30 hover:border-[#89D7B7] hover:bg-[#89D7B7]/5" : "border-[#1A312C]/12 hover:border-[#428475]/40 hover:bg-[#428475]/5"}`}
                                >
                                  <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleImageUpload(
                                        p.key,
                                        e.target.files[0],
                                      )
                                    }
                                  />
                                  <div className="text-2xl mb-1">🖼️</div>
                                  <p className="text-xs font-medium text-[#428475] group-hover:text-[#1A312C] transition-colors font-display">
                                    Click to upload image
                                  </p>
                                  <p className="text-[10px] text-[#428475]/50 mt-0.5 font-mono-os">
                                    JPG, PNG, WebP · Max 10MB
                                  </p>
                                </label>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {selectedPlatforms.length === 0 && (
                    <div className="border-2 border-dashed border-[#1A312C]/10 rounded-xl p-8 text-center bg-[#1A312C]/3">
                      <div className="text-3xl mb-2">👆</div>
                      <p className="text-sm text-[#428475]">
                        Select a platform above to start writing
                      </p>
                    </div>
                  )}

                  {/* Post mode */}
                  <div>
                    <p className="text-sm font-semibold text-[#1A312C] mb-2 font-display">
                      When to post:
                    </p>
                    <div className="flex gap-2">
                      {[
                        { key: "immediate", label: "Post now", icon: "rocket" },
                        {
                          key: "schedule",
                          label: "Schedule",
                          icon: "calendar",
                        },
                      ].map((mode) => (
                        <button
                          key={mode.key}
                          onClick={() => setPostMode(mode.key)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all font-display
                                                        ${postMode === mode.key ? "border-[#1A312C] bg-[#1A312C] text-[#89D7B7]" : "border-[#1A312C]/15 bg-white text-[#428475] hover:border-[#428475]/40"}`}
                        >
                          <Icon name={mode.icon} size={14} />
                          {mode.label}
                        </button>
                      ))}
                    </div>
                    {postMode === "schedule" && (
                      <div className="mt-3">
                        <label className="block text-sm font-semibold text-[#1A312C] mb-1.5 font-display">
                          Schedule date & time
                        </label>
                        <input
                          type="datetime-local"
                          value={scheduledAt}
                          onChange={(e) => setScheduledAt(e.target.value)}
                          min={new Date().toISOString().slice(0, 16)}
                          className="border-2 border-[#1A312C]/15 rounded-xl px-4 py-2.5 text-sm text-[#1A312C] outline-none focus:border-[#428475] focus:ring-2 focus:ring-[#89D7B7]/15 bg-white transition-all"
                        />
                      </div>
                    )}
                  </div>

                  {/* Post result */}
                  {postResult && (
                    <div
                      className={`rounded-xl p-4 text-sm border-2 font-display
                                            ${postResult.success ? "bg-[#89D7B7]/10 border-[#89D7B7]/30 text-[#1A312C]" : "bg-red-50 border-red-200 text-red-800"}`}
                    >
                      <p className="font-semibold mb-1">{postResult.message}</p>
                      {postResult.platforms && (
                        <div className="space-y-0.5 mt-2">
                          {Object.entries(postResult.platforms).map(
                            ([key, val]) => {
                              if (!val?.status) return null;
                              const PIcon = PLATFORM_ICON[key];
                              return (
                                <p
                                  key={key}
                                  className="text-xs flex items-center gap-1.5 font-mono-os"
                                >
                                  {PIcon && <PIcon size={11} />}
                                  {key}:{" "}
                                  {val.status === "published" ? "✅" : "❌"}{" "}
                                  {val.status}
                                  {val.error && ` — ${val.error}`}
                                </p>
                              );
                            },
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Publish button */}
                  <button
                    onClick={handlePublish}
                    disabled={postLoading}
                    className={`w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 font-display
                                            ${postLoading ? "bg-[#428475]/40 text-[#1A312C]/40 cursor-not-allowed" : "bg-[#1A312C] text-[#89D7B7] hover:brightness-110 shadow-lg shadow-[#1A312C]/20 hover:-translate-y-0.5"}`}
                  >
                    {postLoading ? (
                      <>
                        <svg
                          className="animate-spin w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        {postMode === "schedule"
                          ? "Scheduling…"
                          : "Publishing…"}
                      </>
                    ) : postMode === "schedule" ? (
                      <>
                        <Icon name="calendar" size={15} />
                        Schedule post
                      </>
                    ) : (
                      <>
                        <Icon name="rocket" size={15} />
                        Publish now
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── SCHEDULED / PUBLISHED ──────────────────────────── */}
          {(activeTab === "scheduled" || activeTab === "published") && (
            <div className="bg-white rounded-2xl border-2 border-[#1A312C]/8">
              <div className="px-6 py-4 border-b border-[#1A312C]/8 bg-[#FFF4E1] flex items-center justify-between rounded-t-2xl">
                <h2 className="text-sm font-semibold text-[#1A312C] font-display">
                  {activeTab === "scheduled"
                    ? "Scheduled Posts"
                    : "Published Posts"}
                </h2>
                <button
                  onClick={() =>
                    fetchPosts(
                      activeTab === "scheduled" ? "draft" : "published",
                    )
                  }
                  className="text-[#428475] hover:text-[#1A312C] transition-colors"
                >
                  <Icon name="refresh" size={15} />
                </button>
              </div>
              <div className="p-6">
                {postsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20" />
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-4xl mb-3">
                      {activeTab === "scheduled" ? "📅" : "✅"}
                    </div>
                    <p className="text-[#1A312C] text-sm font-semibold font-display">
                      No {activeTab} posts yet
                    </p>
                    <p className="text-[#428475] text-xs mt-1">
                      {activeTab === "scheduled"
                        ? "Schedule a post from the Compose tab"
                        : "Your published posts will appear here"}
                    </p>
                    <button
                      onClick={() => setActiveTab("compose")}
                      className="mt-4 px-4 py-2 bg-[#1A312C] text-[#89D7B7] text-sm font-semibold rounded-xl hover:brightness-110 transition-colors font-display"
                    >
                      Go to Compose →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {posts.map((post) => (
                      <div
                        key={post._id}
                        className="border-2 border-[#1A312C]/8 rounded-xl p-4 hover:border-[#428475]/30 transition-colors bg-[#FFF4E1]/40"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex gap-2">
                            {PLATFORMS.map((p) => {
                              const PIcon = PLATFORM_ICON[p.key];
                              return post.platforms[p.key]?.enabled ? (
                                <PIcon key={p.key} size={17} />
                              ) : null;
                            })}
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full font-semibold font-display
                                                            ${
                                                              post.overallStatus ===
                                                              "published"
                                                                ? "bg-[#89D7B7]/20 text-[#428475]"
                                                                : post.overallStatus ===
                                                                    "draft"
                                                                  ? "bg-amber-100 text-amber-700"
                                                                  : post.overallStatus ===
                                                                      "partial"
                                                                    ? "bg-orange-100 text-orange-700"
                                                                    : "bg-red-100 text-red-700"
                                                            }`}
                            >
                              {post.overallStatus}
                            </span>
                            {post.scheduledAt && (
                              <span className="text-xs text-[#428475] flex items-center gap-1 font-mono-os">
                                <Icon name="calendar" size={11} />
                                {new Date(post.scheduledAt).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        {PLATFORMS.map((p) => {
                          if (!post.platforms[p.key]?.content) return null;
                          const PIcon = PLATFORM_ICON[p.key];
                          return (
                            <p
                              key={p.key}
                              className="text-sm text-[#428475] truncate flex items-center gap-1.5 mb-1"
                            >
                              <PIcon size={12} />
                              <span className="font-semibold text-[#1A312C] font-display">
                                {p.label}:
                              </span>
                              {post.platforms[p.key].content}
                            </p>
                          );
                        })}
                        <p className="text-xs text-[#428475]/50 mt-2 font-mono-os">
                          Created {new Date(post.createdAt).toLocaleString()}
                        </p>
                        {activeTab === "scheduled" &&
                          post.overallStatus === "draft" && (
                            <button
                              onClick={() => cancelScheduledPost(post._id)}
                              className="mt-3 w-full text-xs py-2 rounded-lg text-red-500 border border-red-200 hover:bg-red-50 transition-colors font-semibold font-display flex items-center justify-center gap-1.5"
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
