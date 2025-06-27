import {useState} from 'react'
import { IoPerson } from "react-icons/io5";
import { auth } from '../Firebase/Firebase'
import { Link, useNavigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import { and } from 'firebase/firestore';



 
function Settings() {
 const [showPopup, setShowPopup] = useState(false);
 const [showAdminPopup, setAdminPopup] =useState(false);


    const logout = async () => {
    try {
    await auth.signOut();
      navigate('/Login'); // Use navigate 
    } catch (error) {
    console.log(error);
    }
};

    const admin = async()=>{
        try {
    await auth.signOut();
      navigate('/AdminLogin'); // Use navigate 
    } catch (error) {
    console.log(error);
    }
    }

    const navigate = useNavigate();
return (
    <>
<div className='bg-[#111827] flex flex-col items-center gap-5 p-5 h-[95%] w-[40%] m-auto mt-5 rounded-3xl border-2 shadow-2xl shadow-black'>

    <div className='w-[35%] h-[25%] bg-amber-300 rounded-[100px]'></div>
    <div className='w-[70%] h-[10%] bg-amber-300 rounded-3xl '></div>
    <p className='text-white font-exo font-light'>Update profile picture</p>
    <form action="" className='w-[55%] h-[45%] flex flex-col gap-4 p-1'>
        <label htmlFor="" className='text-white font-exo font-light'>Username</label>
            <div className='relative w-[100%] h-[15%]' >
        <input type="text" className='w-[100%] h-[100%] text-white bg-[#1E212F] rounded-2xl pl-10' />
        <IoPerson className='absolute top-2 left-2 text-white text-2xl' />
            </div>
        <label htmlFor="" className='text-white font-exo font-light'>Bio</label>
            <div className='w-[100%] h-[50%]' >
        <textarea name="" id="" maxlength="25"  className='w-[100%] h-[100%] text-white bg-[#1E212F] rounded-2xl p-2 resize-none '></textarea>
            </div>
        <button className='bg-[#7F5AF0] w-[80%] font-exo p-2 m-auto rounded-4xl text-[1rem] font-bold text-white hover:cursor-pointer hover:bg-[#6A4CD4] hover:scale-105 transition duration-300 ease-in-out hover:drop-shadow-[0_0_6px_rgba(188,168,255,0.8)]'>Save Changes</button>
    </form>
        <button className='bg-[#FF6166] p-3 w-[43%] rounded-3xl font-exo font-bold text-white mt-1.5 hover:cursor-pointerhover:bg-[#6A4CD4] hover:scale-105 transition duration-300 ease-in-out hover:drop-shadow-[0_0_6px_rgba(255,99,71,0.8)]
 hover:cursor-pointer'
        onClick={()=>setShowPopup(true)}>Logout</button>

        <Link><button 
        onClick={()=>setAdminPopup(true)}
        className='text-white font-exo  hover:text-red-500 hover:cursor-pointer transition duration-300 hover:drop-shadow-[0_0_6px_rgba(255,99,71,0.8)]
' >Login as Administrator</button>
        </Link>
</div>
{showPopup && (
    <div className="fixed  inset-0 flex bg-black/80 backdrop-blur-1xl items-center justify-center z-50">
        <div className="bg-[#1E212F] text-white p-6 rounded-2xl text-center shadow-lg w-[20%] opacity-100">
            <h2 className="text-xl font-bold mb-4 font-exo">Confirm Logout</h2>
            <p className="mb-6 font-exo">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4">
            <button
                onClick={logout}
                className="bg-[#FF6166] px-4 py-2 rounded-xl font-exo font-bold hover:bg-red-600 transition hover:cursor-pointer">
                Yes, Logout
            </button>
            <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-500 px-4 py-2 rounded-xl font-exo font-bold hover:bg-gray-600 transition hover:cursor-pointer">
                Cancel
            </button>
            </div>
        </div>
    </div>)
}{
    showAdminPopup && (
        <div className="fixed  inset-0 flex bg-black/80 backdrop-blur-1xl items-center justify-center z-50">
            <div className='bg-[#1E212F] w-[25%] h-[25%] text-white rounded-2xl text-center p-4'>
                <h2 className='font-exo text-3xl'>Admin Login</h2>
                <p className='font-exo text-[1rem] mt-1.5'>Confirm Admin Login</p>
                <div className='flex justify-center gap-2.5'>
                    <button 
                    onClick={admin}
                    className='bg-[#1edb3e] px-4 py-2 rounded-xl font-exo font-bold hover:bg-[#79ff79] transition hover:cursor-pointer'>Proceed</button>
                    <button 
                    onClick={()=> setAdminPopup(false)}
                    className='bg-[#FF6166] px-4 py-2 rounded-xl font-exo font-bold hover:bg-red-600 transition hover:cursor-pointer'>Cancel</button>
                </div>
            </div>
        </div>
    )
}
</>

)}

export default Settings