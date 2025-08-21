import React, { useState } from 'react';

const Header = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  return (
    <header className="bg-gradient-to-br from-[#dc2626] to-[#b91c1c] text-white px-8 py-4 flex justify-between items-center shadow-lg relative z-50 md:flex-row flex-col md:gap-0 gap-4">
      {/* Left section with logo */}
      <div className="flex items-center">
        <div className="flex items-center gap-4">
          <img
            src="/logo.jpg"
            alt="Công An Việt Nam"
            className="w-[60px] h-[60px] object-contain bg-white rounded-full p-[5px]"
          />
          <div className="flex flex-col">
            <h1 className="m-0 text-xl font-bold drop-shadow-md md:text-xl text-lg leading-tight">
              CẨM NANG PHÒNG CHỐNG TỘI PHẠM
            </h1>
            <p className="m-0 text-sm opacity-90 font-medium md:text-sm text-xs">
              CÔNG AN TỈNH QUẢNG NINH
            </p>
          </div>
        </div>
      </div>

      {/* Center section with search */}
      <div className="flex-1 max-w-[500px] mx-8 md:mx-8 mx-0 md:max-w-[500px] w-full">
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm trong cẩm nang..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-5 py-3 pr-[50px] border-none rounded-full text-base outline-none bg-white/95 text-gray-800 shadow-md transition-all duration-300 ease-in-out focus:bg-white focus:shadow-lg focus:-translate-y-[1px]"
            />
            <button
              type="submit"
              className="absolute right-2 bg-[#b91c1c] border-none rounded-full w-9 h-9 flex items-center justify-center text-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#991b1b] hover:scale-110"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Right section with TTS, flag and Mobifone - cùng kích thước */}
      <div className="flex items-center gap-3">
        {/* Text-to-Speech Button */}
        <button
          className="w-[50px] h-[50px] bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-md transition-all duration-300 hover:scale-110 group flex items-center justify-center"
          title="Đọc sách tự động"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="group-hover:animate-pulse">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
        </button>

        {/* Vietnam Flag */}
        <div className="w-[50px] h-[50px] flex items-center justify-center">
          <img
            src="/vietnam-flag.svg"
            alt="Cờ Việt Nam"
            className="w-[45px] h-[30px] object-cover rounded shadow-md"
          />
        </div>

        {/* Mobifone Logo - ngoài cùng bên phải */}
        <img
          src="/mobifone.png"
          alt="Mobifone"
          className="w-[50px] h-[50px] object-contain bg-white rounded-lg p-[3px] shadow-md border border-gray-200"
        />
      </div>
    </header>
  );
};

export default Header; 