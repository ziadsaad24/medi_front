import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import Swal from 'sweetalert2';
import { adminAPI, complaintAPI } from '../services/api';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const mapPriority = (priority) => {
    if (typeof priority === 'string') return priority;
    const mapping = { 0: 'low', 1: 'medium', 2: 'high', 3: 'urgent' };
    return mapping[priority] || 'medium';
  };

  const normalizeComplaint = (complaint) => ({
    id: complaint.id,
    complaint_id: complaint.complaint_id || `#C-${String(complaint.id).padStart(6, '0')}`,
    user_name: complaint.user_name || complaint.user?.name || 'مستخدم',
    user_email: complaint.user_email || complaint.user?.email || '-',
    type: complaint.type || complaint.category || 'other',
    subject: complaint.subject || complaint.title || 'بدون عنوان',
    description: complaint.description || complaint.message || '-',
    status: complaint.status || 'pending',
    priority: mapPriority(complaint.priority),
    created_at: complaint.created_at,
    updated_at: complaint.updated_at,
    admin_response: complaint.admin_response || null,
  });

  const getComplaintsList = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    if (Array.isArray(response?.data?.items)) return response.data.items;
    if (Array.isArray(response?.complaints)) return response.complaints;
    if (Array.isArray(response?.data?.complaints)) return response.data.complaints;
    return [];
  };

  // **Fetch complaints from backend**
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setFetchError('');
      let response;
      try {
        response = await adminAPI.getComplaints();
      } catch (adminError) {
        if (adminError?.response?.status === 404) {
          response = await complaintAPI.getComplaints();
        } else {
          throw adminError;
        }
      }
      const complaintsList = getComplaintsList(response);
      setComplaints(complaintsList.map(normalizeComplaint));
    } catch (error) {
      console.error('Error fetching complaints:', error);
      const status = error?.response?.status;
      const backendMessage = error?.response?.data?.message;
      if (status === 401) {
        setFetchError('غير مصرح: سجل دخولك كمسؤول ثم أعد المحاولة.');
      } else if (status === 403) {
        setFetchError('ليس لديك صلاحية الوصول لشكاوى الأدمن.');
      } else {
        setFetchError(backendMessage || 'تعذر تحميل الشكاوى من قاعدة البيانات.');
      }
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // **Filter complaints**
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = 
      complaint.complaint_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesType = typeFilter === 'all' || complaint.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // **Helper functions**
  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'قيد المراجعة' },
      in_progress: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'قيد المعالجة' },
      resolved: { bg: 'bg-green-100', text: 'text-green-800', label: 'تم الحل' },
      dismissed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'مرفوض' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      urgent: { bg: 'bg-red-100', text: 'text-red-800', label: 'عاجل جداً', icon: '🔴' },
      high: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'عالي', icon: '🟠' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'متوسط', icon: '🟡' },
      low: { bg: 'bg-green-100', text: 'text-green-800', label: 'منخفض', icon: '🟢' }
    };
    const badge = badges[priority] || badges.medium;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.icon} {badge.label}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const types = {
      technical: { label: 'تقني', icon: '💻' },
      service: { label: 'خدمة', icon: '🏥' },
      payment: { label: 'مالي', icon: '💳' },
      doctor: { label: 'طبيب', icon: '👨‍⚕️' },
      other: { label: 'أخرى', icon: '📝' }
    };
    const typeData = types[type] || types.other;
    return (
      <span className="text-gray-700 text-sm">
        {typeData.icon} {typeData.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // **View complaint details**
  const handleViewDetails = (complaint) => {
    Swal.fire({
      title: `<div dir="rtl" style="text-align: right;">${complaint.subject}</div>`,
      html: `
        <div dir="rtl" style="text-align: right; padding: 20px;">
          <div style="margin-bottom: 15px;">
            <strong>رقم الشكوى:</strong> ${complaint.complaint_id}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>المستخدم:</strong> ${complaint.user_name}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>البريد الإلكتروني:</strong> ${complaint.user_email}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>النوع:</strong> ${getTypeBadge(complaint.type).props.children[2]}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>الأولوية:</strong> ${complaint.priority}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>الحالة:</strong> ${complaint.status}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>التاريخ:</strong> ${formatDate(complaint.created_at)}
          </div>
          <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px;">
            <strong>التفاصيل:</strong><br/>
            ${complaint.description}
          </div>
        </div>
      `,
      width: 600,
      confirmButtonText: 'إغلاق',
      confirmButtonColor: '#0F427D'
    });
  };

  // **Update complaint status**
  const handleUpdateStatus = async (complaintId, newStatus) => {
    const statusLabels = {
      pending: 'قيد المراجعة',
      in_progress: 'قيد المعالجة',
      resolved: 'تم الحل',
      dismissed: 'مرفوض'
    };

    Swal.fire({
      title: 'تحديث حالة الشكوى',
      text: `هل تريد تغيير حالة الشكوى إلى "${statusLabels[newStatus]}"؟`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'نعم، قم بالتحديث',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#0F427D',
      cancelButtonColor: '#d33'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await adminAPI.updateComplaintStatus(complaintId, newStatus);
          Swal.fire({
            title: 'تم التحديث!',
            text: 'تم تحديث حالة الشكوى بنجاح',
            icon: 'success',
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#0F427D'
          });
          fetchComplaints(); // Refresh
        } catch (error) {
          console.error('Error updating complaint:', error);
          Swal.fire({
            title: 'فشل التحديث',
            text: error?.response?.data?.message || 'تعذر تحديث حالة الشكوى من قاعدة البيانات',
            icon: 'error',
            confirmButtonText: 'حسناً'
          });
        }
      }
    });
  };

  // **Delete complaint**
  const handleDelete = async (complaintId) => {
    Swal.fire({
      title: 'حذف الشكوى',
      text: 'هل أنت متأكد من حذف هذه الشكوى؟ لا يمكن التراجع عن هذا الإجراء.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0F427D'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await adminAPI.deleteComplaint(complaintId);
          Swal.fire({
            title: 'تم الحذف!',
            text: 'تم حذف الشكوى بنجاح',
            icon: 'success',
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#0F427D'
          });
          fetchComplaints(); // Refresh
        } catch (error) {
          console.error('Error deleting complaint:', error);
          Swal.fire({
            title: 'فشل الحذف',
            text: error?.response?.data?.message || 'تعذر حذف الشكوى من قاعدة البيانات',
            icon: 'error',
            confirmButtonText: 'حسناً'
          });
        }
      }
    });
  };

  // **Stats calculation**
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    in_progress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length
  };

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <AdminSidebar />
      
      <div className="flex-1 pr-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">📝</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">الشكاوى والبلاغات</h1>
                <p className="text-gray-600">إدارة شكاوى المستخدمين والرد عليها</p>
              </div>
            </motion.div>
          </div>

          {fetchError && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {fetchError}
            </div>
          )}

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">إجمالي الشكاوى</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">قيد المراجعة</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⏳</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">قيد المعالجة</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.in_progress}</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔄</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">تم الحل</p>
                  <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  بحث
                </label>
                <input
                  type="text"
                  placeholder="ابحث برقم الشكوى، الاسم، أو الموضوع..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F427D] focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحالة
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F427D] focus:border-transparent"
                >
                  <option value="all">الكل</option>
                  <option value="pending">قيد المراجعة</option>
                  <option value="in_progress">قيد المعالجة</option>
                  <option value="resolved">تم الحل</option>
                  <option value="dismissed">مرفوض</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  النوع
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F427D] focus:border-transparent"
                >
                  <option value="all">الكل</option>
                  <option value="technical">تقني 💻</option>
                  <option value="service">خدمة 🏥</option>
                  <option value="payment">مالي 💳</option>
                  <option value="doctor">طبيب 👨‍⚕️</option>
                  <option value="other">أخرى 📝</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Complaints Table */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F427D]"></div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">رقم الشكوى</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">المستخدم</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الموضوع</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">النوع</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الأولوية</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الحالة</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">التاريخ</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredComplaints.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                          لا توجد شكاوى
                        </td>
                      </tr>
                    ) : (
                      filteredComplaints.map((complaint, index) => (
                        <motion.tr
                          key={complaint.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm text-[#0F427D] font-semibold">
                              {complaint.complaint_id}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900">{complaint.user_name}</div>
                              <div className="text-xs text-gray-500">{complaint.user_email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="max-w-xs">
                              <p className="text-sm text-gray-900 font-medium truncate">
                                {complaint.subject}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {complaint.description}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {getTypeBadge(complaint.type)}
                          </td>
                          <td className="px-6 py-4">
                            {getPriorityBadge(complaint.priority)}
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(complaint.status)}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">
                              {formatDate(complaint.created_at)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewDetails(complaint)}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                                title="عرض التفاصيل"
                              >
                                👁️
                              </button>
                              <select
                                value={complaint.status}
                                onChange={(e) => handleUpdateStatus(complaint.id, e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0F427D]"
                                title="تحديث الحالة"
                              >
                                <option value="pending">قيد المراجعة</option>
                                <option value="in_progress">قيد المعالجة</option>
                                <option value="resolved">تم الحل</option>
                                <option value="dismissed">مرفوض</option>
                              </select>
                              <button
                                onClick={() => handleDelete(complaint.id)}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                title="حذف"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminComplaints;
