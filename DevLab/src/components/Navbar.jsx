import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Navbar_Data } from "../Data/NavBar_Data";
import { LuCog } from "react-icons/lu";
import { IoChevronDownOutline } from "react-icons/io5";
import { IoCodeSlash, IoCode } from "react-icons/io5";

function Navbar() {
  const [open, setOpen] = useState(null); // For dropdown state
  const [collapsed, setCollapsed] = useState(false); // For collapse on large screen
  const [mobileOpen, setMobileOpen] = useState(false); // For toggle on mobile

  const toggleDropdown = (key) => {
    setOpen(open === key ? null : key);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="bg-[#9333EA] text-white p-2 rounded-lg shadow-md"
        >
          {mobileOpen ? <IoCodeSlash size={24} /> : <IoCode size={24} />}
        </button>
      </div>

      {/* Navbar Container */}
      <div
        className={`
          flex flex-col p-3 items-center
          ${collapsed ? "w-20" : "w-70"}
          text-white h-screen overflow-y-auto scrollbar-custom transition-all duration-300
          md:relative md:translate-x-0
          fixed top-0 left-0 z-40
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:flex
        `}>
        {/* Collapse/Expand Button (Desktop Only) */}
        <div className="hidden md:flex justify-end mb-4 self-end">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="bg-[#9333EA] text-white p-2 rounded-full hover:bg-[#7b22c5] transition duration-200 cursor-pointer">
            {collapsed ? <IoCodeSlash /> : <IoCode />}
          </button>
        </div>

        {/* Logo */}
        <div className="p-5">
          {!collapsed && <h1 className="font-exo font-bold text-5xl">DevLab</h1>}
        </div>

        {/* Navigation Items */}
          <div className="flex-1 flex flex-col gap-5 w-full">
            {Navbar_Data.map((item) => (
              <div key={item.key}>
                {/* Parent Link */}
                <div
                  onClick={() => (item.children ? toggleDropdown(item.key) : null)}>
                  <NavLink
                    to={item.path}
                    className="flex items-center gap-3 font-inter text-[1.2rem] relative rounded px-5 p-3 border-b border-gray-500 overflow-hidden group hover:bg-[#9333EA] transition-all ease-out duration-300 NavBarText-laptop"
                  >
                    <span className="text-xl">{item.icon}</span>
                    {!collapsed && item.label}
                    {item.children && !collapsed && (
                      <IoChevronDownOutline
                        className={`ml-auto transition-transform duration-300 ${
                          open === item.key ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </NavLink>
                </div>

                {/* Subtopics */}
                {!collapsed && (
                  <div
                    className={`ml-10 mt-1 flex flex-col gap-3 overflow-hidden transition-all duration-300 ease-in-out ${
                      open === item.key
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
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
                )}
              </div>
            ))}
          </div>
        {/* Settings Button */}
        <NavLink
          to="Settings"
          className={({ isActive }) =>
            `flex items-center justify-center gap-3.5 w-full relative hover:bg-[#9333EA] font-inter transition-all ease-out duration-300 text-[1.3rem] rounded-4xl p-3 NavBarText-laptop ${
              isActive ? "text-[#9333EA]" : "text-white"
            }`}>
          <LuCog className="text-xl" />
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </div>
    </>
  );
}

export default Navbar;
