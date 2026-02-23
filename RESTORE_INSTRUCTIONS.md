# 🔄 RESTORE INSTRUCTIONS - تعليمات استعادة الكود الأصلي

## ⚠️ هذا الملف يحتوي على التعليمات لاستعادة المشروع للوضع الطبيعي بعد تطوير الفرونت إند

---

## 📝 التعديلات المؤقتة التي تم عملها:

### 1️⃣ ملف: `src/Components/ProtectedRoute.jsx`
**التعديل:** تم تعطيل authentication check للسماح بالدخول المباشر

**الكود الأصلي:**
```jsx
const ProtectedRoute = ({ 
  children, 
  allowedRoles = null, 
  redirectTo = '/' 
}) => {
  const { user, loading } = useAuth();

  // إظهار loader أثناء التحميل
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  // إذا لم يكن مسجل دخول، وجّهه لصفحة Auth
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // تحقق من تفعيل الإيميل للمرضى
  if (user.role === 'patient' && !user.email_verified_at) {
    return <Navigate to="/pending-verification" replace />;
  }

  // إذا كان هناك أدوار محددة، تحقق منها
  if (allowedRoles) {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    if (!roles.includes(user.role)) {
      // إذا لم يكن له صلاحية، وجهه للصفحة الرئيسية الخاصة به
      const roleRedirects = {
        patient: '/patient/home',
        doctor: '/doctor/dashboard',
        admin: '/admin/dashboard',
      };
      
      return <Navigate to={roleRedirects[user.role] || '/'} replace />;
    }
  }

  // إذا كل شيء OK، اعرض المحتوى
  return <>{children}</>;
};
```

---

### 2️⃣ ملف: `src/context/AuthContext.jsx`
**التعديل:** تم تعطيل API call للتحقق من صلاحية الـ token

**الكود الأصلي في useEffect:**
```jsx
useEffect(() => {
  const initAuth = async () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        // التحقق من صلاحية الـ token
        const response = await authAPI.getCurrentUser();
        setUser(response.user);
      } catch (err) {
        // Token غير صالح، احذفه
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } else {
      // لو مش فيه token، تأكد إن مفيش user في localStorage
      localStorage.removeItem('user');
      setUser(null);
    }
    setLoading(false);
  };

  initAuth();
}, []);
```

---

### 3️⃣ ملف: `src/services/api.js`
**التعديل:** تم تعطيل auto-redirect عند 401 error

**الكود الأصلي في interceptor:**
```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // إذا كان unauthorized، احذف token وأعد توجيه للـ login
    // لكن استثني صفحات login و register
    const isAuthEndpoint = error.config?.url?.includes('/login') || 
                           error.config?.url?.includes('/register');
    
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);
```

---

## 🔧 خطوات الاستعادة (بعد الانتهاء من تطوير الفرونت إند):

### الخطوة 1: استعادة ProtectedRoute
افتح `src/Components/ProtectedRoute.jsx` وابحث عن:
```
// 🚫 TEMPORARILY DISABLED FOR FRONTEND DEVELOPMENT
```
احذف هذا الكومنت والكود المعطل، وارجع الكود الأصلي المذكور أعلاه.

---

### الخطوة 2: استعادة AuthContext
افتح `src/context/AuthContext.jsx` وابحث عن:
```
// 🚫 TEMPORARILY DISABLED - API validation
```
احذف الكومنتات وارجع API call:
```jsx
const response = await authAPI.getCurrentUser();
setUser(response.user);
```

---

### الخطوة 3: استعادة API interceptor
افتح `src/services/api.js` وابحث عن:
```
// 🚫 TEMPORARILY DISABLED - Auto redirect
```
احذف الكومنتات وارجع الـ redirect:
```javascript
if (error.response?.status === 401 && !isAuthEndpoint) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/auth';
}
```

---

### الخطوة 4: التحقق من Laravel Backend
تأكد من:
- ✅ تشغيل Laravel على `http://localhost:8000`
- ✅ تطبيق `LARAVEL_EMAIL_VERIFICATION_GUIDE.md`
- ✅ تطبيق `LARAVEL_PASSWORD_RESET_GUIDE.md`
- ✅ إعداد CORS في `config/cors.php`
- ✅ تشغيل `php artisan migrate`
- ✅ إعداد `.env` (MAIL_MAILER, FRONTEND_URL, etc.)

---

### الخطوة 5: اختبار التكامل
بعد استعادة الكود:
1. سجل دخول بحساب حقيقي
2. تأكد من عمل Protected Routes
3. اختبر Email Verification
4. اختبر Password Reset
5. تأكد من auto-redirect عند logout

---

## 📋 Checklist للاستعادة:

- [ ] استعادة ProtectedRoute authentication
- [ ] استعادة AuthContext API validation
- [ ] استعادة API interceptor redirect
- [ ] تشغيل Laravel Backend
- [ ] اختبار Login/Register
- [ ] اختبار Email Verification
- [ ] اختبار Password Reset
- [ ] اختبار Protected Routes
- [ ] حذف ملف `RESTORE_INSTRUCTIONS.md` هذا بعد الانتهاء

---

## 🎯 ملاحظات مهمة:

### عند الاستعادة:
- **لا تنسى** إزالة جميع الكومنتات المؤقتة
- **تأكد** من وجود Laravel Backend قبل الاختبار
- **راجع** ملفات الأدلة (LARAVEL_*_GUIDE.md)

### البحث السريع:
ابحث في المشروع عن:
- `🚫 TEMPORARILY DISABLED`
- `FRONTEND DEVELOPMENT`
- `RESTORE:`

---

## 💾 نسخة احتياطية من الكود الحالي (قبل التعطيل):

تم حفظ الكود الأصلي في هذا الملف أعلاه.
يمكنك الرجوع إليه عند الحاجة لاستعادة أي جزء.

---

**📅 تاريخ الإنشاء:** 23 فبراير 2026
**🎨 الهدف:** السماح بتطوير الفرونت إند بدون Backend
**⏰ مدة الاستعادة المتوقعة:** 10-15 دقيقة

---

**⚠️ تحذير:** لا تحذف هذا الملف حتى تنتهي من استعادة الكود بالكامل!
