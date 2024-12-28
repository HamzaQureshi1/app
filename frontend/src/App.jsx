import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import React from 'react';
import LoginPage from "./components/LoginPage.jsx";
import SignupPage from "./components/SignupPage.jsx";
import AppointmentsPage from "./components/AppointmentsPage.jsx";
import AdminAppointmentsPage from "./AdminAppointmentsPage";
axios.defaults.withCredentials = true;

function App() {
  return( 
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
    </Routes>
  </Router>)
 
}

export default App
