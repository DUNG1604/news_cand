import React from 'react';
import useStore from '../store/useStore';

// Component để hiển thị HTML content an toàn
const SafeHTMLContent = ({ content, className = "" }) => {
  if (!content) return null;
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

const ContentPage = ({ selectedChapter }) => {
  const { isLoading, error } = useStore();

  // Hiển thị loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full min-h-[400px]">
        <div className="bg-white rounded-lg shadow-xl p-10 flex flex-col items-center">
          <div className="text-5xl mb-4 animate-spin">⏳</div>
          <h1 className="text-2xl font-bold mb-2 text-yellow-700">Đang tải nội dung...</h1>
          <p className="text-gray-600 mb-4 text-center max-w-md">
            Vui lòng chờ trong giây lát
          </p>
        </div>
      </div>
    );
  }

  // Hiển thị error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full min-h-[400px]">
        <div className="bg-white rounded-lg shadow-xl p-10 flex flex-col items-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2 text-red-700">Đã xảy ra lỗi</h1>
          <p className="text-gray-600 mb-4 text-center max-w-md">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!selectedChapter) {
    return (
      <div className="flex items-center justify-center h-full w-full min-h-[400px]">
        <div className="bg-white rounded-lg shadow-xl p-10 flex flex-col items-center">
          <div className="text-5xl mb-4">👋</div>
          <h1 className="text-2xl font-bold mb-2 text-yellow-700">Chào mừng bạn đến với Cẩm nang!</h1>
          <p className="text-gray-600 mb-4 text-center max-w-md">
            Hãy chọn một mục trong <span className="font-semibold text-yellow-800">Mục lục</span> bên trái để bắt đầu xem nội dung.
          </p>
          <div className="text-lg text-yellow-600 font-semibold">Chúc bạn học tập hiệu quả!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6">
        <div className="flex items-center mb-4">
          <div className="text-3xl mr-4">{selectedChapter.sectionIcon || "📄"}</div>
          <div>
            <h1 className="text-2xl font-bold">{selectedChapter.title}</h1>
            <p className="text-yellow-100">{selectedChapter.sectionTitle}</p>
          </div>
        </div>
        <div className="flex items-center text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">
            Trang {selectedChapter.pageNumber || 1}
          </span>
          <span className="ml-4 bg-white/20 px-3 py-1 rounded-full">
            ID: {selectedChapter.id}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="prose prose-lg max-w-none">
          <SafeHTMLContent 
            content={selectedChapter.content} 
            className="text-gray-700 leading-relaxed"
          />
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              <span className="font-medium">Cẩm nang phòng chống tội phạm</span>
              <span className="mx-2">•</span>
              <span>Đoàn thanh niên</span>
            </div>
            <div>
              Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPage; 