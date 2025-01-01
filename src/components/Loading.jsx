import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <FaSpinner className="animate-spin text-3xl text-gray-500 w-[50px] h-[50px]" />
    </div>
  );
};

export default Loading;
