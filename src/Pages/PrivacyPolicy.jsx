import React from 'react';
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Layout/Footer';

const sections = [
  {
    title: '1) البيانات التي نقوم بجمعها',
    items: [
      'بيانات الحساب مثل الاسم والبريد الإلكتروني ورقم الهاتف.',
      'بيانات الاستخدام مثل المواعيد والسجلات المرتبطة بخدمات المنصة.',
      'الرسائل والاستفسارات التي ترسلها عبر صفحة اتصل بنا أو قنوات الدعم.'
    ]
  },
  {
    title: '2) كيف نستخدم بياناتك',
    items: [
      'تقديم الخدمات الصحية الرقمية وإدارة الحساب والمواعيد.',
      'تحسين جودة المنصة وتجربة المستخدم ودعم العمليات التشغيلية.',
      'إرسال إشعارات مهمة متعلقة بالحساب أو المواعيد أو الأمان.'
    ]
  },
  {
    title: '3) مشاركة البيانات',
    items: [
      'لا يتم بيع بياناتك الشخصية لأي طرف ثالث.',
      'قد تتم مشاركة البيانات بالقدر اللازم مع مقدمي الرعاية أو مزودي الخدمة التقنيين لتشغيل الخدمة.',
      'قد نشارك بيانات عند وجود التزام قانوني أو أمر رسمي ملزم.'
    ]
  },
  {
    title: '4) حماية البيانات',
    items: [
      'نطبق إجراءات تقنية وتنظيمية مناسبة لحماية بياناتك من الوصول غير المصرح أو التعديل أو الفقدان.',
      'يتم تقييد الوصول إلى البيانات على الموظفين المخولين فقط بحسب الحاجة.'
    ]
  },
  {
    title: '5) مدة الاحتفاظ بالبيانات',
    items: [
      'نحتفظ بالبيانات طالما كانت لازمة لتقديم الخدمة أو للوفاء بالالتزامات القانونية والتنظيمية.',
      'يمكن حذف أو إخفاء الهوية للبيانات عندما تنتفي الحاجة التشغيلية أو القانونية.'
    ]
  },
  {
    title: '6) حقوقك كمستخدم',
    items: [
      'طلب الوصول إلى بياناتك الشخصية.',
      'طلب تصحيح أو تحديث البيانات غير الدقيقة.',
      'طلب حذف البيانات في الحدود التي يسمح بها القانون.',
      'الاعتراض على بعض أنواع المعالجة أو سحب الموافقة حيث ينطبق ذلك.'
    ]
  },
  {
    title: '7) ملفات تعريف الارتباط (Cookies)',
    items: [
      'قد نستخدم ملفات تعريف الارتباط وتقنيات مشابهة لتحسين الأداء وتحليل الاستخدام.',
      'يمكنك التحكم في إعدادات الكوكيز من خلال إعدادات المتصفح لديك.'
    ]
  },
  {
    title: '8) تحديثات هذه السياسة',
    items: [
      'قد يتم تحديث هذه السياسة من وقت لآخر لمواكبة التغييرات القانونية أو التشغيلية.',
      'يُعتبر استمرارك في استخدام المنصة بعد التحديث موافقة على النسخة الأحدث من السياسة.'
    ]
  },
  {
    title: '9) التواصل معنا',
    items: [
      'لأي استفسار بخصوص الخصوصية أو طلب متعلق ببياناتك، يمكنك التواصل عبر:',
      'support@medicare.com',
      '+201208596604',
      'الموقع الرئيسي: المنصوره'
    ]
  }
];

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen theme-page" dir="rtl">
        <main className="max-w-[1100px] mx-auto px-4 md:px-8 pt-32 pb-20">
          <div className="theme-surface rounded-3xl p-6 md:p-10 shadow-xl border border-white/20">
            <h1 className="text-3xl md:text-5xl font-black theme-title mb-4">سياسة الخصوصية</h1>
            <p className="theme-text-muted text-sm md:text-base leading-8 mb-8">
              نحن في MediCare نلتزم بحماية خصوصيتك والحفاظ على سرية بياناتك الشخصية والطبية.
              توضح هذه الصفحة أنواع البيانات التي نجمعها، وكيفية استخدامها، وحقوقك المتعلقة بها.
            </p>

            <div className="space-y-8">
              {sections.map((section) => (
                <section key={section.title} className="rounded-2xl border border-[#0f427d]/10 p-5 md:p-6 bg-white/30 dark:bg-white/5">
                  <h2 className="text-xl md:text-2xl font-extrabold theme-title mb-3">{section.title}</h2>
                  <ul className="space-y-2 text-sm md:text-base theme-text-muted leading-8">
                    {section.items.map((item) => (
                      <li key={item} className="pr-3 relative">
                        <span className="absolute right-0 top-3 h-1.5 w-1.5 rounded-full bg-[#008080]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <p className="mt-8 text-xs md:text-sm theme-text-muted font-bold">
              آخر تحديث: 12 أبريل 2026
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
