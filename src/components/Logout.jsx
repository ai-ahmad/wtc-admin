import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSclice";

const Logout = () => {
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    closeModal(); // Закрываем модал после выхода
  };

  const openModal = () => {
    setIsDialogOpen(true);
  };

  const closeModal = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="text-white w-[100]">
      <button
        onClick={openModal}
        className="bg-red-500 w-[120px] h-[48px] text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition duration-200 ease-in-out"
      >
        Выйти
      </button>

      {isDialogOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <h2 className="text-lg font-bold mb-4">Вы уверены, что хотите выйти?</h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition duration-200 ease-in-out"
              >
                Да
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 text-black font-bold py-2 px-4 rounded hover:bg-gray-400 transition duration-200 ease-in-out"
              >
                Нет
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Logout;
