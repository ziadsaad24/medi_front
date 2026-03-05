# 🏥 دليل إعداد Backend للـ Admin Dashboard - Laravel

## 📋 جدول المحتويات
1. [إعداد المشروع الأساسي](#1-إعداد-المشروع-الأساسي)
2. [إعداد قاعدة البيانات](#2-إعداد-قاعدة-البيانات)
3. [إنشاء Models والعلاقات](#3-إنشاء-models-والعلاقات)
4. [إعداد Authentication](#4-إعداد-authentication)
5. [إنشاء Controllers](#5-إنشاء-controllers)
6. [إعداد Routes](#6-إعداد-routes)
7. [تفعيل CORS](#7-تفعيل-cors)
8. [اختبار الـ API](#8-اختبار-الـ-api)

---

## 1. إعداد المشروع الأساسي

### تثبيت Laravel (إذا لم يكن موجود)
```bash
composer create-project laravel/laravel medicare-backend
cd medicare-backend
```

### تثبيت Laravel Sanctum
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### تعديل ملف `.env`
```env
APP_NAME=Medicare
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=medicare
DB_USERNAME=root
DB_PASSWORD=

FRONTEND_URL=http://localhost:5173

# Mail Settings (اختياري للـ Email Verification)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=noreply@medicare.com
MAIL_FROM_NAME="${APP_NAME}"
```

---

## 2. إعداد قاعدة البيانات

### إنشاء Migration للجدول `users`
```bash
php artisan make:migration create_users_table
```

**ملف**: `database/migrations/xxxx_create_users_table.php`
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('password');
            $table->enum('role', ['patient', 'doctor', 'admin'])->default('patient');
            $table->enum('status', ['pending', 'active', 'rejected', 'suspended'])->default('pending');
            $table->string('specialization')->nullable(); // للأطباء فقط
            $table->string('license_file')->nullable(); // ملف الترخيص
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};
```

### إنشاء Migration لجدول `activity_logs`
```bash
php artisan make:migration create_activity_logs_table
```

**ملف**: `database/migrations/xxxx_create_activity_logs_table.php`
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // user_registered, doctor_approved, etc.
            $table->string('title');
            $table->text('description');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('activity_logs');
    }
};
```

### تشغيل المهاجرات
```bash
php artisan migrate
```

---

## 3. إنشاء Models والعلاقات

### تعديل Model `User`
**ملف**: `app/Models/User.php`
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'status',
        'specialization',
        'license_file',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Helper Methods
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isDoctor()
    {
        return $this->role === 'doctor';
    }

    public function isPatient()
    {
        return $this->role === 'patient';
    }

    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isActive()
    {
        return $this->status === 'active';
    }

    // للأطباء فقط: رابط ملف الترخيص
    public function getLicenseUrlAttribute()
    {
        return $this->license_file 
            ? url('storage/licenses/' . $this->license_file)
            : null;
    }
}
```

### إنشاء Model `ActivityLog`
```bash
php artisan make:model ActivityLog
```

**ملف**: `app/Models/ActivityLog.php`
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'title',
        'description',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Helper لإنشاء نشاط جديد
    public static function log($type, $title, $description, $userId = null)
    {
        return self::create([
            'type' => $type,
            'title' => $title,
            'description' => $description,
            'user_id' => $userId,
        ]);
    }
}
```

---

## 4. إعداد Authentication

### إنشاء AuthController
```bash
php artisan make:controller Api/AuthController
```

**ملف**: `app/Http/Controllers/Api/AuthController.php`
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    // تسجيل مستخدم جديد
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:patient,doctor',
            'specialization' => 'required_if:role,doctor|nullable|string',
            'license_file' => 'required_if:role,doctor|nullable|file|mimes:pdf|max:10240', // 10MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'فشل التحقق من البيانات',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only(['name', 'email', 'phone', 'role', 'specialization']);
        $data['password'] = Hash::make($request->password);

        // المرضى active مباشرة، الأطباء pending للمراجعة
        $data['status'] = $request->role === 'patient' ? 'active' : 'pending';

        // رفع ملف الترخيص للأطباء
        if ($request->hasFile('license_file')) {
            $file = $request->file('license_file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('public/licenses', $filename);
            $data['license_file'] = $filename;
        }

        $user = User::create($data);

        // تسجيل النشاط
        ActivityLog::log(
            'user_registered',
            'مستخدم جديد',
            "{$user->name} انضم للمنصة",
            $user->id
        );

        // إنشاء Token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => $request->role === 'doctor' 
                ? 'تم إرسال طلبك بنجاح، سيتم مراجعته من قبل الإدارة' 
                : 'تم التسجيل بنجاح',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    // تسجيل الدخول
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'فشل التحقق من البيانات',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            ], 401);
        }

        // التحقق من حالة المستخدم
        if ($user->status === 'pending' && $user->role === 'doctor') {
            return response()->json([
                'success' => false,
                'message' => 'حسابك قيد المراجعة، يرجى الانتظار'
            ], 403);
        }

        if ($user->status === 'rejected') {
            return response()->json([
                'success' => false,
                'message' => 'تم رفض طلبك'
            ], 403);
        }

        if ($user->status === 'suspended') {
            return response()->json([
                'success' => false,
                'message' => 'تم تعليق حسابك'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الدخول بنجاح',
            'user' => $user,
            'token' => $token,
        ]);
    }

    // تسجيل الخروج
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الخروج بنجاح'
        ]);
    }

    // الحصول على بيانات المستخدم الحالي
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    }
}
```

---

## 5. إنشاء Controllers

### إنشاء AdminController
```bash
php artisan make:controller Api/Admin/AdminController
```

**ملف**: `app/Http/Controllers/Api/Admin/AdminController.php`
```php
<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    // احصائيات Dashboard
    public function getDashboardStats()
    {
        $stats = [
            'totalUsers' => User::where('role', '!=', 'admin')->count(),
            'totalDoctors' => User::where('role', 'doctor')
                ->where('status', 'active')
                ->count(),
            'pendingDoctors' => User::where('role', 'doctor')
                ->where('status', 'pending')
                ->count(),
            'activeUsers' => User::where('status', 'active')->count(),
            'totalAppointments' => 0, // إضافة عند عمل جدول المواعيد
            'todayAppointments' => 0,
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    // عرض الأطباء المعلقين
    public function getPendingDoctors()
    {
        $doctors = User::where('role', 'doctor')
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($doctor) {
                return [
                    'id' => $doctor->id,
                    'name' => $doctor->name,
                    'email' => $doctor->email,
                    'phone' => $doctor->phone,
                    'specialty' => $doctor->specialization,
                    'license' => $doctor->license_file,
                    'license_url' => $doctor->license_url,
                    'submitted_at' => $doctor->created_at->toISOString(),
                    'status' => $doctor->status,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $doctors
        ]);
    }

    // قبول طبيب
    public function approveDoctor($id)
    {
        $doctor = User::where('role', 'doctor')->findOrFail($id);

        if ($doctor->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'هذا الطلب تمت معالجته مسبقاً'
            ], 400);
        }

        $doctor->update(['status' => 'active']);

        // تسجيل النشاط
        ActivityLog::log(
            'doctor_approved',
            'قبول طبيب',
            "تم قبول د. {$doctor->name}",
            $doctor->id
        );

        // TODO: إرسال بريد إلكتروني للطبيب
        // Mail::to($doctor->email)->send(new DoctorApprovedMail($doctor));

        return response()->json([
            'success' => true,
            'message' => 'تم قبول الطبيب بنجاح'
        ]);
    }

    // رفض طبيب
    public function rejectDoctor(Request $request, $id)
    {
        $doctor = User::where('role', 'doctor')->findOrFail($id);

        if ($doctor->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'هذا الطلب تمت معالجته مسبقاً'
            ], 400);
        }

        $doctor->update(['status' => 'rejected']);

        // تسجيل النشاط
        ActivityLog::log(
            'doctor_rejected',
            'رفض طلب',
            "تم رفض طلب د. {$doctor->name}",
            $doctor->id
        );

        // TODO: إرسال بريد إلكتروني للطبيب مع السبب
        $reason = $request->input('reason', 'لم يتم توضيح السبب');
        // Mail::to($doctor->email)->send(new DoctorRejectedMail($doctor, $reason));

        return response()->json([
            'success' => true,
            'message' => 'تم رفض الطلب بنجاح'
        ]);
    }

    // عرض جميع المستخدمين
    public function getAllUsers(Request $request)
    {
        $query = User::where('role', '!=', 'admin');

        // فلترة حسب الدور
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        // فلترة حسب الحالة
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // بحث
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    // عرض جميع الأطباء
    public function getAllDoctors(Request $request)
    {
        $query = User::where('role', 'doctor');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $doctors = $query->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $doctors
        ]);
    }

    // حذف مستخدم
    public function deleteUser($id)
    {
        $user = User::where('role', '!=', 'admin')->findOrFail($id);
        $userName = $user->name;
        $user->delete();

        ActivityLog::log(
            'user_deleted',
            'حذف مستخدم',
            "تم حذف المستخدم {$userName}"
        );

        return response()->json([
            'success' => true,
            'message' => 'تم حذف المستخدم بنجاح'
        ]);
    }

    // تبديل حالة المستخدم (تعليق/تفعيل)
    public function toggleUserStatus($id)
    {
        $user = User::where('role', '!=', 'admin')->findOrFail($id);

        $newStatus = $user->status === 'active' ? 'suspended' : 'active';
        $user->update(['status' => $newStatus]);

        return response()->json([
            'success' => true,
            'message' => $newStatus === 'active' ? 'تم تفعيل المستخدم' : 'تم تعليق المستخدم',
            'status' => $newStatus
        ]);
    }

    // عرض سجل الأنشطة
    public function getActivityLogs(Request $request)
    {
        $limit = $request->input('limit', 6);

        $activities = ActivityLog::with('user')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'type' => $activity->type,
                    'title' => $activity->title,
                    'description' => $activity->description,
                    'time' => $activity->created_at->diffForHumans(),
                    'created_at' => $activity->created_at->toISOString(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $activities
        ]);
    }
}
```

---

## 6. إعداد Routes

### إنشاء Middleware للتحقق من Role
```bash
php artisan make:middleware CheckRole
```

**ملف**: `app/Http/Middleware/CheckRole.php`
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'غير مصرح لك'
            ], 401);
        }

        if (!in_array($request->user()->role, $roles)) {
            return response()->json([
                'success' => false,
                'message' => 'ليس لديك صلاحية للوصول'
            ], 403);
        }

        return $next($request);
    }
}
```

### تسجيل Middleware
**ملف**: `app/Http/Kernel.php`
```php
protected $middlewareAliases = [
    // ... existing middleware
    'role' => \App\Http\Middleware\CheckRole::class,
];
```

### إعداد API Routes
**ملف**: `routes/api.php`
```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Admin\AdminController;

/*
|--------------------------------------------------------------------------
| Authentication Routes (Public)
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Require Authentication)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth Routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    /*
    |--------------------------------------------------------------------------
    | Admin Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        
        // Dashboard
        Route::get('/dashboard/stats', [AdminController::class, 'getDashboardStats']);
        
        // Doctor Management
        Route::get('/doctors/pending', [AdminController::class, 'getPendingDoctors']);
        Route::post('/doctors/{id}/approve', [AdminController::class, 'approveDoctor']);
        Route::post('/doctors/{id}/reject', [AdminController::class, 'rejectDoctor']);
        Route::get('/doctors', [AdminController::class, 'getAllDoctors']);
        
        // User Management
        Route::get('/users', [AdminController::class, 'getAllUsers']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        Route::post('/users/{id}/toggle-status', [AdminController::class, 'toggleUserStatus']);
        
        // Activity Logs
        Route::get('/activity-logs', [AdminController::class, 'getActivityLogs']);
        
        // TODO: Add more routes
        // Route::get('/complaints', [AdminController::class, 'getComplaints']);
        // Route::get('/reports', [AdminController::class, 'getReports']);
    });

    /*
    |--------------------------------------------------------------------------
    | Doctor Routes (لاحقاً)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:doctor')->prefix('doctor')->group(function () {
        // TODO: Add doctor routes
    });

    /*
    |--------------------------------------------------------------------------
    | Patient Routes (لاحقاً)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:patient')->prefix('patient')->group(function () {
        // TODO: Add patient routes
    });
});
```

---

## 7. تفعيل CORS

### تعديل ملف `config/cors.php`
```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:5173',  // Vite dev server
        'http://localhost:3000',  // إضافي
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

### التأكد من تفعيل CORS في `app/Http/Kernel.php`
```php
protected $middleware = [
    // ...
    \Illuminate\Http\Middleware\HandleCors::class,
    // ...
];
```

---

## 8. اختبار الـ API

### إنشاء Admin User للاختبار

**الطريقة 1: باستخدام Tinker**
```bash
php artisan tinker
```
```php
use App\Models\User;
use Illuminate\Support\Facades\Hash;

User::create([
    'name' => 'Admin',
    'email' => 'admin@medicare.com',
    'password' => Hash::make('password123'),
    'role' => 'admin',
    'status' => 'active',
]);
```

**الطريقة 2: إنشاء Seeder**
```bash
php artisan make:seeder AdminSeeder
```

**ملف**: `database/seeders/AdminSeeder.php`
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Admin Medicare',
            'email' => 'admin@medicare.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'status' => 'active',
        ]);
    }
}
```

تشغيل Seeder:
```bash
php artisan db:seed --class=AdminSeeder
```

### تشغيل السيرفر
```bash
php artisan serve
```

### اختبار الـ API باستخدام Postman أو Thunder Client

#### 1. تسجيل دخول Admin
```http
POST http://localhost:8000/api/login
Content-Type: application/json

{
    "email": "admin@medicare.com",
    "password": "admin123"
}
```

**Response:**
```json
{
    "success": true,
    "message": "تم تسجيل الدخول بنجاح",
    "user": {...},
    "token": "1|xxxxxxxxxxxx"
}
```

احفظ الـ `token` لاستخدامه في باقي الـ requests.

#### 2. احصائيات Dashboard
```http
GET http://localhost:8000/api/admin/dashboard/stats
Authorization: Bearer {YOUR_TOKEN}
```

#### 3. عرض طلبات الأطباء المعلقة
```http
GET http://localhost:8000/api/admin/doctors/pending
Authorization: Bearer {YOUR_TOKEN}
```

#### 4. قبول طبيب
```http
POST http://localhost:8000/api/admin/doctors/1/approve
Authorization: Bearer {YOUR_TOKEN}
```

#### 5. رفض طبيب
```http
POST http://localhost:8000/api/admin/doctors/2/reject
Authorization: Bearer {YOUR_TOKEN}
Content-Type: application/json

{
    "reason": "الترخيص غير واضح"
}
```

---

## 9. إنشاء Storage Link (لرفع الملفات)

لكي تعمل روابط الملفات بشكل صحيح:
```bash
php artisan storage:link
```

هذا ينشئ symbolic link من `public/storage` إلى `storage/app/public`.

---

## 10. نصائح إضافية

### تفعيل Error Logging
في `.env`:
```env
APP_DEBUG=true
LOG_CHANNEL=stack
LOG_LEVEL=debug
```

### حماية Routes إضافية
يمكنك إضافة Rate Limiting:

**ملف**: `app/Providers/RouteServiceProvider.php`
```php
protected function configureRateLimiting()
{
    RateLimiter::for('api', function (Request $request) {
        return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
    });
}
```

### Queue للإيميلات (اختياري)
```bash
composer require laravel/horizon
php artisan horizon:install
```

---

## 🎯 خطوات الاستخدام النهائية

### 1. شغل الـ Backend
```bash
cd medicare-backend
php artisan serve
```

### 2. شغل الـ Frontend
```bash
cd medicare
npm run dev
```

### 3. سجل دخول كـ Admin
- Email: `admin@medicare.com`
- Password: `admin123`

### 4. اختبر Dashboard
افتح `http://localhost:5173/admin/dashboard`

---

## 📞 استكشاف الأخطاء

### مشكلة CORS
تأكد من:
- إضافة `http://localhost:5173` في `config/cors.php`
- تفعيل `HandleCors` middleware

### مشكلة 401 Unauthorized
تأكد من:
- إرسال Token في Header بصيغة: `Authorization: Bearer {token}`
- Token صحيح ولم تنتهي صلاحيته

### مشكلة 403 Forbidden
- تأكد أن المستخدم له role `admin`

### ملفات الترخيص لا تظهر
```bash
php artisan storage:link
```

---

## 🚀 Next Steps

بعد إتمام الخطوات السابقة، يمكنك:

1. ✅ إضافة Email Notifications (قبول/رفض الأطباء)
2. ✅ إضافة جدول Appointments
3. ✅ إضافة Complaints System
4. ✅ إضافة Reports & Analytics
5. ✅ إضافة Doctor Profile Management

---

**تم إنشاء هذا الدليل بواسطة GitHub Copilot 🤖**
