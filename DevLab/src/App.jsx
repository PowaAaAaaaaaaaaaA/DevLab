import Login from "./components/Login"
import Register from './components/Register'
import AdminLogin from "./components/AdminLogin"
import { Route, Routes } from "react-router-dom"
import { ToastContainer } from 'react-toastify';


function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/Register" element={<Register/>}/>
    </Routes>
    <ToastContainer/>
    </>
  )
}

export default App
