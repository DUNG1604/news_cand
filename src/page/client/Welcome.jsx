import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/'); // Chuyển sang trang đọc sách (Home)
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
      <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center max-w-lg w-full">
        <div className="text-6xl mb-6">👋</div>
        <h1 className="text-3xl font-bold mb-4 text-yellow-700 text-center">Chào mừng bạn đến với<br/>Cẩm nang phòng chống tội phạm</h1>
        <p className="text-gray-700 mb-6 text-center text-lg">
          Đây là ứng dụng giúp bạn tra cứu, học tập và nâng cao kiến thức về phòng chống tội phạm và vi phạm pháp luật.<br/>
          <span className="font-semibold text-yellow-800">Hãy bắt đầu bằng cách chọn một mục trong Mục lục!</span>
        </p>
        <button
          onClick={handleStart}
          className="mt-4 px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white text-lg font-semibold rounded-lg shadow transition-all duration-200"
        >
          Bắt đầu khám phá
        </button>
      </div>
    </div>
  );
};

export default Welcome; 