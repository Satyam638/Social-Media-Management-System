const jwt = require('jsonwebtoken');
const userModel = require('../model/user.model');
const { postToLinkedIn } = require('../platforms/linkedin/linkedinService')

const isValidField = async (req, res, next) => {

    try {
        const { name, email, password, role } = req.body;


        if (!name || name.length < 4) return res.status(422).json("Name must be in atleast in 4 characters");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return res.status(422).json("Email must be present")

        if (!emailRegex.test(email)) return res.status(422).json("Email must be in correct format")

        if (!password || password.length < 6) return res.status(422).json("Password must be atleast in 6 length")

        const userrole = ['admin', 'superadmin']
        if (!role || userrole.includes(role)) return res.status(422).json("Role can be admin or superadmin");


        console.log("All fields are valid");
        next();

    }
    catch (error) {
        console.log("error occured:", error);
    }
}
const isValidUser = (req, res, next) => {
    try {
        let token = null;

        // check Authorization header first (Postman)
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
            console.log('Token from header');
        }

        // check cookie (browser)
        if (!token && req.cookies?.token) {
            token = req.cookies.token;  // ✅ fixed
            console.log('Token from cookie');
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        console.log('Valid User:', decoded);
        next();

    } catch (err) {
        console.error('Auth error:', err.message);
        return res.status(401).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
};
const isConnectedtoLinkedIn = async (req, res, next) => {
    try {

        const user = await userModel.findById(id);

        if (!user.platforms.linkedin.isConnected) res.status(422).json({ success: false, message: 'Please Connect to PlatForm First' });

        console.log('Your Are Connected to Platform');
        next();
    } catch (err) {
        console.log(err.message);
        return res.status(401).json("Internal Server Error");
    }
}
// characters define for each content length for consistency of platform oriented content
const validatePlatforms = (platforms) => {
    const errors = [];

    const PLATFORM_LIMITS = {
        linkedin:  3000,
        instagram: 2200,
        twitter:   280,
        facebook:  63000
    };

    const knownPlatforms = Object.keys(PLATFORM_LIMITS);

    Object.entries(platforms).forEach(([platform, data]) => {
        // skip unknown platforms
        if (!knownPlatforms.includes(platform)) return;

        // skip disabled platforms
        if (!data.enabled) return;

        // content required for all enabled platforms
        if (!data.content || data.content.trim() === '') {
            errors.push(`${platform}: content is required`);
            return;
        }

        // character limit check
        const limit = PLATFORM_LIMITS[platform];
        if (data.content.length > limit) {
            errors.push(
                `${platform}: content exceeds ${limit} character limit`
            );
        }
    });

    // Instagram ALWAYS requires image — outside forEach so runs once
    if (platforms.instagram?.enabled && !platforms.instagram?.imageUrl) {
        errors.push('instagram: image is required for Instagram posts');
    }

    // LinkedIn and Facebook do NOT require image
    // no check needed for them

    return errors;
};

const deterMineOverallStatus = (platforms) => {

    // only get whose platfrom is selected
    const selectedPlatforms = Object.values(platforms).filter(p => p.enabled);

    // check any selected or not

    if (selectedPlatforms.length === 0) return 'failed'

    // now check status 

    // if every true then return published
    const allPublished = selectedPlatforms.every(p => p.status === 'published');
    // else return false 
    const allFailed = selectedPlatforms.every(p => p.status === 'failed');


    if (allPublished) return 'published';

    if (allFailed) return 'failed';

    return 'partial';
};



module.exports = { isValidField, isValidUser, isConnectedtoLinkedIn, validatePlatforms, deterMineOverallStatus };