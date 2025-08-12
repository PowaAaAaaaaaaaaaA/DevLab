import React, { useEffect, useState } from 'react';
import Lottie from "lottie-react";
import { Link } from 'react-router-dom';
import { LandingPage_Data } from '../Data/LandingContents_Data';



function LandingPage() {
    const [currentDisplay, setCurrentDisplay]= useState(0);
    const [visible, setVisible] = useState (true);
    const [show, setShow] = useState(false);

// Start Data fading Out
    useEffect(()=>{
        const timeout = setTimeout(()=>{
            setVisible(false) // Start Fade-out
        }, 3000); // TImer

    return ()=> clearTimeout(timeout);
    },[currentDisplay]);

    // New Data Fading Innn
    useEffect(()=>{
        if (!visible){
            const fadeIn = setTimeout(()=>{
                setCurrentDisplay((prevIndex)=>(prevIndex + 1) % LandingPage_Data.length);
                setVisible(true); // New Fade In
            }, 1000) // Timer
            return () => clearTimeout(fadeIn);
        }

    },[visible])

    useEffect(() => {
    setTimeout(() => setShow(true), 100); // small delay for mount effect
}, []);

const currentItem = LandingPage_Data[currentDisplay];

return (
<>
<div className='w-full h-screen bg-[radial-gradient(circle_at_center,_#9333EA_0%,_#1E1E2E_65%,_#0F0F17_100%)] overflow-hidden p-5'>
    {/*Header*/}
    <div className='h-[7%] font-exo flex items-center justify-between px-20'>
        <h1 className='text-4xl text-white font-bold'>DevLab</h1>
        <Link to='/Login'><button className="relative h-12 w-40 overflow-hidden border border-indigo-600 text-indigo-600 shadow-2xl transition-all duration-200 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:m-auto before:h-0 before:w-0 before:rounded-sm before:bg-indigo-600 before:duration-300 before:ease-out hover:text-white hover:shadow-indigo-600 hover:before:h-40 hover:before:w-40 hover:before:opacity-80 hover:cursor-pointer">
            <span className="relative z-10">Get Started</span></button>
        </Link>
    </div>
    {/*Contents*/}
    <div className='w-full h-[89%] flex items-center justify-center gap-2'>
        {/*HEader Text */}
        <div className={`w-[40%] flex flex-col justify-center items-center text-white font-exo gap-5 transition-all duration-1000 ease-out ${show? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className='border-red-50'>
            <p className='text-4xl'>Welcome to</p>
            <h1 className='text-[8rem] font-bold text-[#dabaf7] text-shadow-sm text-shadow-black '>DevLab</h1>  
            <p className='text-2xl'>"<span className='text-purple-200'>Code.</span> <span className='text-purple-300'>Play.</span> <span className='text-purple-400'>Level Up.</span> "</p>
            </div>
            <div className='w-[57%]'><p> DevLab helps you learn full-stack web development through fun, interactive challenges. 
  Build your skills, level up, and get smarter with AI-powered guidance.</p></div>
          

        </div>

        {/*Right Pannel*/}
        <div className={`flex items-center flex-col w-[60%] h-full justify-center transition-all duration-1000 ease-out ${show?"opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div  key={currentDisplay}
                className={`w-full h-[50%] flex flex-col items-center text-white gap-6 
                transition-opacity duration-1000 ease-in-out 
                ${visible ? 'opacity-100 ' : 'opacity-0'}`}>
                <div className=' flex items-center justify-center h-[60%] w-[40%]'>{currentItem.icon}</div>
                <h1 className='font-exo text-6xl font-bold'>{currentItem.header}</h1>
                <h2 className='font-exo text-2xl'>{currentItem.header2}</h2>
                <p>{currentItem.text}</p>
            </div>
        </div>

    </div>

</div>
 

</>
)}

export default LandingPage