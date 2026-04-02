import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import Login from './Pages/Login';
import RoleSelection from './Pages/RoleSelection';
import AuthPage from './Pages/AuthPage';
import SuccessPage from './Pages/SuccessPage';
import PendingVerification from './Pages/PendingVerification';
import VerifyEmail from './Pages/VerifyEmail';
import ForgetPassword from './Pages/ForgetPassword';
import ResetPassword from './Pages/ResetPassword';
import PatientHome from './Pages/PatientHome';
import PatientProfile from './Pages/PatientProfile';
import DoctorsGridPage from './Components/DoctorsGridPage';
import AdminDashboard from './Pages/AdminDashboard';
import AdminUsers from './Pages/AdminUsers';
import AdminDoctors from './Pages/AdminDoctors';
import AdminDoctorRequests from './Pages/AdminDoctorRequests';
import AdminComplaints from './Pages/AdminComplaints';
import AdminSettings from './Pages/AdminSettings';
// يمكنك وضع هذا الجزء في ملف منفصل باسم doctorsData.js أو في أعلى ملف App.js
import Doctor1 from './assets/images/doctor.png';
import Doctor2 from './assets/images/doctor2.png';
import Doctor3 from './assets/images/doctor3.png';
import FollowUs from './Components/FollowUs';
import MedicalRecordPage from "./Pages/MedicalRecordPage";
import ViewRecordPage from "./Pages/ViewRecordPage";

import { MedicationsPage } from './Pages/MedicationsPage';
import AppointmentsPage from './Pages/AppointmentsPage';
import  Contact  from './Components/Contact';
import ChatBot from './Components/ChatBot/ChatBot';
import EmergencyCardDemo from './Pages/EmergencyCardDemo';
import EmergencyCard3DPage from './Pages/EmergencyCard3DPage';



// Component للتحكم في ظهور الشات بوت
function ChatBotWrapper() {
  const location = useLocation();
  
  // المسارات اللي الشات بوت مش هيظهر فيها
  const hiddenRoutes = [
    '/',
    '/role-selection',
    '/auth',
    '/success',
    '/pending-verification',
    '/verify-email',
    '/forgot-password',
    '/reset-password'
  ];
  
  // إخفاء الشات بوت من صفحات الأدمن
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHiddenRoute = hiddenRoutes.includes(location.pathname);
  
  // إظهار الشات بوت فقط في صفحات المرضى والأطباء
  if (isHiddenRoute || isAdminRoute) {
    return null;
  }
  
  return <ChatBot />;
}


function App() {
  const allDoctors = [
    { id: 1, name: 'د. محمد أحمد', specialty: 'أخصائي أعصاب', image: Doctor1, exp: '15 عاماً', clinic: 'عيادة النور' },
    { id: 2, name: 'د. سارة علي', specialty: 'أخصائية أطفال', image: Doctor2, exp: '12 عاماً', clinic: 'المركز الدولي' },
    { id: 3, name: 'د. مروان أحمد', specialty: 'أخصائي باطنة', image: Doctor3, exp: '10 أعوام', clinic: 'مجمع الشفاء' },
    { id: 4, name: 'د. ليلى حسن', specialty: 'أخصائية جلدية', image: Doctor1, exp: '8 أعوام', clinic: 'عيادة الرواد' },
    { id: 5, name: 'د. أحمد محمود', specialty: 'أخصائي عظام', image: Doctor2, exp: '20 عاماً', clinic: 'المستشفى التخصصي' },
    { id: 6, name: 'د. نورا خالد', specialty: 'أخصائية عيون', image: Doctor3, exp: '7 أعوام', clinic: 'مركز الإبصار' },
  ];
  
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes - الصفحات المتاحة للجميع */}
          <Route path="/" element={<Login />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/pending-verification" element={<PendingVerification />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/recorded" element={<MedicalRecordPage />} />
        <Route path="/recorded/view/:recordId" element={<ViewRecordPage />} />
        <Route path="/meds" element={<MedicationsPage />} />
        <Route path="/appointments" element={< AppointmentsPage  />} />
        <Route path="/contact" element={< Contact  />} />


        

          
          {/* DEMO PAGE - مؤقت للتوضيح فقط */}
          <Route path="/demo-emergency-card" element={<EmergencyCardDemo />} />
          
          {/* Emergency Card 3D - بطاقة الطوارئ الطبية ثلاثية الأبعاد */}
          <Route path="/emergency-card-3d" element={<EmergencyCard3DPage />} />
          
          {/* Medications Page - صفحة إدارة الأدوية */}
          <Route path="/medications" element={<MedicationsPage />} />
          
          {/* Protected Routes for Patients - صفحات المرضى المحمية */}
          <Route 
            path="/patient/home" 
            element={
              <ProtectedRoute allowedRoles="patient">
                <PatientHome allDoctors={allDoctors} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/doctors" 
            element={
              <ProtectedRoute allowedRoles="patient">
                <DoctorsGridPage allDoctors={allDoctors} />
              </ProtectedRoute>
            } 
          />
       <Route 
  path="/patient/about" 
  element={
    <ProtectedRoute allowedRoles="patient">
      <FollowUs />
    </ProtectedRoute>
  } 
/>
          <Route 
            path="/patient/profile" 
            element={
              <ProtectedRoute allowedRoles="patient">
                <PatientProfile />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes for Doctors - صفحات الأطباء المحمية */}
          <Route 
            path="/doctor/dashboard" 
            element={
              <ProtectedRoute allowedRoles="doctor">
                <div className="min-h-screen flex items-center justify-center bg-blue-50">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-[#0F427D] mb-4">لوحة تحكم الطبيب</h1>
                    <p className="text-gray-600">قريباً...</p>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes for Admin - صفحات المسؤول المحمية */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/doctor-requests" 
            element={
              <ProtectedRoute allowedRoles="admin">
                <AdminDoctorRequests />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles="admin">
                <AdminUsers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/doctors" 
            element={
              <ProtectedRoute allowedRoles="admin">
                <AdminDoctors />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/complaints" 
            element={
              <ProtectedRoute allowedRoles="admin">
                <AdminComplaints />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute allowedRoles="admin">
                <div className="min-h-screen flex items-center justify-center bg-blue-50">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-[#0F427D] mb-4">التقارير</h1>
                    <p className="text-gray-600">قريباً...</p>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/logs" 
            element={
              <ProtectedRoute allowedRoles="admin">
                <div className="min-h-screen flex items-center justify-center bg-blue-50">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-[#0F427D] mb-4">السجلات</h1>
                    <p className="text-gray-600">قريباً...</p>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <ProtectedRoute allowedRoles="admin">
                <AdminSettings />
              </ProtectedRoute>
            } 
          />
          
          {/* Backwards compatibility - للحفاظ على التوافق */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <PatientHome allDoctors={allDoctors} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctors" 
            element={
              <ProtectedRoute>
                <DoctorsGridPage allDoctors={allDoctors} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/about" 
            element={
              <ProtectedRoute>
                <FollowUs  />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <ChatBotWrapper />
      </Router>
    </AuthProvider>
  );
}

export default App;