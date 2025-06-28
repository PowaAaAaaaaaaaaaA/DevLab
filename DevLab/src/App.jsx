// REACt
import { Navigate, Route, Routes } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import { useEffect, useState } from "react";
// FIREBASE
import { auth } from "./Firebase/Firebase";
// COMPONENTS
import LandingPage from "./components/LandingPage";
import Login from "./components/Login"
import Register from './components/Register'
import Layout from "./Layout/Layout";
import Dashboard from './components/Dashboard'
import Achievements from './components/Achievements'
import Shop from './components/Shop'
import Settings from './components/Settings'
import CodePlayground from "./components/CodePlayground";
import DataqueriesPlayground from "./components/DataqueriesPlayground";
// ADMIN
import AdminLogin from "./components/AdminLogin"
// DISPLAY LESSON/LEVELS PAGE
import HtmlLessons from "./Lessons/HtmlLessons";
import CssLessons from './Lessons/CssLessons'
import JavaScriptLessons from "./Lessons/JavaScriptLessons";
import DataLessons  from "./Lessons/DataLessons";
// LESSON PAGES
import LessonPage from "./Lessons/LessonPage";
import LessonPage2 from "./Lessons/LessonPage2";
import LessonPage3 from "./Lessons/LessonPage3";
import LessonPage4 from "./Lessons/LessonPage4";



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
  <Route path="/" element={!isLoggedIn ? <LandingPage /> : <Navigate to="/Main" replace />} />
  <Route path="/Login" element={!isLoggedIn ? <Login /> : <Navigate to="/Main" replace />} />
  <Route path="/Register" element={!isLoggedIn ? <Register /> : <Navigate to="/Main" replace />} />

  {/* Protected Routes */}
  <Route path="/Main" element={isLoggedIn ? <Layout /> : <Navigate to="/Login" replace />}>
    <Route index element={<Dashboard />} />
    <Route path="Lessons/Html" element={<HtmlLessons/>} />
    <Route path="Lessons/Css" element={<CssLessons/>} /> 
    <Route path="Lessons/JavaScript" element={<JavaScriptLessons/>} />  
    <Route path="Lessons/DataBase" element={<DataLessons/>} />  
    
    <Route path="Achievements" element={<Achievements />} />
    <Route path="Shop" element={<Shop />} />
    <Route path="Settings" element={<Settings />} />
  </Route>

  <Route path="/Main/Lessons/Html/:lessonId/:levelId" element={<LessonPage />} />
  <Route path="/Main/Lessons/Css/:lessonId/:levelId" element={<LessonPage2 />} />
  <Route path="/Main/Lessons/JavaScript/:lessonId/:levelId" element={<LessonPage3 />} />
  <Route path="/Main/Lessons/DataBase/:lessonId/:levelId" element={<LessonPage4 />} />
  <Route path="/codingPlay" element={isLoggedIn ? <CodePlayground /> : <Navigate to="/Login" replace />} />
  <Route path="/dataPlayground" element={isLoggedIn ? <DataqueriesPlayground /> : <Navigate to="/Login" replace />} />

  {/*ADmin*/}
    <Route path="/AdminLogin" element={<AdminLogin/>}/>
</Routes>
    <ToastContainer/>
    </>
  )
}

export default App
