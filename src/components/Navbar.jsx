import React from 'react';
import { NavLink } from 'react-router-dom';
import OWlogo from '../assets/OWlogo.png';

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-black text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium'
      : 'hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium';

    const logorsign = ({ })

  return (
    <nav className="bg-indigo-700 border-b border-indigo-500">
       <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
       <div className="flex h-20 items-center justify-between">
          {/* Logo */}
{/* {          <div
          className="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
        >
            <NavLink className="flex flex-shrink-0 items-center mr-4" to="/">
              <img className="h-8 w-8" src={OWlogo} alt="OWlogo" />
            </NavLink>
          </div>} */}
          {/* Links */}
          <div className="flex space-x-4 md:ml-auto">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/gamelog" className={linkClass}>
              Game Log
            </NavLink>
            <NavLink to="/sign-in" className={linkClass}>
              Sign in
            </NavLink>
            <NavLink to="/analysis" className={linkClass}>
              Stat Analysis
            </NavLink>
            <NavLink to="/val-log" className={linkClass}>
            Valorant Game Log
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
