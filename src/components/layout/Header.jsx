import { useState } from 'react'

const Header = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchInput)
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <div className="flex items-center">
        <div className="flex items-center space-x-4">
          <img src="/logo.jpg" alt="Công An Việt Nam" className="w-16 h-16" />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-blue-900">CẨM NANG ĐIỆN TỬ</h1>
            <p className="text-sm text-gray-600">CÔNG AN NHÂN DÂN VIỆT NAM</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 max-w-2xl mx-8">
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm trong cẩm nang..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>
        </form>
      </div>

      <div className="flex items-center">
        <div className="w-12 h-8">
          <img src="/vietnam-flag.svg" alt="Cờ Việt Nam" className="w-full h-full object-contain" />
        </div>
      </div>
    </header>
  )
}

export default Header
