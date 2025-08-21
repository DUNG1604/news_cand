import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { menuService } from '../../services/MenuService';
import { sectionService } from '../../services/SectionService';
import { sectionPageService } from '../../services/SectionPageService';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    index: '',
    name: '',
    parentId: '',
    sectionPages: [
      {
        index: 1,
        content: '',
        media: ['']
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
          index: Number(formData.index),
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
            { index: 1, content: '', media: [''] }
          ]
        });
      } else {
        // Add new category (section)
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
        await fetchCategories();
        setShowModal(false);
        setFormData({
          index: '',
          name: '',
          parentId: '',
          sectionPages: [
            { index: 1, content: '', media: [''] }
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
      index: '',
      name: '',
      parentId: '',
      sectionPages: [
        { index: 1, content: '', media: [''] }
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
        index: category.index,
        name: category.name,
        parentId: '', // Không cho sửa parentId
        sectionPages: [
          sectionPages.length > 0
            ? {
                index: sectionPages[0].index,
                content: sectionPages[0].content,
                media: sectionPages[0].media || ['']
              }
            : { index: 1, content: '', media: [''] }
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
              <div className={`flex items-center gap-3 py-2 rounded hover:bg-gray-50 transition-all ${level === 0 ? 'font-semibold' : ''} text-base sm:text-lg`}
                style={{ paddingLeft: level === 0 ? 0 : 12 }}>
                {/* Expand/collapse icon */}
                <div className='cursor-pointer flex items-center'  onClick={() => toggleExpand(category.id)}>
                  {hasChildren ? (
                    <button
                      className="text-lg focus:outline-none"
                      tabIndex={-1}
                    >
                      <span className="cursor-pointer">
                        {expanded ? <ChevronDown size={22} /> : <ChevronRight size={22} />}
                      </span>
                    </button>
                  ) : (
                    <span className="inline-block w-6" />
                  )}
                  <span className="text-gray-800">{category.name}</span>
                  <span className="text-xs text-gray-400 ml-2">ID:{category.id}</span>
                  <span className="text-xs text-gray-500 ml-2">[{category.index}]</span>
                </div>
                <button
                  className="text-base text-blue-600 hover:underline ml-2 mb-1 cursor-pointer"
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
                  ➕
                </button>
                <button
                  className="text-base text-green-600 hover:underline ml-1 mb-1 cursor-pointer"
                  onClick={() => handleEdit(category)}
                >
                  ✏️
                </button>
                <button
                  className="text-base text-red-600 hover:underline ml-1 mb-1 cursor-pointer"
                  onClick={() => handleDelete(category.id)}
                >
                  🗑️
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
            <div className="text-gray-500">Không có menu nào</div>
          ) : (
            renderCategoryTree(categories)
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingCategory ? 'Sửa menu' : formData.parentId ? 'Thêm menu con' : 'Thêm menu chính'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Index
                  </label>
                  <input
                    type="number"
                    value={formData.index}
                    onChange={e => setFormData({ ...formData, index: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
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
                {/* Chỉ hiển thị trường Parent ID khi thêm menu con */}
                {formData.parentId ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent ID
                    </label>
                    <input
                      type="number"
                      value={formData.parentId}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                    />
                  </div>
                ) : null}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung page đầu tiên (HTML)
                  </label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
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
                          'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                          'outdent', 'indent', '|', 'blockQuote', 'insertTable', 'undo', 'redo'
                        ],
                        placeholder: 'Nhập nội dung trang đầu tiên...'
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
                    onChange={e => setFormData({
                      ...formData,
                      sectionPages: [{ ...formData.sectionPages[0], media: e.target.value.split(',').map(s => s.trim()) }]
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
