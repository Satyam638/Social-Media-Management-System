const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash'
});

const generateSocialPost = async (topic, tone, platform) => {


    console.log('Model is Working');
    const prompt = `
    Generate a ${tone} social media post 
    for ${platform} about: 
   "${topic}"
   Make it engaging and concise and also add relevant Hashtags.`;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    }
    catch (err) {
        console.error('Gemini Full Error:',err);
        throw err;
    }
}


module.exports = { generateSocialPost };