const { generateCaptions } = require('../services/aiService');

const generatePostCaptions = async (req, res) => {
    try {
        const { topic, tone, platforms } = req.body;  // ✅ platforms (plural)

        if (!topic || topic.trim() === '') {
            return res.status(400).json({ success: false, error: "Topic is required" });
        }
        if (!tone) {
            return res.status(400).json({ success: false, error: "Tone is required" });
        }
        if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
            return res.status(400).json({ success: false, error: "At least one platform is required" });
        }

        const validPlatforms = ['linkedin', 'facebook', 'instagram'];
        const invalidPlatforms = platforms.filter(p => !validPlatforms.includes(p));  // ✅ fixed logic + dot
        if (invalidPlatforms.length > 0) {
            return res.status(400).json({ success: false, error: `Invalid platforms: ${invalidPlatforms.join(', ')}` });
        }

        const validTones = ['professional', 'casual', 'funny', 'inspirational', 'educational'];
        if (!validTones.includes(tone)) {  // ✅ .includes() not ()
            return res.status(400).json({ success: false, error: `Invalid tone. Must be: ${validTones.join(', ')}` });
        }

        console.log(`🤖 Generating captions for: "${topic}" | Tone: ${tone} | Platforms: ${platforms.join(', ')}`);  // ✅

        const { results, errors } = await generateCaptions(topic, tone, platforms);
        console.log('Result:',results);
        return res.status(200).json({
            success: true,
            message: "Captions generated successfully",
            captions: results,
            errors: Object.keys(errors).length > 0 ? errors : undefined
        });

    } catch (err) {
        console.error('AI generation error:', err.message);
        return res.status(500).json({ success: false, error: 'AI failed to generate captions' });
    }
};

module.exports = { generatePostCaptions };