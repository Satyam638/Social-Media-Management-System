const mongoSanitize = require('mongo-sanitize');
const xss = require('xss');

const sanitizeMongo = (req,res,next) =>{

    if(req.body){
        req.body = mongoSanitize(req.body);
    }
    if(req.params){
        req.params = mongoSanitize(req.params);
    }
    if(req.query){
        req.query = mongoSanitize(req.query);
    }
    next();
};

// remove html tags from input 
// Input:  "<script>alert('hack')</script>"
// After:  "alert('hack')"  ← script tags removed
const sanitizeString = (str) =>{
    if(typeof str !== 'string') return str;
    return xss(str.trim());
}
// need to understand this code
const sanitizeObj = (obj) => {

    if (typeof obj === 'string') {
        return sanitizeString(obj);
    }

    if (obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(sanitizeObj);
    }

    if (typeof obj !== 'object') {
        return obj;
    }

    const sanitized = {};

    for (const key of Object.keys(obj)) {
        sanitized[key] = sanitizeObj(obj[key]);
    }

    return sanitized;
};

const sanitizeXSS = (req,res,next) =>{
    if(req.body){
        req.body = sanitizeObj(req.body);
    }
    next();
}

const sanitizeAll = [sanitizeMongo,sanitizeXSS];

module.exports = {
    sanitizeMongo,
    sanitizeString,
    sanitizeAll
};