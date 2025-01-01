import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { login } from '../redux/authSclice';
import { FaUser, FaLock } from 'react-icons/fa';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = () => {
    // Сохраняем фиктивные данные и перенаправляем
    localStorage.setItem('admin', JSON.stringify({ username: 'admin', role: 'admin' }));
    dispatch(login({ username: 'admin', role: 'admin' }));
    navigate('/app/home');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/path/to/your/background-image.jpg)' }}>
      <div className="bg-white bg-opacity-80 p-10 rounded-3xl shadow-2xl w-96 md:w-1/3 lg:w-1/4">
        <h1 className="text-3xl font-bold text-center text-black mb-6">Admin Panel Login</h1>
        
        <div className="mb-6 relative">
          <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-200" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            autoComplete="username"
            className="border rounded-full p-4 pl-12 w-full text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Username"
          />
        </div>

        <div className="mb-6 relative">
          <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-200" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            className="border rounded-full p-4 pl-12 w-full text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Password"
          />
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-semibold py-4 px-6 rounded-full w-full shadow-lg"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;