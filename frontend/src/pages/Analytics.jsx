// src/pages/Analytics.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const FontStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
        * { box-sizing: border-box; }
        @keyframes pulse { from{opacity:.4} to{opacity:.9} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .spin { animation: spin 1s linear infinite; }
        @keyframes growBar { from{width:0} to{width:var(--w)} }
        @keyframes growBarV { from{height:0} to{height:var(--h)} }
    `}</style>
);

const LinkedInIcon  = ({ size=20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#0A66C2"/><path d="M7.5 9.5H5V19H7.5V9.5Z" fill="white"/><circle cx="6.25" cy="6.75" r="1.5" fill="white"/><path d="M19 19H16.5V14C16.5 12.9 15.85 12 14.75 12C13.65 12 13 12.9 13 14V19H10.5V9.5H13V10.75C13.55 9.9 14.6 9.25 15.75 9.25C17.6 9.25 19 10.65 19 12.75V19Z" fill="white"/></svg>);
const FacebookIcon  = ({ size=20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#1877F2"/><path d="M13.5 12.5H15.5L16 10H13.5V8.5C13.5 7.8 13.8 7.25 14.75 7.25H16V5.1C15.45 5.05 14.7 5 13.9 5C11.8 5 10.5 6.2 10.5 8.25V10H8V12.5H10.5V19H13.5V12.5Z" fill="white"/></svg>);
const InstagramIcon = ({ size=20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="ig-a" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFDC80"/><stop offset="50%" stopColor="#F77737"/><stop offset="100%" stopColor="#833AB4"/></linearGradient></defs><rect width="24" height="24" rx="6" fill="url(#ig-a)"/><rect x="6" y="6" width="12" height="12" rx="4" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="16.5" cy="7.5" r="1" fill="white"/></svg>);
const TwitterXIcon  = ({ size=20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#000"/><path d="M17.5 5H19.5L14.5 11L20 19H15.5L12 14.5L8 19H6L11.5 12.5L6.5 5H11L14 9.5L17.5 5ZM16.5 17.5H17.5L9.5 6.5H8.5L16.5 17.5Z" fill="white"/></svg>);
const PLATFORM_ICON = { linkedin:LinkedInIcon, facebook:FacebookIcon, instagram:InstagramIcon, twitter:TwitterXIcon };

const PLATFORMS = [
    { key:'linkedin',  label:'LinkedIn',  barColor:'#0A66C2' },
    { key:'facebook',  label:'Facebook',  barColor:'#1877F2' },
    { key:'instagram', label:'Instagram', barColor:'#F77737' },
    { key:'twitter',   label:'Twitter',   barColor:'#000' },
];

const Skeleton = ({ h=44 }) => (
    <div style={{ background:'rgba(26,49,44,.07)', borderRadius:10, height:h, animation:'pulse 1.5s ease-in-out infinite alternate' }}/>
);

function AnimatedBar({ pct, color, delay=0 }) {
    const [w, setW] = useState(0);
    useEffect(() => { const t = setTimeout(()=>setW(pct), 100+delay); return ()=>clearTimeout(t); }, [pct, delay]);
    return (
        <div style={{ height:8, background:'rgba(26,49,44,.08)', borderRadius:999, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${w}%`, background:color, borderRadius:999, transition:'width .7s cubic-bezier(.4,0,.2,1)' }}/>
        </div>
    );
}

function BarColumn({ pct, hasCount, tooltip }) {
    const [h, setH] = useState(0);
    const [show, setShow] = useState(false);
    useEffect(() => { const t = setTimeout(()=>setH(pct), 150); return ()=>clearTimeout(t); }, [pct]);
    return (
        <div style={{ position:'relative', flex:1, display:'flex', alignItems:'flex-end', height:'100%', cursor:'pointer' }}
            onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
            {show && tooltip && (
                <div style={{ position:'absolute', bottom:'calc(100% + 8px)', left:'50%', transform:'translateX(-50%)', background:'#1A312C', color:'#89D7B7', fontSize:10, padding:'6px 10px', borderRadius:8, whiteSpace:'nowrap', zIndex:10, fontFamily:'JetBrains Mono,monospace', pointerEvents:'none' }}>
                    {tooltip}
                    <div style={{ position:'absolute', top:'100%', left:'50%', transform:'translateX(-50%)', border:'5px solid transparent', borderTopColor:'#1A312C' }}/>
                </div>
            )}
            <div style={{ width:'100%', borderRadius:'4px 4px 0 0', background: hasCount ? '#89D7B7' : 'rgba(26,49,44,.08)', height:`${Math.max(h, hasCount?3:2)}%`, transition:'height .5s cubic-bezier(.4,0,.2,1)' }}
                onMouseEnter={e=>{ if(hasCount) e.target.style.background='#428475'; }}
                onMouseLeave={e=>{ if(hasCount) e.target.style.background='#89D7B7'; }}/>
        </div>
    );
}

function StatCard({ label, value, sub, icon, bg, iconBg, valueColor }) {
    return (
        <div style={{ background:bg||'#fff', borderRadius:18, padding:'22px', border:'1.5px solid rgba(26,49,44,.08)', display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:iconBg||'rgba(26,49,44,.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{icon}</div>
            <div>
                <p style={{ margin:0, fontFamily:'Space Grotesk,sans-serif', fontSize:32, fontWeight:700, color:valueColor||'#1A312C', lineHeight:1 }}>{value}</p>
                <p style={{ margin:'6px 0 0', fontSize:13, color:'#428475', fontWeight:500 }}>{label}</p>
                {sub && <p style={{ margin:'3px 0 0', fontSize:11, color:'rgba(26,49,44,.4)', fontFamily:'JetBrains Mono,monospace' }}>{sub}</p>}
            </div>
        </div>
    );
}

export default function Analytics() {
    const navigate = useNavigate();
    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState('');
    const [tooltip, setTooltip] = useState(null);

    useEffect(() => { fetchAnalytics(); }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true); setError('');
            const res = await API.get('/api/analytics/dashboard');
            setData(res.data.data);
        } catch { setError('Failed to load analytics. Please try again.'); }
        finally { setLoading(false); }
    };

    if (error) return (
        <div style={{ minHeight:'100vh', background:'#FFF4E1', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter,sans-serif' }}>
            <FontStyles/>
            <div style={{ textAlign:'center', maxWidth:340 }}>
                <div style={{ width:64, height:64, borderRadius:18, background:'rgba(220,38,38,.08)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:28 }}>⚠️</div>
                <h2 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:20, fontWeight:700, color:'#1A312C', margin:'0 0 8px' }}>Couldn't load analytics</h2>
                <p style={{ fontSize:13, color:'#428475', margin:'0 0 24px' }}>{error}</p>
                <button onClick={fetchAnalytics} style={{ padding:'11px 24px', background:'#1A312C', color:'#89D7B7', border:'none', borderRadius:12, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'Space Grotesk,sans-serif' }}>
                    Try again
                </button>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight:'100vh', background:'#FFF4E1', fontFamily:'Inter,sans-serif', color:'#1A312C' }}>
            <FontStyles/>

            {/* ── Navbar ── */}
            <nav style={{ position:'sticky', top:0, zIndex:20, background:'rgba(255,244,225,.92)', backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(26,49,44,.1)' }}>
                <div style={{ maxWidth:1000, margin:'0 auto', padding:'0 24px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <button onClick={()=>navigate('/dashboard')}
                            style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', background:'#fff', border:'1.5px solid rgba(26,49,44,.15)', borderRadius:10, fontSize:12, fontWeight:600, cursor:'pointer', color:'#1A312C', fontFamily:'Inter,sans-serif' }}>
                            ← Dashboard
                        </button>
                        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                            <div style={{ width:26, height:26, borderRadius:7, background:'#1A312C', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <span style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:700, fontSize:10, color:'#89D7B7' }}>OS</span>
                            </div>
                            <span style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:600, fontSize:14, color:'#1A312C' }}>Analytics</span>
                        </div>
                    </div>
                    <button onClick={fetchAnalytics} disabled={loading}
                        style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', background:'#fff', border:'1.5px solid rgba(26,49,44,.15)', borderRadius:10, fontSize:12, fontWeight:600, cursor:'pointer', color:'#428475', fontFamily:'Inter,sans-serif' }}>
                        <span className={loading ? 'spin' : ''} style={{ display:'inline-block' }}>↻</span> Refresh
                    </button>
                </div>
            </nav>

            <div style={{ maxWidth:1000, margin:'0 auto', padding:'32px 24px' }}>
                {/* Page header */}
                <div style={{ marginBottom:28 }}>
                    <h1 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:26, fontWeight:700, color:'#1A312C', margin:'0 0 4px', letterSpacing:'-0.02em' }}>Analytics</h1>
                    <p style={{ fontSize:13, color:'#428475', margin:0 }}>Your publishing performance at a glance</p>
                </div>

                {loading ? (
                    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
                            {[1,2,3,4].map(i=><Skeleton key={i} h={120}/>)}
                        </div>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                            <Skeleton h={260}/><Skeleton h={260}/>
                        </div>
                        <Skeleton h={200}/>
                        <Skeleton h={240}/>
                    </div>
                ) : data && (() => {
                    const { overview, platforms, timeline, successRates, recentPosts } = data;
                    const maxTL = Math.max(...(timeline.map(d=>d.count)), 1);

                    const statCards = [
                        { label:'Total posts', value:overview.total, sub:'All time', icon:'📋', iconBg:'rgba(26,49,44,.06)' },
                        { label:'Published',   value:overview.published, sub:`${overview.total ? Math.round((overview.published/overview.total)*100) : 0}% of total`, icon:'✅', iconBg:'rgba(22,163,74,.08)', valueColor:'#166534' },
                        { label:'Failed',      value:overview.failed, sub: overview.failed>0 ? 'Needs attention' : 'All clear', icon: overview.failed>0 ? '❌' : '🎉', iconBg: overview.failed>0 ? 'rgba(220,38,38,.08)' : 'rgba(22,163,74,.08)', valueColor: overview.failed>0 ? '#991b1b' : '#166534' },
                        { label:'Success rate',value:`${overview.successRate}%`, sub: overview.successRate>=80 ? 'Great performance' : 'Room to improve', icon:'🎯', iconBg:'rgba(137,215,183,.15)', valueColor:'#1A312C' },
                    ];

                    return (
                        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
                            {/* Stat cards */}
                            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
                                {statCards.map((c,i) => <StatCard key={i} {...c}/>)}
                            </div>

                            {/* Platform bars + Success rates */}
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                                {/* Posts per platform */}
                                <div style={{ background:'#fff', borderRadius:18, border:'1.5px solid rgba(26,49,44,.08)', padding:22 }}>
                                    <p style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:600, fontSize:14, color:'#1A312C', margin:'0 0 20px' }}>Posts per platform</p>
                                    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                                        {PLATFORMS.map((pl,i) => {
                                            const count = platforms[pl.key] || 0;
                                            const pct   = overview.total ? Math.round((count/overview.total)*100) : 0;
                                            const PIcon = PLATFORM_ICON[pl.key];
                                            return (
                                                <div key={pl.key}>
                                                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                                                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                                            <PIcon size={16}/>
                                                            <span style={{ fontSize:13, fontWeight:500, color:'#1A312C' }}>{pl.label}</span>
                                                        </div>
                                                        <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:11, color:'#428475' }}>
                                                            {count} <span style={{ opacity:.5 }}>({pct}%)</span>
                                                        </span>
                                                    </div>
                                                    <AnimatedBar pct={pct} color={pl.barColor} delay={i*80}/>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Success rates */}
                                <div style={{ background:'#fff', borderRadius:18, border:'1.5px solid rgba(26,49,44,.08)', padding:22 }}>
                                    <p style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:600, fontSize:14, color:'#1A312C', margin:'0 0 20px' }}>Success rate per platform</p>
                                    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                                        {['linkedin','facebook','instagram'].map((key,i) => {
                                            const pl   = PLATFORMS.find(p=>p.key===key);
                                            const sr   = successRates[key];
                                            const rate = sr?.rate || 0;
                                            const PIcon = PLATFORM_ICON[key];
                                            const rateColor = rate>=80 ? '#16a34a' : rate>=50 ? '#d97706' : '#dc2626';
                                            const barColor  = rate>=80 ? '#89D7B7' : rate>=50 ? '#fbbf24' : '#f87171';
                                            return (
                                                <div key={key}>
                                                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                                                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                                            <PIcon size={16}/>
                                                            <span style={{ fontSize:13, fontWeight:500, color:'#1A312C' }}>{pl.label}</span>
                                                        </div>
                                                        <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:12, fontWeight:600, color:rateColor }}>{rate}%</span>
                                                    </div>
                                                    <AnimatedBar pct={rate} color={barColor} delay={i*80}/>
                                                    <p style={{ fontSize:10, color:'rgba(26,49,44,.4)', margin:'5px 0 0', fontFamily:'JetBrains Mono,monospace' }}>
                                                        {sr?.published||0} of {sr?.total||0} posts succeeded
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div style={{ background:'#fff', borderRadius:18, border:'1.5px solid rgba(26,49,44,.08)', padding:22 }}>
                                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
                                    <p style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:600, fontSize:14, color:'#1A312C', margin:0 }}>Posts — last 30 days</p>
                                    {timeline.length>0 && (
                                        <div style={{ display:'flex', gap:16 }}>
                                            <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'#428475' }}>Total: <strong style={{color:'#1A312C'}}>{timeline.reduce((s,d)=>s+d.count,0)}</strong></span>
                                            <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'#428475' }}>Peak: <strong style={{color:'#1A312C'}}>{maxTL}</strong></span>
                                        </div>
                                    )}
                                </div>
                                {timeline.length===0 ? (
                                    <div style={{ textAlign:'center', padding:'40px 0' }}>
                                        <div style={{ fontSize:32, marginBottom:8 }}>📭</div>
                                        <p style={{ fontSize:13, color:'#428475' }}>No posts in the last 30 days</p>
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{ display:'flex' }}>
                                            {/* Y axis */}
                                            <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', alignItems:'flex-end', paddingRight:10, height:140, width:28 }}>
                                                {[maxTL, Math.ceil(maxTL/2), 0].map((v,i)=>(
                                                    <span key={i} style={{ fontFamily:'JetBrains Mono,monospace', fontSize:9, color:'rgba(26,49,44,.3)' }}>{v}</span>
                                                ))}
                                            </div>
                                            {/* Bars */}
                                            <div style={{ flex:1, position:'relative', height:140 }}>
                                                {/* Grid */}
                                                <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'space-between', pointerEvents:'none' }}>
                                                    {[0,1,2].map(i=><div key={i} style={{ width:'100%', borderTop:'1px solid rgba(26,49,44,.06)' }}/>)}
                                                </div>
                                                <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'flex-end', gap:1 }}>
                                                    {timeline.map((day,i) => (
                                                        <BarColumn key={i} pct={Math.round((day.count/maxTL)*100)} hasCount={day.count>0}
                                                            tooltip={`${day.count} post${day.count!==1?'s':''} · ${day.date}`}/>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        {/* X axis */}
                                        <div style={{ display:'flex', paddingLeft:38, marginTop:6 }}>
                                            {timeline.map((day,i)=>(
                                                <div key={i} style={{ flex:1, textAlign:'center' }}>
                                                    {(i===0||i%7===0||i===timeline.length-1) && (
                                                        <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:8, color:'rgba(26,49,44,.3)' }}>
                                                            {new Date(day.date).toLocaleDateString(undefined,{month:'short',day:'numeric'})}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Recent activity */}
                            <div style={{ background:'#fff', borderRadius:18, border:'1.5px solid rgba(26,49,44,.08)', overflow:'hidden' }}>
                                <div style={{ padding:'18px 22px', borderBottom:'1px solid rgba(26,49,44,.07)' }}>
                                    <p style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:600, fontSize:14, color:'#1A312C', margin:0 }}>Recent activity</p>
                                </div>
                                {recentPosts.length===0 ? (
                                    <div style={{ textAlign:'center', padding:'48px 0' }}>
                                        <div style={{ fontSize:32, marginBottom:8 }}>📭</div>
                                        <p style={{ fontSize:13, color:'#428475' }}>No posts yet</p>
                                    </div>
                                ) : recentPosts.map((post,i) => {
                                    const statusStyle = {
                                        published:{ background:'rgba(22,163,74,.08)', color:'#166534' },
                                        failed:   { background:'rgba(220,38,38,.08)', color:'#991b1b' },
                                        partial:  { background:'rgba(234,179,8,.08)',  color:'#854d0e' },
                                        draft:    { background:'rgba(234,179,8,.08)',  color:'#854d0e' },
                                    }[post.overallStatus] || { background:'rgba(26,49,44,.06)', color:'#428475' };
                                    const enabledPlatforms = PLATFORMS.filter(pl=>post.platforms[pl.key]?.enabled);
                                    const previewText = enabledPlatforms.map(pl=>post.platforms[pl.key]?.content).filter(Boolean)[0] || '';
                                    return (
                                        <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, padding:'14px 22px', borderBottom: i<recentPosts.length-1?'1px solid rgba(26,49,44,.06)':'none', transition:'background .15s' }}
                                            onMouseEnter={e=>e.currentTarget.style.background='rgba(26,49,44,.02)'}
                                            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                                            <div style={{ display:'flex', alignItems:'center', gap:12, minWidth:0 }}>
                                                <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                                                    {enabledPlatforms.map(pl=>{ const PIcon=PLATFORM_ICON[pl.key]; return <PIcon key={pl.key} size={16}/>; })}
                                                </div>
                                                {previewText && <p style={{ fontSize:12, color:'#428475', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:320 }}>{previewText}</p>}
                                            </div>
                                            <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                                                <span style={{ fontSize:10, padding:'3px 10px', borderRadius:999, fontWeight:600, fontFamily:'JetBrains Mono,monospace', ...statusStyle }}>{post.overallStatus}</span>
                                                <span style={{ fontSize:10, color:'rgba(26,49,44,.4)', fontFamily:'JetBrains Mono,monospace' }}>
                                                    {new Date(post.createdAt).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Summary insight */}
                            {overview.total>0 && (
                                <div style={{ background:'#1A312C', borderRadius:18, padding:'24px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:20, flexWrap:'wrap' }}>
                                    <div>
                                        <p style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:600, fontSize:15, color:'#fff', margin:'0 0 5px' }}>
                                            {overview.successRate>=80 ? '🎉 Great publishing record!' : overview.successRate>=50 ? '📈 Getting there — keep posting!' : '💡 Some posts are failing. Check your platform connections.'}
                                        </p>
                                        <p style={{ fontSize:12, color:'rgba(137,215,183,.55)', margin:0, fontFamily:'JetBrains Mono,monospace' }}>
                                            {overview.published} published · {overview.successRate}% success · {overview.total} total
                                        </p>
                                    </div>
                                    <button onClick={()=>navigate('/dashboard')}
                                        style={{ padding:'11px 22px', background:'#89D7B7', color:'#1A312C', border:'none', borderRadius:12, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'Space Grotesk,sans-serif', flexShrink:0 }}>
                                        Create new post →
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}