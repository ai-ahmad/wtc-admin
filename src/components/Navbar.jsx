import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'; 
import Logout from "./Logout";
import Create from './Create';

const Navbar = ({ toggleTheme, theme }) => {
  return (
    <div className={`navbar ${theme === 'dark' ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-black' : 'bg-gradient-to-r from-white via-gray-100 bg-gray-200'} text-${theme === 'dark' ? 'white' : 'black'} shadow-lg px-6 py-4 flex items-center justify-between`}>
      
      {/* Logo Section with Conditional Background for Light Theme */}
      <div className={`flex items-center p-2 rounded-lg ${theme === 'light' ? 'bg-base-100' : ''} transition-colors duration-300`}>
        <img 
          src={theme === 'dark' ? '/logo4.png' : '/logo4.png'}  // Use appropriate logo for light and dark theme
          alt="Логотип oilTrade" 
          className="h-12 mr-4 rounded-lg transition-transform duration-500 transform hover:scale-110 hover:rotate-3 shadow-lg" // Enhanced hover effect and shadow
        />
      </div>

      {/* Create, Logout, and Theme Toggle Section */}
      <div className="flex items-center gap-5">
        <Create />
        <Logout />
        <div 
          onClick={toggleTheme} 
          className="ml-4 cursor-pointer p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500 transition duration-300"
        >
          {theme === 'light' ? <FaMoon size={24} /> : <FaSun size={24} />} 
        </div>
      </div>
    </div>
  );
};

export default Navbar;
