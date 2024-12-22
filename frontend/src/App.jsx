import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Axios from 'axios'

function App() {
  const [count, setCount] = useState(0)

  const [emailReg, setEmailReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [nameReg, setNameReg] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginStatus, setLoginStatus] = useState(false);

  Axios.defaults.withCredentials = true;

  const signup = () => {
    Axios.post("http://localhost:3000/api/auth/signup", {
      email: emailReg,
      password, passwordReg,
    }).then((response) => {
      console.log(response)
    })
  }

  const login = () => {
    Axios.post("http://localhost:3000/api/auth/login", {
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

  const userAuthenticated = () => {
    const token = localStorage.getItem("token");
    Axios.get("http://localhost:3000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      console.log(response)
    })
  }




  const fetchApi = async () => {
    const response = await Axios.get("http://localhost:3000/api/auth/me", {
      headers: {
        "Authorization": `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwLCJpYXQiOjE3MzQ0NjYyMDd9.hBFRi75V2cOuXnD5zjgOkKca2Zh4VxW1w6ABHwCTRSY`,
        "Content-Type": `application/json`, // Add the token to the Authorization header
      }});
    console.log(response.data.id);
  }

  useEffect(()=>{
    fetchApi();
  }, [])

  return (
    
      <div className ="App">
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
      <button onClick={signup}>Signup </button>
      </div>

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
      </div>

      {loginStatus && <button onClick={userAuthenticated}> Open Appointments</button>}
      </div>
  )
}

export default App
