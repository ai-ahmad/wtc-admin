import React, { useEffect, useState } from 'react';
import { IoMdPaper } from 'react-icons/io';
import Loading from '../components/Loading';

const News = () => {
  const [data, setData] = useState([]);                // All news
  const [newsTypes, setNewsTypes] = useState([]);       // For <select> dropdown
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form fields that match your Mongoose schema:
  //   news_type, title, data, descriptions, images
  // In the schema: 
  //   news_type: String, title: String, data: String, descriptions: String, images: Array
  const [formData, setFormData] = useState({
    news_type: '',
    title: '',
    data: '',
    descriptions: '',
    images: [],
  });

  // ===== Fetch All News & NewsTypes on component mount =====
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        // GET all news from the updated endpoint: /api/v1/news
        const res = await fetch('https://bakend-wtc.onrender.com/api/v1/news');
        if (!res.ok) throw new Error('Failed to fetch news');
        const newsData = await res.json();
        setData(newsData);
      } catch (err) {
        console.error('Error loading news:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchNewsTypes = async () => {
      try {
        // GET all news-types from the updated endpoint: /api/v1/news-type
        const res = await fetch('https://bakend-wtc.onrender.com/api/v1/news-type');
        if (!res.ok) throw new Error('Failed to fetch news types');
        const types = await res.json();
        setNewsTypes(types);
      } catch (error) {
        console.error('Error loading news types:', error);
      }
    };

    fetchNews();
    fetchNewsTypes();
  }, []);

  // ===== Form change (input, select) =====
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===== File change (images) =====
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  // ===== Create or Update News =====
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation: all text fields are required
    if (!formData.news_type || !formData.title || !formData.data || !formData.descriptions) {
      alert('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const form = new FormData();
      form.append('news_type', formData.news_type);
      form.append('title', formData.title);
      form.append('data', formData.data);
      form.append('descriptions', formData.descriptions);

      // Append images
      formData.images.forEach((file) => form.append('images', file));

      let url = 'https://bakend-wtc.onrender.com/api/v1/news/create';
      let method = 'POST';

      if (isEditing && editingId) {
        url = `https://bakend-wtc.onrender.com/api/v1/news/${editingId}`;
        method = 'PATCH';
      }

      const response = await fetch(url, {
        method,
        body: form,  // No need for JSON headers since using FormData
      });

      if (!response.ok) {
        throw new Error(isEditing ? 'Error updating news' : 'Error creating news');
      }

      // After creating/updating, refetch the updated list
      const updatedNews = await (await fetch('https://bakend-wtc.onrender.com/api/v1/news')).json();
      setData(updatedNews);

      // Reset form & close modal
      document.getElementById('my_modal_news').close();
      setFormData({
        news_type: '',
        title: '',
        data: '',
        descriptions: '',
        images: [],
      });
      setIsEditing(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error during create/update:', error);
      alert('Failed to process request. Check console or try again.');
    } finally {
      setLoading(false);
    }
  };

  // ===== Delete News =====
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news?')) return;

    try {
      setLoading(true);
      // DELETE request to /api/v1/news/:id
      const response = await fetch(`https://bakend-wtc.onrender.com/api/v1/news/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setData((prev) => prev.filter((item) => item._id !== id));
        alert('News successfully deleted');
      } else {
        const errData = await response.json();
        alert(`Error deleting news: ${errData.message}`);
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('An unexpected error occurred while deleting the news.');
    } finally {
      setLoading(false);
    }
  };

  // ===== Edit News =====
  const handleEdit = (newsItem) => {
    setIsEditing(true);
    setEditingId(newsItem._id);

    // Populate the form with existing values
    setFormData({
      news_type: newsItem.news_type || '',
      title: newsItem.title || '',
      data: newsItem.data || '',
      descriptions: newsItem.descriptions || '',
      images: [], // We do not set existing images directly here
    });

    // Show dialog
    document.getElementById('my_modal_news').showModal();
  };

  return (
    <div className="p-3 flex flex-col w-full gap-5 text-white">
      {/* Header */}
      <div className="bg-base-300 p-5 w-full flex justify-between items-center rounded-2xl">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <IoMdPaper className="text-4xl" /> News
        </h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setIsEditing(false);
            setEditingId(null);
            setFormData({
              news_type: '',
              title: '',
              data: '',
              descriptions: '',
              images: [],
            });
            document.getElementById('my_modal_news').showModal();
          }}
        >
          Add News
        </button>
      </div>

      {/* Modal for Create/Update */}
      <dialog id="my_modal_news" className="modal">
        <div className="modal-box relative">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => document.getElementById('my_modal_news').close()}
          >
            X
          </button>
          <form onSubmit={handleFormSubmit} className="space-y-5 mt-8">
            {/* Title */}
            <label className="flex flex-col gap-2">
              <span>Title</span>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                className="input input-bordered w-full"
                required
              />
            </label>

            {/* News Type (select from categories) */}
            <label className="flex flex-col gap-2">
              <span>News Type</span>
              <select
                name="news_type"
                value={formData.news_type}
                onChange={handleFormChange}
                className="input input-bordered w-full"
                required
              >
                <option value="" disabled>Select a category</option>
                {newsTypes.map((typeObj) => (
                  <option key={typeObj._id} value={typeObj.type}>
                    {typeObj.type}
                  </option>
                ))}
              </select>
            </label>

            {/* Images */}
            <label className="flex flex-col gap-2">
              <span>Images (up to 5)</span>
              <input
                type="file"
                name="images"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full"
                multiple
                accept="image/*"
              />
            </label>

            {/* Data (like "date", but a text field in your schema) */}
            <label className="flex flex-col gap-2">
              <span>Data (e.g. date or short text)</span>
              <input
                type="text"
                name="data"
                value={formData.data}
                onChange={handleFormChange}
                className="input input-bordered w-full"
                required
              />
            </label>

            {/* Descriptions */}
            <label className="flex flex-col gap-2">
              <span>Descriptions</span>
              <textarea
                name="descriptions"
                value={formData.descriptions}
                onChange={handleFormChange}
                className="textarea textarea-bordered w-full"
                rows="3"
                required
              />
            </label>

            <button type="submit" className="btn w-full mt-3">
              {isEditing ? 'Update News' : 'Create News'}
            </button>
          </form>
        </div>
      </dialog>

      {/* Table of News */}
      <div className="bg-base-300 p-5 rounded-3xl">
        {loading ? (
          <div className="flex justify-center">
            <Loading />
          </div>
        ) : data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Images</th>
                  <th>Data</th>
                  <th>News Type</th>
                  <th>Title</th>
                  <th>Descriptions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((newsItem) => (
                  <tr key={newsItem._id}>
                    <td>{newsItem._id}</td>
                    <td>
                      {newsItem.images && newsItem.images.length > 0 ? (
                        <img
                          src={`https://bakend-wtc.onrender.com${newsItem.images[0]}`} 
                          alt="News"
                          className="w-16 h-16 object-cover"
                        />
                      ) : (
                        'No Image'
                      )}
                    </td>
                    <td>{newsItem.data}</td>
                    <td>{newsItem.news_type}</td>
                    <td className="font-semibold">{newsItem.title}</td>
                    <td className="max-w-xs truncate">{newsItem.descriptions}</td>
                    <td className="flex flex-col gap-2 lg:flex-row">
                      <button
                        className="btn btn-sm bg-slate-800"
                        onClick={() => handleEdit(newsItem)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm bg-red-700"
                        onClick={() => handleDelete(newsItem._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">No news available</p>
        )}
      </div>
    </div>
  );
};

export default News;
