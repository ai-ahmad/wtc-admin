import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaPhone, FaTrash, FaSpinner } from 'react-icons/fa';
import Loading from '../components/Loading';

const Applications = ({ theme }) => {
    const [applications, setApplications] = useState([]); // State to store applications
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch applications when component mounts
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get('https://bakend-wtc-4.onrender.com/api/v1/applications');
                setApplications(response.data || []);
                // Save fetched applications to localStorage
                localStorage.setItem('applications', JSON.stringify(response.data || []));
            } catch (error) {
                console.error('Error fetching applications:', error);
                const savedApplications = localStorage.getItem('applications');
                if (savedApplications) {
                    setApplications(JSON.parse(savedApplications));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    // Handle delete request
    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://bakend-wtc-4.onrender.com/api/v1/applications/delete/${id}`);
            setApplications((prev) => prev.filter((app) => app._id !== id));
        } catch (error) {
            console.error('Error deleting application:', error);
        }
    };

    return (
        <div className={`m-5 container mx-auto p-6 rounded-xl shadow-2xl bg-slate-600 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'text-white'}`}>
            <h2 className="text-4xl font-bold text-center mb-8">Список заявок</h2>
            {loading ? (
                <div className="flex justify-center items-center">
                    <Loading />
                </div>
            ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
                    {applications.map((app) => (
                        <li key={app._id} className="bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-600">
                            <div className="flex justify-between items-center">
                                <strong className="text-2xl">{app.full_name}</strong>
                                <span className="badge badge-info badge-outline text-sm py-1 px-3 bg-gray-600">Новая заявка</span>
                            </div>

                            <div className="flex items-center mt-4">
                                <FaEnvelope className="text-gray-400 mr-2" />
                                <span>{app.email}</span>
                            </div>

                            <div className="flex items-center mt-2">
                                <FaPhone className="text-gray-400 mr-2" />
                                <span>{app.telephone}</span>
                            </div>

                            <p className="text-gray-400 mt-4 italic">{app.message}</p>

                            <div className="flex justify-between items-center mt-4">
                                <span className="text-sm">Дата: {new Date(app.createdAt).toLocaleDateString()}</span>
                                <div className="flex items-center">
                                    <a href={`tel:${app.telephone}`} className="btn btn-secondary btn-sm hover:bg-gray-600 transition-colors mr-2">
                                        Связаться
                                    </a>
                                    <button className="btn btn-danger btn-sm hover:bg-red-600 transition-colors" onClick={() => handleDelete(app._id)}>
                                        <FaTrash className="mr-2" /> Удалить
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Applications;
