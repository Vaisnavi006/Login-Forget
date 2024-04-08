import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import "./mix.css";

const Register = () => {

    const [passShow, setPassShow] = useState(false);
    const [cpassShow, setcPassShow] = useState(false);

    const [inpval,setInpval] = useState({
        fname:"",
        email:"",
        password:"",
        cpassword:""
    });

    console.log(inpval);

    const setVal = (e) => {
        //console.log(e.target.value);
        const {name, value} = e.target;

        setInpval(()=>{
        return{
            ...inpval,
            [name] : value
        }})
    };

    const addUserdata = async (e) => {
        e.preventDefault()

        const { fname,email,password,cpassword} = inpval;

        if(fname === ""){
            alert("Please enter your name");
        
        }else if(email===""){
            alert("Please enter your mail");

        
        }else if(!email.includes("@")){
            alert("Enter valid mail")

        }else if(password === ""){
            alert("Enter your password")

        }else if(password.length <9){
            alert("Password must be 9 char")

        }else if(cpassword === ""){
            alert("Enter your confirm password")

        }else if(cpassword.length <9){
            alert("Confirm password must be 9 char")
        }else if(password !== cpassword){
            alert("Password and confirm password not match")
        }else{
            // console.log("Your registeration successfully done");

            const data = await fetch ("https://login-forget.el.r.appspot.com/register",{  // here we call the api's using await fetch() and give the backend server//we add in package.json proxt:"http://localhost"
              method:"POST", 
              headers:{
                "Content-Type":"application/json"
              },
              body:JSON.stringify({
                fname,email,password,cpassword
              })
            });

            const res = await data.json();
            //console.log(res);

            if(res.status === 201){
              alert("User registeration Successful");
              setInpval({...inpval,fname:"",email:"",password:"",cpassword:""}); //doubt
            }
        }
    }

  return (
    <>
          <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Sign Up</h1>
            <p style={{ textAlign:"center"}}>We are happy that you will be using Project Cloud to organize your <br/> tasks! We hope you will enjoy it.</p>
          </div>
          <form>
          <div className="form_input">
              <label htmlFor="fname">Name</label>
              <input type="text" onChange={setVal} value={inpval.fname} name="fname" id="fname" placeholder='Enter Your Name' />
            </div>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <input type="email"onChange={setVal} value={inpval.email} name="email" id="email" placeholder='Enter Your Email Address' />
            </div>
            <div className="form_input">
              <label htmlFor="password">Password</label>
              <div className='two'>
                <input type={!passShow ? "password" : "text" } value={inpval.password} onChange={setVal} name="password" id="password" placeholder='Enter Your Password' />
                <div className="showpass"onClick={()=>setPassShow(!passShow)}>
                  {!passShow ? "Show" : "Hide"}
                  </div>
              </div>
            </div>


            <div className="form_input">
              <label htmlFor="password">Confirm Password</label>
              <div className='two'>
                <input type={!cpassShow ? "password" : "text" } value={inpval.cpassword} onChange={setVal} name="cpassword" id="cpassword" placeholder='Confirm Password' />
                <div className="showpass" onClick={()=> setcPassShow(!cpassShow)}>
                  {!cpassShow ? "Show" : "Hide"}
                  </div>
              </div>
            </div>

            
            <button className='btn' onClick={addUserdata}>Sign Up</button>
            <p>Already have an account? <NavLink to="/"> Log In</NavLink></p>
          </form>
        </div>
      </section>
    </>
  )
}

export default Register 