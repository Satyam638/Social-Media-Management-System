const aiService = require('../config/ai.service');

const generatePost = async (req, res) => {

    try {
        const { topic, tone, platform } = req.body;

        if (!topic || !tone || !platform) return res.status(400).json({ success: false, message: "Tone, Topic and Pltform are required" });

        console.log('Lets generate Post Caption for You');
        const generatedContent = await aiService.generateSocialPost(topic, tone, platform);

        return res.status(200).json({
            success: true,
            message: "Generate Post SuccessFully",
            generatedContent 
        });
    } catch (err) {

        console.error('AI generation error:',err.message);
        return res.status(500).json({
            success: false,
            error: 'AI generation failed'
        });
    }
}

module.exports = {generatePost};