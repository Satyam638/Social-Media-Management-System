const jwt = require('jsonwebtoken');
const userModel = require('../model/user.model');
const {postToLinkedIn} = require('../platforms/linkedin/linkedinService')

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
const isValidUser = async (req, res, next) => {
    try {
        // read from cookie OR Authorization header
        let token = req.cookies?.token;

        if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1]; // Bearer <token>
        }

        if (!token) {
            return res.status(401).json('Unauthorized');
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        console.log('Valid User:', decoded);
        next();
    } catch (err) {
        return res.status(401).json("Invalid token");
    }
};
const isConnectedtoLinkedIn = async(req,res,next)=>{
    try{

        const user = await userModel.findById(id);

        if(!user.platforms.linkedin.isConnected) res.status(422).json({success:false,message:'Please Connect to PlatForm First'});
        
        console.log('Your Are Connected to Platform');
        next();
    } catch (err) {
        console.log(err.message);
        return res.status(401).json("Internal Server Error");
    }
}


// characters define for each content length for consistency of platform oriented content
const PLATFORM_LIMITS = {
    linkedin:3000,
    facebook:63000,
    instagram:2200,
    twitter:280
};

const validatePlatforms = (platforms)=>{
    const errors = [];

    // get list of know platforms
    const knownPlatforms = Object.keys(PLATFORM_LIMITS);

    // check if any unknown platform was sent or not

    Object.keys(platforms).forEach(platform =>{
        if(!knownPlatforms.includes(platform)){
            errors.push(`Unknown Platform : ${platform}`)
        }
    });

    // check is platform enabled(selected) or not
    Object.entries(platforms).forEach(([platform,data]) => {
        // skip disabled platforms
        if(!data.enabled) return;

        // if enabled then content of that platform must provided
        if(!data.content || data.content.trim === '') 
        {
            errors.push(`${platform}: content is not required when platform is enabled `);
            return;
        }

        // if content is provided then length of content should not more than defined
        const limit = PLATFORM_LIMITS[platform]

        if(data.content.length>limit){
            errors.push(
                `${platform}: content is ${data.content.length} chars ` +
                `but limit is ${limit} chars ` +
                `(${data.content.length - limit} over limit)`
            );
        }
    })
    return errors;
};

const deterMineOverallStatus = (platforms)=>{

    // only get whose platfrom is selected
    const selectedPlatforms = Object.values(platforms).filter(p=>p.enabled);

    // check any selected or not
    
    if(selectedPlatforms.length === 0) return 'failed'

    // now check status 

    // if every true then return published
    const allPublished = selectedPlatforms.every(p=>p.status === 'published');
    // else return false 
    const allFailed = selectedPlatforms.every(p=>p.status === 'failed');


    if(allPublished) return 'published';

    if(allFailed) return 'failed';

    return 'partial';
};



module.exports = { isValidField, isValidUser, isConnectedtoLinkedIn,validatePlatforms,deterMineOverallStatus};