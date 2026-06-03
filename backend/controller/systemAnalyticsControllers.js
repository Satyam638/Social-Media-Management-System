const postModel = require('../model/post.model');
const userModel = require('../model/user.model');
const mongoose = require('mongoose');


const systemAnalyticsDashboard = (req,res)=>{

    try{
        const userId = req.user.id;
        const objId = new mongoose.Types.ObjectId(userId);

        const [
            overviewResult,
            platformResult,
            timelineResult,
            successResult,
            recentResult,
            userResult
        ] = Promise.all([
            // query 1 -> overview Result

            // postModel.aggregate([
            //     // filter user with this userID
            //     { $match:{userId:objId}},
            //     // now group all the post of the user by overvstatus
            //     {
            //         $group:{
            //             _id:null
            //         }
            //     }
            // ])
        ])
    }
    catch(error){

    }




}

module.exports = {systemAnalyticsDashboard};