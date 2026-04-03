# استخدام الأيقونات المحلية

## الأيقونات المتاحة

تم تنقل جميع الأيقونات من Figma إلى المشروع محلياً في: `src/assets/icons/`

### الأيقونات:
- **user-profile.svg** - أيقونة ملف الشخص
- **security.svg** - أيقونة الأمان (باللون الأحمر)
- **warning.svg** - أيقونة التحذير (باللون البرتقالي)
- **healthcare.svg** - أيقونة الرعاية الصحية (باللون الأبيض)
- **shield.svg** - أيقونة الحماية (باللون الأبيض)

## طريقة الاستخدام

### طريقة 1: استخدام Component مباشر

```jsx
import { Icon } from '../assets/icons';

export default function MyComponent() {
  return (
    <div>
      <Icon name="security" width={20} height={20} />
      <Icon name="warning" className="custom-class" />
      <Icon name="userProfile" alt="Profile Icon" />
    </div>
  );
}
```

### طريقة 2: استخدام الـ icons object مباشر

```jsx
import { icons } from '../assets/icons';

export default function EmergencyCard() {
  return (
    <img src={icons.security} alt="Security Icon" className="alert-icon" />
  );
}
```

## تحديث الأيقونات

إذا احتجت إلى إضافة أيقونات جديدة:

1. أضف ملف SVG في `src/assets/icons/`
2. حدّث `index.jsx` لاستيراد الأيقونة الجديدة:
   ```jsx
   import newIcon from '../assets/icons/new-icon.svg';
   export const icons = {
     ...existingIcons,
     newIcon,
   };
   ```

## الفوائد

✅ لا تحتاج اتصال انترنت لتحميل الأيقونات  
✅ أداء أسرع - الأيقونات محفوظة محلياً  
✅ تحكم كامل على الأيقونات والألوان  
✅ سهل التعديل والتخصيص
