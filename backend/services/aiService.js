const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// let's define platform specific rules to generate content based on platform audience


const PLATFORM_RULE = {
    // linkedin: {
    //     maxChars: 3000,
    //     style: 'professional, insightful, detailed',
    //     hashtageRule: '3-5 professional hashtags at the end',
    //     emojiRule: "minimal emojis, professional tone",
    //     example: "Thought leadership, career insights, business announcements"
    // },
    linkedin: {
        maxChars: 3000,
        style: 'professional, insightful, detailed',
        hashtageRule: '3-5 professional hashtags at the end',
        emojiRule: "minimal emojis, professional tone",
        example: "Thought leadership, career insights, business announcements"
    },
    facebook: {
        maxChars: 500,
        style: 'conversational, friendly, engaging',
        hashtageRule: '2-3  relevant hashtags',
        emojiRule: "moderate emojis to boost engagement",
        example: "community posts,announcements,stories "
    },
    instagram: {
        maxChars: 2200,
        style: 'casual, visual, trendy',
        hashtageRule: '10-15 relevant hashtags at the end',
        emojiRule: "use emojis freely to make it visual and fun",
        example: "Visual Captions, lifestyle content, brand stories"
    }
    //  reddit:{
    //     maxChars:3000,
    //     style:'professional, insightful, detailed',
    //     hashtageRule:'3-5 professional hashtags at the end',
    //     emojiRule:"minimal emojis, professional tone",
    //     example:"Thought leadership, career insights, business announcements"
    // }
}

const TONE_DESCRIPTIONS = {
    professional: 'formal, authoritative, business-focused',
    casual: 'friendly, relaxed, conversational',
    funny: 'humorous, witty, sarcasm, lighthearted',
    inspirational: 'motivating, uplifting, empowering',
    educational: 'informative, clear, helpful'
};

const generateCaptionsForPlatform = async (topic, tone, platform) => {
    const rules = PLATFORM_RULE[platform];
    const toneDesc = TONE_DESCRIPTIONS[tone] || tone;

    const prompt = `You are a social media expert specializing in ${platform} content.

Generate exactly 3 caption suggestions for the following:

Topic: ${topic}
Tone: ${toneDesc}
Platform: ${platform}

Platform Rules:
- Style: ${rules.style}
- Maximum characters: ${rules.maxChars}
- Hashtags: ${rules.hashtagRule}
- Emojis: ${rules.emojiRule}
- Content type: ${rules.example}

IMPORTANT INSTRUCTIONS:
1. Generate EXACTLY 3 different caption suggestions
2. Each caption must be unique and approach the topic differently
3. Keep each caption under ${rules.maxChars} characters
4. Format your response as valid JSON only — no extra text
5. Use this exact format:

{
  "captions": [
    {
      "id": 1,
      "caption": "your first caption here",
      "charCount": 120
    },
    {
      "id": 2,
      "caption": "your second caption here",
      "charCount": 95
    },
    {
      "id": 3,
      "caption": "your third caption here",
      "charCount": 110
    }
  ]
}`;

console.log('Before Groq Call');

// calling groq model API 
    const response = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        //             ↑ fast and free model on Groq
        messages: [
            {
                role: 'system',
                content: 'You are a social media caption generator. Always respond with valid JSON only. No markdown, no explanation, just JSON.'
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        temperature: 0.8,
        //            ↑ higher = more creative suggestions
        max_tokens: 1000,
    });
    console.log('After Groq Call');

    // parse the JSON response
    const rawText = response.choices[0].message.content.trim();

    // clean response in case AI adds markdown code blocks
    const cleanText = rawText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

    const parsed = JSON.parse(cleanText);
    console.log("Captions: ",parsed.captions);
    return parsed.captions;
};


// ── Main function — generate for ALL selected platforms ────
const generateCaptions = async (topic, tone, platforms) => {
    // platforms = ['linkedin', 'facebook', 'instagram']

    const results = {};
    const errors = {};

    // generate for each platform in parallel
    await Promise.allSettled(
        platforms.map(async (platform) => {
            try {
                const captions = await generateCaptionsForPlatform(
                    topic,
                    tone,
                    platform
                );
                results[platform] = captions;
            } catch (err) {
                console.error(`AI failed for ${platform}:`, err.message);
                errors[platform] = err.message;
            }
        })
    );

    return { results, errors };
};

module.exports = { generateCaptions };

