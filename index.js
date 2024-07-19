const express = require("express"); 
const cors = require("cors"); 
const mongoose= require("mongoose"); 
const dotenv = require("dotenv");
const userModel=require('./models/users.js');
const noteModel=require("./models/notes.js");
dotenv.config()


var mongodbURL = process.env.MONGODB_URL;

// console.log(process.env.MONGODB_URL)

const app=express();

 app.use(cors());
 app.use(express.json());


const connectDB= ()=>{
    console.log(mongodbURL)
 try{
   mongoose.connect(mongodbURL)
   .then(() => {
    console.log("MongoDB connected");
    app.listen(3000,()=>{
        console.log(` server running on port ${3000}`);
     })
    
   })
   .catch((err) => console.log(err));

 }
 catch(error){
    console.log(error);
 }
}

connectDB();


app.route("/").get(async (req,res)=>{
  res.send("Response send secucessfully");
}) 

app.route("/user").get(async(req,res)=>{
    const allUsers = await userModel.find();
    console.log(allUsers);
    res.send(allUsers);
})

app.route("/login").post(async(req,res)=>{
 const userDetails=req.body 
 try{
    let existingUser= await userModel.findOne({"username":userDetails.username});
    if(existingUser){
        console.log(existingUser);
        res.json({data:existingUser});
    }
    else{
        res.status(400).json({data:{message:"User does not exist"}})
    }

 }
 catch(error){
    console.log(error);
    res.send(error.errors)
 }
})



app.route('/create').post(async (req,res) => {
    const newUser = req.body;
    // console.log(newUser);
   try {
        let existedUser = await userModel.findOne({username:newUser.username});
        if (existedUser){
            res.status(400).json({data:{message:"User Already Exists"}})
        }else{
            const newUserDoc = new userModel({
                username:newUser.username,
                password:newUser.password
            })
            const savedUser = await newUserDoc.save();
            
            if (savedUser){
                res.json({data:savedUser});
            }
        }
    } catch (error) {
        console.log(error)
        res.send(error.errors)
    }
}) 

app.route("/notes").get(async(req,res)=>{
    try {
        const searchQuery = req.query.search;
        const archived = req.query.archived;
        const trashed = req.query.trashed;
        if (searchQuery && searchQuery !== ""){

            const allNotes = await noteModel.find({$and:{title:{$regex:searchQuery,$options : 'i'},trashed:false}});
           
            if (allNotes){
                res.json({data:allNotes});
            }
            
        }
        else if (archived && archived !== ""){
            const allNotes = await noteModel.find({$and:{trashed:false,archived:true}});
           
            if (allNotes){
                res.json({data:allNotes});
            }
        }else if (trashed && trashed !== ""){
            const allNotes = await noteModel.find({trashed:true});
           
            if (allNotes){
                res.json({data:allNotes});
            }
        }
        else{
            const allNotes = await noteModel.find({$and:{trashed:false,archived:false}});
           
            if (allNotes){
                res.json({data:allNotes});
            }
        }
    } catch (error) {
        res.status(400).json({data:{message:"Notes not found"}});
    }
    
})

app.route("/notes").post(async(req,res)=>{
    try {
       let noteData={
        title:req.body.title,
        description:req.body.description,
        labels:req.body.labels || [],
        color:"#ffeec2",
        pinned: false,
        archived:false,
        trashed: false
       }
    //    let notes={
    //     "title":"Learn React",
    //     "description":"functional components",
    //     "labels" :[],
    //     "color":"#f0f0f0",
    //     "pinned":true,
    //     "archived":false,
    //     "trashed":false
    //    }

       const newNotes = new noteModel(noteData);

       const savedNotes = await newNotes.save();

        if (savedNotes){
            res.json({data:savedNotes});
        }
        
    } catch (error) {
        res.status(400).json({data:{message:"Notes not found"}});
    }
    
})



app.route('/notes').put(async (req,res) => {
    try {
        const body = req.body;
        if (req.body.toggle){
            
            let changes = {...req.body.toggle}

            console.log(changes)

            let updateNote = await noteModel.updateOne({_id:req.body.noteId},
                {
                    $set:{...changes}
                }
            );
            if (updateNote.acknowledged){
                console.log(updateNote)
                res.json({data:updateNote});
            }else{
                res.status(400).json({data:{message:"Something went wrong"}});

            }

        }else{

        }
    } catch (error) {
        console.log(error)
    }
})

app.route('/delete-note').delete(async (req,res) => {
    try {
        const noteId = req.query.noteId;
        if (noteId){
            let deleteNote = await noteModel.updateOne({_id : noteId},{
                $set:{trashed:true}
            });
            if (deleteNote.acknowledged){
                res.json({data:deleteNote})
            }
        }else{
            res.status(400).json({data:{message:"Note Id required"}})
        }

        
    } catch (error) {
        console.log(error)
    }
})











