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
import Settings from './components/Settings'
import CodePlayground from "./components/CodePlayground";

function App() {

  const[user, setUser] = useState();

useEffect(() => { //
  const unsubscribe = auth.onAuthStateChanged((user) => {
    setUser(user);
  });
  return () => unsubscribe(); // cleanup
}, []); //

const isLoggedIn = !!user;

  return (
    <>
  <Routes>
  {/* Public Routes */}
  <Route path="/" element={!isLoggedIn ? <Login /> : <Navigate to="/Main" replace />} />
  <Route path="/Login" element={!isLoggedIn ? <Login /> : <Navigate to="/Main" replace />} />
  <Route path="/Register" element={!isLoggedIn ? <Register /> : <Navigate to="/Main" replace />} />

  {/* Protected Routes */}
  <Route path="/Main" element={isLoggedIn ? <Layout /> : <Navigate to="/Login" replace />}>
    <Route index element={<Dashboard />} />
    <Route path="Lessons" element={<Lessons />} />
    <Route path="Achievements" element={<Achievements />} />
    <Route path="Shop" element={<Shop />} />
    <Route path="Settings" element={<Settings />} />
  </Route>

  <Route path="/codingPlay" element={isLoggedIn ? <CodePlayground /> : <Navigate to="/Login" replace />} />

</Routes>
    <ToastContainer/>
    </>
  )
}

export default App
