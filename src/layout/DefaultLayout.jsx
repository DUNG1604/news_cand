import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import useStore from '../store/useStore';
import { menuService } from '../services/MenuService';

const DefaultLayout = ({ children }) => {
  const { collapsed, toggleSidebar, searchQuery, setSearchQuery, setSelectedChapter } = useStore();
  const [menuData, setMenuData] = useState([]);

  // Fetch menu từ API khi mount
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await menuService.getMenu();
        setMenuData(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        setMenuData([]);
      }
    };
    fetchMenu();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header toggleSidebar={toggleSidebar} onSearch={setSearchQuery} />
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar collapsed={collapsed} searchQuery={searchQuery} onChapterSelect={setSelectedChapter} data={menuData} />
        <div className={`flex-1 flex flex-col transition-all duration-500 ease-in-out ${
          collapsed ? 'ml-[72px]' : 'ml-[350px]'
        }`}>
          <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
