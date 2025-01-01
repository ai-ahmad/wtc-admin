import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBullhorn, FaClipboardList, FaNewspaper, FaHome, FaBoxOpen, FaLayerGroup, FaTags } from 'react-icons/fa'; // добавляем FaTags для Category

const Sidebar = ({ theme }) => {
  const location = useLocation();

  return (
    <div className={`drawer lg:drawer-open overflow-y-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} text-${theme === 'dark' ? 'white' : 'black'} w-full lg:w-2/12 shadow-lg`}>
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
          Open drawer
        </label>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu min-h-full w-full p-4 gap-5">
          <li>
            <Link
              to="/app/home"
              className={`flex items-center gap-4 py-2 px-5 rounded-lg transition-all duration-300 ${
                location.pathname === "/app/home" ? "bg-blue-600" : "hover:bg-blue-500"
              }`}
            >
              <FaHome size={20} /> Главная страница 
            </Link>
          </li>
          <li>
            <Link
              to="/app/products"
              className={`flex items-center gap-4 py-2 px-5 rounded-lg transition-all duration-300 ${
                location.pathname === "/app/products" ? "bg-blue-600" : "hover:bg-blue-500"
              }`}
            >
              <FaBoxOpen size={20} /> Продукты
            </Link>
          </li>
          <li>
            <Link
              to="/app/news"
              className={`flex items-center gap-4 py-2 px-5 rounded-lg transition-all duration-300 ${
                location.pathname === "/app/news" ? "bg-blue-600" : "hover:bg-blue-500"
              }`}
            >
              <FaNewspaper size={20} /> Новости
            </Link>
          </li>
          <li>
            <Link
              to="/app/advertising"
              className={`flex items-center gap-4 py-2 px-5 rounded-lg transition-all duration-300 ${
                location.pathname === "/app/advertising" ? "bg-blue-600" : "hover:bg-blue-500"
              }`}
            >
              <FaBullhorn size={20} /> Баннер и Реклама 
            </Link>
          </li>


          {/* Иконка для Category */}
          <li>
            <Link
              to="/app/category"
              className={`flex items-center gap-4 py-2 px-5 rounded-lg transition-all duration-300 ${
                location.pathname === "/app/category" ? "bg-blue-600" : "hover:bg-blue-500"
              }`}
            >
              <FaTags size={20} /> Категория
            </Link>
          </li>

          <li>
            <Link
              to="/app/newsCategory"
              className={`flex items-center gap-4 py-2 px-5 rounded-lg transition-all duration-300 ${
                location.pathname === "/app/category" ? "bg-blue-600" : "hover:bg-blue-500"
              }`}
            >
              <FaTags size={20} /> Новости Категория
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
