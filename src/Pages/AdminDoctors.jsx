import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCheck, 
  Search, 
  Filter,
  Mail,
  Phone,
  Briefcase,
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  Award
} from 'lucide-react';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import { adminAPI } from '../services/api';
import Swal from 'sweetalert2';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchDoctors();
  }, [filterStatus]);

  const fetchDoctors = async () => {
    try {
      const params = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      
      const response = await adminAPI.getAllDoctors(params);
      
      if (response.success) {
        setDoctors(response.data.data || response.data || []);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Fallback dummy data
      setTimeout(() => {
        setDoctors([
          {
            id: 1,
            name: 'د. أحمد محمود',
            email: 'ahmed.doctor@example.com',
            phone: '01012345678',
            specialization: 'أخصائي قلب وأوعية دموية',
            license_file: 'license_123.pdf',
            license_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            status: 'active',
            email_verified_at: '2024-02-01T10:00:00',
            created_at: '2024-01-15T08:30:00'
          },
          {
            id: 2,
            name: 'د. سارة علي',
            email: 'sara.doctor@example.com',
            phone: '01098765432',
            specialization: 'أخصائية جلدية وتجميل',
            license_file: 'license_456.pdf',
            license_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            status: 'active',
            email_verified_at: '2024-02-15T12:00:00',
            created_at: '2024-02-01T10:00:00'
          },
          {
            id: 3,
            name: 'د. محمد حسن',
            email: 'mohamed.doctor@example.com',
            phone: '01155667788',
            specialization: 'أخصائي عظام ومفاصل',
            license_file: 'license_789.pdf',
            license_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            status: 'pending',
            email_verified_at: null,
            created_at: '2024-03-01T14:00:00'
          }
        ]);
        setLoading(false);
      }, 1000);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (doctor.specialization && doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())) ||
                       (doctor.phone && doctor.phone.includes(searchTerm));
    return matchSearch;
  });

  const viewLicense = (licenseUrl, licenseFile) => {
    const url = licenseUrl || `http://localhost:8000/storage/licenses/${licenseFile}`;
    window.open(url, '_blank');
  };

  const getStatusBadge = (status) => {
    const statuses = {
      active: { label: 'نشط', color: 'bg-green-100 text-green-700' },
      pending: { label: 'معلق', color: 'bg-amber-100 text-amber-700' },
      rejected: { label: 'مرفوض', color: 'bg-red-100 text-red-700' }
    };
    return statuses[status] || statuses.active;
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AdminSidebar />
      
      <div className="mr-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <UserCheck className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إدارة الأطباء</h1>
              <p className="text-gray-600 mt-1">عرض وإدارة جميع الأطباء في النظام</p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="بحث عن طبيب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="pending">معلق</option>
                <option value="rejected">مرفوض</option>
              </select>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="p-12 text-center bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">جارٍ التحميل...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl shadow-sm border border-gray-200">
            <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">لا يوجد أطباء</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor, idx) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:border-teal-300 hover:shadow-lg transition-all overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4 relative">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mt-16"></div>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-teal-600 font-bold text-2xl shadow-lg">
                      {doctor.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{doctor.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        getStatusBadge(doctor.status).color.replace('bg-', 'bg-white/20 text-white')
                      }`}>
                        {getStatusBadge(doctor.status).label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Briefcase size={16} className="text-teal-500" />
                      <span className="font-semibold">{doctor.specialization || doctor.specialty}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={16} className="text-blue-500" />
                      <span>{doctor.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={16} className="text-green-500" />
                      <span>{doctor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} className="text-purple-500" />
                      <span>انضم في {new Date(doctor.created_at).toLocaleDateString('ar-EG')}</span>
                    </div>
                    {doctor.email_verified_at && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle size={16} />
                        <span className="font-semibold">الإيميل موثق</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {(doctor.license_url || doctor.license_file) && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => viewLicense(doctor.license_url, doctor.license_file)}
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <FileText size={18} />
                      عرض الترخيص
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <UserCheck className="text-teal-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">إجمالي الأطباء</p>
                <p className="text-xl font-bold text-gray-900">{doctors.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">نشط</p>
                <p className="text-xl font-bold text-gray-900">{doctors.filter(d => d.status === 'active').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Award className="text-amber-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">معلق</p>
                <p className="text-xl font-bold text-gray-900">{doctors.filter(d => d.status === 'pending').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="text-red-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">مرفوض</p>
                <p className="text-xl font-bold text-gray-900">{doctors.filter(d => d.status === 'rejected').length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDoctors;
