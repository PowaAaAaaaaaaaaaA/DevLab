import React from 'react'
import { HiFolder } from "react-icons/hi2";
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
    return (
        <div className='w-[15%] flex flex-col p-5 font-exo text-white'>
            <h1 className='text-[3.5rem] font-bold mb-5'>DevLab</h1>
            <div className='flex-1 flex flex-col gap-7 p-2'>
                <NavLink to={'/Admin/ContentManagement'} className='text-[1.4rem] flex items-center justify-center gap-5'><span><HiFolder /></span> Content Management
                </NavLink>
                <NavLink to={'/Admin/UserManagement'} className='text-[1.4rem] flex items-center justify-center gap-5'><span><HiUserCircle /></span> User Management</NavLink>
            </div>
        <button className='text-[1.5rem] flex justify-center items-center gap-5 hover:cursor-pointer' onClick={Logout}> <span><HiOutlineArrowLeftOnRectangle /></span>Log Out</button>
        </div>
)}

export default AdminNavbar