import React from 'react'
import { IoPerson } from "react-icons/io5";
import { auth } from '../Firebase/Firebase'
import { useNavigate } from 'react-router-dom';





function Settings() {
    const logout = async () => {
    try {
    await auth.signOut();
      navigate('/Login', { replace: true }); // ✅ Use navigate instead of window.location
    } catch (error) {
    console.log(error);
    }
};

    const navigate = useNavigate();
return (
    <div className='bg-[#111827] flex flex-col items-center gap-5 p-5 h-[95%] w-[40%] m-auto mt-5 rounded-3xl border-2 shadow-2xl shadow-black'>

    <div className='w-[35%] h-[25%] bg-amber-300 rounded-[100px]'></div>
    <div className='w-[70%] h-[10%] bg-amber-300 rounded-3xl '></div>
    <p className='text-white font-exo font-light'>Update profile picture</p>
    <form action="" className='w-[55%] h-[35%] flex flex-col gap-2'>
        <label htmlFor="" className='text-white font-exo font-light'>Username</label>
        <div className='relative w-[100%] h-[20%]' >
        <input type="text" className='w-[100%] h-[100%] text-white bg-[#1E212F] rounded-2xl pl-10' />
        <IoPerson className='absolute top-2 left-2 text-white text-2xl' />
        </div>
        <label htmlFor="" className='text-white font-exo font-light'>Bio</label>
        <div className='w-[100%] h-[50%]' >
        <input type="text" className='w-[100%] h-[100%] text-white bg-[#1E212F] rounded-2xl' />
        </div>
        <button className='bg-[#7F5AF0] w-[80%] font-exo p-2 m-auto rounded-4xl text-[1rem] font-bold text-white hover:cursor-pointer'>Save Changes</button>
    </form>
        <button className='bg-[#FF6166] p-3 w-[43%] rounded-3xl font-exo font-bold text-white mt-1.5 hover:cursor-pointer'onClick={logout}>Logout</button>


    </div>
  )
}

export default Settings