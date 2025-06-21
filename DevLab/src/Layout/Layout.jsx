import { Navigate, Outlet, useLocation  } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { auth } from '../Firebase/Firebase'
import { useEffect, useState } from 'react'

function Layout() {
    const location = useLocation();
    const isLessonView =
  location.pathname.startsWith("/Main/Lessons/Html/") ||
  location.pathname.startsWith("/Main/Lessons/Css/") ||
  location.pathname.startsWith("/Main/Lessons/JavaScript/");
     const shouldSkipLayout = isLessonView;
     
     if (shouldSkipLayout) {
    return <Outlet />;
  }

 if (location.pathname === '/codePlay') {
    return <Outlet />;
  }else if (location.pathname ==='/dataPlayground') {
    return <Outlet/>
  } 

    return (
    <div className='flex flex-row bg-[#0D1117] w-screen h-screen overflow-hidden gap-15 items-center p-5'>
        <Navbar />
        <div className='h-[90vh] w-[80%] bg-[#25293B] p-2 rounded-4xl shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]'>
            <Outlet />
        </div>
    </div>
    ) 
}

export default Layout;
