import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";


mongoose.connect("mongodb://127.0.0.1:27017",{
dbName:"backend",})
.then(()=> console.count("database connected"))
.catch((e)=> console.log(e))

const userSchema=new mongoose.Schema({
   name: String,
   email: String,
   password: String,
   phone: String,
});
const User=mongoose.model("User",userSchema,)
const app=express(); 
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");


const isauthication= async(req,res,next) =>{
  const{token}=req.cookies;
  if(token){
   const decode= jwt.verify(token,"srrrfrdrd")
  req.user= await User.findById(decode._id);
   next();
 }
  else{
    res.render("login");
  }}



  app.get("/",isauthication,(req,res)=>{
    console.log(req.user);
      res.render("logout",{name:req.user.name})
    });


    app.get("/login",(req,res)=>{
      
        res.render("login")
      });
  
    
      app.post("/login",async(req,res)=>{
      const {email,password}= req.body;
      let user= await User.findOne({email});  
      if (!user) return res.redirect("/register")
const isMatch=user.password === password;
if(!isMatch) return res.render("login", {message:"incorrect password"});

 const token=jwt.sign({_id:user._id},"srrrfrdrd");
console.log(token)

res.cookie("token",token,{
 httpOnly:true,
 expires: new Date(Date.now()+56*1000),})
 res.redirect("/");
    
      });

      app.get("/register",(req,res)=>{
        //  console.log(req.user);
          res.render("register")
        });
  

  
app.post("/register",async (req,res)=>{
  // console.log(req.body);
  const {name,email,password,phone}=req.body;
  let user=await User.findOne({ email });
  if(user){
  
  return res.redirect("/login");
  }
 
user =await User.create({
  name,
  email,
  password,
  phone,
});


const token=jwt.sign({_id:user._id},"srrrfrdrd");
console.log(token)

res.cookie("token",token,{
 httpOnly:true,
 expires: new Date(Date.now()+56*1000),})
 res.redirect("/");
   });

  
  
   app.get("/logout",(req,res)=>{
    
   res.cookie("token","iamin",{
      httpOnly:true,
      expires: new Date(Date.now()),})
   res.redirect("/");
     });

   

app.listen(3000,()=>{
   console.log("server is working");
});