import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Products from './pages/Products';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { useSelector } from 'react-redux';
import News from './pages/News'; // Импортируйте ваш компонент News

function App() {
  const store = useSelector((store) => store);
  console.log(store);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const [newsData, setNewsData] = useState([]); // Состояние для новостей

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const appStyle = {
    background: theme === 'light' 
      ? 'linear-gradient(to bottom, #f9f9f9, #e0e0e0)' 
      : 'linear-gradient(to bottom, #2c3e50, #34495e)', 
    color: theme === 'light' ? '#2c3e50' : '#ecf0f1',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    transition: 'background 0.5s ease, color 0.5s ease', 
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const updateNews = (newNews) => {
    setNewsData((prevNews) => [...prevNews, newNews]); // Обновляем новости
  };

  return (
    <div style={appStyle}>
      <Navbar toggleTheme={toggleTheme} theme={theme} />
      <div className="flex">
        <Sidebar theme={theme} /> {/* Передаем theme в Sidebar */}
        <div className="flex-grow max-h-[100vh] overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
