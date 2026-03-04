import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, color, bgColor, iconColor, change, changeType, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      className="relative bg-white border border-gray-200 rounded-xl p-6 hover:border-[#0F427D]/30 transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      {/* Subtle Background Effect */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 rounded-full -mr-16 -mt-16 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
            className={`${bgColor} p-3 rounded-xl shadow-sm`}
          >
            <Icon className={iconColor} size={26} strokeWidth={2.5} />
          </motion.div>
          {change && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 + 0.1 }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm
                ${changeType === 'increase' ? 'bg-green-100 text-green-700' : 
                  changeType === 'decrease' ? 'bg-red-100 text-red-700' : 
                  'bg-amber-100 text-amber-700'}
              `}>
              {changeType === 'increase' && <TrendingUp size={14} />}
              {changeType === 'decrease' && <TrendingDown size={14} />}
              {changeType === 'warning' && <AlertTriangle size={14} />}
              {change}
            </motion.div>
          )}
        </div>

        <div className="mb-4">
          <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wide">{title}</p>
          <motion.p
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 + 0.15 }}
            className="text-4xl font-black text-gray-900 group-hover:text-[#0F427D] transition-colors duration-300"
          >
            {value?.toLocaleString('ar-EG') || 0}
          </motion.p>
        </div>

        {/* Progress bar with animation */}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.8, delay: index * 0.05 + 0.2, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${color} rounded-full`}
          ></motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
