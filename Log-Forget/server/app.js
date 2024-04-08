const express = require("express");
const app = express();
require("./db/conn");
const router = require("./routes/router");
const cors = require("cors");  
const cookiParser = require("cookie-parser");
const port = 7001;
require("dotenv").config();

// app.get("/",(req,res)=> {
//     res.status(201).json("Server Created")
// });

app.use(express.json());  // here we used express.json() because we are fetching the frontend data to backend(database). 
app.use(cookiParser());
app.use(cors()); // here we use app.use(cors()) beacuse our frontend part run on 3000 port and backend part is run on 7001 both the server are diff bt usig cors they maniplualate the data using cors.
app.use(router);

app.listen(port,()=>{
    console.log(`Server running on port no : ${port}`);
})