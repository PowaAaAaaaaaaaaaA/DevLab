import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Navbar_Data } from "../Data/NavBar_Data";
import { LuCog } from "react-icons/lu";
import { IoChevronDownOutline } from "react-icons/io5";

function Navbar() {
  const [open, setOpen] = useState(null);

  const toggleDropdown = (key) => {
    setOpen(open === key ? null : key);
  };

  return (
    <div className="flex flex-col p-4 w-70 text-white h-screen overflow-auto scrollbar-custom">
      <div className="p-5">
        <h1 className="p-5 font-exo font-bold text-5xl">DevLab</h1>
      </div>
      <div className="flex-1 flex flex-col gap-5">
        {Navbar_Data.map((item) => (
          <div key={item.key}>
            {/* Main Nav Item */}
            <div
              onClick={() => (item.children ? toggleDropdown(item.key) : null)}>
              <NavLink
                to={item.path}
                className="flex items-center gap-3 font-inter text-[1.2rem] relative rounded px-5 p-3 overflow-hidden group hover:bg-[#9333EA] transition-all ease-out duration-300 NavBarText-laptop">
                <span className="text-xl">{item.icon}</span>
                {item.label}
                {item.children && (
                  <IoChevronDownOutline
                    className={`ml-auto transition-transform duration-300 ${
                      open === item.key ? "rotate-180" : ""
                    }`}
                  />
                )}
              </NavLink>
            </div>
            {/* Subtopics with Transition */}
            <div
              className={`ml-10 mt-1 flex flex-col gap-3 transition-all duration-400 ease-in-out ${
                open === item.key ? "max-h-45 opacity-100" : "max-h-0 opacity-0"
              }`}>
              {item.children &&
                item.children.map((sub) => (
                  <NavLink
                    to={sub.path}
                    key={sub.key}
                    className="flex items-center tracking-wide p-2 gap-3 text-[1rem] font-inter hover:bg-[#9333EA] transition-all ease-out duration-300 rounded NavBarText-laptop">
                    <span className="text-xl">{sub.icon}</span>
                    {sub.label}
                  </NavLink>
                ))}
            </div>
          </div>
        ))}
      </div>
      <NavLink
        to="Settings"
        className={({ isActive }) =>
          `flex justify-center items-center gap-3.5 w-full relative hover:bg-[#9333EA] font-inter transition-all ease-out duration-300 text-[1.3rem] rounded-4xl p-3 NavBarText-laptop
          ${isActive ? "text-[#9333EA]" : "text-white"}`
        }>
        <LuCog className="text-xl" />
        <span>Settings</span>
      </NavLink>
    </div>
  );
}

export default Navbar;
