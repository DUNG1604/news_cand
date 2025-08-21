import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import AdminLayout from '../../layout/AdminLayout';
import { menuService } from '../../services/MenuService';
import { sectionService } from '../../services/SectionService';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [menus, setMenus] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    index: 1,
    name: '',
    parentId: '',
    sectionPages: [
      {
        index: 1,
        content: '',
        media: ['string']
      }
    ]
  });

  // Load data from API
  useEffect(() => {
    // Load menus from API
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      const response = await menuService.getMenu();
      if (response.data.data) {
        setMenus(response.data.data);
      }
    } catch (error) {
      console.error('Error loading menus:', error);
    }
  };

  // Function to flatten menu tree with proper indentation
  const flattenMenus = (menuList, level = 0) => {
    let flattened = [];
    menuList.forEach(menu => {
      // Create prefix based on level
      let prefix = '';
      if (level === 0) {
        prefix = '📁 '; // Root level
      } else if (level === 1) {
        prefix = '├─ '; // First level child
      } else {
        prefix = '│  '.repeat(level - 1) + '├─ '; // Deeper levels
      }
      
      // Add current menu with prefix
      flattened.push({
        ...menu,
        displayName: prefix + menu.name,
        level: level
      });
      
      // Add children if they exist
      if (menu.children && menu.children.length > 0) {
        flattened = flattened.concat(flattenMenus(menu.children, level + 1));
      }
    });
    return flattened;
  };

  // Get flattened menu list for dropdown
  const getFlattenedMenus = () => {
    return flattenMenus(menus);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingArticle) {
        // Update existing article using sectionService
        const payload = {
          index: Number(formData.index),
          name: formData.name,
          parentId: formData.parentId ? Number(formData.parentId) : null,
          sectionPages: formData.sectionPages.map((p, idx) => ({
            index: Number(p.index) || idx + 1,
            content: p.content,
            media: p.media.filter(Boolean)
          }))
        };
        await sectionService.updateSection(editingArticle.id, payload);
      } else {
        // Add new article using sectionService
        const payload = {
          index: Number(formData.index),
          name: formData.name,
          parentId: formData.parentId ? Number(formData.parentId) : null,
          sectionPages: formData.sectionPages.map((p, idx) => ({
            index: Number(p.index) || idx + 1,
            content: p.content,
            media: p.media.filter(Boolean)
          }))
        };
        await sectionService.createSection(payload);
      }

      // Reload articles from API
      await loadMenus();
      setShowModal(false);
      setEditingArticle(null);
      setFormData({
        index: 1,
        name: '',
        parentId: '',
        sectionPages: [
          {
            index: 1,
            content: '',
            media: ['string']
          }
        ]
      });
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Có lỗi xảy ra khi lưu bài viết');
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      index: article.index || 1,
      name: article.name,
      parentId: article.parentId || '',
      sectionPages: article.sectionPages || [
        {
          index: 1,
          content: article.content || '',
          media: ['string']
        }
      ]
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        await sectionService.deleteSection(id);
        await loadMenus();
      } catch (error) {
        console.error('Error deleting article:', error);
        alert('Có lỗi xảy ra khi xóa bài viết');
      }
    }
  };

  const handleAdd = () => {
    setEditingArticle(null);
    setFormData({
      index: 1,
      name: '',
      parentId: '',
      sectionPages: [
        {
          index: 1,
          content: '',
          media: ['string']
        }
      ]
    });
    setShowModal(true);
  };

  const getCategoryName = (parentId) => {
    if (!parentId) return 'Không có';
    const flattenedMenus = getFlattenedMenus();
    const category = flattenedMenus.find(cat => cat.id === parseInt(parentId));
    return category ? category.name : 'Không xác định';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý bài viết</h1>
            <p className="text-gray-600 mt-1">Quản lý nội dung các bài viết trong cẩm nang</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <span>➕</span>
            Thêm bài viết
          </button>
        </div>

        {/* Articles List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bài viết
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {menus.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {article.name}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Index: {article.index}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getCategoryName(article.parentId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Hoạt động
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ID: {article.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(article)}
                          className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50"
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50"
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingArticle ? 'Sửa bài viết' : 'Thêm bài viết mới'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên bài viết
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Index
                    </label>
                    <input
                      type="number"
                      value={formData.index}
                      onChange={(e) => setFormData({...formData, index: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục cha (Parent ID)
                  </label>
                  <select
                    value={formData.parentId}
                    onChange={(e) => setFormData({...formData, parentId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Không có (Root)</option>
                    {getFlattenedMenus().map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tóm tắt
                  </label>
                  <textarea
                    value={formData.summary}
                    onChange={(e) => setFormData({...formData, summary: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    rows="2"
                    placeholder="Tóm tắt ngắn gọn về bài viết"
                  />
                </div> */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung bài viết
                  </label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <style>
                      {`
                        .ck-editor__editable {
                          min-height: 400px !important;
                          max-height: 600px !important;
                        }
                        .ck.ck-editor__main > .ck-editor__editable {
                          min-height: 400px !important;
                          max-height: 600px !important;
                        }
                      `}
                    </style>
                    <CKEditor
                      editor={ClassicEditor}
                      data={formData.sectionPages[0].content}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setFormData({
                          ...formData,
                          sectionPages: [{ ...formData.sectionPages[0], content: data }]
                        });
                      }}
                      config={{
                        toolbar: [
                          'heading',
                          '|',
                          'bold',
                          'italic',
                          'link',
                          'bulletedList',
                          'numberedList',
                          '|',
                          'outdent',
                          'indent',
                          '|',
                          'blockQuote',
                          'insertTable',
                          'undo',
                          'redo'
                        ],
                        placeholder: 'Nhập nội dung bài viết...'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Media (URL, cách nhau bởi dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={formData.sectionPages[0].media.join(',')}
                    onChange={(e) => setFormData({
                      ...formData,
                      sectionPages: [{ ...formData.sectionPages[0], media: e.target.value.split(',').map(s => s.trim()) }]
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    {editingArticle ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Articles;
