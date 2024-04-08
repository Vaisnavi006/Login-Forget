import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const ForgotPassword = () => {

  const {id, token} = useParams();

  const history = useNavigate();

  const [data2, setData] = useState(false);

  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  
  
  const userValid = async () => {
    const res = await fetch(`/forgotpassword/${id}/${token}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const data = await res.json()

    if (data.status === 201) {
      console.log("user valid")
  } else {
      history("*")
  }
}

const setVal = (e)=>{
     setPassword(e.target.value) 
}

const sendpassword = async(e)=>{
  e.preventDefault()

  
    const res = await fetch(`/${id}/${token}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({password})
    });

    const data = await res.json()

    if (data.status === 201) {
      setPassword()
      setMessage(true)
  } else {
      toast.error("!Token Expied generate new LINK")
  } 
  }

useEffect(() => {
  userValid()
}, []);
 
  return (
   <>
       <section>
                <div className="form_data">
                    <div className="form_heading">
                        <h1>Enter Your New Password</h1>
                    </div>
                    {/* if message state is true then it will display the success message, otherwise it will display an empty message */}
                  
                    <form>
                                    {message ? <p style={{ color: "green", fontWeight: "bold" }}>Password Succesfulyy Update </p> : ""}
                                    <div className="form_input">
                                        <label htmlFor="password">New password</label>
                                        <input type="password" value={password} onChange={setVal} name="password" id="password" placeholder='Enter Your new password' />
                                    </div>

                                    <button className='btn' onClick={sendpassword}>Send</button>
                                </form>
                                
                                <ToastContainer />
                            </div>
                        </section>
    </>
  )
}

export default ForgotPassword


