# 📧 Laravel Email Verification - دليل التطبيق الكامل

## 🎯 نظرة عامة
سيتم إضافة نظام Email Verification للمرضى (Patients) فقط. الأطباء سيستمرون بنظام الموافقة الإدارية.

---

## 📋 الخطوات المطلوبة في Laravel Backend

### 1️⃣ التحقق من وجود `email_verified_at` في جدول Users

افتح migration الخاص بـ users وتأكد من وجود:

```php
$table->timestamp('email_verified_at')->nullable();
```

إذا لم يكن موجوداً، أنشئ migration جديدة:

```bash
php artisan make:migration add_email_verified_at_to_users_table
```

```php
public function up()
{
    Schema::table('users', function (Blueprint $table) {
        $table->timestamp('email_verified_at')->nullable()->after('email');
    });
}

public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn('email_verified_at');
    });
}
```

ثم نفذ:
```bash
php artisan migrate
```

---

### 2️⃣ تحديث User Model

افتح `app/Models/User.php` وأضف `MustVerifyEmail`:

```php
<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'specialization',
        'license_file',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];
}
```

---

### 3️⃣ إعداد Mail Configuration

#### أ. افتح `.env` وأضف إعدادات البريد:

**⚡ للاختبار السريع (بدون إرسال إيميلات حقيقية):**
```env
MAIL_MAILER=log
MAIL_FROM_ADDRESS="noreply@medicare.com"
MAIL_FROM_NAME="MediCare"
```
> ✅ **استخدم هذا أولاً!** الإيميلات ستُحفظ في `storage/logs/laravel.log` فقط، ولن يحدث تأخير.

---

**للاختبار المحلي (Mailtrap مجاني):**
```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@medicare.com"
MAIL_FROM_NAME="${APP_NAME}"
```

**أو Gmail (للإنتاج):**
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@medicare.com"
MAIL_FROM_NAME="MediCare"
```

> 💡 **للحصول على App Password من Gmail:**
> 1. اذهب إلى Google Account → Security
> 2. فعّل 2-Step Verification
> 3. اذهب إلى App Passwords وأنشئ password جديد

#### ب. أضف URL الخاص بـ Frontend:

```env
FRONTEND_URL=http://localhost:5173
```

#### ج. **إذا واجهت مشكلة loading عند التسجيل:**

بعد تغيير `.env`، **يجب** تنفيذ هذه الأوامر:

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

ثم أعد تشغيل Laravel server:
```bash
php artisan serve
```

> ⚠️ **مهم:** Laravel يحفظ config في cache. أي تغيير في `.env` يحتاج `config:clear`

---

### 4️⃣ تحديث AuthController

افتح `app/Http/Controllers/AuthController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:patient,doctor',
            'specialization' => 'required_if:role,doctor|string|max:255',
            'license_file' => 'required_if:role,doctor|file|mimes:pdf|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only(['name', 'email', 'phone', 'password', 'role', 'specialization']);
        $data['password'] = Hash::make($request->password);

        // Handle file upload for doctors
        if ($request->role === 'doctor' && $request->hasFile('license_file')) {
            $file = $request->file('license_file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('licenses', $filename, 'public');
            $data['license_file'] = $filename;
            $data['is_active'] = false; // الأطباء يحتاجون موافقة
        } else {
            $data['is_active'] = true; // المرضى مفعلين تلقائياً من ناحية is_active
        }

        $user = User::create($data);

        // إطلاق حدث Registered لإرسال إيميل التحقق للمرضى فقط
        if ($user->role === 'patient') {
            event(new Registered($user));
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['البريد الإلكتروني أو كلمة المرور غير صحيحة'],
            ]);
        }

        // لا نمنع تسجيل الدخول بناءً على email_verified_at
        // سنتعامل مع هذا في Frontend

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Get current user
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    /**
     * Resend verification email
     */
    public function resendVerificationEmail(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'البريد الإلكتروني مفعل بالفعل'
            ], 400);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'تم إعادة إرسال رسالة التحقق بنجاح'
        ]);
    }
}
```

---

### 5️⃣ إضافة Routes للتحقق من الإيميل

افتح `routes/api.php` وأضف:

```php
<?php

use App\Http\Controllers\AuthController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Email verification routes
    Route::post('/email/resend', [AuthController::class, 'resendVerificationEmail']);
    
    // Patient routes
    Route::middleware('role:patient')->prefix('patient')->group(function () {
        // ... patient routes
    });
    
    // Doctor routes
    Route::middleware('role:doctor')->prefix('doctor')->group(function () {
        // ... doctor routes
    });
    
    // Admin routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        // ... admin routes
    });
});

// Email verification route (outside middleware because it needs special handling)
Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    
    // إعادة توجيه لـ Frontend مع رسالة نجاح
    return redirect(env('FRONTEND_URL') . '/verify-email?success=true');
})->middleware(['signed'])->name('verification.verify');

// ملاحظة: تم إزالة 'auth:sanctum' middleware لأن المستخدم قد لا يكون مسجل دخول عند الضغط على رابط الإيميل
```

---

### 6️⃣ تخصيص رسالة Email Verification (اختياري)

إذا كنت تريد رسالة بريد مخصصة:

```bash
php artisan vendor:publish --tag=laravel-notifications
```

ثم أنشئ Notification مخصصة:

```bash
php artisan make:notification CustomVerifyEmailNotification
```

في `app/Notifications/CustomVerifyEmailNotification.php`:

```php
<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

class CustomVerifyEmailNotification extends VerifyEmail
{
    public function toMail($notifiable)
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('تفعيل حساب MediCare')
            ->greeting('مرحباً ' . $notifiable->name . '!')
            ->line('شكراً لتسجيلك في MediCare. يرجى الضغط على الزر أدناه لتفعيل حسابك.')
            ->action('تفعيل الحساب', $verificationUrl)
            ->line('إذا لم تقم بإنشاء هذا الحساب، يرجى تجاهل هذه الرسالة.')
            ->salutation('مع تحيات فريق MediCare');
    }
}
```

ثم في `User.php`:

```php
use App\Notifications\CustomVerifyEmailNotification;

public function sendEmailVerificationNotification()
{
    $this->notify(new CustomVerifyEmailNotification);
}
```

---

### 7️⃣ تحديث CORS

تأكد من أن `config/cors.php` يسمح بـ Frontend URL:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie', 'email/verify/*'],

'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],

'supports_credentials' => true,
```

---

## 🧪 اختبار النظام

### 1. تسجيل مريض جديد (Postman/Insomnia):

```http
POST http://localhost:8000/api/register
Content-Type: application/json

{
  "name": "أحمد محمد",
  "email": "ahmed@test.com",
  "phone": "01234567890",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "patient"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "أحمد محمد",
    "email": "ahmed@test.com",
    "email_verified_at": null,
    "role": "patient",
    "is_active": true
  },
  "token": "..."
}
```

### 2. تحقق من Mailtrap/Gmail:
- يجب أن تستلم إيميل تحقق
- اضغط على الرابط - سيوجهك لـ React `/verify-email`

### 3. تسجيل دخول قبل التحقق:
```http
POST http://localhost:8000/api/login

{
  "email": "ahmed@test.com",
  "password": "password123"
}
```

**Response:** سيعود `email_verified_at: null`

في React، سيتم توجيهه لـ `/pending-verification`

---

## 📌 ملاحظات مهمة

### 1. **الأطباء:**
- لا يحتاجون email verification
- يحتاجون موافقة Admin فقط (`is_active`)
- عملية التسجيل الخاصة بهم لم تتغير

### 2. **المرضى:**
- `is_active = true` دائماً
- يحتاجون `email_verified_at` للدخول للصفحات المحمية

### 3. **Security:**
- الـ verification URL موقع بـ Laravel signed URLs
- لا يمكن تزويره أو إعادة استخدامه

### 4. **UX:**
- المستخدم يمكنه تسجيل الدخول لكن سيُمنع من المحتوى المحمي
- يمكنه إعادة إرسال الإيميل من صفحة `/pending-verification`

---

## ✅ Checklist النهائي

- [ ] إضافة `email_verified_at` column
- [ ] تطبيق `MustVerifyEmail` في User Model
- [ ] إعداد Mail configuration في `.env`
- [ ] إضافة `FRONTEND_URL` في `.env`
- [ ] تحديث AuthController
- [ ] إضافة email verification routes
- [ ] اختبار إرسال البريد
- [ ] اختبار flow كامل (تسجيل → إيميل → تحقق → دخول)

---

## 🆘 استكشاف الأخطاء

### 1. **الإيميل لا يُرسل:**
```bash
php artisan queue:work  # إذا كنت تستخدم queues
php artisan config:clear
php artisan cache:clear
```

تحقق من `storage/logs/laravel.log`

### 2. **خطأ في signed URL:**
تأكد من `APP_KEY` في `.env`

### 3. **CORS errors:**
```bash
php artisan config:clear
```

تأكد من `config/cors.php` صحيح

---

## 🎉 انتهى!

بعد تطبيق هذه الخطوات، سيكون لديك نظام Email Verification كامل ومتكامل مع React Frontend!

**عند أي مشكلة، راجع Laravel logs:**
```bash
tail -f storage/logs/laravel.log
```
