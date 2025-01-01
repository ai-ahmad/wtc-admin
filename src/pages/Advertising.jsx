import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaSpinner, FaBullhorn, FaEdit } from 'react-icons/fa';
import Loading from '../components/Loading';

const Advertising = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        images: [],
        title: '',
        description: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null); // Store the ID of the banner being edited

    // Fetch all banners from the API
    const dataRequest = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://bakend-wtc.onrender.com/api/v1/banners');
            if (!response.ok) throw new Error('Failed to fetch banners from API');
            const ads = await response.json();
            setData(ads.data || []);
        } catch (error) {
            console.error('Error fetching banners:', error);
        } finally {
            setLoading(false);
        }
    };
      

    useEffect(() => {
        dataRequest(); // Fetch data from API on mount
    }, []);

    

    // Handle form input changes
    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: files ? Array.from(files) : value,
        }));
    };

    // Handle form submission (Create or Edit)
    const handleFormSubmit = async (e) => {
        e.preventDefault();
    
        // Validation check for required fields
        if (!formData.title || !formData.description || (formData.images.length < 1 && !isEditing)) {
            alert('Please fill out all required fields');
            return;
        }
    
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
    
        // Append images if there are any
        formData.images.forEach((image) => {
            formDataToSend.append('images', image);
        });
    
        try {
            let response;
            if (isEditing && editingId) {
                // PUT request for updating an existing banner
                response = await fetch(`https://bakend-wtc.onrender.com/api/v1/banners/${editingId}`, {
                    method: 'PUT',
                    body: formDataToSend,
                });
            } else {
                // POST request for adding a new banner
                response = await fetch('https://bakend-wtc.onrender.com/api/v1/banners/create', {
                    method: 'POST',
                    body: formDataToSend,
                });
            }
    
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.data || 'Error adding/updating advertisement');
            }
    
            const updatedBanner = await response.json();
            let updatedData = isEditing 
                ? data.map((ad) => (ad._id === editingId ? updatedBanner.data : ad)) 
                : [...data, updatedBanner.data];
    
            // Update state and close modal
            setData(updatedData);
            document.getElementById('my_modal_advertising').close();
            alert('Banner successfully saved!');
            setFormData({ images: [], title: '', description: '' });
        } catch (error) {
            console.error('Error adding/updating advertisement:', error.message);
            alert(`Failed to save the banner: ${error.message}`);
        }
    };
    

    // Handle deletion of a banner
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://bakend-wtc.onrender.com/api/v1/banners/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Error deleting advertisement');
            }
            const updatedData = data.filter((ad) => ad._id !== id);
            setData(updatedData);
        } catch (error) {
            console.error('Error deleting advertisement:', error);
        }
    };

    // Handle editing of a banner
    const handleEdit = (ad) => {
        setFormData({
            title: ad.title,
            description: ad.description,
            images: [], // Do not prefill images since they are files
        });
        setEditingId(ad._id);
        setIsEditing(true);
        document.getElementById('my_modal_advertising').showModal();
    };

    return (
        <div className="p-5 flex flex-col w-10/15 gap-5 text-white">
            <div className="bg-base-200 p-5 w-full flex justify-between items-center rounded-2xl">
                <h1 className="text-2xl font-bold text-primary flex gap-2">
                    <FaBullhorn className="size-9" /> Баннер и Реклама 
                </h1>
                <button className="btn btn-primary flex items-center" onClick={() => {
                    setIsEditing(false); // Set to add mode
                    setFormData({ images: [], title: '', description: '' }); // Clear form for new banner
                    document.getElementById('my_modal_advertising').showModal();
                }}>
                    <FaPlus className="mr-2" /> Добавить 
                </button>
            </div>

            <dialog id="my_modal_advertising" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">X</button>
                    </form>
                    <form onSubmit={handleFormSubmit}>
                        <label className="input input-bordered flex items-center gap-2 mt-10">
                        Заголовок
                            <input type="text" name="title" value={formData.title} onChange={handleFormChange} className="grow" placeholder="Title" required />
                        </label>
                        <label className="input input-bordered flex items-center gap-2 mt-5">
                        Изображение
                            <input type="file" name="images" onChange={handleFormChange} className="grow" accept="image/*" multiple={!isEditing} />
                        </label>
                        <label className="input input-bordered flex items-center gap-2 mt-5">
                        Описание
                            <input type="text" name="description" value={formData.description} onChange={handleFormChange} className="grow" placeholder="Description" required />
                        </label>
                        <button type="submit" className="btn mt-5">{isEditing ? 'Edit Banner' : 'Add Banner'}</button>
                    </form>
                </div>
            </dialog>

            <div className="p-5 w-full flex justify-between items-center bg-base-200 rounded-3xl">
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Изображение</th>
                                <th>Заголовок</th>
                                <th>Описание</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(data) && data.length > 0 ? (
                                data.map((ad) => (
                                    <tr key={ad._id}>
                                        <td>{ad._id}</td>
                                        <td>
                                            {ad.images.map((image, index) => (
                                                <img key={index} src={`https://bakend-wtc.onrender.com/${image}`} alt="Ad" style={{ width: '100px', height: 'auto', marginRight: '5px' }} />
                                            ))}
                                        </td>
                                        <td>{ad.title}</td>
                                        <td>{ad.description.length > 50 ? ad.description.slice(0, 50) + '...' : ad.description}</td>
                                        <td>
                                            <button className="btn mr-2 bg-slate-800" onClick={() => handleEdit(ad)}>
                                                <FaEdit className="mr-2" /> Редактировать
                                            </button>
                                            <button className="btn bg-red-700" onClick={() => handleDelete(ad._id)}>
                                                <FaTrash className="mr-2" /> Удалить
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">Нет доступных баннеров</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {loading && (
                        <div className="flex justify-center mt-5">
                            <Loading />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Advertising;
