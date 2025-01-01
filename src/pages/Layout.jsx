import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSpinner, FaEdit } from 'react-icons/fa';
import Loading from '../components/Loading';

const Layout = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    descriptions: '',
    "1_text": [],
    "2_text": [],
    "3_text": [],
    "4_text": [],
    bg_image: null,
    imagePreview: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchLayouts = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://bakend-wtc-4.onrender.com/api/layouts');
      if (!response.ok) throw new Error('Failed to fetch layouts from API');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching layouts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLayouts();
  }, []);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        bg_image: files[0],
        imagePreview: URL.createObjectURL(files[0]),
      }));
    } else {
      let parsedValue;
  
      // Try to parse the JSON string, if it fails, use the raw value
      try {
        parsedValue = JSON.parse(value);
      } catch {
        parsedValue = value; // If parsing fails, fall back to using the raw value
      }
  
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: parsedValue,
      }));
    }
  };
  

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.descriptions || !formData.bg_image) {
      alert('Please complete all required fields and upload an image.');
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('descriptions', formData.descriptions);
    formDataToSend.append('1_text', JSON.stringify(formData["1_text"]));
    formDataToSend.append('2_text', JSON.stringify(formData["2_text"]));
    formDataToSend.append('3_text', JSON.stringify(formData["3_text"]));
    formDataToSend.append('4_text', JSON.stringify(formData["4_text"]));
    formDataToSend.append('bg_image', formData.bg_image);
  
    try {
      const response = await fetch(
        isEditing ? `https://bakend-wtc-4.onrender.com/api/layouts/${editingId}` : 'https://bakend-wtc-4.onrender.com//layouts/create',
        {
          method: isEditing ? 'PUT' : 'POST',
          body: formDataToSend,
        }
      );
  
      if (!response.ok) throw new Error('Failed to save layout');
      const result = await response.json();
  
      setData(
        isEditing
          ? data.map((layout) => (layout._id === editingId ? result.layout : layout))
          : [...data, result.layout]
      );
      
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        title: '',
        descriptions: '',
        "1_text": [],
        "2_text": [],
        "3_text": [],
        "4_text": [],
        bg_image: null,
        imagePreview: null,
      });
  
      // Close the modal after successful submission
      document.getElementById('layout_modal').close();
  
    } catch (error) {
      console.error('Error saving layout:', error.message);
      alert(`Failed to save layout: ${error.message}`);
    }
  };
  

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://bakend-wtc-4.onrender.com/layouts/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete layout');
      setData(data.filter((layout) => layout._id !== id));
    } catch (error) {
      console.error('Error deleting layout:', error.message);
    }
  };

  const handleEdit = (layout) => {
    setFormData({
      title: layout.title,
      descriptions: layout.descriptions,
      "1_text": layout["1_text"],
      "2_text": layout["2_text"],
      "3_text": layout["3_text"],
      "4_text": layout["4_text"],
      bg_image: null,
      imagePreview: `https://bakend-wtc-4.onrender.com/${layout.bg_images}`,
    });
    setIsEditing(true);
    setEditingId(layout._id);
    document.getElementById('layout_modal').showModal();
  };

  return (
    <div className="p-5 flex flex-col gap-5 text-white">
      <div className="bg-base-200 p-5 flex justify-between items-center rounded-2xl shadow-lg">
        <h1 className="text-3xl font-semibold text-primary">Layouts</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setIsEditing(false);
            setFormData({
              title: '',
              descriptions: '',
              "1_text": [],
              "2_text": [],
              "3_text": [],
              "4_text": [],
              bg_image: null,
              imagePreview: null,
            });
            document.getElementById('layout_modal').showModal();
          }}
        >
          <FaPlus className="mr-2" /> Add Layout
        </button>
      </div>

      <dialog id="layout_modal" className="modal">
        <div className="modal-box rounded-lg bg-white p-6 shadow-xl max-w-xl mx-auto relative">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-500 hover:text-gray-700">X</button>
          </form>
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
            {isEditing ? 'Edit Layout' : 'Add New Layout'}
          </h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-gray-600 font-medium">Title</label>
              <input
                type="text"// #fff
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                required
                className="input input-bordered rounded-md p-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-600 font-medium">Descriptions</label>
              <input
                type="text"
                name="descriptions"
                value={formData.descriptions}
                onChange={handleFormChange}
                required
                className="input input-bordered rounded-md p-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            {['1_text', '2_text', '3_text', '4_text'].map((field, index) => (
              <div key={index} className="flex flex-col gap-2">
                <label className="text-gray-600 font-medium">{`Select Text ${index + 1}`}</label>
                <select
                  name={field}
                  onChange={handleFormChange}
                  className="input input-bordered rounded-md p-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                  <option value="">Select an option</option>
                  <option value='{"number_text": "1", "text": "Sample text 1"}'>Option 1</option>
                  <option value='{"number_text": "2", "text": "Sample text 2"}'>Option 2</option>
                  <option value='{"number_text": "3", "text": "Sample text 3"}'>Option 3</option>
                </select>
              </div>
            ))}
            <div className="flex flex-col gap-2">
              <label className="text-gray-600 font-medium">Background Image</label>
              <input
                type="file"
                name="bg_image"
                onChange={handleFormChange}
                accept="image/*"
                className="input input-bordered p-2 rounded-md border border-gray-300"
              />
              {formData.imagePreview && <img src={formData.imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-md mt-2" />}
            </div>
            <button type="submit" className="btn btn-primary w-full py-2 rounded-lg shadow-md bg-blue-500 hover:bg-blue-600 text-white mt-4">
              {isEditing ? 'Save Changes' : 'Add Layout'}
            </button>
          </form>
        </div>
      </dialog>

      <div className="p-5 w-full flex justify-between items-center bg-base-200 rounded-3xl shadow-lg">
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Images</th>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((layout) => (
                  <tr key={layout._id}>
                    <td>{layout._id}</td>
                    <td>
                      <img src={`https://bakend-wtc-4.onrender.com/${layout.bg_images}`} alt="Layout" className="w-16 h-16 object-cover rounded-md" />
                    </td>
                    <td>{layout.title}</td>
                    <td>{layout.descriptions.length > 50 ? layout.descriptions.slice(0, 50) + '...' : layout.descriptions}</td>
                    <td className="flex gap-2">
                      <button className="btn bg-gray-800 text-white py-1 px-2 rounded-md hover:bg-gray-700" onClick={() => handleEdit(layout)}>
                        <FaEdit className="mr-2" /> Edit
                      </button>
                      <button className="btn bg-red-700 text-white py-1 px-2 rounded-md hover:bg-red-600" onClick={() => handleDelete(layout._id)}>
                        <FaTrash className="mr-2" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500">
                    No layouts available
                  </td>
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

export default Layout;