# Patient-Doctor Booking Flow Backend Prompt (Implementation Contract)

## Goal
Implement backend APIs and business rules so that:
1. Any doctor appears in patient doctors list only after profile completion and activation.
2. Patient can book only when doctor has available schedule slots.
3. Booking starts as `pending` and appears in patient appointments + doctor booking requests.
4. Doctor approval changes booking to `confirmed` and creates a patient notification.
5. Doctor rejection changes booking to `rejected` and creates a patient notification.
6. Clinic location/address and schedule details are visible to patient.
7. Medical record tables/flow are out of scope for this task (later phase).

---

## Existing Frontend Payload (Must Be Supported)
Frontend currently sends booking request with:
- `doctor_id`
- `appointment_type`: `new` | `follow_up`
- `requested_date`: `YYYY-MM-DD`
- `requested_time`: `HH:mm`
- `reason`

Please accept these exact field names.

### Current Frontend Route Expectation (Laravel)
Patient routes under `/api/patient`:
- `GET /notifications` -> `NotificationController@index`
- `GET /doctors` -> `PatientBookingController@doctors`
- `GET /doctors/{doctorId}/availability` -> `PatientBookingController@availability`
- `POST /booking-requests` -> `PatientBookingController@store`
- `GET /appointments` -> `PatientBookingController@myAppointments`

Doctor routes under `/api/doctor`:
- `GET /booking-requests`
- `POST /booking-requests/{id}/approve`
- `POST /booking-requests/{id}/reject`

### Middleware Expectations
- Patient endpoints: `auth:sanctum` + `role:patient`.
- Doctor booking endpoints: `auth:sanctum` + `role:doctor` + `doctor.active`.

---

## Core Business Rules

### Doctor Visibility in Patient Doctors Page
A doctor is visible in patient list only if:
- `role = doctor`
- `is_active = true` (or equivalent active status)
- doctor profile is complete (`is_profile_complete = true`)

Returned doctor card must include:
- `id`
- `full_name`
- `specialization`
- `avatar_url`
- `clinic_name`
- `clinic_address`
- `consultation_fee`
- `years_experience`
- `rating` (optional)
- `can_book_now` (boolean)
- `unavailable_reason` (nullable string)

`can_book_now = false` if doctor has no available slots/schedule.

### Booking Creation
When patient sends booking request:
- Validate doctor is visible/bookable.
- Validate requested date/time is in future.
- Validate slot belongs to doctor working hours and is available.
- Create booking request with status = `pending`.
- Do not create medical record in this phase.

### Doctor Decision
Doctor can:
- Approve pending request -> status becomes `confirmed`.
- Reject pending request -> status becomes `rejected` with optional `reject_reason`.

On approve or reject:
- create patient notification.

On approve, doctor can optionally provide:
- `confirmed_date` (if adjusted from requested date)
- `confirmed_time` (if adjusted from requested time)
- `doctor_note` (short preparation note for patient)

### Patient Appointments Timeline
Patient appointments list should show:
- `pending` (new request waiting doctor decision)
- `confirmed` (doctor approved)
- `rejected` (doctor rejected)
- optional future statuses: `completed`, `cancelled` (not required now)

---

## API Endpoints Contract

### 1) Patient: Doctors List
`GET /api/patient/doctors`

Query (optional):
- `search`
- `specialization`
- `page`
- `per_page`

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 12,
      "full_name": "د. أحمد محمد",
      "specialization": "أخصائي باطنة",
      "avatar_url": "https://...",
      "clinic_name": "عيادة النور",
      "clinic_address": "القاهرة - مدينة نصر - شارع ...",
      "consultation_fee": 300,
      "years_experience": 10,
      "can_book_now": true,
      "unavailable_reason": null
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 50
  }
}
```

### 2) Patient: Doctor Availability
`GET /api/patient/doctors/{doctorId}/availability?date=YYYY-MM-DD`

Response:
```json
{
  "success": true,
  "data": {
    "doctor_id": 12,
    "date": "2026-04-12",
    "slots": [
      { "time": "10:00", "available": true },
      { "time": "10:30", "available": false },
      { "time": "11:00", "available": true }
    ]
  }
}
```

### 3) Patient: Create Booking Request
`POST /api/patient/booking-requests`

Body:
```json
{
  "doctor_id": 12,
  "appointment_type": "new",
  "requested_date": "2026-04-12",
  "requested_time": "10:00",
  "reason": "صداع مستمر"
}
```

Response:
```json
{
  "success": true,
  "message": "Booking request created",
  "data": {
    "id": 901,
    "doctor_id": 12,
    "patient_id": 77,
    "appointment_type": "new",
    "requested_date": "2026-04-12",
    "requested_time": "10:00",
    "reason": "صداع مستمر",
    "status": "pending",
    "created_at": "2026-04-10T10:00:00Z"
  }
}
```

Error examples:
- 409 `SLOT_NOT_AVAILABLE`
- 422 validation errors
- 403 `DOCTOR_NOT_BOOKABLE`

### 4) Patient: My Appointments / Requests
`GET /api/patient/appointments`

Response item should include:
- id
- doctor_name
- specialization
- clinic_name
- clinic_address
- appointment_type
- requested_date
- requested_time
- confirmed_date (nullable; fallback to requested_date)
- confirmed_time (nullable; fallback to requested_time)
- doctor_note (nullable)
- status (`pending|confirmed|rejected`)
- reject_reason (nullable)
- approved_at (nullable)

### 5) Doctor: Booking Requests List
`GET /api/doctor/booking-requests`

Must return pending requests at minimum, with:
- id
- patient_name
- patient_id
- patient_phone
- requested_date
- requested_time
- appointment_type
- reason
- status

### 6) Doctor: Approve Booking Request
`POST /api/doctor/booking-requests/{id}/approve`

Body (optional):
```json
{
  "confirmed_date": "2026-04-12",
  "confirmed_time": "10:30",
  "doctor_note": "يرجى الحضور قبل الموعد بـ15 دقيقة"
}
```

Behavior:
- only `pending` can be approved
- status -> `confirmed`
- reserve slot
- send notification to patient

Response:
```json
{
  "success": true,
  "message": "Request approved",
  "data": {
    "id": 901,
    "status": "confirmed",
    "approved_at": "2026-04-10T12:00:00Z"
  }
}
```

### 7) Doctor: Reject Booking Request
`POST /api/doctor/booking-requests/{id}/reject`

Body (optional):
```json
{ "reason": "الميعاد غير متاح" }
```

Behavior:
- only `pending` can be rejected
- status -> `rejected`
- send notification to patient

### 8) Patient Notifications
`GET /api/patient/notifications`

On approval create notification payload similar to:
- title: `تم تأكيد موعدك`
- body: `تم قبول طلب الحجز مع د. ... بتاريخ ... الساعة ...`
- type: `appointment_confirmed`

On rejection:
- title: `تم رفض طلب الحجز`
- body includes reject reason if provided
- type: `appointment_rejected`

---

## Database Design (Minimum)

### doctors / users enhancement
- `is_profile_complete` boolean
- `clinic_name` string
- `clinic_address` text
- `consultation_fee` decimal
- `years_experience` int
- `specialization` string
- `avatar_url` string nullable
- `is_active` boolean

### doctor_working_hours
- `id`
- `doctor_id`
- `day_of_week` (0-6)
- `is_enabled` bool
- `start_time`
- `end_time`
- unique (`doctor_id`, `day_of_week`)

### booking_requests (or appointments if unified)
- `id`
- `doctor_id`
- `patient_id`
- `appointment_type` enum(`new`,`follow_up`)
- `requested_date` date
- `requested_time` time
- `reason` text nullable
- `status` enum(`pending`,`confirmed`,`rejected`)
- `reject_reason` text nullable
- `approved_at` timestamp nullable
- timestamps
- unique index for conflict prevention (`doctor_id`, `requested_date`, `requested_time`, `status`) where status in active states

### notifications
- `id`
- `user_id`
- `title`
- `body`
- `type`
- `data` json nullable
- `is_read` bool default false
- timestamps

---

## Validation Rules

### Create Booking Request
- `doctor_id`: required, exists, doctor bookable
- `appointment_type`: required, in `new,follow_up`
- `requested_date`: required, date, today or future
- `requested_time`: required, format `H:i`
- `reason`: nullable|string|max:1000

### Approve/Reject
- request belongs to authenticated doctor
- request status must be `pending`

---

## Concurrency & Integrity
- Use DB transaction for approve/reject.
- Re-check slot availability inside transaction before approve.
- Return 409 conflict if slot consumed concurrently.

---

## Frontend Compatibility Notes
- Keep snake_case + camelCase tolerance if possible in response mapper period.
- Important fields frontend currently reads in doctor dashboard mapping:
  - `requested_date`
  - `requested_time`
  - `patient_name`
  - `patient_id`
  - `patient_phone`
  - `reason`
  - `status`
  - `linked_appointment_id` (after approve)
- Keep status values stable: `pending`, `confirmed`, `rejected`.
- If legacy value `approved` exists in old records, backend should map it to `confirmed` in API response.

Recommended final standard for consistency:
- Use `pending`, `confirmed`, `rejected` everywhere.

---

## Acceptance Criteria (Definition of Done)
1. Completed/active doctors only appear for patient booking.
2. Doctor without schedule appears but `can_book_now=false` and booking button disabled in frontend.
3. Patient booking creates `pending` request.
4. Pending request appears in doctor booking requests page.
5. Doctor approve changes patient status to `confirmed` and sends notification.
6. Doctor reject changes patient status to `rejected` and sends notification.
7. Patient appointment item shows clinic name/address + date/time + type + status + doctor note (if provided).
8. No medical record dependency in this phase.
9. Book button is disabled in patient doctors page when `can_book_now=false` and `unavailable_reason` is returned.

---

## Out of Scope (Now)
- Medical record schema and post-consultation clinical workflow.
- Payments.
- Video/online meetings.

---

## Implementation Priority
1. Doctor visibility + `can_book_now`
2. Patient booking request create/list
3. Doctor approve/reject
4. Notifications
5. Polishing response format
