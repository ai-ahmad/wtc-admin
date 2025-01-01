import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBox, FaBullhorn, FaSpinner, FaLayerGroup, FaNewspaper, FaClipboardList, FaClipboardCheck } from "react-icons/fa";
import { Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, TimeScale, CategoryScale, LinearScale, BarElement } from 'chart.js';
import 'chartjs-adapter-date-fns';
import axios from 'axios';
import Loading from "../components/Loading";

ChartJS.register(ArcElement, Tooltip, Legend, TimeScale, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [advertising, setAdvertising] = useState([]);
  const [layout, setLayout] = useState([]);
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [applications, setApplications] = useState([]);
  const [newsCategories, setNewsCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    requestProducts();
    requestAdvertising();
    requestLayout();
    requestNews();
    requestCategories();
    requestApplications();
    requestNewsCategories();
  }, []);

  const requestProducts = async () => {
    try {
      const response = await fetch("https://bakend-wtc.onrender.com/api/v1/products");
      const data = await response.json();
      setProducts(data || []);
    } catch (e) {
      console.error("Error fetching products: ", e);
    }
  };

  const requestAdvertising = async () => {
    try {
      const response = await fetch("https://bakend-wtc.onrender.com/api/v1/banners");
      const ads = await response.json();
      setAdvertising(ads.data || []);
    } catch (e) {
      console.error("Error fetching advertising: ", e);
    }
  };

  const requestLayout = async () => {
    try {
      const response = await fetch("https://bakend-wtc.onrender.com/api/v1/layout");
      const layoutData = await response.json();
      setLayout(layoutData.data || []);
    } catch (e) {
      console.error("Error fetching layout: ", e);
    }
  };

  const requestNews = async () => {
    try {
      const response = await fetch("https://bakend-wtc.onrender.com/api/v1/news");
      const newsData = await response.json();
      setNews(newsData || []);
    } catch (e) {
      console.error("Error fetching news: ", e);
    } finally {
      setLoading(false);
    }
  };

  const requestCategories = async () => {
    try {
      const response = await fetch('https://bakend-wtc.onrender.com/api/v1/categories');
      const categoryData = await response.json();
      setCategories(categoryData || []);
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  const requestApplications = async () => {
    try {
      const response = await axios.get('https://bakend-wtc.onrender.com/api/v1/applications');
      setApplications(response.data || []);
    } catch (error) {
      console.error("Error fetching applications: ", error);
    }
  };

  const requestNewsCategories = async () => {
    try {
      const response = await fetch('https://bakend-wtc.onrender.com//api/v1/news-category');
      const newsCategoryData = await response.json();
      setNewsCategories(newsCategoryData || []);
    } catch (error) {
      console.error("Error fetching news categories: ", error);
    }
  };

  const totalItems = products.length + advertising.length + layout.length + news.length + categories.length + newsCategories.length;

  const doughnutData = {
    labels: ['Products', 'Advertising', 'Layouts', 'News', 'Categories', 'News Categories'],
    datasets: [
      {
        label: 'Distribution',
        data: [
          (products.length / totalItems) * 100,
          (advertising.length / totalItems) * 100,
          (layout.length / totalItems) * 100,
          (news.length / totalItems) * 100,
          (categories.length / totalItems) * 100,
          (newsCategories.length / totalItems) * 100,
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FFA500', '#9370DB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FFA500', '#9370DB'],
        borderWidth: 1,
        cutout: '75%',
      },
    ],
  };

  const doughnutOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${Math.round(tooltipItem.raw)}%`;
          },
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  // Bar chart for applications count
  const applicationsBarData = {
    labels: ['Applications'],
    datasets: [
      {
        label: 'Applications Count',
        data: [applications.length],
        backgroundColor: ['#4A90E2'],
        hoverBackgroundColor: ['#357ABD'],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Applications: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <div className="w-full h-full text-black p-6">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loading />
        </div>
      ) : (
        <>
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              className="p-6 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => handleNavigate('/app/products')}
            >
              <div className="flex justify-between items-center">
                <FaBox size={30} />
                <div className="text-right">
                  <p className="text-3xl font-bold">{products.length}</p>
                  <p className="text-sm">Всего продуктов</p>
                </div>
              </div>
            </div>

            <div 
              className="p-6 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => handleNavigate('/app/layout')}
            >
              <div className="flex justify-between items-center">
                <FaLayerGroup size={30} />
                <div className="text-right">
                  <p className="text-3xl font-bold">{layout.length}</p>
                  <p className="text-sm">Всего макетов</p>
                </div>
              </div>
            </div>

            <div 
              className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => handleNavigate('/app/advertising')}
            >
              <div className="flex justify-between items-center">
                <FaBullhorn size={30} />
                <div className="text-right">
                  <p className="text-3xl font-bold">{advertising.length}</p>
                  <p className="text-sm">Активные объявления</p>
                </div>
              </div>
            </div>

            <div 
              className="p-6 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => handleNavigate('/app/news')}
            >
              <div className="flex justify-between items-center">
                <FaNewspaper size={30} />
                <div className="text-right">
                  <p className="text-3xl font-bold">{news.length}</p>
                  <p className="text-sm">Всего новостей</p>
                </div>
              </div>
            </div>

            <div 
              className="p-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => handleNavigate('/app/categories')}
            >
              <div className="flex justify-between items-center">
                <FaClipboardList size={30} />
                <div className="text-right">
                  <p className="text-3xl font-bold">{categories.length}</p>
                  <p className="text-sm">Всего категорий</p>
                </div>
              </div>
            </div>

            <div 
              className="p-6 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => handleNavigate('/app/applications')}
            >
              <div className="flex justify-between items-center">
                <FaClipboardCheck size={30} />
                <div className="text-right">
                  <p className="text-3xl font-bold">{applications.length}</p>
                  <p className="text-sm">Всего заявок</p>
                </div>
              </div>
            </div>

            <div 
              className="p-6 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => handleNavigate('/app/news-categories')}
            >
              <div className="flex justify-between items-center">
                <FaNewspaper size={30} />
                <div className="text-right">
                  <p className="text-3xl font-bold">{newsCategories.length}</p>
                  <p className="text-sm">Всего категорий новостей</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-white text-black rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105 flex flex-col items-center">
              <h2 className="text-lg font-semibold mb-4">Распределение данных</h2>
              <div className="relative w-[400px] h-[400px]">
                <Doughnut data={doughnutData} options={doughnutOptions} />
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                  <p className="text-xl font-bold">Всего предметов</p>
                  <p className="text-2xl">{totalItems}</p>
                </div>
              </div>
            </div>

            {/* Applications Count Chart */}
            <div className="p-6 bg-white text-black rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105 flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text">Количество заявок</h2>
              <h1 className="text-4xl font-extrabold text-gray-800 mb-6">{applications.length}</h1>
              <div className="w-full">
                <Bar data={applicationsBarData} options={barOptions} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
