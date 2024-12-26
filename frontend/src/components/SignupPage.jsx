import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'
import axios from 'axios';

const SignupPage = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(0)
  const [emailReg, setEmailReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [nameReg, setNameReg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);

  const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://app-xmfz.onrender.com'
    : 'http://localhost:3000';
  


  const signup = () => {
    axios.post(`${baseUrl}/api/auth/signup`, {
      email: emailReg,
      password: passwordReg,
      name: nameReg,
    }).then((response) => {

      console.log(response)
      alert("Please Login.");
    }).catch((error) => {
      console.error("Signup failed:", error.response?.data || error.message);

      // Optional: Show an error message to the user
      alert("Signup failed. Please try again.");
    });
  }


  return (
   
  
<div className = "Signup">
<h1>Signup</h1>
<label>Name</label>
<input
type = "text"
onChange = {(e) =>{
  setNameReg(e.target.value)
}}
/>
<label>Email</label>
<input
type = "text"
onChange = {(e) =>{
  setEmailReg(e.target.value)
}}
/>
<label>Password</label>
<input
type = "text"
onChange = {(e) =>{
  setPasswordReg(e.target.value)
}}
/>
<button onClick={signup} style={{ marginRight: "10px" }}>Signup </button>
<button onClick={() => navigate("/")}>Back to Login</button>
</div>

  );
};

export default SignupPage;