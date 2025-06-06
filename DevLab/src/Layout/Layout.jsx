import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Layout() {
    return (
    <div className='flex flex-row bg-[#0D1117] w-screen h-screen overflow-hidden'>
        <Navbar/>
        
        <div className='p-4'><Outlet/></div>
    </div>
)
}

export default Layout