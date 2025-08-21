import React, { useRef, useCallback, useState, useEffect, useMemo, useLayoutEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
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

class BookErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Book Error:', error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    // Reset error state when props change
    if (this.state.hasError && prevProps.selectedChapter !== this.props.selectedChapter) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-red-600 font-bold mb-2">Đã xảy ra lỗi</h2>
          <p className="text-red-500">Vui lòng thử lại sau</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hàm chia nhỏ HTML content thành các phần theo chiều cao trang
function splitHtmlContentByHeight(html, pageHeight, className = "") {
  // Tạo một container ẩn để đo
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.visibility = 'hidden';
  container.style.width = '500px'; // hoặc width trang sách, có thể điều chỉnh
  container.style.height = 'auto';
  container.style.pointerEvents = 'none';
  container.className = className;
  document.body.appendChild(container);

  // Chia đoạn theo <p> hoặc <div> hoặc <br>
  const parser = new window.DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const nodes = Array.from(doc.body.firstChild.childNodes);

  let pages = [];
  let currentHtml = '';
  container.innerHTML = '';
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    container.appendChild(node.cloneNode(true));
    if (container.offsetHeight > pageHeight) {
      // Nếu vượt quá chiều cao, lưu lại phần trước đó
      pages.push(currentHtml);
      // Reset container và currentHtml
      container.innerHTML = '';
      container.appendChild(node.cloneNode(true));
      currentHtml = container.innerHTML;
    } else {
      currentHtml = container.innerHTML;
    }
  }
  if (currentHtml) pages.push(currentHtml);

  document.body.removeChild(container);
  return pages;
}

const Book = React.memo(({ selectedChapter }) => {
  const bookRef = useRef();
  const [isMounted, setIsMounted] = useState(false);
  const [key, setKey] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [isBookReady, setIsBookReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { isLoading, error, collapsed } = useStore();
  const [chapterPages, setChapterPages] = useState([]);

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Responsive book dimensions - moved up to ensure consistent hook order
  const dimensions = useMemo(() => {
    if (windowSize.width >= 1024) {
      // PC - Large screens
      return {
        width: 550,
        height: 800,
        minWidth: 315,
        maxWidth: 1000,
        minHeight: 400,
        maxHeight: 1533
      };
    } else if (windowSize.width >= 768) {
      // Tablet - Medium screens
      return {
        width: 450,
        height: 650,
        minWidth: 280,
        maxWidth: 800,
        minHeight: 350,
        maxHeight: 1200
      };
    } else {
      // Mobile - Small screens
      return {
        width: 320,
        height: 500,
        minWidth: 250,
        maxWidth: 600,
        minHeight: 300,
        maxHeight: 900
      };
    }
  }, [windowSize.width]);

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }, 150);

    window.addEventListener('resize', handleResize);
    setIsMounted(true);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (bookRef.current) {
        try {
          const pageFlip = bookRef.current.pageFlip();
          if (pageFlip && typeof pageFlip.destroy === 'function') {
            pageFlip.destroy();
          }
        } catch (error) {
          console.error('Error destroying book:', error);
        }
      }
    };
  }, []);

  // Cập nhật window size khi sidebar thay đổi
  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, [collapsed]);

  // Cập nhật key khi sidebar thay đổi để force re-render book
  useEffect(() => {
    if (isBookReady) {
      setKey(prev => prev + 1);
    }
  }, [collapsed, isBookReady]);

  useEffect(() => {
    if (selectedChapter && isBookReady) {
      setKey(prev => prev + 1);
      // Mở sách đến trang 2 khi có content từ API
      setTimeout(() => {
        if (bookRef.current) {
          try {
            const pageFlip = bookRef.current.pageFlip();
            if (pageFlip) {
              // Luôn mở đến trang 2 để hiển thị content
              pageFlip.flip(1); // Trang 2 (index 1)
            }
          } catch (error) {
            console.error('Error flipping to page:', error);
            setHasError(true);
          }
        }
      }, 100);
    }
  }, [selectedChapter, isBookReady]);

  // Chia nhỏ nội dung khi chapter hoặc kích thước trang thay đổi
  useEffect(() => {
    if (selectedChapter && isBookReady) {
      // Trừ padding, header, ...
      const pageHeight = dimensions.height - 120; // Điều chỉnh nếu cần
      const pages = splitHtmlContentByHeight(
        selectedChapter.content,
        pageHeight,
        "mb-1 text-sm sm:text-base text-gray-700 leading-relaxed"
      );
      setChapterPages(pages);
    } else {
      setChapterPages([]);
    }
  }, [selectedChapter, isBookReady, dimensions]);

  const onFlip = useCallback((e) => {
    console.log('Current page:', e.data);
  }, []);

  const onInit = useCallback(() => {
    setIsBookReady(true);
    setHasError(false);
  }, []);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsBookReady(false);
    setKey(prev => prev + 1);
  }, []);

  // Early return after all hooks
  if (!isMounted) {
    return null;
  }

  if (hasError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-red-600 font-bold mb-2">Đã xảy ra lỗi</h2>
        <p className="text-red-500">Vui lòng thử lại sau</p>
        <button 
          onClick={handleRetry}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

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

  // Nếu chưa chọn chapter nào, hiển thị trang Welcome
  if (!selectedChapter) {
    return (
      <div className="flex items-center justify-center h-full w-full min-h-[400px]">
        <div className="bg-white rounded-lg shadow-xl p-10 flex flex-col items-center">
          <div className="text-5xl mb-4">👋</div>
          <h1 className="text-2xl font-bold mb-2 text-yellow-700">Chào mừng bạn đến với Cẩm nang!</h1>
          <p className="text-gray-600 mb-4 text-center max-w-md">
            Hãy chọn một mục trong <span className="font-semibold text-yellow-800">Mục lục</span> bên trái để bắt đầu xem nội dung sách.
          </p>
          <div className="text-lg text-yellow-600 font-semibold">Chúc bạn học tập hiệu quả!</div>
        </div>
      </div>
    );
  }

  // Default chapter if none selected
  const defaultChapter = {
    title: "Định danh điện tử 1",
    content: "Đây là nội dung mặc định cho chương đầu tiên. Vui lòng chọn một chương từ sidebar để xem nội dung chi tiết.",
    sectionTitle: "Chương mở đầu",
    sectionIcon: "📚",
    pageNumber: 1
  };

  const currentChapter = selectedChapter || defaultChapter;

  const Page = React.forwardRef((props, ref) => {
    const isCover = props.number === 1;
    const isContentPage = currentChapter && props.number >= 2 && props.pageContent;
    
    useEffect(() => {
      console.log(currentChapter);
    }, [currentChapter]);

    return (
      <div
        className={`page ${isCover ? 'bg-gradient-to-br from-red-600 to-red-800' : 'bg-white'}
          p-4 sm:p-6 lg:p-10 text-center flex flex-col justify-center items-center h-full box-border
          shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100`}
        ref={ref}
      >
        {isCover ? (
          <div className="cover-design text-white">
            <div className="cover-title text-lg sm:text-xl lg:text-3xl font-bold mb-4 sm:mb-6 tracking-wider leading-tight">
              CẨM NANG PHÒNG CHỐNG<br/>TỘI PHẠM VÀ VI PHẠM<br/>PHÁP LUẬT
            </div>
            <div className="cover-subtitle text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8">ĐOÀN THANH NIÊN</div>
            <div className="cover-emblem text-4xl sm:text-5xl lg:text-6xl mb-6 sm:mb-8 text-yellow-400">★</div>
          </div>
        ) : isContentPage ? (
          <div className="chapter-content text-left p-4">
            <div className="chapter-header mb-4 sm:mb-6 bg-gradient-to-r from-[#fef3c7] to-[#fde68a] p-3 sm:p-4 lg:p-6 rounded-lg border-l-4 border-[#fbbf24]">
              <div className="flex flex-col sm:flex-row items-center mb-3 sm:mb-4">
                <div className="chapter-icon text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-0 sm:mr-4">{currentChapter?.sectionIcon}</div>
                <div className="chapter-info text-center sm:text-left">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 text-gray-800">{currentChapter?.title}</h1>
                </div>
              </div>
            </div>
            <div className="page-number text-xs text-gray-500 mb-4 text-center">Trang {props.number}</div>
            <div className="page-content">
              <SafeHTMLContent content={props.pageContent} className="mb-1 text-sm sm:text-base text-gray-700 leading-relaxed" />
            </div>
          </div>
        ) : (
          <div className="empty-page text-center">
            <div className="page-number text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 border-b pb-2">Trang {props.number}</div>
            <div className="empty-content text-gray-400">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📄</div>
              <p className="text-sm sm:text-base">Trang trống</p>
            </div>
          </div>
        )}
      </div>
    );
  });

  return (
    <BookErrorBoundary selectedChapter={currentChapter}>
      <div className="perspective-1000 mx-auto w-full p-2 sm:p-4 lg:p-8">
        {/* Book spine effect */}
        <div className="relative">
          {/* Book thickness shadow */}
          <div className="absolute -right-1 sm:-right-2 top-1 sm:top-2 w-full h-full bg-gray-800 rounded-lg transform rotate-1 opacity-30"></div>
          <div className="absolute -right-0.5 sm:-right-1 top-0.5 sm:top-1 w-full h-full bg-gray-600 rounded-lg transform rotate-0.5 opacity-40"></div>

          {/* Main book container */}
          <div className="relative bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
            <HTMLFlipBook
              key={key}
              width={dimensions.width}
              height={dimensions.height}
              size="stretch"
              minWidth={dimensions.minWidth}
              maxWidth={dimensions.maxWidth}
              minHeight={dimensions.minHeight}
              maxHeight={dimensions.maxHeight}
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={true}
              className="bg-white shadow-xl"
              ref={bookRef}
              onFlip={onFlip}
              onInit={onInit}
              flippingTime={1000}
              usePortrait={true}
              startZIndex={0}
              autoSize={true}
              clickEventForward={true}
              useMouseEvents={true}
            >
              <Page number={1} />
              {chapterPages.length > 0
                ? chapterPages.map((pageContent, idx) => (
                    <Page key={idx + 2} number={idx + 2} pageContent={pageContent} />
                  ))
                : <Page number={2} pageContent={currentChapter?.content} />}
            </HTMLFlipBook>
          </div>
        </div>
      </div>
    </BookErrorBoundary>
  );
});

export default Book; 