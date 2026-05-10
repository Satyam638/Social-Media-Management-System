const jwt = require('jsonwebtoken');
const userModel = require('../model/user.model');


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
module.exports = { isValidField, isValidUser, isConnectedtoLinkedIn};