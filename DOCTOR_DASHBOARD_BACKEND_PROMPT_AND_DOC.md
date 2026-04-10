# Doctor Dashboard Backend Prompt And Documentation

## 0) Doctor Flow Logic Review (Frontend Snapshot - Apr 2026)

Current implemented doctor flow in frontend (already wired structurally, still using mock/state data):
- Doctor login allowed only if account is active.
- Entry route is role-aware through /home and redirects doctor to /doctor/dashboard.
- Requests page allows approve/reject booking requests.
- After approval, doctor can immediately start consultation.
- Consultation opens New Medical Record page with appointment context.
- Saving medical record marks appointment as completed and moves it to patient records archive tab.
- Dashboard and appointments pages show only actionable appointments (approved and in_progress).
- Patients page has two tabs: current patients and previous consultation records archive.

Important implementation alignment notes for backend:
- Appointment status in_progress is actively used by frontend between approved and completed.
- Booking approval must return appointment linkage for immediate consultation start.
- Frontend profile-completion popup is temporarily disabled; backend middleware enforcement is mandatory and is the source of truth.
- Clinical consultation screen expects patient snapshot fields before writing record.
- Doctor logout flow is now explicit and should invalidate session/token server-side.

## 1) Ready Prompt To Send Backend Team

Please implement the full backend for Doctor Dashboard features in the Medicare project.

Important scope note:
- Authentication is already complete and should not be redesigned.
- Focus only on doctor dashboard domain features and contracts.

Required outcome:
- Production-ready APIs for doctor profile, completion enforcement, dashboard metrics, appointments, booking requests, patients list, working hours, and notifications.
- Production-ready APIs for doctor-authored clinical records and prescriptions after accepted bookings, with integration into patient QR emergency card data.
- Clean validation, permission checks, consistent error responses, and pagination.
- Laravel-friendly implementation with controllers, form requests, resources, middleware, and migrations.

Business rules:
1. Doctor can log in if account is active.
2. If doctor profile is incomplete, allow access only to profile-related endpoints and logout.
3. Any other doctor dashboard endpoint must return profile incomplete error with missing fields list.
4. Patient email verification logic stays as-is and must not be changed.
5. Doctor can create new medical record and prescription for a patient only when there is an accepted appointment context.
6. Doctor must receive critical patient profile snapshot in consultation context: age, blood type, allergies, chronic diseases, and emergency contact details.
7. Doctor-authored records and patient-uploaded records must be unified in the QR emergency card feed used by the future backend integration of demo-emergency-card route.

Deliverables:
1. Migrations and schema updates.
2. API routes under doctor namespace.
3. Controllers and service layer logic.
4. FormRequest validations.
5. API Resources for response shaping.
6. Middleware for profile completion enforcement.
7. OpenAPI-like contract notes or equivalent endpoint documentation.
8. Test coverage for core flows and edge cases.
9. Clinical record and prescription flow coverage with accepted appointment authorization checks.

Definition of done:
- Frontend can remove all doctor dashboard mock data and work fully from API.
- Incomplete doctor cannot use dashboard pages except profile completion flows.
- All endpoints return predictable JSON structure and error codes.


## 2) Implementation Documentation

## 2.1 Scope

In scope:
- Doctor profile read and update
- Doctor avatar upload
- Change password
- Profile completion status and missing fields
- Dashboard overview counters
- Doctor appointments list and status update
- Booking requests list and accept/reject
- Doctor patients list with search/filter/pagination
- Working hours and slots
- Notifications count/list/read
- Patient clinical snapshot for doctor consultation context
- Doctor medical record authoring after accepted booking
- Prescription authoring and optional prescription file upload
- Unified emergency QR data source from both patient and doctor records

Out of scope:
- Rebuilding auth flow
- Changing patient auth rules
- Reworking admin dashboard domain


## 2.2 API Response Standard

Success response shape:
- success: true
- message: optional human-readable message
- data: payload object or array
- meta: optional pagination or extra metadata

Error response shape:
- success: false
- code: machine-readable code
- message: human-readable message
- errors: validation detail map when applicable

Recommended codes:
- PROFILE_INCOMPLETE
- DOCTOR_NOT_ACTIVE
- FORBIDDEN_ROLE
- VALIDATION_ERROR
- APPOINTMENT_NOT_FOUND
- REQUEST_NOT_FOUND
- WORKING_HOURS_INVALID_SLOT
- APPOINTMENT_CONTEXT_REQUIRED
- PATIENT_NOT_ASSIGNED_TO_DOCTOR
- MEDICAL_RECORD_NOT_FOUND
- PRESCRIPTION_UPLOAD_INVALID


## 2.3 Database Changes

### A) doctor_profiles table

Columns:
- id
- user_id unique fk users.id
- specialization nullable string
- avatar_url nullable string
- address nullable string
- clinic_name nullable string
- license_number nullable string
- years_experience nullable unsigned integer
- bio nullable text
- consultation_fee nullable decimal(10,2)
- created_at
- updated_at

### B) doctor_working_hours table

Columns:
- id
- doctor_id fk users.id
- day_of_week tinyint 0..6
- enabled boolean default true
- created_at
- updated_at

Unique:
- unique on doctor_id + day_of_week

### C) doctor_working_hour_slots table

Columns:
- id
- working_hour_id fk doctor_working_hours.id
- start_time time
- end_time time
- created_at
- updated_at

### D) appointments table adjustments if needed

Minimum columns needed for doctor dashboard:
- id
- doctor_id
- patient_id
- appointment_date date
- appointment_time time
- type enum new,followup
- reason text nullable
- status enum pending,approved,in_progress,rejected,completed,cancelled
- rejection_reason nullable text
- created_at
- updated_at

### E) notifications table if not present

Columns:
- id
- user_id
- type string
- title string
- body text
- meta json nullable
- read_at timestamp nullable
- created_at
- updated_at

### F) medical_records table

Purpose:
- Unified storage for patient-uploaded and doctor-authored records.

Columns:
- id
- patient_id fk users.id
- doctor_id nullable fk users.id
- appointment_id nullable fk appointments.id
- source_type enum patient_upload,doctor_note
- visit_date date nullable
- chief_complaint nullable text
- clinical_notes nullable text
- diagnosis nullable text
- instructions nullable text
- attachment_url nullable string
- attachment_mime nullable string
- attachment_size nullable integer
- created_at
- updated_at

### G) prescriptions table

Columns:
- id
- medical_record_id fk medical_records.id
- patient_id fk users.id
- doctor_id fk users.id
- appointment_id nullable fk appointments.id
- prescription_date datetime
- follow_up_date nullable date
- notes nullable text
- attachment_url nullable string
- attachment_mime nullable string
- attachment_size nullable integer
- created_at
- updated_at

### H) prescription_items table

Columns:
- id
- prescription_id fk prescriptions.id
- medication_name string
- dosage string nullable
- frequency string nullable
- duration string nullable
- route string nullable
- instructions nullable text
- created_at
- updated_at


## 2.4 Profile Completion Definition

Required fields for complete doctor profile:
- full name
- phone
- email
- specialization
- profile image avatar
- address
- clinic name
- license number
- years experience
- about bio
- consultation fee

Computed fields to return:
- is_profile_complete boolean
- completion_percent integer 0..100
- missing_fields array of field keys

Consultation snapshot fields to return for doctor before writing a record:
- patient_age
- blood_type
- allergies
- chronic_diseases
- emergency_contact_name
- emergency_contact_phone


## 2.5 Middleware: EnsureDoctorProfileCompleted

Apply to doctor routes except:
- GET /doctor/profile
- PUT /doctor/profile
- POST /doctor/profile/avatar
- POST /doctor/change-password
- GET /doctor/completion-status
- POST /logout
- GET /me

Behavior:
- If doctor profile incomplete:
  - Return 403
  - code PROFILE_INCOMPLETE
  - include missing_fields and completion_percent


## 2.6 Endpoints Contract

Base prefix:
- /api/doctor

### 1) GET /doctor/profile

Purpose:
- Read current doctor profile and completion metadata

Response data object:
- id
- fullName
- email
- phone
- specialization
- profileImage
- address
- clinicName
- licenseNumber
- experience
- about
- consultationFee
- isProfileComplete
- completionPercent
- missingFields

### 2) PUT /doctor/profile

Purpose:
- Update doctor profile fields except password

Body:
- fullName string required
- email string required email
- phone string required
- specialization string optional or required by business rule
- address string
- clinicName string
- licenseNumber string
- experience integer min 0
- about string
- consultationFee numeric min 0

Response:
- updated profile object + completion metadata

### 3) POST /doctor/profile/avatar

Purpose:
- Upload avatar image

Request:
- multipart form-data
- avatar file required image max size based on policy

Response:
- profileImage URL
- completion metadata

### 4) GET /doctor/completion-status

Purpose:
- Quick endpoint for completion checks

Response data:
- isProfileComplete
- completionPercent
- missingFields

### 5) POST /doctor/change-password

Body:
- current_password required
- new_password required min 8 confirmed

Rules:
- Verify current password
- Hash and save new password

Response:
- success message

### 6) GET /doctor/dashboard/overview

Purpose:
- Dashboard cards and today preview

Query optional:
- date defaults today

Response data:
- todayAppointmentsCount
- upcomingAppointmentsCount
- activePatientsCount
- totalAppointmentsCount
- todayAppointments array with:
  - id
  - patientName
  - time
  - type
  - status

### 7) GET /doctor/appointments

Purpose:
- Doctor appointments listing

Query:
- date optional
- from optional date
- to optional date
- status optional
- page optional
- per_page optional

Response:
- paginated list

Appointment item:
- id
- patientId
- patientName
- patientPhone
- date
- time
- type new or followup
- reason
- status
- rejectionReason

### 8) PATCH /doctor/appointments/{id}/status

Body:
- status required one of approved,in_progress,rejected,completed,cancelled
- rejectionReason required only when rejected

Response:
- updated appointment

Allowed transition recommendation:
- pending -> approved or rejected
- approved -> in_progress or cancelled
- in_progress -> completed or cancelled

### 9) GET /doctor/booking-requests

Purpose:
- List new booking requests

Query:
- status defaults pending
- page
- per_page

Response item:
- id
- patientName
- patientId
- phone
- requestedDate
- requestedTime
- reason
- status pending,approved,rejected
- avatarInitials optional

### 10) POST /doctor/booking-requests/{id}/approve

Response:
- updated request with status approved
- linkedAppointmentId required for frontend quick-start consultation button
- appointment object recommended if your flow auto-creates appointment

### 11) POST /doctor/booking-requests/{id}/reject

Body optional:
- reason

Response:
- updated request with status rejected

### 12) GET /doctor/patients

Purpose:
- Patients table and grid source

Query:
- search optional
- status optional values active,needs_follow_up
- page optional
- per_page optional
- sort optional

Response item:
- id
- name
- patientId
- age
- phone
- lastVisit
- status active or needs_follow_up
- avatarUrl optional
- avatarInitials optional
- canCreateMedicalRecord boolean
- allowedAppointmentId nullable when canCreateMedicalRecord true

### 13) GET /doctor/working-hours

Response:
- days array:
  - dayOfWeek number 0..6
  - enabled boolean
  - slots array of start,end

### 14) PUT /doctor/working-hours

Body:
- days array with dayOfWeek, enabled, slots

Validation:
- no overlapping slots in same day
- each slot start before end
- no duplicate day entries

Response:
- normalized saved schedule

### 15) GET /doctor/notifications/unread-count

Response data:
- unreadCount integer

### 16) GET /doctor/notifications

Query:
- unread optional boolean
- page
- per_page

Response item:
- id
- type
- title
- body
- meta
- readAt
- createdAt

### 17) PATCH /doctor/notifications/{id}/read

Response:
- notification with readAt set

### 18) PATCH /doctor/notifications/read-all

Response:
- updatedCount

### 19) GET /doctor/patients/{patientId}/clinical-summary

Purpose:
- Return critical medical snapshot from patient profile for consultation.

Authorization:
- Doctor must have accepted appointment relation with this patient in allowed time window.

Response data:
- patientId
- fullName
- age
- gender optional
- bloodType
- allergies
- chronicDiseases
- currentMedications optional
- emergencyContactName
- emergencyContactPhone
- lastVisitDate optional
- lastDoctorRecordSummary optional
- canCreateMedicalRecord boolean
- allowedAppointmentId nullable

### 20) GET /doctor/patients/{patientId}/medical-records

Purpose:
- List patient medical records visible to this doctor.

Query:
- source_type optional patient_upload,doctor_note
- page
- per_page

Response item:
- id
- sourceType
- visitDate
- diagnosis
- summary
- attachmentUrl
- doctorName optional
- createdAt

### 21) POST /doctor/patients/{patientId}/medical-records

Purpose:
- Create doctor-authored medical record.

Authorization:
- Accepted appointment context required.

Body:
- appointmentId required
- visitDate required date
- chiefComplaint optional string
- clinicalNotes required string
- diagnosis optional string
- instructions optional string
- attachment optional file or url by policy

Response:
- created medical record object

### 22) POST /doctor/medical-records/{recordId}/prescription

Purpose:
- Attach prescription to doctor-created medical record.

Body:
- prescriptionDate required datetime
- followUpDate optional date
- notes optional string
- items required array min 1
  - medicationName required
  - dosage optional
  - frequency optional
  - duration optional
  - route optional
  - instructions optional

Optional multipart attachment:
- prescription file image or pdf

Response:
- prescription object with items

### 23) GET /doctor/medical-records/{recordId}

Purpose:
- Return full record details with prescription if exists.

Response:
- medicalRecord
- prescription optional
- prescriptionItems optional

### 24) GET /doctor/medical-records/archive

Purpose:
- Archive feed for doctor completed consultations across all patients (used in patients page records tab).

Query:
- search optional (patientName, patientId, diagnosis)
- page
- per_page

Response item:
- id
- appointmentId
- patientId
- patientName
- visitDate
- diagnosis
- notes
- medicationsCount
- createdAt


## 2.6.1 Emergency QR Integration Contract

Purpose:
- Ensure emergency card QR consumes unified records from both patient and doctor sources.

Recommended endpoint:
- GET /patient/emergency-card/qr-data

Data composition:
- patient_identity basic safe fields
- emergency_fields blood type, allergies, chronic diseases, emergency contact
- recent_medical_records mixed list from source_type patient_upload and doctor_note
- recent_prescriptions with medication items and follow-up date

Security:
- Public QR token must be signed and time-limited.
- Sensitive fields should be controlled by visibility policy.


## 2.7 Authorization Rules

- All endpoints above require authenticated user with doctor role.
- Non-doctor must receive 403 FORBIDDEN_ROLE.
- Doctor status must be active.
- Incomplete profile restriction applies through middleware as defined.
- Clinical-summary and doctor-record creation require doctor-patient relationship via accepted appointment or explicit assignment.


## 2.8 Validation Rules Summary

Profile:
- email unique in users except current user
- phone format by local policy
- consultationFee numeric and non-negative
- experience integer and non-negative

Avatar:
- image mime types jpg,jpeg,png,webp
- max size configurable

Working hours:
- dayOfWeek in range 0..6
- slots array may be empty when enabled false
- each slot has valid HH:MM

Appointments status update:
- reject requires reason
- cannot move from cancelled to approved unless business allows
- enforce state machine transitions including in_progress

Clinical record and prescription:
- medical record creation requires appointmentId in accepted status
- doctor can only create records for assigned patient under accepted context
- prescription items array must contain at least one medication
- uploaded files allowed mime types: jpg,jpeg,png,pdf
- enforce max file size by policy


## 2.9 Suggested Laravel Structure

- app/Http/Controllers/Api/Doctor/ProfileController
- app/Http/Controllers/Api/Doctor/DashboardController
- app/Http/Controllers/Api/Doctor/AppointmentController
- app/Http/Controllers/Api/Doctor/BookingRequestController
- app/Http/Controllers/Api/Doctor/PatientController
- app/Http/Controllers/Api/Doctor/WorkingHoursController
- app/Http/Controllers/Api/Doctor/NotificationController
- app/Http/Middleware/EnsureDoctorProfileCompleted
- app/Http/Requests/Doctor/... FormRequests
- app/Http/Resources/Doctor/... Resources


## 2.10 Testing Checklist

Functional:
1. Active doctor with complete profile can use all doctor APIs.
2. Active doctor with incomplete profile can only access allowed profile endpoints.
3. Incomplete doctor gets PROFILE_INCOMPLETE on restricted endpoints.
4. Dashboard overview returns correct counters.
5. Appointment status updates persist and validate transitions.
6. Booking request approve and reject work correctly.
7. Working hours reject overlapping slots.
8. Notifications unread count updates after read operations.
9. Doctor cannot create medical record without accepted appointment context.
10. Doctor can create medical record and prescription after accepted booking.
11. Clinical summary endpoint returns age, blood type, allergies, chronic diseases, and emergency contact correctly.
12. Emergency QR payload includes both patient-uploaded and doctor-authored records.

Security:
1. Non-doctor blocked from doctor routes.
2. Doctor cannot access another doctor private data by ID tampering.
3. File upload validation enforced.
4. QR token access is signed and limited by expiry policy.

Performance:
1. Patients and appointments are paginated.
2. Dashboard endpoint avoids N+1 queries.


## 2.11 Frontend Mapping Reference

Current frontend expects these doctor dashboard pages:
- /doctor/dashboard
- /doctor/patients
- /doctor/settings
- /doctor/requests
- /doctor/profile
- /doctor/medical-records/new

Profile completion UX behavior expected by frontend:
- Doctor can login and reach dashboard route.
- Frontend forced popup is temporarily disabled during current development cycle.
- Backend must enforce PROFILE_INCOMPLETE on restricted endpoints and return missingFields/completionPercent.
- Frontend will depend on backend completion-status/profile metadata to drive final UX behavior.


## 2.12 Handover Notes For Backend Team

Please deliver with:
1. Route list
2. Final request and response examples for each endpoint
3. Error codes list
4. Migration files list
5. Seeder notes for local testing
6. Postman collection or equivalent
7. Clinical record and prescription flow examples end-to-end from booking approve to QR payload

Once backend is ready, frontend will replace doctor mock data and wire all calls to production APIs.

## 2.13 Validated Implemented Routes (From Backend)

Confirmed implemented route structure from backend:
- Route group middleware: role:doctor, doctor.active
- Prefix: /api/doctor
- Secondary restricted middleware for dashboard domain: doctor.profile.completed

Confirmed endpoints exposed outside doctor.profile.completed (available while profile incomplete):
- GET /doctor/profile
- PUT /doctor/profile
- POST /doctor/profile/avatar
- GET /doctor/completion-status
- POST /doctor/change-password

Confirmed restricted endpoints under doctor.profile.completed:
- GET /doctor/dashboard/overview
- GET /doctor/appointments
- PATCH /doctor/appointments/{id}/status
- GET /doctor/booking-requests
- POST /doctor/booking-requests/{id}/approve
- POST /doctor/booking-requests/{id}/reject
- GET /doctor/patients
- GET /doctor/patients/{patientId}/clinical-summary
- GET /doctor/patients/{patientId}/medical-records
- GET /doctor/working-hours
- PUT /doctor/working-hours
- GET /doctor/notifications/unread-count
- GET /doctor/notifications
- PATCH /doctor/notifications/read-all
- PATCH /doctor/notifications/{id}/read
- POST /doctor/patients/{patientId}/medical-records
- POST /doctor/medical-records/{recordId}/prescription
- GET /doctor/medical-records/archive
- GET /doctor/medical-records/{recordId}

Implementation alignment result:
- Route map is fully aligned with this contract and frontend integration prompt.
- doctor.profile.completed middleware placement matches required PROFILE_INCOMPLETE flow.
- Medical record archive endpoint exists and supports patients archive tab integration.
- Notification endpoints and read-all/read-one paths are aligned.

Implementation caveat to keep in frontend integration:
- Keep parsing standard error body for PROFILE_INCOMPLETE:
  - success: false
  - code: PROFILE_INCOMPLETE
  - errors.missing_fields
  - errors.completion_percent

