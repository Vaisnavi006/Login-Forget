import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import "./mix.css";

const Login = () => {
  const [passShow, setPassShow] = useState(false);

  const [inpval, setInpval] = useState({

    email: "",
    password: ""

  });
  const history = useNavigate();

  console.log(inpval);

  const setVal = (e) => {
    //console.log(e.target.value);
    const { name, value } = e.target;

    setInpval(() => {
      return {
        ...inpval,
        [name]: value
      }
    })
  };

  const loginuser = async (e) => {
      e.preventDefault();

      const { email, password } = inpval;

      if (email === "") {
        alert("Please enter your mail");


      } else if (!email.includes("@")) {
        alert("Enter valid mail")

      } else if (password === "") {
        alert("Enter your password")

      } else if (password.length < 9) {
        alert("Password must be 9 char")

      } else {
        console.log("Your login successfully done");

        const data = await fetch("/login", {  // here we call the api's using await fetch() and give the backend server//we add in package.json proxt:"http://localhost"
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email, password
          })
        });
        console.log(data.url);
        const res = await data.json();
        console.log(res);

        if (res.status === 201) {
          //alert("User Successfully Login");

          localStorage.setItem("usersdatatoken", res.result.token);
          history("/dash")
          setInpval({ ...inpval, email: "", password: "" }); //doubt
        }
      }
    
}

  return (
    <>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Welcome Back Log In</h1>
            <p>Hi, we are you glad you are back. Please Login.</p>
          </div>
          <form>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <input type="email" value={inpval.email} onChange={setVal} name="email" id="email" placeholder='Enter Your Email Address' />
            </div>
            <div className="form_input">
              <label htmlFor="password">Password</label>
              <div className='two'>
                <input type={!passShow ? "password" : "text"} onChange={setVal} value={inpval.password} name="password" id="password" placeholder='Enter Your Password' />
                <div className="showpass" onClick={() => setPassShow(!passShow)}>
                  {!passShow ? "Show" : "Hide"}
                </div>
              </div>
            </div>
            <button className='btn' onClick={loginuser}>Login</button>
            <p>Don't Have an Account? <NavLink to="/register">Sign Up</NavLink></p>
            <p style={{ color: "black", fontWeight: "bold" }}>Forgot Password  <NavLink to="/password-reset">Click Here</NavLink> </p>

          </form>
        </div>
      </section>
    </>
  )
}

export default Login
