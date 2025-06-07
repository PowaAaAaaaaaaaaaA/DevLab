import Login from "./components/Login"
import Register from './components/Register'
import AdminLogin from "./components/AdminLogin"
import { Navigate, Route, Routes } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import Home from "./components/Home";
import { useEffect, useState } from "react";
import { auth } from "./Firebase/Firebase";
import Layout from "./Layout/Layout";
import Dashboard from './components/Dashboard'
import Lessons from './components/Lessons'
import Achievements from './components/Achievements'
import Shop from './components/Shop'


function App() {
{/*
  const[user, setUser] = useState();

  useEffect(()=>{
    auth.onAuthStateChanged((user)=>{
      setUser(user);
    })
  })
    */}

  const isLoggedIn = window.localStorage.getItem("loggedIn");

  return (
    <>
  <Routes>
      <Route path="/" element={/*user ?  <Navigate to={'/Main'}/>:*/<Login/>}/>
      <Route path="/Register" element={<Register/>}/>
      <Route path="/" element={<Layout/>}/>


{/*Protected Routes*/}
    <Route path="/Main" element={<Layout/>}>
        <Route index element={<Dashboard/>}/>
        <Route path="Lessons" element={<Lessons/>}/>
        <Route path="Achievements" element={<Achievements/>}/>
        <Route path="Shop" element={<Shop/>}/>
    </Route>
  </Routes>

    <ToastContainer/>
    </>
  )
}

export default App
