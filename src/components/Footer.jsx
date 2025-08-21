import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-red-600 to-red-700 text-white py-4 mt-auto">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">

          {/* Left: Contact Numbers */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-yellow-300">📞</span>
              <span className="text-sm font-medium">SỐ ĐIỆN THOẠI TRỰC BAN</span>
            </div>
            <div className="flex flex-col text-sm">
              <div>
                <span className="font-semibold text-yellow-200">CÔNG AN TỈNH:</span>
                <span className="ml-2">069.2808.132 • 069.3335.901</span>
              </div>
              <div>
                <span className="font-semibold text-yellow-200">HÌNH SỰ:</span>
                <span className="ml-2">069.2808.134</span>
              </div>
            </div>
          </div>

          {/* Center: Website */}
          <div className="flex items-center gap-3">
            <span className="text-yellow-300">🌐</span>
            <span className="text-sm font-medium">WEBSITE CHÍNH THỨC</span>
            <a
              href="https://conganquangninh.gov.vn/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-200 hover:text-yellow-100 font-medium underline text-sm"
            >
              conganquangninh.gov.vn
            </a>
            <div className="text-xs opacity-80">
              Trang thông tin điện tử chính thức Công an tỉnh Quảng Ninh
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex items-center gap-3">
            <span className="text-yellow-300">⭐</span>
            <div className="text-sm">
              <div className="font-semibold">CẨM NANG PHÒNG CHỐNG TỘI PHẠM VÀ VI PHẠM PHÁP LUẬT</div>
              <div className="text-xs opacity-80">© 2024 Công an tỉnh Quảng Ninh • Phối hợp với Mobifone</div>
            </div>
          </div>

        </div>

        {/* Bottom line */}
        <div className="border-t border-white/20 mt-3 pt-3 text-center text-xs opacity-75">
          Hỗ trợ người dân, doanh nghiệp thực hiện thủ tục hành chính • Đường dây nóng 24/7
        </div>
      </div>
    </footer>
  );
};

export default Footer; 