const {body, params, validationResult} = require('express-validator');



const validate =(validations) =>{
    return async(req,res,next) =>{
        // check validation for each request where validation applied
        for(const validation of validations) {
            await validation.run(req);
        }

        // store error for failed validation
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            return next() // no error so move to controller
        }

        // now store failed validation error in correct manner
        const formattedErrors = errors.array().map(err => ({
            field:err.path,
            message:err.msg
        }));


        return res.status(400).json
        ({
            success:false,
            error:'Validation failed',
            errors:formattedErrors
        });
    };
};



// AUTH VALIDATIONS
const validateRegister = validate([
    body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is Required')
    .isLength({min:2,max:50})
    .withMessage('Name must be in 2-50 characters'),

    body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is Required')
    .isEmail()
    .withMessage('Invalid Email Format')
    .normalizeEmail() // it convert into lowercase and remove dots in gmail
    ,
    body('password')
    .notEmpty()
    .withMessage('Password is Required')
    .isLength({min:6})
    .withMessage('Password must be at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    ,
    body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['Admin'])
    .withMessage('Role must be Admin')
]);

const validateLogin = validate([
    body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is Required')
    .isEmail()
    .withMessage('Invalid Email Format'),

     body('password')
    .notEmpty()
    .withMessage('Password is Required')
]);

const validateOTP = validate([
    body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid Email Format'),

    body('otp')
    .notEmpty()
    .withMessage('OTP is required')
    .isNumeric()
    .withMessage('OTP be a number')
    .isLength({min:6,max:6})
    .withMessage('OTP must be of 6 numbers')
])

// POST VALIDATIONS

const validateCreatePost = validate([
    body('platforms')
    .notEmpty()
    .withMessage('Platforms object is required')
    .isObject()
    .withMessage('Platforms must be an object'),

    body('plaforms.linkedin.content')
    .optional()
    .notEmpty()
    .withMessage('Linkedin content must be a string').
    isLength({max:3000})
    .withMessage("Linkeidn content length cannot exceed 3000 characters"),

    body('plaforms.facebook.content')
    .optional()
    .notEmpty()
    .withMessage('Facebook content must be a string').
    isLength({max:63000})
    .withMessage("Facebook content length cannot exceed 63000 characters"),

    body('plaforms.instagram.content')
    .optional()
    .notEmpty()
    .withMessage('Instagram content must be a string').
    isLength({max:2200})
    .withMessage("Instagram content length cannot exceed 2200 characters"),
    body('scheduledAt')
    .optional()
    .isISO8601()
    .withMessage('scheduledAt must be a valid date')
    .custom((value) =>{
        if(new Date(value) <= new Date()) {
            throw new Error('scheduledAt must be a future date')
        }
        return true;
    }),
    body('imageUrl')
    .optional()
    .isURL()
    .withMessage('imageUrl must be a alid URL'),
]);

// AI POST GENERATION 
const validateGenerateCaptions = validate([
    body('topic')
        .trim()
        .notEmpty()
        .withMessage('Topic is required')
        .isLength({ min: 3, max: 500 })
        .withMessage('Topic must be 3-500 characters'),

    body('tone')
        .notEmpty()
        .withMessage('Tone is required')
        .isIn([
            'professional',
            'casual',
            'funny',
            'educational',
            'inspirational'
        ])
        .withMessage('Invalid Tone'),

    body('platforms')
        .isArray({ min: 1, max: 4 })
        .withMessage('Platforms must be an array with 1-4 items'),

    body('platforms.*')
        .isIn([
            'linkedin',
            'facebook',
            'instagram',
            'twitter'
        ])
        .withMessage('Invalid platform name')
]);

const validateForgotPassword = validate([
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format'),

    body('password')
        .notEmpty()
        .withMessage('New password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/\d/)
        .withMessage('Password must contain at least one number'),
]);

module.exports = {
    validateRegister,
    validateLogin,
    validateOTP,
    validateForgotPassword,
    validateGenerateCaptions,
    validateCreatePost
}