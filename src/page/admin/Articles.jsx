import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { sectionPageService } from '../../services/SectionPageService';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { menuService } from '../../services/MenuService';

const Articles = () => {
  const [sectionPages, setSectionPages] = useState([]);
  const [showSPModal, setShowSPModal] = useState(false);
  const [editingSP, setEditingSP] = useState(null);
  const [spForm, setSpForm] = useState({ content: '' });
  const [showAddSPModal, setShowAddSPModal] = useState(false);
  const [addForm, setAddForm] = useState({ sectionId: '', content: '' });
  const [categories, setCategories] = useState([]);

  // Load data from API
  useEffect(() => {
    loadSectionPages();
    loadCategories();
  }, []);

  const loadSectionPages = async () => {
    try {
      const response = await sectionPageService.getSectionPage({ page: 1, limit: 100 });
      const items = response?.data?.data?.content || response?.data?.content || [];
      setSectionPages(items);
    } catch (error) {
      console.error('Error loading section pages:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await menuService.getMenu();
      setCategories(res?.data?.data || []);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const flattenMenus = (menuList, level = 0) => {
    let flattened = [];
    (menuList || []).forEach(menu => {
      let prefix = level === 0 ? '' : '│  '.repeat(Math.max(0, level - 1)) + '├─ ';
      flattened.push({ ...menu, displayName: prefix + menu.name, level });
      if (menu.children && menu.children.length > 0) {
        flattened = flattened.concat(flattenMenus(menu.children, level + 1));
      }
    });
    return flattened;
  };

  

  const formatDateDDMMYYYY = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const truncate = (text, max = 120) => {
    if (!text) return '';
    return text.length > max ? text.slice(0, max) + '…' : text;
  };

  const handleEditSP = (sp) => {
    setEditingSP(sp);
    setSpForm({ content: sp?.content || '' });
    setShowSPModal(true);
  };

  const handleDeleteSP = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nội dung này?')) return;
    try {
      await sectionPageService.deleteSectionPage(id);
      await loadSectionPages();
    } catch (error) {
      console.error('Error deleting section page:', error);
      alert('Không thể xóa nội dung');
    }
  };

  const handleSubmitSP = async (e) => {
    e.preventDefault();
    if (!editingSP) return;
    try {
      await sectionPageService.updateSectionPage(editingSP.id, { content: spForm.content });
      await loadSectionPages();
      setShowSPModal(false);
      setEditingSP(null);
    } catch (error) {
      console.error('Error updating section page:', error);
      alert('Không thể cập nhật nội dung');
    }
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
            onClick={() => { setShowAddSPModal(true); setAddForm({ sectionId: '', content: '' }); }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <span>➕</span>
            Thêm bài viết
          </button>
        </div>

        

        {/* Section Pages List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên danh mục</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nội dung</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sectionPages.map((sp) => (
                  <tr key={sp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sp.sectionName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-[600px]">
                      <div className="max-h-40 overflow-hidden" dangerouslySetInnerHTML={{ __html: sp.content }} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateDDMMYYYY(sp.createDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditSP(sp)}
                          className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50"
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteSP(sp.id)}
                          className="text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50"
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sectionPages.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-6 text-center text-sm text-gray-500">Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal edit Section Page */}
        {showSPModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
              <h2 className="text-xl font-bold mb-4">Sửa nội dung</h2>
              <form onSubmit={handleSubmitSP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên danh mục</label>
                  <input
                    type="text"
                    value={editingSP?.sectionName || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung</label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <style>
                      {`
                        .ck-editor__editable { 
                          min-height: 300px !important;
                          max-height: 420px !important;
                          overflow-y: auto !important;
                        }
                        .ck.ck-editor__main > .ck-editor__editable {
                          min-height: 300px !important;
                          max-height: 420px !important;
                          overflow-y: auto !important;
                        }
                      `}
                    </style>
                    <CKEditor
                      editor={ClassicEditor}
                      data={spForm.content}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setSpForm({ content: data });
                      }}
                      config={{
                        toolbar: [
                          'heading','|','bold','italic','link','bulletedList','numberedList','|','blockQuote','insertTable','undo','redo'
                        ],
                        placeholder: 'Nhập nội dung...'
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowSPModal(false); setEditingSP(null); }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal add Section Page */}
        {showAddSPModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
              <h2 className="text-xl font-bold mb-4">Thêm bài viết</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    if (!addForm.content || !addForm.content.trim()) {
                      alert('Vui lòng nhập nội dung');
                      return;
                    }
                    await sectionPageService.addSectionPage({ idSection: Number(addForm.sectionId), content: addForm.content });
                    await loadSectionPages();
                    setShowAddSPModal(false);
                  } catch (error) {
                    console.error('Error adding section page:', error);
                    alert('Không thể thêm bài viết');
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chọn danh mục</label>
                  <select
                    value={addForm.sectionId}
                    onChange={(e) => setAddForm({ ...addForm, sectionId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {flattenMenus(categories).map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.displayName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung</label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <style>
                      {`
                        .ck-editor__editable { 
                          min-height: 300px !important;
                          max-height: 500px !important;
                          overflow-y: auto !important;
                        }
                        .ck.ck-editor__main > .ck-editor__editable {
                          min-height: 300px !important;
                          max-height: 500px !important;
                          overflow-y: auto !important;
                        }
                      `}
                    </style>
                    <CKEditor
                      editor={ClassicEditor}
                      data={addForm.content}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setAddForm({ ...addForm, content: data });
                      }}
                      config={{
                        toolbar: [
                          'heading','|','bold','italic','link','bulletedList','numberedList','|','blockQuote','insertTable','undo','redo'
                        ],
                        placeholder: 'Nhập nội dung...'
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddSPModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Lưu
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
