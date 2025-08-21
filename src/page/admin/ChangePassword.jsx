import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layout/AdminLayout';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validate current password (in real app, this would be API call)
    if (formData.currentPassword !== 'admin123') {
      setMessage({ type: 'error', text: 'Mật khẩu hiện tại không đúng' });
      setLoading(false);
      return;
    }

    // Validate new password
    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
      setLoading(false);
      return;
    }

    // Validate confirm password
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Xác nhận mật khẩu không khớp' });
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // In real app, save new password to database
      localStorage.setItem('admin_password', formData.newPassword);
      
      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setLoading(false);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/admin/categories');
      }, 2000);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Đổi mật khẩu</h1>
            <p className="text-gray-600 mt-1">Cập nhật mật khẩu đăng nhập của bạn</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {message.text && (
              <div className={`p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                placeholder="Nhập mật khẩu hiện tại"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                required
                minLength="6"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                placeholder="Nhập lại mật khẩu mới"
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/admin/categories')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
              </button>
            </div>
          </form>

          {/* Security Tips */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Lưu ý bảo mật:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Sử dụng mật khẩu mạnh với ít nhất 8 ký tự</li>
              <li>• Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
              <li>• Không sử dụng thông tin cá nhân dễ đoán</li>
              <li>• Thay đổi mật khẩu định kỳ</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ChangePassword;
