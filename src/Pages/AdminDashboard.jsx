import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  Clock, 
  TrendingUp, 
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  BarChart3
} from 'lucide-react';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import StatsCard from '../Components/Admin/StatsCard';
import DoctorRequests from '../Components/Admin/DoctorRequests';
import RecentActivity from '../Components/Admin/RecentActivity';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    pendingDoctors: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    loading: true
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      
      if (response.success) {
        setStats({
          totalUsers: response.data.totalUsers || 0,
          totalDoctors: response.data.totalDoctors || 0,
          pendingDoctors: response.data.pendingDoctors || 0,
          activeUsers: response.data.activeUsers || 0,
          loading: false
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // في حالة فشل الاتصال، استخدم بيانات تجريبية للتطوير
      setStats({
        totalUsers: 0,
        totalDoctors: 0,
        pendingDoctors: 0,
        activeUsers: 0,
        loading: false
      });
    }
  };

  const statsCards = [
    {
      title: 'إجمالي المستخدمين',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'الأطباء المسجلين',
      value: stats.totalDoctors,
      icon: UserCheck,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'طلبات معلقة',
      value: stats.pendingDoctors,
      icon: Clock,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      change: '3 جديد',
      changeType: 'warning'
    },
    {
      title: 'المستخدمين النشطين',
      value: stats.activeUsers,
      icon: Activity,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      change: '+24%',
      changeType: 'increase'
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <AdminSidebar />
      
      <div className="flex-1 mr-64">
        {/* Header - Professional & Clean */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  لوحة التحكم - Medicare Admin
                </h1>
                <p className="text-sm text-gray-500">
                  مرحباً {user?.name?.split(' ')[0] || 'المسؤول'} • {new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">النظام</p>
                  <p className="text-sm font-bold text-[#0F427D]">Medicare v2.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Stats Grid - 4 Cards Only */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.loading ? (
              // Loading skeleton
              Array(4).fill(0).map((_, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                  <div className="h-12 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))
            ) : (
              statsCards.map((card, idx) => (
                <StatsCard key={idx} {...card} index={idx} />
              ))
            )}
          </motion.div>

          {/* Two Column Layout - Doctor Requests & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Doctor Requests - Takes 2 columns */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <DoctorRequests />
            </motion.div>

            {/* Recent Activity - Takes 1 column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <RecentActivity />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
