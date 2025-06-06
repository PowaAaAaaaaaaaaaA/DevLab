import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar_Data } from '../Data/NavBar_Data'




function Navbar() {
  return (
    <div className='flex flex-col p-5 w-60 text-white'>
        <div className='p-5'>
            <h1 className='p-5 font-exo font-bold text-4xl'>DevLab</h1>
        </div>
        <div className='flex-1 flex flex-col gap-5'>
            {Navbar_Data.map((item)=>(
                <Link to={item.path} className='flex items-center gap-3 font-inter text-[1.3rem] "relative rounded px-5 py-2.5 overflow-hidden group relative hover:bg-gradient-to-r hover:from-[#0D1117]] hover:to-[#9333EA] text-white hover:ring-3 hover:ring-offset-0 hover:ring-[#9333EA] transition-all ease-out duration-300"'>
                    <span className='text-xl'>{item.icon}</span>
                    {item.label}
                </Link>
            ))}
        </div>
        <Link>
        <div className='flex justify-center w-full overflow-hidden group relative hover:bg-gradient-to-r hover:from-[#0D1117]] hover:to-[#9333EA] text-white hover:ring-3 hover:ring-offset-0 hover:ring-[#9333EA] transition-all ease-out duration-300"font-inter text-[1.3rem] rounded-4xl'>Settings</div></Link>
    </div>
  )
}


export default Navbar