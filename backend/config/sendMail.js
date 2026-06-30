const nodemailer = require('nodemailer');
require('dotenv').config();


console.log("EMAIL:", process.env.ADMIN_EMAIL);
console.log("PASS:", process.env.ADMIN_PASS);

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASS
    }
}
)

const sendMail = async (toEmail, subject, text) => {

    try {
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: toEmail,
            subject: subject,
            text
        }
        await transport.sendMail(mailOptions);

        console.log('Email Sent to User');
    }
    catch (error) {
        console.log("Something Wrong", error);
    }
}

// ── Helper to format platform list nicely ──────────────────
const formatPlatforms = (platforms) => {
    const enabled = Object.entries(platforms)
        .filter(([_, data]) => data.enabled)
        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));
    return enabled.join(', ');
};

// ── Helper to format content preview ────────────────────────
const getContentPreview = (platforms) => {
    const first = Object.values(platforms).find(p => p.enabled && p.content);
    if (!first) return '';
    return first.content.length > 150
        ? first.content.substring(0, 150) + '...'
        : first.content;
};

// send mail when post is scheduled
const sendScheduledEmail  =  async(userEmail, userName, post) => {
    const platformList = formatPlatforms(post.platforms);
    const preview = getContentPreview(post.platforms);
    const scheduledTime = new Date(post.scheduledAt).toLocaleString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long',
        day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #f9fafb;">
        <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 24px;">
                <div style="font-size: 40px;">📅</div>
                <h2 style="color: #1f2937; margin: 8px 0 0;">Post Scheduled!</h2>
            </div>

            <p style="color: #4b5563; font-size: 14px;">Hi ${userName || 'there'},</p>
            <p style="color: #4b5563; font-size: 14px;">Your post has been scheduled successfully and will go live automatically.</p>

            <div style="background: #eef2ff; border-radius: 12px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0 0 8px; font-size: 12px; color: #6366f1; font-weight: 600; text-transform: uppercase;">Scheduled For</p>
                <p style="margin: 0; font-size: 15px; color: #1f2937; font-weight: 600;">${scheduledTime}</p>
            </div>

            <div style="margin: 16px 0;">
                <p style="margin: 0 0 4px; font-size: 12px; color: #9ca3af; font-weight: 600; text-transform: uppercase;">Platforms</p>
                <p style="margin: 0; font-size: 14px; color: #1f2937;">${platformList}</p>
            </div>

            <div style="margin: 16px 0;">
                <p style="margin: 0 0 4px; font-size: 12px; color: #9ca3af; font-weight: 600; text-transform: uppercase;">Content Preview</p>
                <p style="margin: 0; font-size: 14px; color: #4b5563; background: #f9fafb; padding: 12px; border-radius: 8px; border-left: 3px solid #6366f1;">${preview}</p>
            </div>

            <p style="color: #9ca3af; font-size: 12px; margin-top: 24px; text-align: center;">
                You'll get another email once it's published.
            </p>
        </div>
    </div>`;
    await transport.sendMail({
        from: `"OneSocial" <${process.env.ADMIN_EMAIL}>`,
        to:userEmail,
        subject: `📅 Post scheduled for ${new Date(post.scheduledAt).toLocaleDateString()}`,
        html
    });
    console.log(`📧 Scheduled email sent to ${userEmail}`);
}

// send mail when post is published successfullly
const sendPublishEmail = async (userEmail, userName, post) => {

    const preview = getContentPreview(post.platforms);

    const platformRows = Object.entries(post.platforms)
        .filter(([_, data]) => data.enabled)
        .map(([key, data]) => {

            const icon = data.status === "published" ? "✅" : "❌";
            const color = data.status === "published" ? "#16a34a" : "#dc2626";

            return `
                <tr>
                    <td>${icon} ${key}</td>
                    <td style="color:${color}; text-align:right;">
                        ${data.status}
                    </td>
                </tr>
            `;
        })
        .join("");

    const html = `
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;background:#f9fafb;">
        <div style="background:white;padding:32px;border-radius:16px;">

            <div style="text-align:center;">
                <div style="font-size:40px;">🎉</div>
                <h2>Your Post Is Live!</h2>
            </div>

            <p>Hi ${userName || "there"},</p>

            <table width="100%">
                ${platformRows}
            </table>

            <br>

            <strong>Content</strong>

            <p>${preview}</p>

            <br>

            <a href="${process.env.FRONTEND_URL}/dashboard">
                Open Dashboard
            </a>

        </div>
    </div>
    `;

    await transport.sendMail({
        from: `"OneSocial" <${process.env.ADMIN_EMAIL}>`,
        to: userEmail,
        subject: "🎉 Your post is now live!",
        html
    });

    console.log(`📧 Published email sent to ${userEmail}`);
};

// send mail when post is failed
const sendFailedEmail = async (userEmail, userName, post) => {
    const failedPlatforms = Object.entries(post.platforms)
        .filter(([_, data]) => data.enabled && data.status === 'failed')
        .map(([key, data]) => {
            const label = key.charAt(0).toUpperCase() + key.slice(1);
            return `
                <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: #1f2937;">❌ ${label}</td>
                    <td style="padding: 8px 0; font-size: 12px; color: #dc2626; text-align: right;">${data.error || 'Unknown error'}</td>
                </tr>`;
        }).join('');

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #f9fafb;">
        <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 24px;">
                <div style="font-size: 40px;">⚠️</div>
                <h2 style="color: #1f2937; margin: 8px 0 0;">Action Needed</h2>
            </div>

            <p style="color: #4b5563; font-size: 14px;">Hi ${userName || 'there'},</p>
            <p style="color: #4b5563; font-size: 14px;">Unfortunately your post couldn't be published to the following platforms:</p>

            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                ${failedPlatforms}
            </table>

            <div style="background: #fef2f2; border-radius: 12px; padding: 16px; margin: 16px 0;">
                <p style="margin: 0; font-size: 13px; color: #991b1b;">
                    💡 This is often caused by an expired connection. Try reconnecting the platform from your dashboard.
                </p>
            </div>

            <div style="text-align: center; margin-top: 24px;">
                <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background: #dc2626; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
                    Reconnect Platform
                </a>
            </div>
        </div>
    </div>`;

    await transport.sendMail({
        from:    `"OneSocial" <${process.env.ADMIN_EMAIL}>`,
        to:      userEmail,
        subject: `⚠️ Action needed: post failed to publish`,
        html
    });

    console.log(`📧 Failed email sent to ${userEmail}`);
};

module.exports = {sendMail,sendScheduledEmail, sendFailedEmail,sendPublishEmail};