import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, UserPlus, UserCheck, UserX, FileText, Clock } from 'lucide-react';
import { adminAPI } from '../../services/api';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const fetchActivityLogs = async () => {
    try {
      const response = await adminAPI.getActivityLogs({ limit: 10 });
      
      if (response.success) {
        // تحويل البيانات من Backend لـ format مناسب للعرض
        const formattedActivities = response.data.map(log => ({
          id: log.id,
          type: log.type,
          title: log.title,
          description: log.description,
          icon: getIconByType(log.type),
          color: getColorByType(log.type),
          bgColor: getBgColorByType(log.type),
          time: log.time // from diffForHumans()
        }));
        
        setActivities(formattedActivities);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      // في حالة فشل الاتصال، استخدم بيانات تجريبية للتطوير
      setActivities([
    {
      id: 1,
      type: 'user_registered',
      title: 'مستخدم جديد',
      description: 'أحمد محمد انضم للمنصة',
      icon: UserPlus,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      time: 'منذ 5 دقائق'
    },
    {
      id: 2,
      type: 'doctor_approved',
      title: 'قبول طبيب',
      description: 'تم قبول د. سارة علي',
      icon: UserCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      time: 'منذ 15 دقيقة'
    },
    {
      id: 3,
      type: 'doctor_rejected',
      title: 'رفض طلب',
      description: 'تم رفض طلب د. محمد حسن',
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      time: 'منذ 30 دقيقة'
    },
    {
      id: 4,
      type: 'report_generated',
      title: 'تقرير جديد',
      description: 'تم إنشاء التقرير الشهري',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      time: 'منذ ساعة'
    },
    {
      id: 5,
      type: 'user_registered',
      title: 'مستخدم جديد',
      description: 'فاطمة أحمد انضمت للمنصة',
      icon: UserPlus,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      time: 'منذ ساعتين'
    },
    {
      id: 6,
      type: 'doctor_approved',
      title: 'قبول طبيب',
      description: 'تم قبول د. خالد يوسف',
      icon: UserCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      time: 'منذ 3 ساعات'
    }
  ]);
  setLoading(false);
    }
  };

  // Helper functions لتحديد الـ icon والـ color بناءً على نوع النشاط
  const getIconByType = (type) => {
    const iconMap = {
      'user_registered': UserPlus,
      'doctor_approved': UserCheck,
      'doctor_rejected': UserX,
      'user_deleted': UserX,
      'user_status_changed': UserCheck,
      'report_generated': FileText,
      'default': Activity
    };
    return iconMap[type] || iconMap['default'];
  };

  const getColorByType = (type) => {
    const colorMap = {
      'user_registered': 'text-green-600',
      'doctor_approved': 'text-blue-600',
      'doctor_rejected': 'text-red-600',
      'user_deleted': 'text-red-600',
      'user_status_changed': 'text-yellow-600',
      'report_generated': 'text-purple-600',
      'default': 'text-gray-600'
    };
    return colorMap[type] || colorMap['default'];
  };

  const getBgColorByType = (type) => {
    const bgColorMap = {
      'user_registered': 'bg-green-50',
      'doctor_approved': 'bg-blue-50',
      'doctor_rejected': 'bg-red-50',
      'user_deleted': 'bg-red-50',
      'user_status_changed': 'bg-yellow-50',
      'report_generated': 'bg-purple-50',
      'default': 'bg-gray-50'
    };
    return bgColorMap[type] || bgColorMap['default'];
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header - Modern Gradient */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-5 relative overflow-hidden">
        {/* Subtle decoration */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mt-12"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg"
          >
            <Activity className="text-white" size={24} />
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-white">النشاطات الأخيرة</h2>
            <p className="text-sm text-white/80">آخر التحديثات في النظام</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto" style={{ maxHeight: '500px' }}>
        <div className="space-y-2">
          {activities.map((activity, idx) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
              whileHover={{ x: -5, backgroundColor: "rgb(249, 250, 251)" }}
              className="flex items-start gap-3 p-3 rounded-xl cursor-pointer border-2 border-transparent hover:border-gray-200 transition-all duration-200"
            >
              {/* Icon with hover effect */}
              <motion.div 
                whileHover={{ scale: 1.15, rotate: 10 }}
                className={`${activity.bgColor} p-2.5 rounded-xl flex-shrink-0 shadow-sm`}
              >
                <activity.icon className={activity.color} size={20} strokeWidth={2.5} />
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-sm mb-1">{activity.title}</h4>
                <p className="text-xs text-gray-600 truncate">{activity.description}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Clock size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-500 font-medium">{activity.time}</span>
                </div>
              </div>
              
              {/* Indicator dot */}
              <div className={`w-2 h-2 rounded-full ${activity.color.replace('text-', 'bg-')} flex-shrink-0 mt-2`}></div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <button className="text-sm text-[#0F427D] hover:text-[#008080] font-semibold transition-colors">
          عرض كل النشاطات ←
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;
