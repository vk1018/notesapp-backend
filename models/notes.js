const mongoose = require("mongoose"); 

const noteSchema = mongoose.Schema({
    title:{type:String, required:true},
    description:{type:String,required:true} ,
    labels:{type:Array} ,
    color:{type:String},
    pinned:{type:Boolean},
    archived:{type:Boolean},
    trashed:{type:Boolean}
    }, 
    {timestamps: true, versionKey: false}
); 

const noteModel = mongoose.model("notes",noteSchema); 

module.exports = noteModel