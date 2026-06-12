const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async()=>{

    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB Successfully');
        console.log(process.env.MONGODB_URI);
    }
    catch(error){
        console.log('Failed to Connected',error.message);
        process.exit(1); // stop app if DB fails
    }
}


module.exports = connectDb;