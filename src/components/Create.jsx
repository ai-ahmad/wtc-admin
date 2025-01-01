import React, { useState } from 'react';

const Create = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const openModal = () => {
    setModalIsOpen(true);
    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success messages
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setUsername('');
    setPassword('');
    setRole('');
    setError('');
    setSuccess('');
  };

  const handleCreate = async () => {
    if (!username || !password || !role) {
        setError('Please fill in all fields');
        return;
    }

    const partnerData = { username, password, role };

    try {
        const response = await fetch('https://bakend-wtc-4.onrender.com/api/v1/auth/create-partnyor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(partnerData),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Error creating partner');
        }

        setSuccess('Partner created successfully!');
        closeModal(); // Only close modal on success
    } catch (error) {
        if (error.message.includes('E11000')) {
            setError('Username already exists'); // Display user-friendly message
        } else {
            setError(error.message);
        }
    }
};

  return (
    <div className="flex flex-col items-center justify-center w-full text-white">
      <button onClick={openModal} className="btn btn-primary text-white">
        Создать партнера
      </button>

      {modalIsOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <h2 className="text-xl font-bold mb-4">Создать партнера</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}
            <div className="mb-4">
              <label className="block mb-2">Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError(''); // Clear error message on username change
                }}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Role:</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={handleCreate}
                className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-200 ease-in-out"
              >
                Create
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 text-black font-bold py-2 px-4 rounded hover:bg-gray-400 transition duration-200 ease-in-out"
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Create;
