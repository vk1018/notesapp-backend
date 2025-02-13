const mongoose = require("mongoose"); 

const userSchema = mongoose.Schema({
    username:{type:String, required:true},
    password:{type:String,required:true} ,
    age:{type:Number}, 
    }, 
    {timestamps: true, versionKey: false}
); 

const userModel = mongoose.model("users",userSchema); 

module.exports = userModel