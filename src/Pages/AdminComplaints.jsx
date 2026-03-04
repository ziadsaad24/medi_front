import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import Swal from 'sweetalert2';
import { adminAPI } from '../services/api';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // **Fetch complaints from backend with fallback**
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getComplaints();
      
      if (response.success) {
        setComplaints(response.data);
      } else {
        // Fallback to dummy data
        setComplaints(dummyComplaints);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setComplaints(dummyComplaints);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // **Dummy data for testing**
  const dummyComplaints = [
    {
      id: 1,
      complaint_id: '#C-2024-001',
      user_name: 'أحمد محمد',
      user_email: 'ahmed@example.com',
      type: 'technical',
      subject: 'مشكلة في تحميل التطبيق',
      description: 'التطبيق لا يعمل بشكل صحيح على جهاز الآيفون. يتوقف عند شاشة التحميل.',
      status: 'pending',
      priority: 'high',
      created_at: '2024-01-15 10:30:00',
      updated_at: '2024-01-15 10:30:00'
    },
    {
      id: 2,
      complaint_id: '#C-2024-002',
      user_name: 'فاطمة علي',
      user_email: 'fatima@example.com',
      type: 'service',
      subject: 'تأخير في موعد الحجز',
      description: 'تم حجز موعد مع الطبيب ولكن تأخر الموعد لمدة 30 دقيقة بدون إشعار.',
      status: 'in_progress',
      priority: 'medium',
      created_at: '2024-01-14 14:20:00',
      updated_at: '2024-01-15 09:00:00'
    },
    {
      id: 3,
      complaint_id: '#C-2024-003',
      user_name: 'خالد حسن',
      user_email: 'khaled@example.com',
      type: 'payment',
      subject: 'مشكلة في الدفع',
      description: 'تم خصم المبلغ من البطاقة الائتمانية ولكن الحجز لم يتم تأكيده.',
      status: 'resolved',
      priority: 'high',
      created_at: '2024-01-13 11:00:00',
      updated_at: '2024-01-14 15:30:00'
    },
    {
      id: 4,
      complaint_id: '#C-2024-004',
      user_name: 'سارة إبراهيم',
      user_email: 'sara@example.com',
      type: 'doctor',
      subject: 'سلوك غير لائق من الطبيب',
      description: 'الطبيب كان غير محترم خلال الكشف وتعامل بطريقة سيئة.',
      status: 'pending',
      priority: 'urgent',
      created_at: '2024-01-15 16:45:00',
      updated_at: '2024-01-15 16:45:00'
    },
    {
      id: 5,
      complaint_id: '#C-2024-005',
      user_name: 'محمد عبدالله',
      user_email: 'mohamed@example.com',
      type: 'technical',
      subject: 'خطأ في عرض البيانات',
      description: 'السجلات الطبية الخاصة بي تظهر بيانات خاطئة. أرجو التصحيح.',
      status: 'dismissed',
      priority: 'low',
      created_at: '2024-01-12 09:15:00',
      updated_at: '2024-01-13 10:00:00'
    }
  ];

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
          // Call backend API
          const response = await adminAPI.updateComplaintStatus(complaintId, newStatus);
          
          if (response.success) {
            Swal.fire({
              title: 'تم التحديث!',
              text: 'تم تحديث حالة الشكوى بنجاح',
              icon: 'success',
              confirmButtonText: 'حسناً',
              confirmButtonColor: '#0F427D'
            });
            fetchComplaints(); // Refresh
          } else {
            throw new Error('Failed to update');
          }
        } catch (error) {
          console.error('Error updating complaint:', error);
          // For demo: update locally
          setComplaints(prev => 
            prev.map(c => 
              c.id === complaintId 
                ? { ...c, status: newStatus, updated_at: new Date().toISOString() }
                : c
            )
          );
          Swal.fire({
            title: 'تم التحديث (Demo)!',
            text: 'تم تحديث حالة الشكوى محلياً',
            icon: 'success',
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#0F427D'
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
          // Call backend API
          const response = await adminAPI.deleteComplaint(complaintId);
          
          if (response.success) {
            Swal.fire({
              title: 'تم الحذف!',
              text: 'تم حذف الشكوى بنجاح',
              icon: 'success',
              confirmButtonText: 'حسناً',
              confirmButtonColor: '#0F427D'
            });
            fetchComplaints(); // Refresh
          } else {
            throw new Error('Failed to delete');
          }
        } catch (error) {
          console.error('Error deleting complaint:', error);
          // For demo: delete locally
          setComplaints(prev => prev.filter(c => c.id !== complaintId));
          Swal.fire({
            title: 'تم الحذف (Demo)!',
            text: 'تم حذف الشكوى محلياً',
            icon: 'success',
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#0F427D'
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
