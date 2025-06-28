import React, { useEffect, useState } from 'react';
import Lottie from "lottie-react";
import { Link } from 'react-router-dom';
import { LandingPage_Data } from '../Data/LandingContents_Data';



function LandingPage() {
    const [currentDisplay, setCurrentDisplay]= useState(0);
    const [visible, setVisible] = useState (true);

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

const currentItem = LandingPage_Data[currentDisplay];

return (
<>
<div className='w-full h-screen bg-[#0F172A]'>
    {/*Header*/}
    <div className='bg-[#423cb3] h-[7%] font-exo flex items-center justify-between px-20'>
        <h1 className='text-4xl text-white font-bold'>DevLab</h1>
        <Link><button>Get Started</button></Link>
    </div>
    {/*Contents*/}
    <div className='bg-[#0F172A] h-[89%] flex items-center flex-col p-5'>
        <div  key={currentDisplay}
            className={`w-full h-[80%] flex flex-col items-center text-white gap-6 mt-4
            transition-opacity duration-1000 ease-in-out 
            ${visible ? 'opacity-100 ' : 'opacity-0'}`}>
            <div className=' flex items-center justify-center h-[60%] w-[40%]'>{currentItem.icon}</div>
            <h1 className='font-exo text-6xl font-bold'>{currentItem.header}</h1>
            <h2 className='font-exo text-2xl'>{currentItem.header2}</h2>
            <p>{currentItem.text}</p>
        </div>
            <Link to='/Login'><button className="relative h-12 w-40 overflow-hidden border border-indigo-600 text-indigo-600 shadow-2xl transition-all duration-200 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:m-auto before:h-0 before:w-0 before:rounded-sm before:bg-indigo-600 before:duration-300 before:ease-out hover:text-white hover:shadow-indigo-600 hover:before:h-40 hover:before:w-40 hover:before:opacity-80 hover:cursor-pointer">
            <span className="relative z-10">Get Started</span></button>
            </Link>
    </div>
    {/*FOoter*/}
    <div className='bg-[#423cb3] h-[4%] flex items-center justify-center'><p>© 2025 DevLab. All rights reserved.</p></div>
</div>
 

</>
)}

export default LandingPage