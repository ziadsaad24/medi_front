# 🔐 Laravel Password Reset - دليل التطبيق

## 🎯 نظرة عامة
نظام إعادة تعيين كلمة المرور يتيح للمستخدمين استعادة حساباتهم عند نسيان كلمة المرور.

---

## 📋 الخطوات المطلوبة في Laravel Backend

### 1️⃣ التحقق من جدول password_resets

تأكد من وجود migration لجدول `password_resets` (يجب أن يكون موجود افتراضياً):

```php
// database/migrations/xxxx_create_password_resets_table.php
Schema::create('password_resets', function (Blueprint $table) {
    $table->string('email')->index();
    $table->string('token');
    $table->timestamp('created_at')->nullable();
});
```

إذا لم يكن موجوداً، نفذ:
```bash
php artisan migrate
```

---

### 2️⃣ إعداد Mail Configuration (نفس إعدادات Email Verification)

في `.env`:

**للاختبار السريع:**
```env
MAIL_MAILER=log
MAIL_FROM_ADDRESS="noreply@medicare.com"
MAIL_FROM_NAME="MediCare"
FRONTEND_URL=http://localhost:5173
```

**للإنتاج (Gmail مثلاً):**
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@medicare.com"
MAIL_FROM_NAME="MediCare"
FRONTEND_URL=http://localhost:5173
```

ثم:
```bash
php artisan config:clear
```

---

### 3️⃣ إنشاء Controller لإعادة تعيين كلمة المرور

#### أ. إنشاء PasswordResetController:

```bash
php artisan make:controller API/PasswordResetController
```

#### ب. محتوى الـ Controller:

```php
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class PasswordResetController extends Controller
{
    /**
     * إرسال رابط إعادة تعيين كلمة المرور
     */
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // التحقق من وجود الإيميل
        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            return response()->json([
                'message' => 'لا يوجد حساب مسجل بهذا البريد الإلكتروني'
            ], 404);
        }

        // إرسال رابط إعادة التعيين
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
            ], 200);
        }

        return response()->json([
            'message' => 'حدث خطأ في إرسال الرابط. حاول مرة أخرى.'
        ], 500);
    }

    /**
     * إعادة تعيين كلمة المرور
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'تم تحديث كلمة المرور بنجاح'
            ], 200);
        }

        return response()->json([
            'message' => 'فشل تحديث كلمة المرور. الرابط قد يكون منتهي الصلاحية.'
        ], 400);
    }
}
```

---

### 4️⃣ تخصيص رسالة الإيميل (اختياري)

#### أ. نشر template الإيميل:

```bash
php artisan vendor:publish --tag=laravel-mail
```

#### ب. إنشاء notification مخصص:

```bash
php artisan make:notification CustomResetPasswordNotification
```

#### ج. تخصيص الـ Notification:

```php
<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CustomResetPasswordNotification extends Notification
{
    use Queueable;

    public $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $resetUrl = env('FRONTEND_URL') . '/reset-password?token=' . $this->token . '&email=' . urlencode($notifiable->email);

        return (new MailMessage)
            ->subject('🔐 إعادة تعيين كلمة المرور - MediCare')
            ->greeting('مرحباً ' . $notifiable->name . '!')
            ->line('لقد تلقيت هذه الرسالة لأنك طلبت إعادة تعيين كلمة المرور لحسابك.')
            ->action('إعادة تعيين كلمة المرور', $resetUrl)
            ->line('هذا الرابط سينتهي خلال :count دقيقة.', ['count' => config('auth.passwords.'.config('auth.defaults.passwords').'.expire')])
            ->line('إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة.')
            ->salutation('مع تحيات فريق MediCare');
    }
}
```

#### د. تحديث User Model:

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Notifications\CustomResetPasswordNotification;

class User extends Authenticatable
{
    // ... باقي الكود

    /**
     * إرسال notification مخصص لإعادة تعيين كلمة المرور
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new CustomResetPasswordNotification($token));
    }
}
```

---

### 5️⃣ إضافة Routes

في `routes/api.php`:

```php
use App\Http\Controllers\API\PasswordResetController;

// Password Reset Routes (خارج middleware لأنها public)
Route::post('/password/forgot', [PasswordResetController::class, 'forgotPassword']);
Route::post('/password/reset', [PasswordResetController::class, 'resetPassword']);
```

---

### 6️⃣ تحديث CORS (إذا لم يكن محدثاً)

في `config/cors.php`:

```php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
```

---

## 🔧 الإعدادات الاختيارية

### تغيير مدة صلاحية الرابط (افتراضياً 60 دقيقة)

في `config/auth.php`:

```php
'passwords' => [
    'users' => [
        'provider' => 'users',
        'table' => 'password_resets',
        'expire' => 60, // بالدقائق - غيّره حسب الحاجة
        'throttle' => 60, // منع إعادة الإرسال قبل 60 ثانية
    ],
],
```

---

## 🧪 الاختبار

### 1. إرسال طلب Forget Password:

```bash
curl -X POST http://localhost:8000/api/password/forgot \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@example.com"}'
```

### 2. التحقق من الإيميل:

**إذا استخدمت MAIL_MAILER=log:**
```bash
cat storage/logs/laravel.log | grep "reset-password"
```

ستجد رابط مثل:
```
http://localhost:5173/reset-password?token=xxxxx&email=patient@example.com
```

### 3. فتح الرابط في المتصفح وإدخال كلمة المرور الجديدة

### 4. التحقق من تحديث كلمة المرور:
حاول تسجيل الدخول بكلمة المرور الجديدة.

---

## ✅ Checklist

- [ ] جدول `password_resets` موجود
- [ ] إعداد `MAIL_MAILER` و `FRONTEND_URL` في `.env`
- [ ] إنشاء `PasswordResetController`
- [ ] (اختياري) تخصيص `CustomResetPasswordNotification`
- [ ] تحديث `User Model` بـ `sendPasswordResetNotification`
- [ ] إضافة routes في `api.php`
- [ ] تحديث CORS settings
- [ ] اختبار النظام

---

## 📝 ملاحظات هامة

### الأمان:
- ✅ الروابط منتهية الصلاحية (60 دقيقة افتراضياً)
- ✅ Token يُستخدم مرة واحدة فقط
- ✅ Rate limiting (throttle) لمنع abuse
- ✅ التحقق من وجود الإيميل قبل الإرسال

### الإنتاج:
- 🔹 استخدم Queue لإرسال الإيميلات (منعاً للتأخير)
- 🔹 استخدم HTTPS للـ FRONTEND_URL
- 🔹 راجع إعدادات SMTP

---

## 🚀 التكامل مع React

الـ React Frontend جاهز بالفعل! الصفحات:
- `/forgot-password` - إدخال الإيميل
- `/reset-password?token=xxx&email=xxx` - إدخال كلمة المرور الجديدة

فقط طبّق الخطوات في Laravel وكل شيء سيعمل! 🎉

---

## 🐛 حل المشاكل

### الإيميل لا يُرسَل:
```bash
php artisan config:clear
php artisan cache:clear
# تحقق من Laravel logs
tail -f storage/logs/laravel.log
```

### "Token mismatch" error:
- تأكد من تطابق البيانات المرسلة (email, token)
- تحقق من انتهاء صلاحية الرابط

### CORS errors:
- تأكد من `FRONTEND_URL` في `.env`
- راجع `config/cors.php`
