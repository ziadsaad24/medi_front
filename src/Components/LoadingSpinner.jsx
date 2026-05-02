import React from 'react';

/**
 * مكون التحميل الموحد — يُستخدم في جميع أنحاء التطبيق
 * @param {string} size - 'sm' | 'md' | 'lg' (الحجم)
 * @param {string} text - نص اختياري يظهر تحت المؤشر
 * @param {boolean} fullScreen - إذا كان true يملأ الشاشة بالكامل
 */
const LoadingSpinner = ({ size = 'md', text = 'جارٍ التحميل...', fullScreen = false }) => {
  const sizes = {
    sm: 'w-8 h-8 border-2',
    md: 'w-16 h-16 border-4',
    lg: 'w-24 h-24 border-[6px]',
  };

  const spinner = (
    <div className="text-center">
      <div
        className={`${sizes[size]} border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4`}
      />
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
