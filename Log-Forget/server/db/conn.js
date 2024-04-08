const mongoose = require("mongoose");

const DB = "mongodb+srv://Aditya25:Aditya25@cluster0.12arsh4.mongodb.net/Log-Forget?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(DB,{
 
}).then(()=> console.log("Database Connected"))
   .catch((err)=>{
    console.log(err);
})