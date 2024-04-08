const express = require("express");
const router = new express.Router();  //Here we create a new express for router. 
const userdb = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate"); 
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken")

const keysecret = "pratikkateqwertyuihgfdsazxcvbnmj";

//email config

const transporter = nodemailer.createTransport({
   service:"gmail",
   auth:{
      user:"aditya0karande@gmail.com",
      pass:"rgov ifvs ereo xpac"
   }

})
// for user registeration we are creating API usint router 

 router.post("/register",async(req,res)=>{
  //  console.log(req.body);   // We used here req.body because whenevr we fill the data from frontend side like email, owd that time 
                            //our data will be store in database for that proces we use req.body

      const { fname,email,password,cpassword} = req.body; // when user request to enter a data in frontend that time this data is storedin req.body

      if(!fname || !email || !password || !cpassword){
         res.status(422).json({error:"fill all the details"})

      }

      try {           //this validation for our emailis already registred or not.    
         const preuser = await userdb.findOne({email:email}) // Here  first email name is in dB name and sceond is while user entering the email ...for the validation already emailis regsitred....
               
         if(preuser){
            res.status(422).json({error:"This email is already exist"})
         }else if(password !== cpassword ){
            res.status(422).json({error:"Password and Confrom Password Not Match"})
         }else{
            const finalUser = new userdb({
               fname,email,password,cpassword

            });
            // here password hashing

            const storeData = await finalUser.save();

            // console.log(storeData);
            res.status(201).json({status:201,storeData})
            
         }
            
      }catch(error){
         res.status(422).json(error)
         console.log("catch block error");
      }


 });

 //user Login

 router.post("/login",async(req,res)=>{
   //console.log(req.body)

   const { email,password} = req.body; // when user request to enter a data in frontend that time this data is storedin req.body

   if(!email || !password){
         res.status(422).json({error:"fill all the details"})

   }
   // email amd pwd validation with db email and pwd. 
   try {
      const userValid = await userdb.findOne({email:email});
   
      if(userValid){

         const isMatch = await bcrypt.compare(password,userValid.password);   
         // here we used a bcrypt(hasshing pwd method) because here we are validating the username and pwd which are in our database or not
          //compare(password,uservalid.password)<for comparing  used hashing > here first password which is in our database and another is uservalid.pwd used at the filling data from frontend  
         if(!isMatch){
         res.status(422).json({ error: "invalid details"})
         }else{
            // token generate
         
            const token = await userValid.generateAuthtoken();

            console.log("token is here::",token);

            // cookiegenerate
            res.cookie("usercookie",token,{
                expires:new Date(Date.now()+9000000),
                httpOnly:true
            });

            const result = {
                userValid,
                token
            }
            res.status(201).json({status:201,result})
        }
    }

   } catch (error) {
      res.status(401).json(error);
      console.log("catch block");
      
   }
});

//user valid 
router.get("/validuser",authenticate,async(req,res)=>{ //In login.js and registeration.js we directly heat from router.. but here er have to use middleware beauce here we are autheticating/validating using the token.
                                     //Here we used authenticate funtion becuase we defined it in authenticate.js and used to validate
//console.log("done"); 
try {
   const ValidUserOne = await userdb.findOne({_id:req.userId});
   res.status(201).json({status:201,ValidUserOne});
} catch (error) {
   res.status(401).json({status:401,error});
}    
});

//user logout
router.get("/logout",authenticate,async(req,res)=>{
   try {
       req.rootUser.tokens =  req.rootUser.tokens.filter((curelem)=>{  // we use filter becuase it will chek the specific uses..curelem means current element  
           return curelem.token !== req.token
       });

       res.clearCookie("usercookie",{path:"/"});

       req.rootUser.save();

       res.status(201).json({status:201})

   } catch (error) {
       res.status(401).json({status:401,error})
   }
});

//send email Link for reset Password
router.post("/sendpasswordlink",async(req,res)=>{
   console.log(req.body)

   const {email} = req.body;

   if(!email){
      res.status(401).json({status:401,message:"Enter your mail"})
   }

   try {
      const userfind = await userdb.findOne({email:email});

      //token generate for reset pwd
      const token = jwt.sign({_id:userfind._id},keysecret,{
         expiresIn:"120s"
      });
      //console.log("token",token)
      const setusertoken = await userdb.findByIdAndUpdate({_id:userfind._id},{verifytoken:token},{new:true});

      //console.log("setusertoken",setusertoken);

      if(setusertoken){
         const mailOptions = {
             from:process.env.EMAIL,
             to:email,
             subject:"Sending Email For password Reset",
             text:`This Link Valid For 2 MINUTES http://localhost:3000/forgotpassword/${userfind.id}/${setusertoken.verifytoken}`
         }                  //localhost/3K,forgotpws which is call from app.js ...forgot mail link redirect on this page 

         transporter.sendMail(mailOptions,(error,info)=>{
             if(error){
                 console.log("error",error);
                 res.status(401).json({status:401,message:"email not send"})
             }else{
                 console.log("Email sent",info.response);
                 res.status(201).json({status:201,message:"Email sent Succsfully"})
             }
         })

     }

 } catch (error) {
     res.status(401).json({status:401,message:"invalid user"})
 }

});

//verify user for forgot password time 
router.get("/forgotpassword/:id/:token",async(req,res)=>{
   const {id,token} = req.params;
   // console.log(id,token);

   try {
      const validuser = await userdb.findOne({_id:id,verifytoken:token}); // here we find the user using id and token in db ... those user who want to forgotpwd ...verofttokn replace the firt token which is in db
      //console.log(validuser)

      const verifyToken = jwt.verify(token,keysecret);

      if(validuser && verifyToken._id){
      res.status(201).json({status:201,validuser})
   }else{
      res.status(401).json({status:401,message:"user not exist"})
   }
   

   } catch (error) {
      res.status(401).json({status:401,error})
      
   }
});

// change password

router.post("/:id/:token",async(req,res)=>{
   const {id,token} = req.params;

   const {password} = req.body;

   try {
       const validuser = await userdb.findOne({_id:id,verifytoken:token});
       
       const verifyToken = jwt.verify(token,keysecret);

       if(validuser && verifyToken._id){
           const newpassword = await bcrypt.hash(password,12);

           const setnewuserpass = await userdb.findByIdAndUpdate({_id:id},{password:newpassword});

           setnewuserpass.save();
           res.status(201).json({status:201,setnewuserpass})

       }else{
           res.status(401).json({status:401,message:"user not exist"})
       }
   } catch (error) {
       res.status(401).json({status:401,error})
   }
})
 module.exports = router;
