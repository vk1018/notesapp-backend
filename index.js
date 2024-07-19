const express = require("express"); 
const cors = require("cors"); 
const mongoose= require("mongoose"); 
const dotenv = require("dotenv");
const userModel=require('./models/users.js');
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
 const newUser=req.body 
 try{
    let existingUser= await userModel.findOne({"username":newUser.username});

    

    if(existingUser){
        console.log(existingUser);
        res.send({"message":"Login successful"});

    }
    else{
        res.send({"message":"User does not exist"});
    }

 }
 catch(error){
    console.log(error);
    res.send(error.errors)
 }
})

app.route('/create').post(async (req,res) => {
    const newUser = req.body;
    console.log(newUser);
    
   try {
        
        const newUserDoc = new userModel({
            username:newUser.username,
            password:newUser.password
        })
        const savedUser = await newUserDoc.save();
        
        if (savedUser){
            res.send(savedUser)
        }
    } catch (error) {
        console.log(error)
        res.send(error.errors)
    }
})


















