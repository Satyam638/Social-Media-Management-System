// src/pages/PrivacyPolicy.jsx
import { useNavigate } from 'react-router-dom';

const FontStyles = () => (
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap'); *{box-sizing:border-box;}`}</style>
);

const sections = [
    { title:'1. Who We Are', content:`OneSocial is a social media management platform that allows users to connect their LinkedIn, Facebook, and Instagram accounts and publish or schedule content from a single dashboard. OneSocial is operated by Satyam Gupta, based in India.\n\nIf you have any questions about this policy, contact us at satyamgupta55591@gmail.com.` },
    { title:'2. What Information We Collect', content:`When you use OneSocial, we collect the following information:\n\nAccount Information\n- Your full name and email address when you register\n- A hashed (encrypted) version of your password — your real password is never stored\n\nSocial Media Tokens\n- OAuth access tokens for LinkedIn, Facebook, and Instagram when you connect those accounts\n- These tokens are used solely to publish content on your behalf and are stored securely\n\nPost Content\n- The text and image content of posts you create or schedule through OneSocial\n\nProfile Picture\n- If you upload a profile picture, it is stored via Cloudinary (a secure media hosting service)` },
    { title:'3. How We Use Your Information', content:`We use the information we collect to:\n\n- Authenticate you and manage your account securely\n- Connect to LinkedIn, Facebook, and Instagram on your behalf using your OAuth tokens\n- Publish or schedule posts to your connected social media accounts\n- Generate AI-powered captions using Groq AI based on the topic and tone you provide\n- Display your post history and analytics in the dashboard\n- Send OTP verification emails when you register or reset your password` },
    { title:'4. How We Share Your Information', content:`We do not sell, rent, or share your personal data with any third parties for advertising or marketing purposes.\n\nWe share data only with the following services, strictly to operate OneSocial:\n\n- LinkedIn API — to publish posts to your LinkedIn account\n- Facebook Graph API — to publish posts to your Facebook Page and Instagram account\n- Groq AI — to generate captions based on your topic input (only your topic and tone are sent)\n- Cloudinary — to store and serve images you upload\n- Nodemailer / Gmail SMTP — to send OTP verification emails` },
    { title:'5. Data Storage and Security', content:`Your data is stored in a MongoDB database hosted on a secure cloud server. We take the following steps to protect your data:\n\n- Passwords are hashed using bcrypt before storage — we cannot see your password\n- JWT tokens are stored in HTTP-only cookies to prevent JavaScript access\n- OAuth tokens are stored securely and used only to interact with the respective platforms\n- All communication between your browser and our servers uses HTTPS` },
    { title:'6. Your Rights', content:`You have the right to:\n\n- Access the data we hold about you\n- Request correction of inaccurate data\n- Request deletion of your account and all associated data\n- Disconnect any connected social media account at any time from the dashboard\n\nTo exercise any of these rights, email us at satyamgupta55591@gmail.com and we will respond within 7 business days.` },
    { title:'7. Social Media Platform Policies', content:`By connecting your social media accounts through OneSocial, you are also subject to the terms and privacy policies of those platforms:\n\n- LinkedIn: https://www.linkedin.com/legal/privacy-policy\n- Facebook & Instagram: https://www.facebook.com/privacy/policy/\n\nOneSocial only requests the minimum permissions required to publish content on your behalf.` },
    { title:'8. Cookies', content:`OneSocial uses a single HTTP-only cookie to maintain your login session. This cookie:\n\n- Is not used for advertising or tracking\n- Is not accessible by JavaScript\n- Expires after 7 days or when you log out\n- Is required for the application to function\n\nWe do not use any third-party tracking or advertising cookies.` },
    { title:'9. Data Retention', content:`We retain your data for as long as your account is active. If you request account deletion, we will permanently delete your account, OAuth tokens, post history, and all associated data within 7 business days.` },
    { title:'10. Children\'s Privacy', content:`OneSocial is not intended for use by anyone under the age of 13. We do not knowingly collect personal information from children.` },
    { title:'11. Changes to This Policy', content:`We may update this Privacy Policy from time to time. When we do, we will update the "Last Updated" date at the top of this page. Continued use of OneSocial after changes are posted constitutes your acceptance of the updated policy.` },
    { title:'12. Contact Us', content:`If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:\n\nSatyam Gupta\nEmail: satyamgupta55591@gmail.com\nLocation: India` },
];

function renderContent(text) {
    return text.split('\n').map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height:10 }}/>;
        if (line.startsWith('- ')) return (
            <div key={i} style={{ display:'flex', gap:10, margin:'4px 0' }}>
                <span style={{ color:'#89D7B7', fontWeight:700, flexShrink:0 }}>•</span>
                <span>{line.slice(2)}</span>
            </div>
        );
        if (line.match(/^[A-Z][a-zA-Z\s]+$/) && !line.includes('.')) return (
            <p key={i} style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:600, fontSize:13, color:'#1A312C', margin:'14px 0 6px' }}>{line}</p>
        );
        return <p key={i} style={{ margin:'3px 0', lineHeight:1.7 }}>{line}</p>;
    });
}

export default function PrivacyPolicy() {
    const navigate = useNavigate();
    return (
        <div style={{ minHeight:'100vh', background:'#FFF4E1', fontFamily:'Inter,sans-serif', color:'#1A312C' }}>
            <FontStyles/>

            {/* Navbar */}
            <nav style={{ position:'sticky', top:0, zIndex:50, background:'rgba(255,244,225,.92)', backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(26,49,44,.1)' }}>
                <div style={{ maxWidth:900, margin:'0 auto', padding:'0 24px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <button onClick={()=>navigate('/')} style={{ display:'flex', alignItems:'center', gap:9, background:'none', border:'none', cursor:'pointer', padding:0 }}>
                        <div style={{ width:30, height:30, borderRadius:8, background:'#1A312C', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <span style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:700, fontSize:10, color:'#89D7B7' }}>OS</span>
                        </div>
                        <span style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:600, fontSize:14, color:'#1A312C' }}>OneSocial</span>
                    </button>
                    <button onClick={()=>navigate(-1)} style={{ background:'none', border:'none', fontSize:13, color:'#428475', cursor:'pointer', fontFamily:'Inter,sans-serif', fontWeight:500 }}>← Back</button>
                </div>
            </nav>

            {/* Header */}
            <div style={{ background:'#1A312C', padding:'56px 24px 48px' }}>
                <div style={{ maxWidth:900, margin:'0 auto' }}>
                    <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'rgba(137,215,183,.5)', textTransform:'uppercase', letterSpacing:'0.12em' }}>Legal</span>
                    <h1 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:40, fontWeight:700, color:'#fff', margin:'10px 0 10px', letterSpacing:'-0.02em' }}>Privacy Policy</h1>
                    <p style={{ fontSize:12, color:'rgba(137,215,183,.4)', fontFamily:'JetBrains Mono,monospace', margin:'0 0 20px' }}>Last updated: June 2026</p>
                    <p style={{ fontSize:14, color:'rgba(137,215,183,.65)', lineHeight:1.75, maxWidth:580, margin:0 }}>
                        At OneSocial, your privacy matters. This policy explains what data we collect, why we collect it, how we use it, and what rights you have over it. No legal jargon — just plain language.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth:900, margin:'0 auto', padding:'48px 24px' }}>
                {/* Quick nav chips */}
                <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:40 }}>
                    {sections.slice(0,6).map((s,i) => (
                        <a key={i} href={`#section-${i}`}
                            style={{ padding:'5px 14px', borderRadius:999, border:'1.5px solid rgba(26,49,44,.15)', fontSize:12, color:'#428475', textDecoration:'none', fontWeight:500, background:'#fff', transition:'all .15s' }}
                            onMouseEnter={e=>{ e.target.style.borderColor='#89D7B7'; e.target.style.color='#1A312C'; }}
                            onMouseLeave={e=>{ e.target.style.borderColor='rgba(26,49,44,.15)'; e.target.style.color='#428475'; }}>
                            {s.title.split('.')[0]}. {s.title.split('. ')[1]}
                        </a>
                    ))}
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                    {sections.map((section, i) => (
                        <div key={i} id={`section-${i}`} style={{ borderBottom:'1px solid rgba(26,49,44,.08)', padding:'32px 0', display:'grid', gridTemplateColumns:'280px 1fr', gap:32 }}>
                            <div>
                                <h2 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:15, fontWeight:600, color:'#1A312C', margin:0, lineHeight:1.3 }}>{section.title}</h2>
                            </div>
                            <div style={{ fontSize:13, color:'#428475', lineHeight:1.75 }}>
                                {renderContent(section.content)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div style={{ background:'#1A312C', borderRadius:20, padding:'36px 36px', textAlign:'center', marginTop:48 }}>
                    <div style={{ width:48, height:48, borderRadius:14, background:'#89D7B7', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:22 }}>📬</div>
                    <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:18, fontWeight:700, color:'#fff', margin:'0 0 8px' }}>Have a question about your data?</h3>
                    <p style={{ fontSize:13, color:'rgba(137,215,183,.6)', margin:'0 0 20px' }}>We're happy to help. Reach out and we'll respond within 7 business days.</p>
                    <a href="mailto:satyamgupta55591@gmail.com"
                        style={{ display:'inline-block', padding:'11px 24px', background:'#89D7B7', color:'#1A312C', borderRadius:12, fontSize:13, fontWeight:700, textDecoration:'none', fontFamily:'Space Grotesk,sans-serif' }}>
                        satyamgupta55591@gmail.com
                    </a>
                </div>
            </div>

            {/* Footer */}
            <footer style={{ borderTop:'1px solid rgba(26,49,44,.1)', padding:'24px', background:'#FFF4E1' }}>
                <div style={{ maxWidth:900, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:22, height:22, borderRadius:6, background:'#1A312C', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <span style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:700, fontSize:8, color:'#89D7B7' }}>OS</span>
                        </div>
                        <span style={{ fontSize:13, fontWeight:600, color:'#1A312C' }}>OneSocial</span>
                    </div>
                    <span style={{ fontSize:12, color:'#428475' }}>© 2026 OneSocial · All rights reserved</span>
                </div>
            </footer>
        </div>
    );
}