# Laravel Backend Documentation: Medications + Patient Profile

هذا الملف يحدد بالترتيب ما يجب تنفيذه في Laravel Backend حتى يتكامل مع الفرونت الحالي في المشروع.

## 1) الهدف

تنفيذ وحدتين أساسيتين:
- إدارة ملف المريض (Profile)
- إدارة الأدوية (Medications)

مع تجهيز تنبيهات قريبة للمواعيد والأدوية بنفس المنطق الحالي في الواجهة.

## 2) توافق البيانات مع الفرونت الحالي

### Profile fields المطلوبة في الفرونت
من صفحة [src/Pages/PatientProfile.jsx](src/Pages/PatientProfile.jsx):
- name
- email
- phone
- birth_date
- address
- blood_type
- emergency_contact
- emergency_name
- allergies
- chronic_diseases
- height
- weight

### Medications fields المطلوبة في الفرونت
من [src/hooks/use-medications.ts](src/hooks/use-medications.ts):
- id (string/uuid)
- name
- dosage
- time (HH:mm)
- frequency
- taken (boolean)
- color (optional; للعرض فقط)

## 3) Database Design

## 3.1 جدول profiles (أفضل من تكديس users)

```php
Schema::create('patient_profiles', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
    $table->date('birth_date')->nullable();
    $table->string('address')->nullable();
    $table->string('blood_type', 5)->nullable();
    $table->string('emergency_contact', 30)->nullable();
    $table->string('emergency_name')->nullable();
    $table->text('allergies')->nullable();
    $table->text('chronic_diseases')->nullable();
    $table->decimal('height', 5, 2)->nullable();
    $table->decimal('weight', 5, 2)->nullable();
    $table->timestamps();
});
```

## 3.2 جدول medications

```php
Schema::create('medications', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('name');
    $table->string('dosage');
    $table->time('time');
    $table->string('frequency')->default('مرة يومياً');
    $table->boolean('taken')->default(false);
    $table->string('color')->nullable();
    $table->timestamps();

    $table->index(['user_id', 'time']);
});
```

## 4) Models & Relations

## 4.1 User model

```php
public function profile()
{
    return $this->hasOne(PatientProfile::class);
}

public function medications()
{
    return $this->hasMany(Medication::class);
}
```

## 4.2 PatientProfile model

```php
class PatientProfile extends Model
{
    protected $fillable = [
        'user_id',
        'birth_date',
        'address',
        'blood_type',
        'emergency_contact',
        'emergency_name',
        'allergies',
        'chronic_diseases',
        'height',
        'weight',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

## 4.3 Medication model

```php
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Medication extends Model
{
    use HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'user_id',
        'name',
        'dosage',
        'time',
        'frequency',
        'taken',
        'color',
    ];

    protected $casts = [
        'taken' => 'boolean',
        'time' => 'datetime:H:i',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

## 5) API Endpoints (بالترتيب)

كل endpoints تحت middleware:
- auth:sanctum
- verified (اختياري حسب سياسة المشروع)
- role:patient (لو عندك middleware للأدوار)

## 5.1 Profile APIs

### GET /api/patient/profile
يرجع بيانات المستخدم + profile.

Response shape مقترح:
```json
{
  "success": true,
  "data": {
    "id": 15,
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "01012345678",
    "birth_date": "1995-05-15",
    "address": "القاهرة",
    "blood_type": "A+",
    "emergency_contact": "01098765432",
    "emergency_name": "محمد علي (الأخ)",
    "allergies": "حساسية من البنسلين",
    "chronic_diseases": "",
    "height": "175",
    "weight": "75"
  }
}
```

### PUT /api/patient/profile
يحدث بيانات user + profile في Transaction.

Validation:
- name: required|string|max:255
- email: required|email|unique:users,email,{userId}
- phone: nullable|string|max:30
- birth_date: nullable|date|before:today
- address: nullable|string|max:500
- blood_type: nullable|in:A+,A-,B+,B-,AB+,AB-,O+,O-
- emergency_contact: nullable|string|max:30
- emergency_name: nullable|string|max:255
- allergies: nullable|string
- chronic_diseases: nullable|string
- height: nullable|numeric|min:30|max:300
- weight: nullable|numeric|min:1|max:500

## 5.2 Medications APIs

### GET /api/patient/medications
يرجع أدوية المستخدم الحالي.

### POST /api/patient/medications
ينشئ دواء جديد.

Validation:
- name: required|string|max:255
- dosage: required|string|max:255
- time: required|date_format:H:i
- frequency: required|string|max:100
- taken: sometimes|boolean
- color: nullable|string|max:50

### PUT /api/patient/medications/{id}
تعديل دواء.

### PATCH /api/patient/medications/{id}/toggle
تبديل taken true/false.

### DELETE /api/patient/medications/{id}
حذف دواء.

مهم: كل queries يجب تكون مقيدة بالمستخدم:
```php
Medication::where('user_id', auth()->id())
```

## 5.3 Notifications API (اختياري لكن موصى به)

### GET /api/patient/notifications/upcoming
يرجع تنبيهات:
- دواء خلال 180 دقيقة
- موعد مؤكد خلال 24 ساعة

Response shape:
```json
{
  "success": true,
  "data": [
    {
      "id": "med-uuid",
      "type": "medication",
      "priority": "urgent",
      "title": "ميعاد دواء قريب",
      "message": "Panadol - قرص",
      "meta": "بعد 25 دقيقة",
      "route": "/medications",
      "due_at": "2026-04-02T18:30:00+02:00"
    }
  ]
}
```

## 6) Controllers المطلوبة

- PatientProfileController
  - show()
  - update(Request $request)

- MedicationController
  - index()
  - store(Request $request)
  - update(Request $request, string $id)
  - toggle(string $id)
  - destroy(string $id)

- NotificationController (اختياري)
  - upcoming()

## 7) Routes (routes/api.php)

```php
Route::middleware(['auth:sanctum'])->prefix('patient')->group(function () {
    Route::get('/profile', [PatientProfileController::class, 'show']);
    Route::put('/profile', [PatientProfileController::class, 'update']);

    Route::get('/medications', [MedicationController::class, 'index']);
    Route::post('/medications', [MedicationController::class, 'store']);
    Route::put('/medications/{id}', [MedicationController::class, 'update']);
    Route::patch('/medications/{id}/toggle', [MedicationController::class, 'toggle']);
    Route::delete('/medications/{id}', [MedicationController::class, 'destroy']);

    Route::get('/notifications/upcoming', [NotificationController::class, 'upcoming']);
});
```

## 8) Frontend Integration المطلوب بعد Backend

في [src/services/api.js](src/services/api.js) أضف:

- patientAPI.getProfile()
- patientAPI.updateProfile(data)
- patientAPI.getMedications()
- patientAPI.addMedication(data)
- patientAPI.updateMedication(id, data)
- patientAPI.toggleMedication(id)
- patientAPI.deleteMedication(id)
- patientAPI.getUpcomingNotifications()

## 9) Acceptance Checklist

Backend جاهز عندما:
- Profile fetch/update يعمل بدون أخطاء
- Medications CRUD يعمل لكل مستخدم بشكل معزول
- Validation واضحة برسائل مفهومة
- Unauthorized requests ترجع 401
- User لا يستطيع تعديل دواء User آخر (403/404)
- Notifications API ترجع بيانات مرتبة حسب الأقرب

## 10) ترتيب التنفيذ الموصى به

1. migrations + models + relations
2. Profile controller + routes + test
3. Medications controller + routes + test
4. Notifications endpoint
5. Resource classes لتوحيد response shape
6. ربط frontend بالـ APIs بدل localStorage

## 11) ملاحظات مهمة

- اضبط timezone في Laravel على `Africa/Cairo` إذا هذا سياق المشروع.
- استخدم DB Transaction داخل update profile.
- لا ترجع stack traces في production.
- استخدم Form Request classes لvalidation (أفضل من وضعها في controller).

## 12) هل لازم يشوف كود الفرونت؟

نعم، لازم يشوف ملفات محددة من الفرونت قبل تنفيذ الـ backend حتى نتجنب أخطاء mismatch في أسماء الحقول أو شكل البيانات أو الـ routes.

### الملفات المرجعية المطلوبة

- [src/Pages/PatientProfile.jsx](src/Pages/PatientProfile.jsx)
  - يحدد حقول البروفايل المطلوبة فعليًا.
  - يوضح أسماء المفاتيح التي يتوقعها الفرونت من الـ API.

- [src/hooks/use-medications.ts](src/hooks/use-medications.ts)
  - يوضح شكل بيانات الأدوية.
  - يحدد الحقول الإلزامية مثل `name`, `dosage`, `time`, `frequency`, `taken`.

- [src/services/api.js](src/services/api.js)
  - يوضح شكل الـ endpoints الحالية وطريقة استدعائها.
  - مهم جدًا للتأكد أن Laravel سيرجع responses متوافقة مع ما ينتظره الفرونت.

### ليه ده مهم؟

- يمنع اختلاف أسماء الحقول بين Laravel والفرونت.
- يمنع مشاكل التاريخ والوقت خصوصًا في التنبيهات.
- يمنع رجوع payload غير متوقع يكسر الـ UI.
- يساعدنا نثبت contract واضح من البداية بدل إصلاحات متكررة لاحقًا.

### الخلاصة العملية

قبل كتابة Controllers وRequests في Laravel، لازم يراجع:
1. شكل بيانات `PatientProfile`.
2. شكل بيانات `Medications`.
3. طريقة عرض التنبيهات في الـ Navbar.
4. طريقة استهلاك الـ API في `api.js`.

---

إذا أردت، الخطوة التالية أعمل لك implementation skeleton جاهز داخل Laravel نفسه (Controllers + Requests + Routes + Resources) بنفس أسماء الملفات.
