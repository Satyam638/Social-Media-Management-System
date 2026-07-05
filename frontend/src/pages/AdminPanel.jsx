// src/pages/AdminPanel.jsx — FIXED
// Bug: 3 useEffect hooks were placed AFTER conditional returns (if authChecking / if !authorized)
// React Rules of Hooks: ALL hooks must be called unconditionally, before any return statement.
// Fix: moved all useEffect calls to the top, added `authorized` guard inside them instead.

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
    * { box-sizing: border-box; }
    @keyframes spin  { to { transform: rotate(360deg); } }
    @keyframes pulse { from{opacity:.4} to{opacity:.9} }
    @keyframes slideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
    .spin     { animation: spin 1s linear infinite; }
    .slide-in { animation: slideIn .25s ease-out; }
  `}</style>
);

const C = { forest:"#1A312C", teal:"#428475", mint:"#89D7B7", cream:"#FFF4E1" };

const Skel = ({ h=36, w="100%" }) => (
  <div style={{ height:h, width:w, background:"rgba(26,49,44,.07)", borderRadius:8, animation:"pulse 1.5s ease-in-out infinite alternate" }}/>
);

const Badge = ({ label, color="teal" }) => {
  const map = {
    teal:  { bg:"rgba(66,132,117,.1)",   text:C.teal },
    green: { bg:"rgba(22,163,74,.1)",    text:"#166534" },
    red:   { bg:"rgba(220,38,38,.1)",    text:"#991b1b" },
    amber: { bg:"rgba(234,179,8,.1)",    text:"#854d0e" },
    forest:{ bg:"rgba(26,49,44,.08)",    text:C.forest },
    mint:  { bg:"rgba(137,215,183,.15)", text:"#0f5132" },
  };
  const s = map[color] || map.teal;
  return (
    <span style={{ padding:"3px 10px", borderRadius:999, fontSize:10, fontWeight:600, fontFamily:"JetBrains Mono,monospace", background:s.bg, color:s.text, whiteSpace:"nowrap" }}>
      {label}
    </span>
  );
};

const Card = ({ children, style={} }) => (
  <div style={{ background:"#fff", borderRadius:18, border:"1.5px solid rgba(26,49,44,.08)", ...style }}>{children}</div>
);

const StatCard = ({ icon, label, value, sub, accent="forest" }) => (
  <Card style={{ padding:22, display:"flex", flexDirection:"column", gap:12 }}>
    <div style={{ width:40, height:40, borderRadius:11, background: accent==="mint"?"rgba(137,215,183,.15)":"rgba(26,49,44,.06)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{icon}</div>
    <div>
      <p style={{ margin:0, fontFamily:"Space Grotesk,sans-serif", fontSize:30, fontWeight:700, color:C.forest, lineHeight:1 }}>{value ?? "—"}</p>
      <p style={{ margin:"5px 0 0", fontSize:13, color:C.teal, fontWeight:500 }}>{label}</p>
      {sub && <p style={{ margin:"2px 0 0", fontSize:10, color:"rgba(26,49,44,.35)", fontFamily:"JetBrains Mono,monospace" }}>{sub}</p>}
    </div>
  </Card>
);

const btnPrimary = { background:C.forest, color:C.mint, border:"none", borderRadius:10, padding:"9px 18px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"Space Grotesk,sans-serif", display:"inline-flex", alignItems:"center", gap:6 };
const btnDanger  = { background:"rgba(220,38,38,.08)", color:"#991b1b", border:"1.5px solid rgba(220,38,38,.2)", borderRadius:8, padding:"6px 12px", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"Inter,sans-serif" };
const btnGhost   = { background:"transparent", color:C.teal, border:"1.5px solid rgba(26,49,44,.15)", borderRadius:8, padding:"6px 12px", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"Inter,sans-serif" };

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (msg, type="success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200);
  };
  return { toasts, success: m=>add(m,"success"), error: m=>add(m,"error") };
}

function Toasts({ toasts }) {
  return (
    <div style={{ position:"fixed", top:20, right:20, zIndex:9999, display:"flex", flexDirection:"column", gap:8 }}>
      {toasts.map(t => (
        <div key={t.id} className="slide-in" style={{ padding:"11px 16px", borderRadius:12, fontSize:13, fontWeight:500, fontFamily:"Inter,sans-serif", boxShadow:"0 8px 28px rgba(0,0,0,.18)", background:t.type==="success"?C.forest:"#7f1d1d", color:t.type==="success"?C.mint:"#fecaca", maxWidth:300 }}>
          {t.type==="success"?"✅":"❌"} {t.msg}
        </div>
      ))}
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.45)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div className="slide-in" style={{ background:"#fff", borderRadius:20, padding:"32px 28px", maxWidth:380, width:"100%", boxShadow:"0 24px 60px rgba(0,0,0,.2)" }}>
        <div style={{ fontSize:32, marginBottom:14, textAlign:"center" }}>⚠️</div>
        <p style={{ fontFamily:"Space Grotesk,sans-serif", fontWeight:600, fontSize:15, color:C.forest, textAlign:"center", margin:"0 0 24px", lineHeight:1.5 }}>{message}</p>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{ ...btnGhost, flex:1, justifyContent:"center", padding:"10px" }}>Cancel</button>
          <button onClick={onConfirm} style={{ ...btnDanger, flex:1, justifyContent:"center", padding:"10px", borderRadius:10 }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

function UserDrawer({ userId, onClose, onUpdate, toast }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/api/admin/users/${userId}`)
      .then(r => setData(r.data))
      .catch(() => toast.error("Failed to load user"))
      .finally(() => setLoading(false));
  }, [userId]);

  const changeRole = async (role) => {
    try {
      await API.patch(`/api/admin/users/${userId}`, { role });
      toast.success(`Role changed to ${role}`);
      setData(p => ({ ...p, user: { ...p.user, role } }));
      onUpdate();
    } catch { toast.error("Failed to change role"); }
  };

  const toggleBan = async () => {
    const next = !data?.user?.isBanned;
    try {
      await API.patch(`/api/admin/users/${userId}`, { isBanned: next });
      toast.success(next ? "User banned" : "User unbanned");
      setData(p => ({ ...p, user: { ...p.user, isBanned: next } }));
      onUpdate();
    } catch { toast.error("Failed to update ban status"); }
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:50, display:"flex" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.4)" }}/>
      <div className="slide-in" style={{ position:"absolute", right:0, top:0, height:"100%", width:420, background:"#FFF4E1", overflowY:"auto", boxShadow:"-8px 0 40px rgba(0,0,0,.15)", zIndex:1 }}>
        <div style={{ background:C.forest, padding:"24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <p style={{ fontFamily:"Space Grotesk,sans-serif", fontWeight:700, fontSize:16, color:"#fff", margin:0 }}>User detail</p>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"rgba(137,215,183,.6)", cursor:"pointer", fontSize:20 }}>✕</button>
        </div>
        {loading ? (
          <div style={{ padding:24, display:"flex", flexDirection:"column", gap:12 }}>
            {[80,40,40,40].map((h,i) => <Skel key={i} h={h}/>)}
          </div>
        ) : data && (
          <div style={{ padding:24, display:"flex", flexDirection:"column", gap:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              {data.user.profilePic ? (
                <img src={data.user.profilePic} alt="" style={{ width:56, height:56, borderRadius:"50%", objectFit:"cover", border:`3px solid ${C.mint}` }}/>
              ) : (
                <div style={{ width:56, height:56, borderRadius:"50%", background:C.forest, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Space Grotesk,sans-serif", fontWeight:700, fontSize:20, color:C.mint }}>
                  {data.user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p style={{ margin:0, fontFamily:"Space Grotesk,sans-serif", fontWeight:700, fontSize:16, color:C.forest }}>{data.user.name}</p>
                <p style={{ margin:"3px 0 0", fontSize:12, color:C.teal }}>{data.user.email}</p>
                <div style={{ display:"flex", gap:6, marginTop:6 }}>
                  <Badge label={data.user.role} color={data.user.role==="Superadmin"?"mint":"forest"}/>
                  {data.user.isBanned && <Badge label="Banned" color="red"/>}
                  {!data.user.isVerified && <Badge label="Unverified" color="amber"/>}
                </div>
              </div>
            </div>
            <Card style={{ padding:"14px 18px", display:"flex", flexDirection:"column", gap:10 }}>
              {[
                ["Joined", new Date(data.user.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})],
                ["Email verified", data.user.isVerified ? "Yes" : "No"],
                ["Total posts", data.posts?.length ?? 0],
              ].map(([l,v]) => (
                <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:12 }}>
                  <span style={{ color:C.teal }}>{l}</span>
                  <span style={{ fontWeight:600, color:C.forest, fontFamily:"JetBrains Mono,monospace" }}>{v}</span>
                </div>
              ))}
            </Card>
            <div>
              <p style={{ fontFamily:"Space Grotesk,sans-serif", fontWeight:600, fontSize:12, color:C.forest, margin:"0 0 10px", textTransform:"uppercase", letterSpacing:"0.05em" }}>Connected platforms</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {["linkedin","facebook","instagram"].map(p => (
                  <Badge key={p} label={p} color={data.user.platforms?.[p]?.isConnected?"green":"teal"}/>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontFamily:"Space Grotesk,sans-serif", fontWeight:600, fontSize:12, color:C.forest, margin:"0 0 10px", textTransform:"uppercase", letterSpacing:"0.05em" }}>Change role</p>
              <div style={{ display:"flex", gap:8 }}>
                {["Admin","Superadmin"].map(r => (
                  <button key={r} onClick={() => changeRole(r)}
                    style={{ ...btnGhost, flex:1, justifyContent:"center", padding:"9px", background:data.user.role===r?C.forest:"transparent", color:data.user.role===r?C.mint:C.teal, border:data.user.role===r?"none":"1.5px solid rgba(26,49,44,.15)" }}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={toggleBan}
              style={{ width:"100%", padding:"11px", borderRadius:12, border:"none", cursor:"pointer", fontFamily:"Space Grotesk,sans-serif", fontWeight:700, fontSize:13, background:data.user.isBanned?"rgba(22,163,74,.1)":"rgba(220,38,38,.08)", color:data.user.isBanned?"#166534":"#991b1b" }}>
              {data.user.isBanned ? "✅ Unban user" : "🚫 Ban user"}
            </button>
            {data.posts?.length > 0 && (
              <div>
                <p style={{ fontFamily:"Space Grotesk,sans-serif", fontWeight:600, fontSize:12, color:C.forest, margin:"0 0 10px", textTransform:"uppercase", letterSpacing:"0.05em" }}>Recent posts</p>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {data.posts.slice(0,5).map(post => (
                    <Card key={post._id} style={{ padding:"12px 14px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                        <Badge label={post.overallStatus} color={post.overallStatus==="published"?"green":post.overallStatus==="draft"?"amber":"red"}/>
                        <span style={{ fontSize:10, color:"rgba(26,49,44,.4)", fontFamily:"JetBrains Mono,monospace" }}>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      {["linkedin","facebook","instagram"].map(p => post.platforms?.[p]?.content ? (
                        <p key={p} style={{ fontSize:11, color:C.teal, margin:"3px 0 0", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          <strong style={{ color:C.forest }}>{p}:</strong> {post.platforms[p].content}
                        </p>
                      ) : null)}
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main AdminPanel ───────────────────────────────────────────
export default function AdminPanel() {
  const navigate = useNavigate();
  const toast    = useToast();

  // ── ALL state at the top ──────────────────────────────────
  const [tab, setTab]                     = useState("overview");
  const [stats, setStats]                 = useState(null);
  const [statsLoading, setStatsLoading]   = useState(true);
  const [users, setUsers]                 = useState([]);
  const [usersLoading, setUsersLoading]   = useState(false);
  const [usersTotal, setUsersTotal]       = useState(0);
  const [userPage, setUserPage]           = useState(1);
  const [userSearch, setUserSearch]       = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [selectedUser, setSelectedUser]   = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [posts, setPosts]                 = useState([]);
  const [postsLoading, setPostsLoading]   = useState(false);
  const [postsTotal, setPostsTotal]       = useState(0);
  const [postPage, setPostPage]           = useState(1);
  const [postStatusFilter, setPostStatusFilter] = useState("");
  const [confirmDeletePost, setConfirmDeletePost] = useState(null);
  const [authorized, setAuthorized]       = useState(false);
  const [authChecking, setAuthChecking]   = useState(true);

  // ── ALL useCallback at the top ────────────────────────────
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await API.get("/api/admin/stats");
      setStats(res.data.stats);
    } catch { toast.error("Failed to load stats"); }
    finally { setStatsLoading(false); }
  }, []);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await API.get("/api/admin/users", {
        params: { search:userSearch, role:userRoleFilter, page:userPage, limit:20 },
      });
      setUsers(res.data.users);
      setUsersTotal(res.data.total);
    } catch { toast.error("Failed to load users"); }
    finally { setUsersLoading(false); }
  }, [userSearch, userRoleFilter, userPage]);

  const fetchPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      const res = await API.get("/api/admin/posts", {
        params: { status:postStatusFilter, page:postPage, limit:20 },
      });
      setPosts(res.data.posts);
      setPostsTotal(res.data.total);
    } catch { toast.error("Failed to load posts"); }
    finally { setPostsLoading(false); }
  }, [postStatusFilter, postPage]);

  // ── ALL useEffect at the top — BEFORE any return ──────────
  // ✅ FIX: these were previously placed AFTER the early returns
  //    which violated React's Rules of Hooks and caused the blank page.

  // 1. Auth check — runs once on mount
  useEffect(() => {
    API.get("/api/auth/me")
      .then(res => {
        if (res.data.user?.role === "Superadmin") {
          setAuthorized(true);
        } else {
          navigate("/dashboard");
        }
      })
      .catch(() => navigate("/login"))
      .finally(() => setAuthChecking(false));
  }, []);

  // 2. Fetch stats once authorized
  useEffect(() => {
    if (authorized) fetchStats();
  }, [authorized]);          // ← only fires when authorized flips to true

  // 3. Fetch users when tab changes to "users"
  useEffect(() => {
    if (authorized && tab === "users") fetchUsers();
  }, [tab, fetchUsers, authorized]);

  // 4. Fetch posts when tab changes to "posts"
  useEffect(() => {
    if (authorized && tab === "posts") fetchPosts();
  }, [tab, fetchPosts, authorized]);

  // ── Safe to do early returns here — all hooks are above ───
  if (authChecking) return (
    <div style={{ minHeight:"100vh", background:C.cream, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <FontStyles/>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:36, height:36, borderRadius:"50%", border:`3px solid ${C.mint}`, borderTopColor:"transparent", margin:"0 auto 14px", animation:"spin 1s linear infinite" }}/>
        <p style={{ color:C.teal, fontFamily:"Inter,sans-serif", fontSize:13 }}>Verifying access…</p>
      </div>
    </div>
  );

  if (!authorized) return null;

  // ── Action handlers ───────────────────────────────────────
  const deleteUser = async (id) => {
    try {
      await API.delete(`/api/admin/users/${id}`);
      toast.success("User deleted");
      setConfirmDelete(null);
      fetchUsers();
      fetchStats();
    } catch { toast.error("Failed to delete user"); }
  };

  const deletePost = async (id) => {
    try {
      await API.delete(`/api/admin/posts/${id}`);
      toast.success("Post deleted");
      setConfirmDeletePost(null);
      fetchPosts();
      fetchStats();
    } catch { toast.error("Failed to delete post"); }
  };

  const TABS = [
    { key:"overview", label:"Overview",  icon:"📊" },
    { key:"users",    label:"Users",     icon:"👥" },
    { key:"posts",    label:"All Posts", icon:"📋" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.cream, fontFamily:"Inter,sans-serif", color:C.forest }}>
      <FontStyles/>
      <Toasts toasts={toast.toasts}/>

      {confirmDelete && (
        <ConfirmModal
          message={`Permanently delete "${confirmDelete.name}" and all their posts? This cannot be undone.`}
          onConfirm={() => deleteUser(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}/>
      )}
      {confirmDeletePost && (
        <ConfirmModal
          message="Permanently delete this post? This cannot be undone."
          onConfirm={() => deletePost(confirmDeletePost)}
          onCancel={() => setConfirmDeletePost(null)}/>
      )}
      {selectedUser && (
        <UserDrawer
          userId={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={() => { fetchUsers(); fetchStats(); }}
          toast={toast}/>
      )}

      {/* Navbar */}
      <nav style={{ background:C.forest, padding:"0 24px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:30 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <button onClick={() => navigate("/dashboard")}
            style={{ background:"rgba(137,215,183,.1)", border:"1px solid rgba(137,215,183,.2)", borderRadius:9, padding:"6px 14px", fontSize:12, fontWeight:600, color:C.mint, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
            ← Dashboard
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:8, background:C.mint, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontFamily:"Space Grotesk,sans-serif", fontWeight:700, fontSize:10, color:C.forest }}>SA</span>
            </div>
            <span style={{ fontFamily:"Space Grotesk,sans-serif", fontWeight:600, fontSize:15, color:"#fff" }}>Superadmin Panel</span>
          </div>
        </div>
        <Badge label="Superadmin only" color="mint"/>
      </nav>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"28px 24px" }}>
        {/* Tab bar */}
        <div style={{ display:"flex", gap:4, background:"rgba(26,49,44,.06)", padding:4, borderRadius:14, width:"fit-content", marginBottom:24 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 18px", borderRadius:10, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"Inter,sans-serif", transition:"all .15s", background:tab===t.key?C.forest:"transparent", color:tab===t.key?C.mint:C.teal }}>
              <span style={{ fontSize:14 }}>{t.icon}</span>{t.label}
              {t.key==="users" && usersTotal>0 && (
                <span style={{ background:tab==="users"?C.mint:"rgba(26,49,44,.15)", color:tab==="users"?C.forest:C.teal, fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:999, fontFamily:"JetBrains Mono,monospace" }}>{usersTotal}</span>
              )}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab==="overview" && (
          <div style={{ display:"flex", flexDirection:"column", gap:20 }} className="slide-in">
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
              {statsLoading ? [1,2,3,4].map(i=><Skel key={i} h={130}/>) : [
                { icon:"👥", label:"Total users",    value:stats?.users?.total,       sub:`${stats?.users?.recentSignups} joined this week` },
                { icon:"✅", label:"Verified users", value:stats?.users?.verified,    sub:"Email confirmed" },
                { icon:"🚫", label:"Banned users",   value:stats?.users?.banned,      sub:"Blocked from posting", accent:"mint" },
                { icon:"👑", label:"Superadmins",    value:stats?.users?.superadmins, sub:"Full access accounts", accent:"mint" },
              ].map((c,i) => <StatCard key={i} {...c}/>)}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
              {statsLoading ? [1,2,3,4].map(i=><Skel key={i} h={130}/>) : [
                { icon:"📋", label:"Total posts",     value:stats?.posts?.total,     sub:"All time" },
                { icon:"✅", label:"Published posts", value:stats?.posts?.published, sub:"Successfully sent", accent:"mint" },
                { icon:"📅", label:"Scheduled posts", value:stats?.posts?.scheduled, sub:"Queued to go out" },
                { icon:"❌", label:"Failed posts",    value:stats?.posts?.failed,    sub:"Needs investigation" },
              ].map((c,i) => <StatCard key={i} {...c}/>)}
            </div>
            <Card style={{ padding:"22px 24px" }}>
              <p style={{ fontFamily:"Space Grotesk,sans-serif", fontWeight:600, fontSize:14, color:C.forest, margin:"0 0 16px" }}>Quick actions</p>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <button onClick={() => setTab("users")} style={btnPrimary}>👥 Manage users</button>
                <button onClick={() => setTab("posts")} style={btnPrimary}>📋 View all posts</button>
                <button onClick={fetchStats} style={{ ...btnGhost, padding:"9px 18px" }}>↻ Refresh stats</button>
                <button onClick={() => navigate("/")} style={{ ...btnGhost, padding:"9px 18px" }}>🌐 View site</button>
              </div>
            </Card>
            <div style={{ background:"rgba(234,179,8,.06)", border:"1.5px solid rgba(234,179,8,.25)", borderRadius:16, padding:"16px 20px", display:"flex", gap:14, alignItems:"flex-start" }}>
              <span style={{ fontSize:20, flexShrink:0 }}>🔐</span>
              <div>
                <p style={{ fontFamily:"Space Grotesk,sans-serif", fontWeight:600, fontSize:13, color:"#854d0e", margin:"0 0 4px" }}>Security reminder</p>
                <p style={{ fontSize:12, color:"#92400e", margin:0, lineHeight:1.6 }}>This panel is only accessible to Superadmin accounts. Never share your credentials. Make sure your MongoDB Atlas IP whitelist only allows your server's IP in production.</p>
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab==="users" && (
          <div className="slide-in">
            <Card>
              <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(26,49,44,.07)", display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
                <input placeholder="Search name or email…" value={userSearch}
                  onChange={e => { setUserSearch(e.target.value); setUserPage(1); }}
                  style={{ flex:1, minWidth:180, padding:"9px 14px", borderRadius:10, border:"1.5px solid rgba(26,49,44,.15)", fontSize:13, color:C.forest, outline:"none", fontFamily:"Inter,sans-serif", background:"#FAFAF5" }}
                  onFocus={e => e.target.style.borderColor=C.mint}
                  onBlur={e => e.target.style.borderColor="rgba(26,49,44,.15)"}/>
                <select value={userRoleFilter} onChange={e => { setUserRoleFilter(e.target.value); setUserPage(1); }}
                  style={{ padding:"9px 12px", borderRadius:10, border:"1.5px solid rgba(26,49,44,.15)", fontSize:12, color:C.forest, outline:"none", background:"#fff", cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
                  <option value="">All roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Superadmin">Superadmin</option>
                </select>
                <button onClick={fetchUsers} style={{ ...btnGhost, padding:"9px 14px" }}>↻ Refresh</button>
                <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:11, color:C.teal, marginLeft:"auto" }}>{usersTotal} users</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"2fr 2fr 1fr 1fr 1fr 100px", padding:"10px 20px", borderBottom:"1px solid rgba(26,49,44,.07)" }}>
                {["User","Email","Role","Posts","Joined","Actions"].map(h => (
                  <span key={h} style={{ fontFamily:"JetBrains Mono,monospace", fontSize:9, color:C.teal, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:500 }}>{h}</span>
                ))}
              </div>
              {usersLoading ? (
                <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:10 }}>{[1,2,3,4,5].map(i=><Skel key={i} h={44}/>)}</div>
              ) : users.length===0 ? (
                <div style={{ textAlign:"center", padding:"56px 0", color:C.teal, fontSize:13 }}>No users found</div>
              ) : users.map((u,i) => (
                <div key={u._id}
                  style={{ display:"grid", gridTemplateColumns:"2fr 2fr 1fr 1fr 1fr 100px", padding:"13px 20px", borderBottom:i<users.length-1?"1px solid rgba(26,49,44,.05)":"none", alignItems:"center", transition:"background .15s", cursor:"pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background="rgba(26,49,44,.02)"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}
                  onClick={() => setSelectedUser(u._id)}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    {u.profilePic ? (
                      <img src={u.profilePic} alt="" style={{ width:32, height:32, borderRadius:"50%", objectFit:"cover", border:`2px solid ${C.mint}`, flexShrink:0 }}/>
                    ) : (
                      <div style={{ width:32, height:32, borderRadius:"50%", background:C.forest, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Space Grotesk,sans-serif", fontWeight:700, fontSize:12, color:C.mint, flexShrink:0 }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p style={{ margin:0, fontSize:13, fontWeight:600, color:C.forest }}>{u.name}</p>
                      <div style={{ display:"flex", gap:5, marginTop:2 }}>
                        {u.isBanned && <Badge label="Banned" color="red"/>}
                        {!u.isVerified && <Badge label="Unverified" color="amber"/>}
                      </div>
                    </div>
                  </div>
                  <p style={{ margin:0, fontSize:12, color:C.teal, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", paddingRight:12 }}>{u.email}</p>
                  <Badge label={u.role} color={u.role==="Superadmin"?"mint":"forest"}/>
                  <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:12, color:C.forest, fontWeight:600 }}>{u.postCount}</span>
                  <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:10, color:"rgba(26,49,44,.4)" }}>
                    {new Date(u.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"2-digit"})}
                  </span>
                  <div style={{ display:"flex", gap:6 }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => setSelectedUser(u._id)} style={{ ...btnGhost, padding:"5px 10px", fontSize:10 }}>View</button>
                    <button onClick={() => setConfirmDelete({ id:u._id, name:u.name })} style={{ ...btnDanger, padding:"5px 10px", fontSize:10 }}>Del</button>
                  </div>
                </div>
              ))}
              {usersTotal > 20 && (
                <div style={{ padding:"14px 20px", borderTop:"1px solid rgba(26,49,44,.07)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <button disabled={userPage===1} onClick={() => setUserPage(p=>p-1)} style={{ ...btnGhost, padding:"7px 14px", opacity:userPage===1?.4:1, cursor:userPage===1?"default":"pointer" }}>← Prev</button>
                  <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:11, color:C.teal }}>Page {userPage} of {Math.ceil(usersTotal/20)}</span>
                  <button disabled={userPage>=Math.ceil(usersTotal/20)} onClick={() => setUserPage(p=>p+1)} style={{ ...btnGhost, padding:"7px 14px", opacity:userPage>=Math.ceil(usersTotal/20)?.4:1, cursor:userPage>=Math.ceil(usersTotal/20)?"default":"pointer" }}>Next →</button>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ALL POSTS */}
        {tab==="posts" && (
          <div className="slide-in">
            <Card>
              <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(26,49,44,.07)", display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
                <select value={postStatusFilter} onChange={e => { setPostStatusFilter(e.target.value); setPostPage(1); }}
                  style={{ padding:"9px 12px", borderRadius:10, border:"1.5px solid rgba(26,49,44,.15)", fontSize:12, color:C.forest, outline:"none", background:"#fff", cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
                  <option value="">All statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Scheduled</option>
                  <option value="failed">Failed</option>
                  <option value="partial">Partial</option>
                </select>
                <button onClick={fetchPosts} style={{ ...btnGhost, padding:"9px 14px" }}>↻ Refresh</button>
                <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:11, color:C.teal, marginLeft:"auto" }}>{postsTotal} posts</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"2fr 2fr 1fr 1fr 80px", padding:"10px 20px", borderBottom:"1px solid rgba(26,49,44,.07)" }}>
                {["User","Content preview","Platforms","Status","Actions"].map(h => (
                  <span key={h} style={{ fontFamily:"JetBrains Mono,monospace", fontSize:9, color:C.teal, textTransform:"uppercase", letterSpacing:"0.08em" }}>{h}</span>
                ))}
              </div>
              {postsLoading ? (
                <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:10 }}>{[1,2,3,4,5].map(i=><Skel key={i} h={44}/>)}</div>
              ) : posts.length===0 ? (
                <div style={{ textAlign:"center", padding:"56px 0", color:C.teal, fontSize:13 }}>No posts found</div>
              ) : posts.map((post,i) => {
                const preview = ["linkedin","facebook","instagram"].map(p=>post.platforms?.[p]?.content).filter(Boolean)[0] || "—";
                const platforms = ["linkedin","facebook","instagram"].filter(p=>post.platforms?.[p]?.enabled);
                const statusColor = { published:"green", draft:"amber", failed:"red", partial:"amber" }[post.overallStatus] || "teal";
                return (
                  <div key={post._id}
                    style={{ display:"grid", gridTemplateColumns:"2fr 2fr 1fr 1fr 80px", padding:"13px 20px", borderBottom:i<posts.length-1?"1px solid rgba(26,49,44,.05)":"none", alignItems:"center", transition:"background .15s" }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(26,49,44,.02)"}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                    <div>
                      <p style={{ margin:0, fontSize:12, fontWeight:600, color:C.forest }}>{post.userId?.name||"Unknown"}</p>
                      <p style={{ margin:0, fontSize:10, color:C.teal }}>{post.userId?.email||""}</p>
                    </div>
                    <p style={{ margin:0, fontSize:12, color:C.teal, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", paddingRight:12 }}>{preview}</p>
                    <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                      {platforms.map(p => <Badge key={p} label={p} color="teal"/>)}
                    </div>
                    <Badge label={post.overallStatus} color={statusColor}/>
                    <button onClick={() => setConfirmDeletePost(post._id)} style={{ ...btnDanger, padding:"5px 10px", fontSize:10 }}>Delete</button>
                  </div>
                );
              })}
              {postsTotal > 20 && (
                <div style={{ padding:"14px 20px", borderTop:"1px solid rgba(26,49,44,.07)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <button disabled={postPage===1} onClick={() => setPostPage(p=>p-1)} style={{ ...btnGhost, padding:"7px 14px", opacity:postPage===1?.4:1, cursor:postPage===1?"default":"pointer" }}>← Prev</button>
                  <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:11, color:C.teal }}>Page {postPage} of {Math.ceil(postsTotal/20)}</span>
                  <button disabled={postPage>=Math.ceil(postsTotal/20)} onClick={() => setPostPage(p=>p+1)} style={{ ...btnGhost, padding:"7px 14px", opacity:postPage>=Math.ceil(postsTotal/20)?.4:1, cursor:postPage>=Math.ceil(postsTotal/20)?"default":"pointer" }}>Next →</button>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}