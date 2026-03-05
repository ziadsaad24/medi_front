import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter,
  UserX,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  Shield,
  Trash2,
  Ban,
  CheckCircle
} from 'lucide-react';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import { adminAPI } from '../services/api';
import Swal from 'sweetalert2';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [filterRole, filterStatus]);

  const fetchUsers = async () => {
    try {
      const params = {};
      if (filterRole !== 'all') params.role = filterRole;
      if (filterStatus !== 'all') params.status = filterStatus;
      
      const response = await adminAPI.getAllUsers(params);
      
      if (response.success) {
        setUsers(response.data.data || response.data || []);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback dummy data
      setTimeout(() => {
        setUsers([
          {
            id: 1,
            name: 'أحمد محمد علي',
            email: 'ahmed@example.com',
            phone: '01012345678',
            role: 'patient',
            status: 'active',
            email_verified_at: '2024-03-01T10:00:00',
            created_at: '2024-01-15T08:30:00'
          },
          {
            id: 2,
            name: 'فاطمة حسن',
            email: 'fatma@example.com',
            phone: '01098765432',
            role: 'patient',
            status: 'active',
            email_verified_at: '2024-02-20T14:00:00',
            created_at: '2024-02-01T12:00:00'
          },
          {
            id: 3,
            name: 'محمد يوسف',
            email: 'mohamed@example.com',
            phone: '01155667788',
            role: 'patient',
            status: 'suspended',
            email_verified_at: null,
            created_at: '2024-02-28T16:00:00'
          }
        ]);
        setLoading(false);
      }, 1000);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const action = newStatus === 'active' ? 'تفعيل' : 'تعليق';
    
    const result = await Swal.fire({
      title: `تأكيد ${action} المستخدم`,
      text: `هل أنت متأكد من ${action} هذا المستخدم؟`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `نعم، ${action}`,
      cancelButtonText: 'إلغاء',
      confirmButtonColor: newStatus === 'active' ? '#10b981' : '#ef4444',
      cancelButtonColor: '#6b7280',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        const response = await adminAPI.toggleUserStatus(userId);
        
        if (response.success) {
          setUsers(users.map(user => 
            user.id === userId ? { ...user, status: newStatus } : user
          ));
          
          Swal.fire({
            title: 'تم بنجاح!',
            text: `تم ${action} المستخدم بنجاح`,
            icon: 'success',
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#10b981'
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'خطأ!',
          text: 'حدث خطأ أثناء تحديث حالة المستخدم',
          icon: 'error',
          confirmButtonText: 'حسناً'
        });
      }
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    const result = await Swal.fire({
      title: 'تأكيد الحذف',
      text: `هل أنت متأكد من حذف المستخدم "${userName}"؟ هذا الإجراء لا يمكن التراجع عنه!`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'نعم، حذف',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        const response = await adminAPI.deleteUser(userId);
        
        if (response.success) {
          setUsers(users.filter(user => user.id !== userId));
          
          Swal.fire({
            title: 'تم الحذف!',
            text: 'تم حذف المستخدم بنجاح',
            icon: 'success',
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#10b981'
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'خطأ!',
          text: 'حدث خطأ أثناء حذف المستخدم',
          icon: 'error',
          confirmButtonText: 'حسناً'
        });
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (user.phone && user.phone.includes(searchTerm));
    return matchSearch;
  });

  const getRoleLabel = (role) => {
    const roles = {
      patient: 'مريض',
      doctor: 'طبيب',
      admin: 'مسؤول'
    };
    return roles[role] || role;
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      patient: 'bg-blue-100 text-blue-700',
      doctor: 'bg-teal-100 text-teal-700',
      admin: 'bg-purple-100 text-purple-700'
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AdminSidebar />
      
      <div className="mr-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إدارة المستخدمين</h1>
              <p className="text-gray-600 mt-1">عرض وإدارة جميع المستخدمين في النظام</p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="بحث عن مستخدم..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع الأدوار</option>
                <option value="patient">مرضى</option>
                <option value="doctor">أطباء</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="suspended">معلق</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">جارٍ التحميل...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">لا يوجد مستخدمون</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">المستخدم</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">البريد الإلكتروني</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">الهاتف</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">الدور</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">الحالة</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">تاريخ التسجيل</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user, idx) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            {user.email_verified_at && (
                              <span className="text-xs text-green-600 flex items-center gap-1">
                                <CheckCircle size={12} />
                                موثق
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} />
                          {user.phone || 'غير متوفر'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleBadgeColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {user.status === 'active' ? 'نشط' : 'معلق'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(user.created_at).toLocaleDateString('ar-EG')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleToggleStatus(user.id, user.status)}
                            className={`p-2 rounded-lg transition-all shadow-sm hover:shadow-md ${
                              user.status === 'active'
                                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                : 'bg-green-100 text-green-600 hover:bg-green-200'
                            }`}
                            title={user.status === 'active' ? 'تعليق' : 'تفعيل'}
                          >
                            {user.status === 'active' ? <Ban size={16} /> : <UserCheck size={16} />}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all shadow-sm hover:shadow-md"
                            title="حذف"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">إجمالي المستخدمين</p>
                <p className="text-xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">مرضى</p>
                <p className="text-xl font-bold text-gray-900">{users.filter(u => u.role === 'patient').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">نشط</p>
                <p className="text-xl font-bold text-gray-900">{users.filter(u => u.status === 'active').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <UserX className="text-red-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">معلق</p>
                <p className="text-xl font-bold text-gray-900">{users.filter(u => u.status === 'suspended').length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
