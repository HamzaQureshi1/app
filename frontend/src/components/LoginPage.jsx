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
  const [errorMessage, setErrorMessage] = useState("");


  const handleLogin = (e) => {
    e.preventDefault();
    alert("Logged in successfully! (Add your login logic here)");
  };

  const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://app-xmfz.onrender.com'
    : 'http://localhost:3000';


  const login = () => {
    axios.post(
      `${baseUrl}/api/auth/login`,
      {
        email: email,
        password: password,
      },
      {
        withCredentials: true, // Include credentials (cookies) in the request
      }
    ).then((response) =>{
      if (response.data) {
        setLoginStatus(true);
        setErrorMessage(""); // Clear any previous errors
        alert("Login successful! Redirecting...");
        navigate("/appointments"); // Navigate to app
      } else if (error.response) {
        setErrorMessage(error.response.data.message); 
        setLoginStatus(false);
      } 
      else {
        setErrorMessage("An unexpected error occurred. Please try again.");
        setLoginStatus(false);
      }
    })
  }




  useEffect(() => {
    axios
      .get(`${baseUrl}/api/auth/me`, {
        withCredentials: true,
      })
      .then((response) => {

        if (response.status === 200) {
          setLoginStatus(true);
        } else {
          setLoginStatus(false);
        }
      })
      .catch((error) => {

        setLoginStatus(false);
      });
  }, []);

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
    type = "password"
    placeholder="Password..."
    onChange = {(e) =>{
      setPassword(e.target.value)
    }}
    />
    <button onClick={login}>Login </button>
    <button onClick={() => navigate("/signup")}>New User? Sign Up</button>
    {loginStatus &&  (
        <button onClick={() => navigate("/appointments")}>Open Appointments</button>
      )}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>



  )
};

export default LoginPage;