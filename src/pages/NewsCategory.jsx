import React, { useState, useEffect } from 'react';
import { FaSpinner, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { IoMdPaper } from 'react-icons/io';
import Loading from '../components/Loading';

const NewsCategory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    type: '', // matches your NewsCategory model field
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // ===== Fetch All News Types =====
  const fetchNewsCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://bakend-wtc-4.onrender.com/api/v1/news-type');
      if (!response.ok) {
        throw new Error('Failed to fetch news categories');
      }
      const categories = await response.json();
      setData(categories);
    } catch (error) {
      console.error('Error fetching news categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // ===== On Mount, fetch data =====
  useEffect(() => {
    fetchNewsCategories();
  }, []);

  // ===== Handle Form Changes =====
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ===== Create or Update Category =====
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      
      // If editing, send PUT request
      if (isEditing && editingId) {
        response = await fetch(`https://bakend-wtc-4.onrender.com/api/v1/news-type/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        // Else, send POST request
        response = await fetch('https://bakend-wtc-4.onrender.com/api/v1/news-type', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        throw new Error('Error adding/updating news category');
      }

      const updatedCategory = await response.json();

      if (isEditing) {
        // Update existing item in state
        setData(data.map((cat) => (cat._id === editingId ? updatedCategory : cat)));
        setIsEditing(false);
        setEditingId(null);
      } else {
        // Add new item to state
        setData([...data, updatedCategory]);
      }

      // Close modal & reset form
      document.getElementById('my_modal_news_category').close();
      setFormData({ type: '' });

    } catch (error) {
      console.error('Error adding/updating news category:', error);
    } finally {
      setLoading(false);
    }
  };

  // ===== Delete Category =====
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    setLoading(true);
    try {
      const response = await fetch(`https://bakend-wtc-4.onrender.com/api/v1/news-type/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error deleting news category');
      }
      setData(data.filter((category) => category._id !== id));
      alert('News category deleted successfully');
    } catch (error) {
      console.error('Error deleting news category:', error);
    } finally {
      setLoading(false);
    }
  };

  // ===== Edit Category =====
  const handleEdit = (category) => {
    setFormData({ type: category.type });
    setEditingId(category._id);
    setIsEditing(true);
    document.getElementById('my_modal_news_category').showModal();
  };

  return (
    <div className="p-5 flex flex-col w-full gap-5 text-white">
      {/* Header */}
      <div className="bg-base-200 p-5 w-full flex justify-between items-center rounded-2xl">
        <h1 className="text-3xl font-bold text-primary flex gap-2">
          <IoMdPaper className="size-9" /> News Categories
        </h1>
        <button
          className="btn btn-primary flex items-center"
          onClick={() => {
            setIsEditing(false);
            setFormData({ type: '' });
            document.getElementById('my_modal_news_category').showModal();
          }}
        >
          <FaPlus className="mr-2" /> Add News Category
        </button>
      </div>

      {/* Modal for Create & Edit */}
      <dialog id="my_modal_news_category" className="modal">
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => document.getElementById('my_modal_news_category').close()}
          >
            X
          </button>
          <form onSubmit={handleFormSubmit}>
            <label className="input input-bordered flex items-center gap-2 mt-10">
              Category Name
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleFormChange}
                className="grow"
                placeholder="News Category Name"
                required
              />
            </label>
            <button type="submit" className="btn mt-5">
              {isEditing ? 'Edit News Category' : 'Add News Category'}
            </button>
          </form>
        </div>
      </dialog>

      {/* Table Display */}
      <div className="p-5 w-full flex justify-between items-center bg-base-200 rounded-3xl">
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center w-full h-full flex justify-center items-center">
                    <Loading />
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((category) => (
                  <tr key={category._id}>
                    <td>{category._id}</td>
                    <td>{category.type}</td>
                    <td className="flex gap-2">
                      <button
                        className="btn btn-sm bg-slate-800 text-white flex items-center"
                        onClick={() => handleEdit(category)}
                      >
                        <FaEdit className="mr-2" /> Edit
                      </button>
                      <button
                        className="btn btn-sm bg-red-500 text-white flex items-center"
                        onClick={() => handleDelete(category._id)}
                      >
                        <FaTrash className="mr-2" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No news categories available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NewsCategory;
