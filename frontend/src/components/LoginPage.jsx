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
    axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
      email: email,
      password: password,
    }).then((response) =>{
      if (!response.data) {
        setLoginStatus(false);
      } else {
      
        setLoginStatus(true)
      }
    })
  }

  console.log("LoginPage rendered");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setLoginStatus(true);
        } else {
          setLoginStatus(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoginStatus(false);
      });
  }, []);

  return (

    <div className = "Login">
    <h1>Logi</h1>
    
   
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
    {loginStatus &&  (
        <button onClick={() => navigate("/appointments")}>Open Appointments</button>
      )}
    </div>



  )
};

export default LoginPage;