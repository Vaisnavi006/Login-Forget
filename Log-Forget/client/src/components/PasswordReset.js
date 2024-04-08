

import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const PasswordReset = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const setVal = (e) => {
        setEmail(e.target.value);
    }

    const sendLink = async (e) => {
        e.preventDefault();  //here we used e.preventDefault beacise when we click on send button it will not take time it send the immediate link to mail
        const res = await fetch("https://login-forget.el.r.appspot.com/sendpasswordlink", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email }) // Here we send the email from frontend to backend
        });

        const data = await res.json();

        if (data.status === 201) {
            setEmail("");
            setMessage(true);
        } else {
            toast.error("Invalid User");
        }
    }

    return (
        <>
            <section>
                <div className="form_data">
                    <div className="form_heading">
                        <h1>Enter Your Email</h1>
                    </div>
                    {/* if message state is true then it will display the success message, otherwise it will display an empty message */}
                    {message ? <p style={{ color: "green", fontWeight: "bold" }}>Password reset link sent successfully to your email</p> : ""}
                    <form>
                        <div className="form_input">
                            <label htmlFor="email">Email</label>
                            <input type="email" value={email} onChange={setVal} name="email" id="email" placeholder='Enter Your Email Address' />
                        </div>
                        <button className='btn' onClick={sendLink}>Send</button>
                    </form>
                    <ToastContainer />
                </div>
            </section>
        </>
    )
}

export default PasswordReset;
