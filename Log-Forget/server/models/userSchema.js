const mongoose = require("mongoose");
const validator = require ("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken") 

//const keysecret = process.env.JWT_SECRET;

const keysecret = "pratikkateqwertyuihgfdsazxcvbnmj"

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true // here we used trim becuase whenver we try to fill the information and that time if spacing is happining then it will automatically remove the spacing 
    },
    email:{
        type: String,
        required: true,
        unique:true,
        validate(value){ // We use validator funtion beacuse if we add any other value instead of mail then it will throw the error.  
            if(!validator.isEmail(value)){
                throw new Error("It is not valid email")
            }
        }
    },
    password: {
        type:String,
        required:true,
        minlength:9
    },
    cpassword: {
        type:String,
        required:true,
        minlength:9
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            }
        }
    ],
    verifytoken:{
        type: String,
    }
});



userSchema.pre("save",async function(next){

    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,12);
        this.cpassword = await bcrypt.hash(this.cpassword,12);
    }
    

    next()
});

//token generate 
userSchema.methods.generateAuthtoken = async function(){
    try {
        let token23 = jwt.sign({_id:this._id},keysecret,  // this is payload 
            {
              expiresIn:"30d"
            });

            this.tokens = this.tokens.concat({token:token23}); // this.token means which is in userschema and token23 is 
            await this.save();
            console.log(this.tokens)
            return token23;
           
    } catch (error) {
        //res.status(422).json(error)
        throw new Error(error);
    }
}   

// creating model
const userdb = new mongoose.model("users",userSchema); // we use user as parameter becuse this user varible is used un mnogodb.com during creation on mongodb.com

module.exports = userdb;