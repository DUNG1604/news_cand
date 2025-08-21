import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { menuService } from '../../services/MenuService';
import { sectionService } from '../../services/SectionService';
import { sectionPageService } from '../../services/SectionPageService';
import { ChevronRight, ChevronDown } from 'lucide-react';
 

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    index: 1,
    name: '',
    parentId: '',
    sectionPages: [
      {
        index: 1,
        content: '',
        media: []
      }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedIds, setExpandedIds] = useState({});
  

  // Load categories from API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await menuService.getMenu();
      setCategories(res.data.data || []);
    } catch (err) {
      setError('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate chỉ trường name
    if (!formData.name.trim()) {
      setError('Tên menu không được để trống');
      setLoading(false);
      return;
    }

    try {
      if (editingCategory) {
        // Gọi API update
        const payload = {
          index: Number(formData.index) || 1,
          name: formData.name,
          sectionPages: formData.sectionPages.map((p, idx) => ({
            index: Number(p.index) || idx + 1,
            content: p.content,
            media: p.media.filter(Boolean)
          }))
        };
        await sectionService.updateSection(editingCategory.id, payload);
        await fetchCategories();
        setShowModal(false);
        setEditingCategory(null);
        setFormData({
          index: '',
          name: '',
          parentId: '',
          sectionPages: [
            { index: 1, content: '', media: [] }
          ]
        });
      } else {
        // Add new category (section)
        const payload = {
          index: Number(formData.index) || 1,
          name: formData.name,
          parentId: formData.parentId ? Number(formData.parentId) : null,
          sectionPages: formData.sectionPages.map((p, idx) => ({
            index: Number(p.index) || idx + 1,
            content: p.content,
            media: p.media.filter(Boolean)
          }))
        };
        await sectionService.createSection(payload);
        await fetchCategories();
        setShowModal(false);
        setFormData({
          index: '',
          name: '',
          parentId: '',
          sectionPages: [
            { index: 1, content: '', media: [] }
          ]
        });
      }
    } catch (err) {
      setError(editingCategory ? 'Không thể cập nhật danh mục' : 'Không thể thêm danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({
      index: 1,
      name: '',
      parentId: '',
      sectionPages: [
        { index: 1, content: '', media: [] }
      ]
    });
    setShowModal(true);
  };

  // Hàm xóa menu
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa menu này?')) return;
    setLoading(true);
    setError(null);

    try {
      await sectionService.deleteSection(id);
      await fetchCategories();
    } catch (err) {
      setError('Không thể xóa menu');
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm handleEdit mới
  const handleEdit = async (category) => {
    setLoading(true);
    setError(null);
    try {
      const res = await sectionPageService.getSectionById(category.id);
      // Giả sử API trả về mảng sectionPages, lấy phần tử đầu tiên nếu có
      const sectionPages = res.data.data || [];
      setEditingCategory(category);
      setFormData({
        index: category.index || 1,
        name: category.name,
        parentId: '', // Không cho sửa parentId
        sectionPages: [
          sectionPages.length > 0
            ? {
                index: sectionPages[0].index,
                content: sectionPages[0].content,
                media: sectionPages[0].media || []
              }
            : { index: 1, content: '', media: [] }
        ]
      });
      setShowModal(true);
    } catch (err) {
      setError('Không thể tải nội dung để sửa');
    } finally {
      setLoading(false);
    }
  };

  

  // Thêm hàm toggleExpand
  const toggleExpand = (id) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Hàm đệ quy để render tree
  const renderCategoryTree = (categories, level = 0) => {
    return (
      <ul className={level === 0 ? "pl-0" : "pl-4 border-l border-gray-100 ml-2"}>
        {categories.map(category => {
          const hasChildren = category.children && category.children.length > 0;
          const expanded = expandedIds[category.id];
          return (
            <li key={category.id} className="mb-2">
              <div className={`flex items-center gap-3 py-2 rounded hover:bg-gray-50 transition-all ${level === 0 ? '' : ''} text-sm`}
                style={{ paddingLeft: level === 0 ? 0 : 12 }}>
                {/* Expand/collapse icon */}
                <div className='cursor-pointer flex items-center'  onClick={() => toggleExpand(category.id)}>
                  {hasChildren ? (
                    <button
                      className="text-sm focus:outline-none"
                      tabIndex={-1}
                    >
                      <span className="cursor-pointer">
                        {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </span>
                    </button>
                  ) : (
                    <span className="inline-block w-6" />
                  )}
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                </div>
                <button
                  className="ml-2 mb-1 px-3 py-1 text-sm text-blue-600 border border-blue-200 rounded hover:bg-blue-50"
                  onClick={() => {
                    setEditingCategory(null);
                    setFormData({
                      index: '',
                      name: '',
                      parentId: category.id,
                      sectionPages: [{ index: 1, content: '', media: [''] }]
                    });
                    setShowModal(true);
                  }}
                >
                  Thêm
                </button>
                <button
                  className="ml-1 mb-1 px-3 py-1 text-sm text-green-600 border border-green-200 rounded hover:bg-green-50"
                  onClick={() => handleEdit(category)}
                >
                  Sửa
                </button>
                <button
                  className="ml-1 mb-1 px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
                  onClick={() => handleDelete(category.id)}
                >
                  Xóa
                </button>
              </div>
              {/* Children */}
              {hasChildren && expanded && (
                renderCategoryTree(category.children, level + 1)
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý menu (section)</h1>
            <p className="text-gray-600 mt-1">Quản lý các menu/section chính của cẩm nang</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <span>➕</span>
            Thêm menu chính
          </button>
        </div>

        {/* Error/Loading */}
        {error && <div className="text-red-600">{error}</div>}
        {loading && <div className="text-gray-500">Đang tải...</div>}

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          {categories.length === 0 ? (
            <div className="text-sm text-gray-500">Không có menu nào</div>
          ) : (
            renderCategoryTree(categories)
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-500/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className={`bg-white rounded-xl shadow-xl p-6 ${editingCategory ? 'w-4/5' : 'w-full max-w-lg'}`}>
              <h2 className="text-xl font-bold mb-4">
                {editingCategory ? 'Sửa menu' : formData.parentId ? 'Thêm menu con' : 'Thêm menu chính'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Index mặc định = 1, không hiển thị trường nhập */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên menu (name)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                {/* Ẩn Parent ID khi thêm menu con, vẫn giữ giá trị trong state để submit */}
                
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
                    disabled={loading}
                  >
                    {editingCategory ? 'Cập nhật' : 'Thêm mới'}
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

export default Categories;
