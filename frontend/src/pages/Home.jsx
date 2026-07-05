// src/pages/Home.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const F = { forest:'#1A312C', teal:'#428475', mint:'#89D7B7', cream:'#FFF4E1' };

const FontStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
        .sg{font-family:'Space Grotesk',sans-serif} .inter{font-family:'Inter',sans-serif} .mono{font-family:'JetBrains Mono',monospace}
        @keyframes pulseRing{0%{transform:scale(.7);opacity:.6}80%{transform:scale(2.3);opacity:0}100%{transform:scale(2.3);opacity:0}}
        .ring1{animation:pulseRing 2.8s ease-out infinite}
        .ring2{animation:pulseRing 2.8s ease-out infinite;animation-delay:.9s}
        .ring3{animation:pulseRing 2.8s ease-out infinite;animation-delay:1.8s}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        .floatY{animation:floatY 4.5s ease-in-out infinite}
        @keyframes drawLine{from{stroke-dashoffset:220}to{stroke-dashoffset:0}}
        .dl{stroke-dasharray:220;animation:drawLine 1.3s ease-out forwards}
        @keyframes nodePop{from{transform:scale(.4);opacity:0}to{transform:scale(1);opacity:1}}
        .np0{animation:nodePop .45s cubic-bezier(.34,1.56,.64,1) 1s forwards;opacity:0}
        .np1{animation:nodePop .45s cubic-bezier(.34,1.56,.64,1) 1.2s forwards;opacity:0}
        .np2{animation:nodePop .45s cubic-bezier(.34,1.56,.64,1) 1.4s forwards;opacity:0}
        @media(prefers-reduced-motion:reduce){.ring1,.ring2,.ring3,.floatY,.dl,.np0,.np1,.np2{animation:none!important;opacity:1!important}}
        .feat-card:hover{border-color:#89D7B7!important;transform:translateY(-3px);box-shadow:0 12px 40px rgba(26,49,44,.1)}
        .step-card:hover{border-color:#89D7B7!important;box-shadow:0 8px 32px rgba(26,49,44,.08)}
        .use-card:hover{border-color:#89D7B7!important;transform:translateY(-3px)}
    `}</style>
);

const LinkedInIcon = ({size=20}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#0A66C2"/>
        <path d="M7.5 9.5H5V19H7.5V9.5Z" fill="white"/><circle cx="6.25" cy="6.75" r="1.5" fill="white"/>
        <path d="M19 19H16.5V14C16.5 12.9 15.85 12 14.75 12C13.65 12 13 12.9 13 14V19H10.5V9.5H13V10.75C13.55 9.9 14.6 9.25 15.75 9.25C17.6 9.25 19 10.65 19 12.75V19Z" fill="white"/>
    </svg>
);
const FacebookIcon = ({size=20}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#1877F2"/>
        <path d="M13.5 12.5H15.5L16 10H13.5V8.5C13.5 7.8 13.8 7.25 14.75 7.25H16V5.1C15.45 5.05 14.7 5 13.9 5C11.8 5 10.5 6.2 10.5 8.25V10H8V12.5H10.5V19H13.5V12.5Z" fill="white"/>
    </svg>
);
const InstagramIcon = ({size=20}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs><linearGradient id="igh" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFDC80"/><stop offset="50%" stopColor="#F77737"/><stop offset="100%" stopColor="#833AB4"/></linearGradient></defs>
        <rect width="24" height="24" rx="6" fill="url(#igh)"/>
        <rect x="6" y="6" width="12" height="12" rx="4" stroke="white" strokeWidth="1.5" fill="none"/>
        <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" fill="none"/>
        <circle cx="16.5" cy="7.5" r="1" fill="white"/>
    </svg>
);
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

function AnimatedCounter({ target, suffix='', duration=1500 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null); const started = useRef(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !started.current) {
                started.current = true;
                const t0 = performance.now();
                const tick = (now) => {
                    const p = Math.min((now-t0)/duration, 1);
                    setCount(Math.floor((1-Math.pow(1-p,3))*target));
                    if (p < 1) requestAnimationFrame(tick); else setCount(target);
                };
                requestAnimationFrame(tick);
            }
        }, { threshold: 0.5 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration]);
    return <span ref={ref}>{count}{suffix}</span>;
}

function BroadcastSignal() {
    const nodes = [
        {Icon:LinkedInIcon, label:'LinkedIn',  angle:-52, dist:148, cls:'np0'},
        {Icon:FacebookIcon, label:'Facebook',  angle:10,  dist:162, cls:'np1'},
        {Icon:InstagramIcon,label:'Instagram', angle:72,  dist:148, cls:'np2'},
    ];
    return (
        <div style={{position:'relative',width:'100%',height:320,display:'flex',alignItems:'center',justifyContent:'center',userSelect:'none'}}>
            <svg style={{position:'absolute',inset:0,width:'100%',height:'100%'}} viewBox="-200 -160 400 320">
                {nodes.map((n,i)=>{const r=n.angle*Math.PI/180; return <line key={i} x1="0" y1="0" x2={Math.cos(r)*n.dist} y2={Math.sin(r)*n.dist} stroke={F.mint} strokeOpacity="0.3" strokeWidth="1.5" className="dl" style={{animationDelay:`${i*.15+.3}s`}}/>;}) }
            </svg>
            <div style={{position:'absolute',width:56,height:56,borderRadius:'50%',border:`2px solid ${F.mint}`}} className="ring1"/>
            <div style={{position:'absolute',width:56,height:56,borderRadius:'50%',border:`2px solid ${F.teal}`}} className="ring2"/>
            <div style={{position:'absolute',width:56,height:56,borderRadius:'50%',border:'2px solid rgba(255,244,225,.2)'}} className="ring3"/>
            <div style={{position:'relative',zIndex:2,width:68,height:68,borderRadius:18,background:F.mint,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 48px rgba(137,215,183,.3)',fontSize:28}} className="floatY">✍️</div>
            {nodes.map((n,i)=>{const r=n.angle*Math.PI/180; return (
                <div key={i} className={n.cls} style={{position:'absolute',zIndex:2,display:'flex',flexDirection:'column',alignItems:'center',gap:6,transform:`translate(${Math.cos(r)*n.dist}px,${Math.sin(r)*n.dist}px)`}}>
                    <div style={{width:44,height:44,borderRadius:12,background:'rgba(255,255,255,.07)',border:'1px solid rgba(137,215,183,.2)',display:'flex',alignItems:'center',justifyContent:'center'}}><n.Icon size={22}/></div>
                    <span className="mono" style={{fontSize:9,color:'rgba(137,215,183,.5)',textTransform:'uppercase',letterSpacing:'.07em'}}>{n.label}</span>
                </div>
            );})}
        </div>
    );
}

const features = [
    {emoji:'🤖',title:'AI caption generator',desc:"Type a topic and pick a tone. Platform-specific captions generated in under a minute.",tag:'AI-powered'},
    {emoji:'📅',title:'Smart scheduler',desc:"Set a date and time once. Your post goes live automatically — no need to be online.",tag:'Set & forget'},
    {emoji:'📊',title:'Analytics dashboard',desc:"See what published, what failed, and why — with a 30-day history per platform.",tag:'Track growth'},
    {emoji:'⚡',title:'Post everywhere at once',desc:"Write it once, choose platforms, publish in one click. No more copy-pasting.",tag:'Save time'},
    {emoji:'🔗',title:'Secure OAuth login',desc:"Connect via official OAuth. We never see or store your social media passwords.",tag:'Secure'},
    {emoji:'🎨',title:'Content per platform',desc:"Different caption per platform in the same composer — because voice matters.",tag:'Flexible'},
];

export default function Home() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const cs = {maxWidth:1152,margin:'0 auto',padding:'0 24px'};

    return (
        <div className="inter" style={{minHeight:'100vh',background:'#fff',color:F.forest}}>
            <FontStyles/>
            {/* Navbar */}
            <nav style={{position:'sticky',top:0,zIndex:50,background:'rgba(255,255,255,.92)',backdropFilter:'blur(12px)',borderBottom:'1px solid rgba(26,49,44,.08)'}}>
                <div style={{...cs,height:64,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <button onClick={()=>navigate('/')} style={{display:'flex',alignItems:'center',gap:8,background:'none',border:'none',cursor:'pointer'}}>
                        <div style={{width:32,height:32,borderRadius:9,background:F.forest,display:'flex',alignItems:'center',justifyContent:'center'}}><span className="sg" style={{fontSize:11,fontWeight:700,color:F.mint}}>OS</span></div>
                        <span className="sg" style={{fontSize:15,fontWeight:600,color:F.forest}}>OneSocial</span>
                    </button>
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <button onClick={()=>navigate('/how-to-use')} style={{padding:'8px 14px',background:'none',border:'none',cursor:'pointer',fontSize:13,color:F.teal,fontFamily:'Inter,sans-serif',fontWeight:500}}>How it works</button>
                        <button onClick={()=>navigate('/login')} style={{padding:'8px 14px',background:'none',border:'none',cursor:'pointer',fontSize:13,color:F.teal,fontFamily:'Inter,sans-serif',fontWeight:500}}>Sign in</button>
                        <button onClick={()=>navigate('/register')} style={{padding:'9px 20px',background:F.forest,color:F.mint,border:'none',borderRadius:999,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'Inter,sans-serif'}}>Get started →</button>
                    </div>
                </div>
            </nav>

            {/* Hero — forest dark */}
            <section style={{background:F.forest}}>
                <div style={{...cs,paddingTop:64,paddingBottom:0,display:'grid',gridTemplateColumns:'1fr 1fr',gap:40,alignItems:'center'}}>
                    <div>
                        <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(137,215,183,.1)',border:'1px solid rgba(137,215,183,.22)',borderRadius:999,padding:'5px 14px',marginBottom:22}}>
                            <span style={{width:6,height:6,borderRadius:'50%',background:F.mint,display:'inline-block'}}/>
                            <span className="mono" style={{fontSize:10,color:F.mint,textTransform:'uppercase',letterSpacing:'.08em'}}>For creators, brands & social teams</span>
                        </div>
                        <h1 className="sg" style={{fontSize:'clamp(34px,4.5vw,54px)',fontWeight:700,color:'#fff',lineHeight:1.07,margin:'0 0 18px',letterSpacing:'-.02em'}}>
                            Write once.<br/><span style={{color:F.mint}}>Broadcast everywhere.</span>
                        </h1>
                        <p style={{fontSize:16,color:'rgba(137,215,183,.7)',lineHeight:1.75,margin:'0 0 30px',maxWidth:440}}>Stop retyping the same post into three apps. Connect LinkedIn, Facebook and Instagram once, publish or schedule to all of them. Free to start, no card required.</p>
                        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                            <button onClick={()=>navigate('/register')} style={{padding:'13px 28px',background:F.mint,color:F.forest,border:'none',borderRadius:12,fontSize:14,fontWeight:700,cursor:'pointer'}}>Create free account</button>
                            <button onClick={()=>navigate('/login')} style={{padding:'13px 28px',background:'rgba(255,255,255,.06)',color:'#fff',border:'1.5px solid rgba(255,255,255,.14)',borderRadius:12,fontSize:14,fontWeight:600,cursor:'pointer'}}>Sign in to your account</button>
                        </div>
                        <div style={{display:'flex',gap:22,marginTop:22,flexWrap:'wrap'}}>
                            {['No credit card','No setup fees','Instant access'].map(t=>(
                                <span key={t} style={{display:'flex',alignItems:'center',gap:5,fontSize:12,color:'rgba(137,215,183,.6)'}}><span style={{color:F.mint}}><CheckIcon/></span>{t}</span>
                            ))}
                        </div>
                    </div>
                    <BroadcastSignal/>
                </div>
                {/* Stats */}
                <div style={{...cs,paddingTop:32,paddingBottom:32,borderTop:'1px solid rgba(137,215,183,.1)',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
                    {[{value:3,suffix:'',label:'Platforms, one dashboard'},{value:60,suffix:'s',label:'To generate AI captions'},{value:30,suffix:'+',label:'Days of post history'},{value:0,suffix:'₹',label:'Cost to get started'}].map((s,i)=>(
                        <div key={i} style={{textAlign:'center'}}>
                            <p className="sg" style={{margin:0,fontSize:38,fontWeight:700,color:F.mint}}>{s.suffix==='₹'?'₹0':<AnimatedCounter target={s.value} suffix={s.suffix}/>}</p>
                            <p className="mono" style={{margin:'6px 0 0',fontSize:10,color:'rgba(137,215,183,.45)',textTransform:'uppercase',letterSpacing:'.07em'}}>{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features — cream */}
            <section style={{background:F.cream,padding:'80px 24px'}}>
                <div style={{maxWidth:1152,margin:'0 auto'}}>
                    <div style={{textAlign:'center',marginBottom:52}}>
                        <p className="mono" style={{fontSize:10,color:F.teal,textTransform:'uppercase',letterSpacing:'.12em',margin:'0 0 10px'}}>Everything you need</p>
                        <h2 className="sg" style={{fontSize:34,fontWeight:700,color:F.forest,margin:'0 0 12px'}}>Built for people who post often</h2>
                        <p style={{fontSize:16,color:F.teal,maxWidth:480,margin:'0 auto'}}>Every tool for managing your social presence, in one clean dashboard.</p>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))',gap:16}}>
                        {features.map((f,i)=>(
                            <div key={i} className="feat-card" style={{background:'#fff',border:'1.5px solid rgba(26,49,44,.09)',borderRadius:18,padding:24,transition:'all .25s',cursor:'default'}}>
                                <div style={{width:44,height:44,borderRadius:12,background:F.forest,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,marginBottom:14}}>{f.emoji}</div>
                                <span className="mono" style={{fontSize:9,color:F.teal,textTransform:'uppercase',letterSpacing:'.1em'}}>{f.tag}</span>
                                <h3 className="sg" style={{fontSize:15,fontWeight:600,color:F.forest,margin:'6px 0 8px'}}>{f.title}</h3>
                                <p style={{fontSize:13,color:F.teal,lineHeight:1.7,margin:0}}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works — white */}
            <section style={{background:'#fff',padding:'80px 24px',borderTop:'1px solid rgba(26,49,44,.07)'}}>
                <div style={{maxWidth:1152,margin:'0 auto'}}>
                    <div style={{textAlign:'center',marginBottom:52}}>
                        <p className="mono" style={{fontSize:10,color:F.teal,textTransform:'uppercase',letterSpacing:'.12em',margin:'0 0 10px'}}>Three steps</p>
                        <h2 className="sg" style={{fontSize:34,fontWeight:700,color:F.forest,margin:0}}>Up and running in minutes</h2>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:20}}>
                        {[
                            {step:'01',icon:'🔗',title:'Connect your accounts',desc:'Link LinkedIn, Facebook and Instagram with secure OAuth. No passwords stored — ever.'},
                            {step:'02',icon:'✍️',title:'Write or generate content',desc:'Type your post by hand, or let AI draft platform-specific captions from a topic and tone.'},
                            {step:'03',icon:'🚀',title:'Publish or schedule',desc:'Send it live now, or pick a future date and let OneSocial handle it automatically.'},
                        ].map((s,i)=>(
                            <div key={i} className="step-card" style={{background:F.cream,border:'1.5px solid rgba(26,49,44,.08)',borderRadius:18,padding:28,transition:'all .25s'}}>
                                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
                                    <span className="mono" style={{fontSize:10,fontWeight:700,color:F.teal,background:'rgba(66,132,117,.12)',padding:'4px 10px',borderRadius:6}}>{s.step}</span>
                                    <span style={{fontSize:22}}>{s.icon}</span>
                                </div>
                                <h3 className="sg" style={{fontSize:15,fontWeight:600,color:F.forest,margin:'0 0 8px'}}>{s.title}</h3>
                                <p style={{fontSize:13,color:F.teal,lineHeight:1.7,margin:0}}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who it's for */}
            <section style={{background:F.cream,padding:'80px 24px',borderTop:'1px solid rgba(26,49,44,.07)'}}>
                <div style={{maxWidth:1152,margin:'0 auto'}}>
                    <div style={{textAlign:'center',marginBottom:48}}>
                        <p className="mono" style={{fontSize:10,color:F.teal,textTransform:'uppercase',letterSpacing:'.12em',margin:'0 0 10px'}}>Use cases</p>
                        <h2 className="sg" style={{fontSize:34,fontWeight:700,color:F.forest,margin:'0 0 12px'}}>Who is OneSocial for?</h2>
                        <p style={{fontSize:16,color:F.teal,maxWidth:480,margin:'0 auto'}}>Whether you manage one brand or many, OneSocial saves you time every week.</p>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:18}}>
                        {[
                            {emoji:'👤',title:'Solo creators',desc:'Manage your personal brand across LinkedIn, Instagram and Facebook without juggling three apps.'},
                            {emoji:'💼',title:'Small businesses',desc:'Keep your pages active and consistent. Schedule a week of content in one sitting.'},
                            {emoji:'📣',title:'Social media managers',desc:'Handle multiple platforms from one dashboard. Draft faster with AI, stay ahead with scheduling.'},
                        ].map((c,i)=>(
                            <div key={i} className="use-card" style={{background:'#fff',border:'1.5px solid rgba(26,49,44,.09)',borderRadius:18,padding:28,transition:'all .25s'}}>
                                <div style={{fontSize:38,marginBottom:14}}>{c.emoji}</div>
                                <h3 className="sg" style={{fontSize:15,fontWeight:600,color:F.forest,margin:'0 0 8px'}}>{c.title}</h3>
                                <p style={{fontSize:13,color:F.teal,lineHeight:1.7,margin:0}}>{c.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section style={{padding:'0 24px 80px'}}>
                <div style={{maxWidth:1152,margin:'0 auto'}}>
                    <div style={{background:F.forest,borderRadius:24,padding:'64px 48px',textAlign:'center',position:'relative',overflow:'hidden'}}>
                        <div style={{position:'absolute',top:-40,right:-40,width:200,height:200,borderRadius:'50%',background:F.mint,opacity:.06}}/>
                        <div style={{position:'absolute',bottom:-50,left:-50,width:240,height:240,borderRadius:'50%',background:F.teal,opacity:.08}}/>
                        <div style={{position:'relative',zIndex:1}}>
                            <h2 className="sg" style={{fontSize:34,fontWeight:700,color:'#fff',margin:'0 0 14px'}}>Ready to post smarter?</h2>
                            <p style={{fontSize:16,color:'rgba(137,215,183,.7)',margin:'0 auto 32px',maxWidth:480}}>Create your free account, connect your platforms, and publish your first cross-platform post in minutes.</p>
                            <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
                                <button onClick={()=>navigate('/register')} style={{padding:'14px 32px',background:F.mint,color:F.forest,border:'none',borderRadius:12,fontSize:14,fontWeight:700,cursor:'pointer'}}>Create free account →</button>
                                <button onClick={()=>navigate('/login')} style={{padding:'14px 32px',background:'rgba(255,255,255,.07)',color:'#fff',border:'1.5px solid rgba(255,255,255,.15)',borderRadius:12,fontSize:14,fontWeight:600,cursor:'pointer'}}>Sign in</button>
                            </div>
                            <div style={{display:'flex',justifyContent:'center',gap:24,marginTop:24,flexWrap:'wrap'}}>
                                {['Free to use','No credit card','LinkedIn + Facebook + Instagram','AI captions included'].map(t=>(
                                    <span key={t} style={{display:'flex',alignItems:'center',gap:5,fontSize:12,color:'rgba(137,215,183,.55)'}}><span style={{color:F.mint}}><CheckIcon/></span>{t}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{borderTop:'1px solid rgba(26,49,44,.08)',padding:'32px 24px'}}>
                <div style={{maxWidth:1152,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <div style={{width:24,height:24,borderRadius:7,background:F.forest,display:'flex',alignItems:'center',justifyContent:'center'}}><span className="sg" style={{fontSize:9,fontWeight:700,color:F.mint}}>OS</span></div>
                        <span className="sg" style={{fontSize:13,fontWeight:600,color:F.forest}}>OneSocial</span>
                        <span style={{color:'#ccc'}}>·</span>
                        <span style={{fontSize:13,color:F.teal}}>Social Media Management</span>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:20}}>
                        <span style={{fontSize:13,color:F.teal}}>© 2026 OneSocial</span>
                        {[['Login','/login'],['Register','/register'],['Privacy Policy','/privacy']].map(([l,p])=>(
                            <button key={l} onClick={()=>navigate(p)} style={{background:'none',border:'none',cursor:'pointer',fontSize:13,color:F.teal}}>{l}</button>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}