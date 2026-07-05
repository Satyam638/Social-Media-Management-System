// src/pages/HowToUse.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const FontStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        .fade-up { animation: fadeUp .5s ease-out forwards; }
    `}</style>
);

const LinkedInIcon  = ({ size=18 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#0A66C2"/><path d="M7.5 9.5H5V19H7.5V9.5Z" fill="white"/><circle cx="6.25" cy="6.75" r="1.5" fill="white"/><path d="M19 19H16.5V14C16.5 12.9 15.85 12 14.75 12C13.65 12 13 12.9 13 14V19H10.5V9.5H13V10.75C13.55 9.9 14.6 9.25 15.75 9.25C17.6 9.25 19 10.65 19 12.75V19Z" fill="white"/></svg>);
const FacebookIcon  = ({ size=18 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#1877F2"/><path d="M13.5 12.5H15.5L16 10H13.5V8.5C13.5 7.8 13.8 7.25 14.75 7.25H16V5.1C15.45 5.05 14.7 5 13.9 5C11.8 5 10.5 6.2 10.5 8.25V10H8V12.5H10.5V19H13.5V12.5Z" fill="white"/></svg>);
const InstagramIcon = ({ size=18 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="ig-htw" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFDC80"/><stop offset="50%" stopColor="#F77737"/><stop offset="100%" stopColor="#833AB4"/></linearGradient></defs><rect width="24" height="24" rx="6" fill="url(#ig-htw)"/><rect x="6" y="6" width="12" height="12" rx="4" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="16.5" cy="7.5" r="1" fill="white"/></svg>);

const steps = [
    {
        num: '01', icon: '🔗', title: 'Create your account',
        desc: 'Sign up with your email, verify it with the OTP we send, and you\'re in. Takes about 60 seconds.',
        detail: [
            'Click "Create free account" on the home page',
            'Fill in your name, email and password',
            'Check your inbox for a 6-digit verification code',
            'Enter the code to activate your account',
        ],
    },
    {
        num: '02', icon: '🔌', title: 'Connect your platforms',
        desc: 'Link LinkedIn, Facebook and Instagram through official OAuth. We never see or store your passwords.',
        detail: [
            'Go to the Dashboard and click "Connect" next to each platform',
            'You\'ll be redirected to the platform\'s official login page',
            'Approve the permissions and you\'ll be sent back automatically',
            'A green indicator means you\'re connected and ready to post',
        ],
    },
    {
        num: '03', icon: '✍️', title: 'Write or generate content',
        desc: 'Type your post manually with different content per platform, or use the AI generator to draft everything in one click.',
        detail: [
            'In the Compose tab, select which platforms to post to',
            'Write different captions per platform in the tabbed editor',
            'Or use the AI Caption Generator — enter a topic and tone',
            'AI generates 3 captions per platform, pick the one you like',
        ],
    },
    {
        num: '04', icon: '🖼️', title: 'Add images (optional)',
        desc: 'Upload images directly from your device. Instagram posts require an image — LinkedIn and Facebook make it optional.',
        detail: [
            'Click the image upload area under each platform\'s text box',
            'Upload JPG, PNG, or WebP — up to 10MB',
            'The image is uploaded to our secure media server',
            'Instagram requires an image; LinkedIn and Facebook don\'t',
        ],
    },
    {
        num: '05', icon: '🚀', title: 'Publish or schedule',
        desc: 'Send your post live to all selected platforms immediately, or pick a future date and time — OneSocial handles the rest.',
        detail: [
            'Choose "Post now" to publish immediately',
            'Choose "Schedule" to pick a future date and time',
            'Click "Publish now" or "Schedule post"',
            'Your post appears in the Published or Scheduled tab',
        ],
    },
    {
        num: '06', icon: '📊', title: 'Track your performance',
        desc: 'Open Analytics to see how many posts you\'ve published per platform, your success rate, and a 30-day posting history.',
        detail: [
            'Click "Analytics" in the sidebar',
            'See total posts, published vs failed, and success rates',
            'View the 30-day timeline chart with per-day hover tooltips',
            'Check recent activity at the bottom of the page',
        ],
    },
];

const faqs = [
    { q:'Is OneSocial free?',                ans:'Yes, completely free to use. No credit card required, no hidden fees.' },
    { q:'Which platforms are supported?',    ans:'LinkedIn, Facebook (Pages), and Instagram. Twitter/X support is coming soon.' },
    { q:'Does OneSocial store my passwords?',ans:'No. We use official OAuth for every platform. Your social media passwords are never sent to or stored by OneSocial.' },
    { q:'Can I post different content per platform?', ans:'Yes. The composer has a separate tab for each selected platform so you can write different captions for each one.' },
    { q:'What happens if a post fails?',     ans:'You\'ll see a failure status in the Published tab and on the Analytics page. Check that your platform is still connected and try again.' },
    { q:'Can I cancel a scheduled post?',    ans:'Yes. Go to the Scheduled tab, find the post, and click "Cancel scheduled post." It will be removed from the queue.' },
    { q:'How does the AI caption generator work?', ans:'You enter a topic and choose a tone (professional, casual, funny, etc.). OneSocial sends that to Groq AI and gets back 3 caption options per platform, each tailored to that platform\'s style and character limit.' },
];

export default function HowToUse() {
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = useState(null);
    const [activeStep, setActiveStep] = useState(0);

    return (
        <div style={{ minHeight:'100vh', background:'#FFF4E1', fontFamily:'Inter,sans-serif', color:'#1A312C' }}>
            <FontStyles/>

            {/* Navbar */}
            <nav style={{ position:'sticky', top:0, zIndex:50, background:'rgba(255,244,225,.92)', backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(26,49,44,.1)' }}>
                <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <button onClick={()=>navigate('/')} style={{ display:'flex', alignItems:'center', gap:9, background:'none', border:'none', cursor:'pointer', padding:0 }}>
                        <div style={{ width:30, height:30, borderRadius:8, background:'#1A312C', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <span style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:700, fontSize:10, color:'#89D7B7' }}>OS</span>
                        </div>
                        <span style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:600, fontSize:14, color:'#1A312C' }}>OneSocial</span>
                    </button>
                    <div style={{ display:'flex', gap:8 }}>
                        <button onClick={()=>navigate('/login')} style={{ padding:'8px 16px', background:'none', border:'1.5px solid rgba(26,49,44,.15)', borderRadius:9, fontSize:12, fontWeight:600, cursor:'pointer', color:'#428475', fontFamily:'Inter,sans-serif' }}>Sign in</button>
                        <button onClick={()=>navigate('/register')} style={{ padding:'8px 16px', background:'#1A312C', color:'#89D7B7', border:'none', borderRadius:9, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif' }}>Get started →</button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section style={{ background:'#1A312C', padding:'64px 24px 56px', textAlign:'center' }}>
                <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'rgba(137,215,183,.5)', textTransform:'uppercase', letterSpacing:'0.12em' }}>Guides</span>
                <h1 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:44, fontWeight:700, color:'#fff', margin:'12px 0 16px', letterSpacing:'-0.02em' }}>How to use OneSocial</h1>
                <p style={{ fontSize:15, color:'rgba(137,215,183,.65)', maxWidth:520, margin:'0 auto 32px', lineHeight:1.75 }}>
                    From creating your account to publishing across three platforms — here's everything you need to get started.
                </p>
                {/* Platform chips */}
                <div style={{ display:'flex', justifyContent:'center', gap:10, flexWrap:'wrap' }}>
                    {[[LinkedInIcon,'LinkedIn'],[FacebookIcon,'Facebook'],[InstagramIcon,'Instagram']].map(([Icon,l]) => (
                        <div key={l} style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 14px', background:'rgba(137,215,183,.08)', border:'1px solid rgba(137,215,183,.15)', borderRadius:999 }}>
                            <Icon size={15}/><span style={{ fontSize:12, color:'rgba(137,215,183,.8)', fontWeight:500 }}>{l}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Interactive step guide */}
            <section style={{ maxWidth:1100, margin:'0 auto', padding:'56px 24px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:24, alignItems:'start' }}>
                    {/* Step nav */}
                    <div style={{ position:'sticky', top:80, background:'#fff', borderRadius:18, border:'1.5px solid rgba(26,49,44,.08)', overflow:'hidden' }}>
                        {steps.map((s,i) => (
                            <button key={i} onClick={()=>setActiveStep(i)}
                                style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'14px 18px', border:'none', borderBottom: i<steps.length-1?'1px solid rgba(26,49,44,.07)':'none', cursor:'pointer', textAlign:'left', transition:'background .15s',
                                    background: activeStep===i ? '#1A312C' : 'transparent' }}>
                                <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, fontWeight:600, minWidth:20,
                                    color: activeStep===i ? '#89D7B7' : 'rgba(26,49,44,.3)' }}>{s.num}</span>
                                <span style={{ fontSize:13, fontWeight:600, fontFamily:'Inter,sans-serif',
                                    color: activeStep===i ? '#fff' : '#428475' }}>{s.title}</span>
                            </button>
                        ))}
                    </div>

                    {/* Step detail */}
                    <div key={activeStep} className="fade-up" style={{ background:'#fff', borderRadius:18, border:'1.5px solid rgba(26,49,44,.08)', padding:32 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
                            <div style={{ width:52, height:52, borderRadius:14, background:'#1A312C', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>{steps[activeStep].icon}</div>
                            <div>
                                <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'#428475', textTransform:'uppercase', letterSpacing:'0.1em' }}>Step {steps[activeStep].num}</span>
                                <h2 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:22, fontWeight:700, color:'#1A312C', margin:'4px 0 0', letterSpacing:'-0.01em' }}>{steps[activeStep].title}</h2>
                            </div>
                        </div>
                        <p style={{ fontSize:14, color:'#428475', lineHeight:1.75, margin:'0 0 24px', maxWidth:560 }}>{steps[activeStep].desc}</p>
                        <div style={{ background:'#FAFAF5', borderRadius:14, padding:'20px 24px', border:'1.5px solid rgba(26,49,44,.07)' }}>
                            <p style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:600, fontSize:12, color:'#1A312C', margin:'0 0 14px', textTransform:'uppercase', letterSpacing:'0.05em' }}>Step by step</p>
                            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                                {steps[activeStep].detail.map((d,i) => (
                                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                                        <div style={{ width:22, height:22, borderRadius:'50%', background:'#1A312C', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                                            <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:9, fontWeight:600, color:'#89D7B7' }}>{i+1}</span>
                                        </div>
                                        <p style={{ fontSize:13, color:'#1A312C', margin:0, lineHeight:1.6 }}>{d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Prev / Next */}
                        <div style={{ display:'flex', justifyContent:'space-between', marginTop:24 }}>
                            <button disabled={activeStep===0} onClick={()=>setActiveStep(p=>p-1)}
                                style={{ padding:'9px 18px', borderRadius:10, border:'1.5px solid rgba(26,49,44,.15)', background:'transparent', color: activeStep===0?'rgba(26,49,44,.25)':'#1A312C', fontSize:12, fontWeight:600, cursor: activeStep===0?'default':'pointer', fontFamily:'Inter,sans-serif' }}>
                                ← Previous
                            </button>
                            {activeStep < steps.length-1 ? (
                                <button onClick={()=>setActiveStep(p=>p+1)}
                                    style={{ padding:'9px 18px', borderRadius:10, border:'none', background:'#1A312C', color:'#89D7B7', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                                    Next →
                                </button>
                            ) : (
                                <button onClick={()=>navigate('/register')}
                                    style={{ padding:'9px 18px', borderRadius:10, border:'none', background:'#89D7B7', color:'#1A312C', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                                    Get started →
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Tips strip */}
            <section style={{ background:'#1A312C', padding:'48px 24px' }}>
                <div style={{ maxWidth:1100, margin:'0 auto' }}>
                    <p style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'rgba(137,215,183,.4)', textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 8px' }}>Pro tips</p>
                    <h2 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:26, fontWeight:700, color:'#fff', margin:'0 0 28px', letterSpacing:'-0.01em' }}>Get the most out of OneSocial</h2>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
                        {[
                            { icon:'🎨', tip:'Write different captions per platform', desc:'LinkedIn values professional insight. Instagram works better with hashtags and a casual tone. Don\'t use the same text for both.' },
                            { icon:'📅', tip:'Schedule a week ahead in one session', desc:'Use the scheduler to queue up 5–7 posts on a Sunday. Your content goes out automatically without you being online.' },
                            { icon:'✨', tip:'Use AI as a starting point', desc:'The AI generator gives you 3 options. Pick the closest one and tweak it to match your voice — it\'s faster than writing from scratch.' },
                        ].map((t,i) => (
                            <div key={i} style={{ background:'rgba(137,215,183,.06)', borderRadius:16, padding:'20px', border:'1px solid rgba(137,215,183,.12)' }}>
                                <div style={{ fontSize:24, marginBottom:10 }}>{t.icon}</div>
                                <p style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:600, fontSize:13, color:'#fff', margin:'0 0 8px' }}>{t.tip}</p>
                                <p style={{ fontSize:12, color:'rgba(137,215,183,.55)', lineHeight:1.65, margin:0 }}>{t.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section style={{ maxWidth:760, margin:'0 auto', padding:'64px 24px' }}>
                <div style={{ textAlign:'center', marginBottom:36 }}>
                    <p style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'#428475', textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 8px' }}>FAQ</p>
                    <h2 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:30, fontWeight:700, color:'#1A312C', margin:0, letterSpacing:'-0.01em' }}>Common questions</h2>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:0, border:'1.5px solid rgba(26,49,44,.1)', borderRadius:18, overflow:'hidden' }}>
                    {faqs.map((faq,i) => (
                        <div key={i} style={{ borderBottom: i<faqs.length-1?'1px solid rgba(26,49,44,.08)':'none' }}>
                            <button onClick={()=>setOpenFaq(openFaq===i?null:i)}
                                style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', background:'#fff', border:'none', cursor:'pointer', textAlign:'left', transition:'background .15s' }}
                                onMouseEnter={e=>e.currentTarget.style.background='rgba(26,49,44,.02)'}
                                onMouseLeave={e=>e.currentTarget.style.background='#fff'}>
                                <span style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:600, fontSize:14, color:'#1A312C' }}>{faq.q}</span>
                                <span style={{ fontSize:16, color:'#428475', transition:'transform .2s', transform: openFaq===i?'rotate(45deg)':'none', display:'inline-block', flexShrink:0, marginLeft:12 }}>+</span>
                            </button>
                            {openFaq===i && (
                                <div style={{ padding:'0 22px 18px', background:'#fff' }}>
                                    <p style={{ fontSize:13, color:'#428475', lineHeight:1.75, margin:0 }}>{faq.ans}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding:'0 24px 64px' }}>
                <div style={{ maxWidth:1100, margin:'0 auto' }}>
                    <div style={{ background:'#1A312C', borderRadius:24, padding:'48px', textAlign:'center', position:'relative', overflow:'hidden' }}>
                        <div style={{ position:'absolute', top:-30, right:-30, width:180, height:180, borderRadius:'50%', background:'#89D7B7', opacity:.06 }}/>
                        <div style={{ position:'relative', zIndex:1 }}>
                            <h2 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:28, fontWeight:700, color:'#fff', margin:'0 0 12px', letterSpacing:'-0.01em' }}>Ready to try it yourself?</h2>
                            <p style={{ fontSize:14, color:'rgba(137,215,183,.6)', margin:'0 0 24px' }}>Create your free account and publish your first post in minutes.</p>
                            <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                                <button onClick={()=>navigate('/register')} style={{ padding:'12px 28px', background:'#89D7B7', color:'#1A312C', border:'none', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'Space Grotesk,sans-serif' }}>
                                    Create free account →
                                </button>
                                <button onClick={()=>navigate('/login')} style={{ padding:'12px 28px', background:'rgba(255,255,255,.07)', color:'#fff', border:'1.5px solid rgba(255,255,255,.15)', borderRadius:12, fontSize:14, fontWeight:600, cursor:'pointer' }}>
                                    Sign in
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ borderTop:'1px solid rgba(26,49,44,.1)', padding:'24px', background:'#FFF4E1' }}>
                <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:22, height:22, borderRadius:6, background:'#1A312C', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <span style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:700, fontSize:8, color:'#89D7B7' }}>OS</span>
                        </div>
                        <span style={{ fontSize:13, fontWeight:600, color:'#1A312C' }}>OneSocial</span>
                    </div>
                    <div style={{ display:'flex', gap:20 }}>
                        {[['Home','/'],['Login','/login'],['Register','/register'],['Privacy','/privacy']].map(([l,p]) => (
                            <button key={l} onClick={()=>navigate(p)} style={{ background:'none', border:'none', fontSize:12, color:'#428475', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>{l}</button>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}