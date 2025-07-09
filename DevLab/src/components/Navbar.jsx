import { useState } from 'react';
import { Link, NavLink,} from 'react-router-dom';
import { Navbar_Data } from '../Data/NavBar_Data';
import { LuCog } from "react-icons/lu";
import { IoChevronDownOutline } from "react-icons/io5";

function Navbar() {

const [open, setOpen] = useState(null);

const toggleDropdown = (key) => {
    setOpen(open === key ? null : key);};

return (
    <div className='flex flex-col p-4 w-60 text-white h-screen'>
        <div className='p-5'>
            <h1 className='p-5 font-exo font-bold text-4xl'>DevLab</h1>
        </div>

        <div className='flex-1 flex flex-col gap-5'>
            {Navbar_Data.map((item) => (
            <div key={item.key}>
                {/* Main Nav Item */}
            <div onClick={() => item.children ? toggleDropdown(item.key) : null}>
            <NavLink
                to={item.path}
                    className= 'flex items-center gap-3 font-inter text-[1.3rem] relative rounded px-5 py-2.5 overflow-hidden group  hover:bg-[#9333EA] hover:ring-3 hover:ring-[#78dada] transition-all ease-out duration-300 '>
                <span className='text-xl'>{item.icon}</span>
                {item.label}
                {item.children && (
                <IoChevronDownOutline
                    className={`ml-auto transition-transform duration-300 ${
                    open === item.key ? 'rotate-180' : ''}`}/>)}
            </NavLink>
            </div>
            {/* Subtopics if any */}
            {item.children && open === item.key && (
            <div className="ml-10 mt-1 flex flex-col gap-3">
                {item.children.map((sub) => (
                <NavLink
                    to={sub.path}
                    key={sub.key}
                    className='flex items-center p-2 gap-3 text-[1.1rem] font-inter hover:bg-[#9333EA] hover:ring-3 hover:ring-[#78dada] transition-all ease-out duration-300 rounded '>
                    <span className='text-xl'>{item.icon}</span>
                    {sub.label}
                </NavLink>))}
            </div>
            )}
            </div>))}
        </div>

    <NavLink
        to='Settings'
        className={({ isActive }) =>
        `flex justify-center items-center gap-3.5 w-full overflow-hidden group relative hover:bg-gradient-to-r hover:from-[#0D1117] hover:to-[#9333EA] font-bold font-inter hover:ring-3 hover:ring-offset-0 hover:ring-[#9333EA] transition-all ease-out duration-300 text-[1.3rem] rounded-4xl	
        ${isActive ? 'text-[#9333EA]' : 'text-white'}`
        }
    >
        <LuCog className='text-xl' />
        <span>Settings</span>
    </NavLink>
    </div>
);
}

export default Navbar;