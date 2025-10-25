import React from 'react'
import { HiFolder } from "react-icons/hi2";
import { auth } from '../Firebase/Firebase';
import { HiUserCircle } from "react-icons/hi2";
import { HiOutlineArrowLeftOnRectangle } from "react-icons/hi2";
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

function AdminNavbar() {
    const Navigate = useNavigate();
    
    const Logout = async ()=>{
        try{
            await auth.signOut();
            Navigate('/Login')
        }catch(error){

        }
    }

    
    if (location.pathname.startsWith === '/Admin/ContentManagement/LessonEdit') {
    return <Outlet />;
    }
    return (
        <div className='w-[15%] flex flex-col p-5 font-exo text-white justify-center'>
            <h1 className='text-[3rem] text-center font-bold mb-5 bigText-laptop'>DevLab</h1>
            <div className='flex-1 flex flex-col gap-7 p-2'>
                <NavLink to={'/Admin/ContentManagement'} className='flex items-center gap-3 font-inter text-[1.3rem] relative rounded  py-2.5 hover:bg-[#9333EA] transition-all ease-out duration-300 NavBarText-laptop'><span><HiFolder /></span> Content Management
                </NavLink>
                <NavLink to={'/Admin/UserManagement'} className='flex items-center gap-3 font-inter text-[1.3rem] relative rounded  py-2.5 hover:bg-[#9333EA] transition-all ease-out duration-300 NavBarText-laptop '><span><HiUserCircle /></span> User Management</NavLink>
            </div>
        <button className='text-[1.5rem] flex justify-center items-center gap-5 hover:cursor-pointer NavBarText-laptop' onClick={Logout}> <span><HiOutlineArrowLeftOnRectangle /></span>Log Out</button>
        </div>
)}

export default AdminNavbar