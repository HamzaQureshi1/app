import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'
import axios from 'axios'

const LoginPage = () => {
  const navigate = useNavigate();

  const [count, setCount] = useState(0)
  const [emailReg, setEmailReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [nameReg, setNameReg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);


  const handleLogin = (e) => {
    e.preventDefault();
    alert("Logged in successfully! (Add your login logic here)");
  };

  const login = () => {
    axios.post("http://localhost:3000/api/auth/login", {
      email: email,
      password: password,
    }).then((response) =>{
      if (!response.data) {
        setLoginStatus(false);
      } else {
        console.log(response.data);
        localStorage.setItem("token", response.data.token)
        setLoginStatus(true)
      }
    })
  }

  console.log("LoginPage rendered");

  const userAuthenticated = () => {
    console.log('user authenticated')
    const token = localStorage.getItem("token");
    axios.get("http://localhost:3000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      console.log(response)
    })
  }

  return (

    <div className = "Login">
    <h1>Login</h1>
    
   
    <input
    type = "text"
    placeholder="Email..."
    onChange = {(e) =>{
      setEmail(e.target.value)
    }}
    />
   <input
    type = "text"
    placeholder="Password..."
    onChange = {(e) =>{
      setPassword(e.target.value)
    }}
    />
    <button onClick={login}>Login </button>
    <button onClick={() => navigate("/signup")}>New User? Sign Up</button>
    {loginStatus && userAuthenticated && (
        <button onClick={() => navigate("/appointments")}>Open Appointments</button>
      )}
    </div>



  )
};

export default LoginPage;