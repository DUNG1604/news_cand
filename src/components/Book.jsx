import React, { useRef, useCallback, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import TTSControls from './TTSControls';
import picture from '../assets/anhbia.jpg';

class BookErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Book Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-red-600 font-bold mb-2">Đã xảy ra lỗi</h2>
          <p className="text-red-500">Vui lòng thử lại sau</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hàm tách content thành các trang dựa trên chiều cao thực tế
function splitContentToPages(content, maxHeight) {
  if (!content) return [];
  
  // Tạo div tạm để đo chiều cao
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.visibility = 'hidden';
  tempDiv.style.width = '470px'; // Width của content area (550px - 2*40px padding)
  tempDiv.style.fontSize = '18px';
  tempDiv.style.lineHeight = '1.6';
  tempDiv.style.padding = '0';
  tempDiv.className = 'prose prose-lg max-w-none text-gray-700 leading-relaxed';
  
  document.body.appendChild(tempDiv);
  
  try {
    // Nếu toàn bộ content vừa trong 1 trang
    tempDiv.innerHTML = content;
    if (tempDiv.offsetHeight <= maxHeight) {
      document.body.removeChild(tempDiv);
      return [content];
    }
    
    // Tách content thành các đoạn văn và elements
    const htmlElements = content.match(/<[^>]+>.*?<\/[^>]+>|[^<]+/gs) || [];
    const pages = [];
    let currentPage = '';
    
    for (let i = 0; i < htmlElements.length; i++) {
      const element = htmlElements[i].trim();
      if (!element) continue;
      
      // Thử thêm element vào trang hiện tại
      const testContent = currentPage + element;
      tempDiv.innerHTML = testContent;
      
      if (tempDiv.offsetHeight > maxHeight && currentPage) {
        // Nếu vượt quá chiều cao và đã có content, tạo trang mới
        pages.push(currentPage);
        currentPage = element;
      } else {
        // Nếu vẫn vừa hoặc trang hiện tại rỗng, thêm vào trang hiện tại
        currentPage = testContent;
      }
    }
    
    // Thêm trang cuối cùng
    if (currentPage) {
      pages.push(currentPage);
    }
    
    document.body.removeChild(tempDiv);
    return pages.length > 0 ? pages : [content];
    
  } catch (error) {
    document.body.removeChild(tempDiv);
    console.error('Error splitting content:', error);
    // Fallback: chia theo ký tự
    const pages = [];
    const charsPerPage = Math.ceil(content.length / Math.ceil(content.length / 2000));
    for (let i = 0; i < content.length; i += charsPerPage) {
      pages.push(content.slice(i, i + charsPerPage));
    }
    return pages;
  }
}

// Đặt Page ra ngoài Book để props được truyền đúng
const Page = React.forwardRef(({ number, contentPages, selectedChapter }, ref) => {
  const isCover = number === 1;
  const pageContent = contentPages[number - 2] || '';
  
  return (
    <div
      className={`page ${isCover ? 'bg-gradient-to-br from-red-600 to-red-800' : 'bg-white'}
        ${isCover ? 'p-0' : 'p-10'} text-center flex flex-col justify-center items-center h-full box-border
        shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100`}
      ref={ref}
    >
      {isCover ? (
        <div className="cover-design text-white relative h-full">
            
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
             style={{ backgroundImage: `url(${picture})` }}>
        </div>
        
        {/* Red overlay */}
        <div className="absolute inset-0 bg-red-600 opacity-40"></div>
        
      
        <div className="relative z-10 h-full flex flex-col justify-center items-center">
          <div className="cover-title text-lg sm:text-xl lg:text-3xl font-bold mb-4 sm:mb-6 tracking-wider leading-tight">
            CẨM NANG PHÒNG CHỐNG<br/>TỘI PHẠM VÀ VI PHẠM<br/>PHÁP LUẬT
          </div>
          <div className="cover-subtitle text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8">ĐOÀN THANH NIÊN</div>
          <div className="cover-emblem text-4xl sm:text-5xl lg:text-6xl mb-6 sm:mb-8 text-yellow-400">★</div>
        </div>
      </div>

      ) : (
        <div className="chapter-content text-left h-full flex flex-col">
          <div className="chapter-header mb-6 bg-gradient-to-r from-[#fef3c7] to-[#fde68a] p-6 rounded-lg border-l-4 border-[#fbbf24] flex-shrink-0">
            <div className="flex items-center mb-4">
              <div className="chapter-info">
                <h1 className="text-2xl font-bold mb-2 text-gray-800">{selectedChapter?.title}</h1>
              </div>
            </div>
          </div>
          
          <div className="chapter-body flex-1 flex flex-col overflow-hidden">
            <div className="page-number text-sm text-gray-500 mb-6 border-b pb-2 text-center flex-shrink-0">
              Trang {number - 1}
            </div>
            
            <div className="content-main flex-1 overflow-hidden">
              <div className="content-section bg-white p-6 rounded-lg h-full overflow-hidden">
                {pageContent ? (
                  <div
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed h-full overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: pageContent }}
                    style={{ 
                      lineHeight: '1.6',
                      fontSize: '18px',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word'
                    }}
                  />
                ) : selectedChapter?.hasContent === false ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4 animate-bounce">📄</div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">{selectedChapter?.title}</h2>
                    <p className="text-lg text-gray-500 mb-3">Menu này hiện tại không có nội dung</p>
                    <p className="text-sm text-gray-400">Nội dung sẽ được cập nhật sớm nhất</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📄</div>
                    <p>Nội dung đang được cập nhật...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

const Book = ({ selectedChapter }) => {
  const bookRef = useRef();
  const [isMounted, setIsMounted] = useState(false);
  const [key, setKey] = useState(0);
  const [contentPages, setContentPages] = useState([]);
  
  // Tính toán chiều cao có sẵn cho content
  const BOOK_HEIGHT = 800;
  const BOOK_PADDING = 80; // padding top/bottom của page
  const HEADER_HEIGHT = 120; // chiều cao header + page number
  const CONTENT_PADDING = 48; // padding của content section
  const AVAILABLE_HEIGHT = BOOK_HEIGHT - (BOOK_PADDING * 2) - HEADER_HEIGHT - CONTENT_PADDING;

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (bookRef.current) {
        try {
          bookRef.current.pageFlip().destroy();
        } catch (error) {
          console.error('Error destroying book:', error);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (selectedChapter) {
      setKey(prev => prev + 1);
      // Chỉ lật trang khi có nội dung
      if (selectedChapter.hasContent !== false) {
        setTimeout(() => {
          if (bookRef.current) {
            try {
              // Luôn lật đến trang 2 (index 1) để hiển thị nội dung
              bookRef.current.pageFlip().flip(1);
            } catch (error) {
              console.error('Error flipping to page:', error);
            }
          }
        }, 100);
      }
    }
  }, [selectedChapter]);

  // Chia content thành các trang
  useEffect(() => {
    if (!selectedChapter || !selectedChapter.content || selectedChapter.hasContent === false) {
      setContentPages([]);
      return;
    }

    console.log('Splitting content with available height:', AVAILABLE_HEIGHT);
    console.log('Original content length:', selectedChapter.content.length);
    
    // Đợi DOM render xong rồi mới tách content
    setTimeout(() => {
      const pages = splitContentToPages(selectedChapter.content, AVAILABLE_HEIGHT);
      console.log('Split into pages:', pages.length);
      setContentPages(pages);
    }, 100);
    
  }, [selectedChapter, AVAILABLE_HEIGHT]);

  const onFlip = useCallback((e) => {
    console.log('Current page:', e.data);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <BookErrorBoundary>
      <div className="perspective-1000 mx-auto w-full p-8">
        {/* TTS Controls */}
        {selectedChapter && selectedChapter.hasContent !== false && (
          <div className="mb-6">
            <TTSControls
              content={selectedChapter.content}
              title={selectedChapter.title}
            />
          </div>
        )}

        {/* Book spine effect */}
        <div className="relative">
          {/* Book thickness shadow */}
          <div className="absolute -right-2 top-2 w-full h-full bg-gray-800 rounded-lg transform rotate-1 opacity-30"></div>
          <div className="absolute -right-1 top-1 w-full h-full bg-gray-600 rounded-lg transform rotate-0.5 opacity-40"></div>

          {/* Main book container */}
          <div className="relative bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
            <HTMLFlipBook
              key={key}
              width={550}
              height={800}
              size="stretch"
              minWidth={315}
              maxWidth={1000}
              minHeight={400}
              maxHeight={1533}
              showCover={true}
              ref={bookRef}
              onFlip={onFlip}
              className="mx-auto"
              startPage={0}
              flippingTime={700}
              renderOnlyPageLengthChange={true}
              pageCount={contentPages.length + 1}
            >
              {/* Trang bìa */}
              <Page number={1} key={1} contentPages={contentPages} selectedChapter={selectedChapter} />
              {/* Các trang nội dung */}
              {contentPages.map((_, idx) => (
                <Page number={idx + 2} key={idx + 2} contentPages={contentPages} selectedChapter={selectedChapter} />
              ))}
            </HTMLFlipBook>
          </div>
        </div>
      </div>
    </BookErrorBoundary>
  );
};

export default Book;