import React from 'react';

const ContactInfo = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold">
          HD
        </div>
        <h3 className="text-lg font-bold text-gray-800">
          SỐ ĐIỆN THOẠI ĐƯỜNG DÂY NÓNG
        </h3>
      </div>

      {/* Contact Numbers */}
      <div className="space-y-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
          <div className="text-red-700 font-bold text-sm mb-2">TRỰC BAN CÔNG AN TỈNH</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-blue-600">📞</span>
              <span className="font-semibold text-gray-800">069.2808.132, 069.3335.901</span>
            </div>
            <div className="text-red-600 font-bold text-sm">TRỰC BAN HÌNH SỰ</div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600">📞</span>
              <span className="font-semibold text-gray-800">069.2808.134</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
          <div className="text-blue-700 font-bold text-sm mb-2">THÔNG TIN ĐẦU MỐI</div>
          <div className="text-gray-700 text-sm">
            HƯỚNG DẪN, HỖ TRỢ NGƯỜI DÂN, DOANH NGHIỆP THỰC HIỆN THỦ TỤC HÀNH CHÍNH
          </div>
        </div>
      </div>

      {/* Text-to-Speech Feature */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-white text-purple-600 p-2 rounded-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            </div>
            <div>
              <div className="font-bold text-lg">ĐỌC SÁCH TỰ ĐỘNG</div>
              <div className="text-sm opacity-90">Nhấn để nghe nội dung sách</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
