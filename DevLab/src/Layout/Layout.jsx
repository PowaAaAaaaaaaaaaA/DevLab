import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Layout() {
    const isLoggedIn = window.localStorage.getItem("loggedIn");
    return (
    isLoggedIn ==="true"?
    <div className='flex flex-row bg-[#0D1117] w-screen h-screen overflow-hidden gap-15 items-center p-5'>
        <Navbar/> 
        <div className='h-[90vh] w-[80%] bg-[#25293B] p-2 rounded-4xl shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]'>
            <Outlet/>
        </div>
    </div>
    :<Navigate to ="/"/>
)
}

export default Layout