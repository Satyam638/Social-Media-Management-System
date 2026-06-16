// src/pages/PrivacyPolicy.jsx
import { useNavigate } from 'react-router-dom';

const sections = [
    {
        title: '1. Who We Are',
        content: `OneSocial is a social media management platform that allows users to connect their LinkedIn, Facebook, and Instagram accounts and publish or schedule content from a single dashboard. OneSocial is operated by Satyam Gupta, based in India.

If you have any questions about this policy, contact us at satyamgupta55591@gmail.com.`
    },
    {
        title: '2. What Information We Collect',
        content: `When you use OneSocial, we collect the following information:

Account Information
- Your full name and email address when you register
- A hashed (encrypted) version of your password — your real password is never stored

Social Media Tokens
- OAuth access tokens for LinkedIn, Facebook, and Instagram when you connect those accounts
- These tokens are used solely to publish content on your behalf and are stored securely in our database

Post Content
- The text and image content of posts you create or schedule through OneSocial
- This content is stored in our database to support scheduling, history, and analytics features

Profile Picture
- If you upload a profile picture, it is stored via Cloudinary (a secure media hosting service)`
    },
    {
        title: '3. How We Use Your Information',
        content: `We use the information we collect to:

- Authenticate you and manage your account securely
- Connect to LinkedIn, Facebook, and Instagram on your behalf using your OAuth tokens
- Publish or schedule posts to your connected social media accounts
- Generate AI-powered captions using Groq AI based on the topic and tone you provide
- Display your post history and analytics in the dashboard
- Send OTP verification emails when you register or reset your password`
    },
    {
        title: '4. How We Share Your Information',
        content: `We do not sell, rent, or share your personal data with any third parties for advertising or marketing purposes.

We share data only with the following services, strictly to operate OneSocial:

- LinkedIn API — to publish posts to your LinkedIn account
- Facebook Graph API — to publish posts to your Facebook Page and Instagram account
- Groq AI — to generate captions based on your topic input (only your topic and tone are sent, not your account details)
- Cloudinary — to store and serve images you upload
- Nodemailer / Gmail SMTP — to send OTP verification emails

None of these services receive more data than is necessary to perform their function.`
    },
    {
        title: '5. Data Storage and Security',
        content: `Your data is stored in a MongoDB database hosted on a secure cloud server. We take the following steps to protect your data:

- Passwords are hashed using bcrypt before storage — we cannot see your password
- JWT tokens are stored in HTTP-only cookies to prevent JavaScript access
- OAuth tokens are stored securely and used only to interact with the respective social media platforms
- All communication between your browser and our servers uses HTTPS

While we take reasonable measures to protect your data, no system is completely secure. We encourage you to use a strong, unique password for your OneSocial account.`
    },
    {
        title: '6. Your Rights',
        content: `You have the right to:

- Access the data we hold about you
- Request correction of inaccurate data
- Request deletion of your account and all associated data
- Disconnect any connected social media account at any time from the dashboard

To exercise any of these rights, email us at satyamgupta55591@gmail.com and we will respond within 7 business days.`
    },
    {
        title: '7. Social Media Platform Policies',
        content: `By connecting your social media accounts through OneSocial, you are also subject to the terms and privacy policies of those platforms:

- LinkedIn: https://www.linkedin.com/legal/privacy-policy
- Facebook & Instagram: https://www.facebook.com/privacy/policy/
        
OneSocial only requests the minimum permissions required to publish content on your behalf. We do not access your friends lists, messages, or any data beyond what is needed to post.`
    },
    {
        title: '8. Cookies',
        content: `OneSocial uses a single HTTP-only cookie to maintain your login session. This cookie:

- Is not used for advertising or tracking
- Is not accessible by JavaScript
- Expires after 7 days or when you log out
- Is required for the application to function

We do not use any third-party tracking or advertising cookies.`
    },
    {
        title: '9. Data Retention',
        content: `We retain your data for as long as your account is active. If you request account deletion, we will permanently delete your account, OAuth tokens, post history, and all associated data within 7 business days.`
    },
    {
        title: '10. Children\'s Privacy',
        content: `OneSocial is not intended for use by anyone under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with their personal information, please contact us and we will delete it promptly.`
    },
    {
        title: '11. Changes to This Policy',
        content: `We may update this Privacy Policy from time to time. When we do, we will update the "Last Updated" date at the top of this page. We encourage you to review this page periodically. Continued use of OneSocial after changes are posted constitutes your acceptance of the updated policy.`
    },
    {
        title: '12. Contact Us',
        content: `If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:

Satyam Gupta
Email: satyamgupta55591@gmail.com
Location: India`
    },
];

export default function PrivacyPolicy() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white font-sans">

            {/* ── Navbar ─────────────────────────────────────────────── */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                            OS
                        </div>
                        <span className="text-sm font-semibold text-gray-900">OneSocial</span>
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                        ← Back
                    </button>
                </div>
            </nav>

            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="bg-gray-50 border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">Legal</p>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
                    <p className="text-gray-500 text-sm">
                        Last updated: <span className="font-medium text-gray-700">June 2026</span>
                    </p>
                    <p className="text-gray-600 mt-4 max-w-2xl leading-relaxed">
                        At OneSocial, your privacy matters. This policy explains what data we collect,
                        why we collect it, how we use it, and what rights you have over it.
                        We keep this simple and honest — no legal jargon.
                    </p>
                </div>
            </div>

            {/* ── Content ────────────────────────────────────────────── */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="space-y-10">
                    {sections.map((section, i) => (
                        <div key={i} className="border-b border-gray-100 pb-10 last:border-0">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                {section.title}
                            </h2>
                            <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                {section.content.split('\n').map((line, j) => {
                                    if (line.trim() === '') return <br key={j} />;
                                    if (line.startsWith('- ')) {
                                        return (
                                            <div key={j} className="flex gap-2 mb-1">
                                                <span className="text-indigo-400 mt-0.5 flex-shrink-0">•</span>
                                                <span>{line.replace('- ', '')}</span>
                                            </div>
                                        );
                                    }
                                    if (line.match(/^[A-Z][a-zA-Z\s]+$/) && !line.includes('.')) {
                                        return <p key={j} className="font-semibold text-gray-800 mt-4 mb-2">{line}</p>;
                                    }
                                    return <p key={j} className="mb-1">{line}</p>;
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Contact CTA ─────────────────────────────────────── */}
                <div className="mt-12 bg-indigo-50 border border-indigo-100 rounded-2xl p-8 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Have a question about your data?</h3>
                    <p className="text-gray-500 text-sm mb-4">We're happy to help. Reach out and we'll respond within 7 business days.</p>
                    <a
                        href="mailto:satyamgupta55591@gmail.com"
                        className="inline-block px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                        satyamgupta55591@gmail.com
                    </a>
                </div>
            </div>

            {/* ── Footer ─────────────────────────────────────────────── */}
            <footer className="border-t border-gray-100 py-8 mt-8">
                <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">OS</div>
                        <span className="text-sm font-semibold text-gray-700">OneSocial</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-sm text-gray-400">Social Media Management</span>
                    </div>
                    <span className="text-sm text-gray-400">© 2026 OneSocial · All rights reserved</span>
                </div>
            </footer>
        </div>
    );
}