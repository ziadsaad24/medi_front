# Backend Documentation - Medical Records Storage + Patient Management + QR View-Only

## 1) الهدف من التنفيذ

المطلوب تنفيذ Backend يدعم حالتين واضحتين:

1. صفحة إدارة السجلات للمريض فقط
- المريض ينشئ سجل طبي جديد (ملف واحد + ملاحظات)
- المريض يشوف كل سجلاته
- المريض يحذف سجلاته

2. صفحة QR للعرض فقط
- أي شخص معه رابط QR يشوف السجل فقط
- لا يوجد أي تعديل أو حذف أو أزرار إدارة

## 2) قواعد العمل

- كل سجل طبي يخص مريض واحد فقط
- كل سجل طبي يحتوي على مرفق واحد فقط (Image أو PDF) + Notes اختيارية
- المريض فقط يقدر ينشئ/يعرض/يحذف سجلاته من صفحة الإدارة
- الطبيب يقدر ينشئ سجلًا للمريض بعد تأكيد الحجز (Doctor Entry)
- رابط QR يكون View-Only وليس Owner Mode
- لا يتم كشف السجل بالرقم الداخلي فقط في QR، بل عبر Token آمن

## 3) تصميم قاعدة البيانات المقترح

### 3.1 جدول medical_records

- id (bigint أو uuid)
- patient_id (fk -> users.id)
- doctor_id (fk -> users.id, nullable)
- appointment_id (fk -> appointments.id, nullable)
- source (enum: patient_upload, doctor_entry) default patient_upload
- notes (text, nullable)
- category (enum: prescription, xray, pdf, other) nullable
- created_at
- updated_at
- deleted_at (soft delete)

فهارس:
- index على patient_id + created_at desc
- index على doctor_id + created_at desc
- index على appointment_id

### 3.2 جدول medical_record_attachments

- id
- record_id (fk -> medical_records.id)
- original_name
- mime_type
- extension
- size_bytes
- storage_disk (local/s3)
- storage_path
- public_url (اختياري حسب استراتيجية التخزين)
- created_at

فهارس:
- unique(record_id) لضمان مرفق واحد لكل سجل

### 3.3 جدول medical_record_share_tokens

- id
- patient_id (fk -> users.id)
- token (unique, طويل وعشوائي)
- expires_at (nullable)
- revoked_at (nullable)
- created_at

فهارس:
- unique(token)
- unique(patient_id) // token فعال واحد لكل مريض

## 4) الصلاحيات المطلوبة

### 4.1 Patient Auth

- create record: مسموح
- list my records: مسموح
- show my record by id: مسموح لو owner فقط
- delete my record: مسموح فقط إذا كان source=patient_upload
- generate/revoke share token: مسموح على مستوى المريض

### 4.2 Doctor Auth

- create doctor entry for patient: مسموح بشرط وجود موعد confirmed بين الطبيب والمريض
- list doctor-created records (اختياري للدكتور): مسموح حسب الحاجة
- update/delete doctor entry: حسب سياسة المشروع (يفضل منع الحذف المباشر أو جعله soft delete مع audit)

شروط إلزامية:
- الطبيب لا ينشئ سجلًا إلا لو appointment.status = confirmed
- appointment يجب أن يخص نفس doctor_id الحالي ونفس patient_id الهدف

### 4.3 Public QR Access

- get patient medical timeline by token: مسموح (view only)
- create/update/delete: ممنوع

## 5) API Endpoints المطلوبة

## 5.1 Patient Management Endpoints (Auth: patient)

### POST /api/patient/medical-records

الغرض:
- إنشاء سجل جديد للمريض (ملف واحد + notes)

Content-Type:
- multipart/form-data

Request Fields:
- file (required, image/* أو application/pdf)
- notes (optional, string, max 5000)
- category (optional: prescription|xray|pdf|other)

Response 201:
- success: true
- data:
  - id
  - patient_id
  - notes
  - category
  - created_at
  - attachment:
    - original_name
    - mime_type
    - size_bytes
    - file_url
  - share:
    - token
    - qr_view_url

### GET /api/patient/medical-records?page=1&per_page=20

الغرض:
- عرض كل سجلات المريض الحالي (للصفحة الإدارية)

Response 200:
- success: true
- data: array of records (latest first)
- meta: pagination info

### GET /api/patient/medical-records/{recordId}

الغرض:
- عرض سجل محدد للمالك فقط

Response 200:
- success: true
- data: record + attachment + share token status

### DELETE /api/patient/medical-records/{recordId}

الغرض:
- حذف سجل المريض (Soft Delete مفضل)

Response 200:
- success: true
- message: deleted

ملاحظة سياسة حذف:
- إذا كان source=doctor_entry يجب إرجاع 403 مع code = FORBIDDEN_DELETE
- يفضل الاحتفاظ بسجل Audit في كل عمليات الحذف

### POST /api/patient/medical-records/share-token/rotate

الغرض:
- تدوير QR token الحالي للمريض (Patient-level token)

Request Body (optional):
- expires_in_days (nullable)

Response 200:
- success: true
- data:
  - token
  - qr_view_url
  - expires_at

### DELETE /api/patient/medical-records/share-token

الغرض:
- revoke للـ active token الحالي للمريض

Response 200:
- success: true

## 5.2 Public QR View Endpoint (No Auth)

### GET /api/public/patients/{token}/medical-records

الغرض:
- عرض صفحة السجل الطبي كاملة للمريض عبر QR token بوضع View-Only

Response 200:
- success: true
- mode: public_view
- can_manage: false
- data:
  - patient (basic summary)
  - records[] (patient_upload + doctor_entry)
  - pagination

أخطاء:
- 404 TOKEN_NOT_FOUND
- 410 TOKEN_INACTIVE

## 5.3 Doctor Entry Endpoints (Auth: doctor)

### POST /api/doctor/patients/{patientId}/medical-records

الغرض:
- إضافة سجل طبي للمريض بواسطة الطبيب بعد تأكيد الموعد

Content-Type:
- application/json (أو multipart/form-data إذا يوجد attachment)

Request Fields:
- appointmentId (required)  
- visitDate (optional: YYYY-MM-DD)
- chiefComplaint (optional)
- clinicalNotes (optional)
- diagnosis (optional)
- instructions (optional)
- attachment (optional: image/pdf)  

مهم جداً (توافق مع الفرونت الحالي):
- الفرونت الحالي في صفحة `NewMedicalRecordPage` يرسل camelCase بالأسماء أعلاه.
- يفضل أن يدعم الباك snake_case وcamelCase معًا في مرحلة الانتقال.

Validation Business Rules:
- appointmentId موجود
- appointment.patient_id = {patientId}
- appointment.doctor_id = current doctor
- appointment.status = confirmed

Response 201:
- success: true
- data:
  - id
  - patient_id
  - doctor_id
  - appointment_id
  - source: doctor_entry
  - chief_complaint
  - diagnosis
  - clinical_notes
  - instructions
  - visit_date
  - attachment (optional)
  - created_at

Example Request (JSON) مطابق للفرونت الحالي:
```json
{
  "appointmentId": "123",
  "visitDate": "2026-04-10",
  "chiefComplaint": "صداع مستمر",
  "clinicalNotes": "ضغط أعلى من الطبيعي",
  "diagnosis": "ارتفاع ضغط",
  "instructions": "تقليل الملح والمتابعة بعد أسبوع"
}
```

Example Response:
```json
{
  "success": true,
  "data": {
    "id": "MR-987",
    "patient_id": 44,
    "doctor_id": 12,
    "appointment_id": 123,
    "source": "doctor_entry",
    "chief_complaint": "صداع مستمر",
    "clinical_notes": "ضغط أعلى من الطبيعي",
    "diagnosis": "ارتفاع ضغط",
    "instructions": "تقليل الملح والمتابعة بعد أسبوع",
    "visit_date": "2026-04-10",
    "created_at": "2026-04-10T12:00:00Z"
  }
}
```

### POST /api/doctor/medical-records/{recordId}/prescription

الغرض:
- حفظ الروشتة/الأدوية بعد إنشاء السجل الطبي (Step 2 في نفس flow)

Request Fields مطابق للفرونت الحالي:
- prescriptionDate (required, ISO date-time)
- notes (optional)
- items (array)
  - medicationName
  - dosage
  - frequency
  - duration
  - instructions

Example Request:
```json
{
  "prescriptionDate": "2026-04-10T12:10:00.000Z",
  "notes": "تعليمات عامة",
  "items": [
    {
      "medicationName": "Concor 5mg",
      "dosage": "قرص",
      "frequency": "مرة يومياً",
      "duration": "30 يوم",
      "instructions": "بعد الإفطار"
    }
  ]
}
```

Response 201:
- success: true
- data:
  - record_id
  - prescription_id
  - items_count

### GET /api/doctor/medical-records?patient_id=&page=&per_page=

الغرض:
- استعراض السجلات التي أنشأها الطبيب (اختياري حسب الواجهة)

Response 200:
- success: true
- data: records
- meta: pagination

## 6) Validation Rules

- file required في create
- allowed mime types:
  - image/jpeg
  - image/png
  - image/webp
  - application/pdf
- max file size مثال: 10MB
- notes max length مثال: 5000
- category whitelist only
- في doctor entry: appointmentId (أو appointment_id) required + must be confirmed and belongs to doctor/patient
- في doctor entry: واحد على الأقل من الحقول الطبية التالية مطلوب: diagnosis أو clinicalNotes أو chiefComplaint أو medications
- في prescription endpoint: items يجب أن تحتوي عنصرًا واحدًا على الأقل إذا تم إرسالها
- في DELETE patient record: إذا source=doctor_entry => 403 FORBIDDEN_DELETE

## 7) Security

- لا تستخدم record id المباشر كرابط QR
- استخدم token عشوائي طويل (مثلا 40-64 chars)
- token قابل للإلغاء
- token يمكن أن يكون له expiration
- token على مستوى المريض (ليس على مستوى سجل واحد)
- جميع patient endpoints خلف auth:sanctum + role check
- جميع doctor entry endpoints خلف auth:sanctum + role=doctor + ownership checks
- سياسة owner check إلزامية على record access

## 8) Response Format موحد

يفضل توحيد الشكل:
- success
- message
- data
- meta
- errors

## 9) الربط المطلوب من الفرونت بعد تجهيز الباك

### 9.1 صفحة إدارة السجلات (المريض فقط)

تستخدم:
- POST /api/patient/medical-records
- GET /api/patient/medical-records
- DELETE /api/patient/medical-records/{id}
- POST /api/patient/medical-records/share-token/rotate
- DELETE /api/patient/medical-records/share-token

مع ملاحظة العرض:
- GET /api/patient/medical-records يجب يرجع السجلات بنوعيها:
  - source=patient_upload
  - source=doctor_entry
- عشان صفحة المريض تعرض كل السجل الطبي الموحد في timeline واحدة

### 9.2 إضافة الطبيب بعد قبول الحجز

تستخدم:
- POST /api/doctor/patients/{patientId}/medical-records
- POST /api/doctor/medical-records/{recordId}/prescription

الشاشة المتوقعة:
- بعد قبول الحجز ووقت الكشف، الدكتور يضيف chiefComplaint/clinicalNotes/diagnosis/instructions (+ مرفق اختياري)
- السجل يظهر مباشرة للمريض في صفحة السجلات

الـ flow الفعلي الحالي في الفرونت:
1. `startConsultation` -> تحديث حالة الموعد إلى `in_progress`
2. `completeConsultation` -> إنشاء السجل عبر `POST /doctor/patients/{patientId}/medical-records`
3. لو فيه أدوية -> إنشاء الروشتة عبر `POST /doctor/medical-records/{recordId}/prescription`
4. تحديث الموعد إلى `completed`
5. ظهور السجل للمريض في timeline

### 9.3 صفحة QR View

تستخدم:
- GET /api/public/patients/{token}/medical-records

ومهم:
- mode=public_view أو can_manage=false يعني إخفاء أي زر إدارة
- لذلك أزرار مثل إنشاء سجل جديد والعودة للرئيسية لا تظهر في وضع QR view

## 10) خطوات تنفيذ مختصرة للباك

1. إنشاء migrations للجداول الثلاثة
2. إنشاء Models + Relations
- MedicalRecord hasOne Attachment
- MedicalRecord hasMany ShareTokens
- User hasMany MedicalRecords
 - MedicalRecord belongsTo Doctor (User)
 - MedicalRecord belongsTo Appointment
3. إنشاء Form Requests للـ validation
4. إنشاء Controllers
- PatientMedicalRecordController
- DoctorMedicalRecordController
- PublicMedicalRecordController
5. إنشاء Policies للتحقق من الملكية
6. رفع الملفات عبر Storage وإرجاع file_url
7. إنشاء token service (generate/revoke/expire)
8. كتابة Feature Tests
- create/list/delete owner
- forbid non-owner
- public token view
- expired/revoked token behavior
- doctor create allowed only on confirmed appointment
- doctor create forbidden for pending/rejected or foreign appointment

## 11) ملاحظات مهمة قبل البدء

- لو مطلوب أن الطبيب ينشئ سجل للمريض أيضا، نضيف endpoint دكتور منفصل ويكتب source=doctor_entry
- لو التخزين النهائي S3، يفضل استخدام signed URLs للعرض بدل public_url المباشر
- يفضل logging لعمليات إنشاء/حذف السجل لأسباب تدقيقية

## 12) Laravel Routes (مطابقة لما أرسلته)

الـ routes التالية صحيحة ومطابقة للمواصفة:

```php
// Public (بدون auth)
Route::get('/public/patients/{token}/medical-records', [PublicMedicalRecordController::class, 'patientRecordsByToken']);

// Patient (داخل prefix + auth)
Route::get('/medical-records', [PatientMedicalRecordController::class, 'index']);
Route::post('/medical-records', [PatientMedicalRecordController::class, 'store']);
Route::get('/medical-records/{recordId}', [PatientMedicalRecordController::class, 'show'])->whereNumber('recordId');
Route::delete('/medical-records/{recordId}', [PatientMedicalRecordController::class, 'destroy'])->whereNumber('recordId');

Route::post('/medical-records/share-token/rotate', [PatientMedicalRecordController::class, 'rotateShareToken']);
Route::delete('/medical-records/share-token', [PatientMedicalRecordController::class, 'revokeShareToken']);
```

مهم: ضع هذه المجموعة داخل:
- `Route::prefix('patient')->middleware(['auth:sanctum', 'role:patient'])->group(...)`

ومسار الـ public يبقى خارج أي middleware auth.

### Routes ناقصة حتى يكون التنفيذ كامل 100%

```php
// Doctor (داخل prefix + auth)
Route::prefix('doctor')->middleware(['auth:sanctum', 'role:doctor'])->group(function () {
  Route::post('/patients/{patientId}/medical-records', [DoctorMedicalRecordController::class, 'storeForPatient'])
    ->whereNumber('patientId');

  Route::post('/medical-records/{recordId}/prescription', [DoctorMedicalRecordController::class, 'storePrescription'])
    ->whereNumber('recordId');

  Route::get('/medical-records', [DoctorMedicalRecordController::class, 'index']);
});
```

### Error Codes المتوقعة من Controllers

- `TOKEN_NOT_FOUND` -> HTTP 404
- `TOKEN_INACTIVE` -> HTTP 410
- `FORBIDDEN_DELETE` -> HTTP 403

---

هذه المواصفة كافية لبدء التنفيذ على Laravel مباشرة وربط الفرونت الحالي بدون تغيير كبير في UI.