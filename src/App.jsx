import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import 'animate.css';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import PublicRoute from './Components/PublicRoute';
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

import DoctorDashboard from './Pages/doctor/Docdashboard'

import EmergencyCard3DPage from './Pages/EmergencyCard3DPage';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import NotFound from './Pages/NotFound';
import ErrorBoundary from './Components/ErrorBoundary';

import PatientsPage from './Pages/doctor/PatientsPage';
import Settings  from './Pages/doctor/SettingsPage';
import RequestsPage from "./Pages/doctor/RequestsPage";
import ProfilePage from "./Pages/doctor/ProfilePage";
import { ProfileProvider } from "./context/ProfileContext";
import { DoctorWorkflowProvider } from './context/DoctorWorkflowContext';
import NewMedicalRecordPage from './Pages/doctor/NewMedicalRecordPage';

function HomeRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const homeRoutes = {
    patient: '/patient/home',
    doctor: '/doctor/dashboard',
    admin: '/admin/dashboard',
  };

  return <Navigate to={homeRoutes[user.role] || '/'} replace />;
}

// Component للتحكم في ظهور الشات بوت
function ChatBotWrapper() {
  const location = useLocation();
  const pathname = location.pathname;
  
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
  
  // المسارات المعروفة للمرضى اللي الشات بوت يظهر فيها
  const allowedPatientRoutes = [
    '/patient/home',
    '/medications',
    '/appointments',
    '/contact',
    '/about',
    '/doctors',
    '/privacy-policy',
    '/emergency-card-3d',
  ];
  
  // إخفاء الشات بوت من الصفحات غير المناسبة
  const isAdminRoute = pathname.startsWith('/admin');
  const isDoctorRoute = pathname.startsWith('/doctor');
  const isRecordsRoute = pathname.startsWith('/recorded') || pathname === '/demo-emergency-card';
  const isHiddenRoute = hiddenRoutes.includes(pathname);
  const isAllowedPatientRoute = allowedPatientRoutes.includes(pathname) || pathname.startsWith('/patient/');
  
  // إظهار الشات بوت فقط في صفحات المرضى المعروفة
  if (!isAllowedPatientRoute || isHiddenRoute || isAdminRoute || isDoctorRoute || isRecordsRoute) {
    return null;
  }
  
  return <ChatBot />;
}


// Scroll to top on every navigation
function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
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
      <ProfileProvider>
      <DoctorWorkflowProvider>
      <ErrorBoundary>
      <Router>
        <ScrollToTopOnNavigate />
        <Routes>
          {/* Public Routes - الصفحات المتاحة للجميع */}
          <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/role-selection" element={<PublicRoute><RoleSelection /></PublicRoute>} />
          <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
          <Route path="/success" element={<PublicRoute><SuccessPage /></PublicRoute>} />
          <Route path="/pending-verification" element={<PublicRoute><PendingVerification /></PublicRoute>} />
          <Route path="/verify-email" element={<PublicRoute><VerifyEmail /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgetPassword /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
          <Route path="/recorded" element={<ProtectedRoute allowedRoles="patient"><MedicalRecordPage /></ProtectedRoute>} />
          <Route path="/recorded/view/:recordId" element={<ProtectedRoute allowedRoles="patient"><ViewRecordPage /></ProtectedRoute>} />
          <Route path="/recorded/public/:token" element={<EmergencyCardDemo />} />
          <Route path="/medications" element={<ProtectedRoute allowedRoles="patient"><MedicationsPage /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute allowedRoles="patient"><AppointmentsPage /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          
          <Route
            path="/Recoreded-data"
            element={
              <ProtectedRoute allowedRoles="patient">
                <EmergencyCardDemo />
              </ProtectedRoute>
            }
          />
          
          {/* Emergency Card 3D - بطاقة الطوارئ الطبية ثلاثية الأبعاد */}
          <Route path="/emergency-card-3d" element={<EmergencyCard3DPage />} />
          
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
        <DoctorDashboard />
      </ProtectedRoute>
    } 
  />

  <Route 
    path="/doctor/patients" 
    element={
      <ProtectedRoute allowedRoles="doctor">
        <PatientsPage />
      </ProtectedRoute>
    } 
  />

  <Route 
    path="/doctor/settings" 
    element={
      <ProtectedRoute allowedRoles="doctor">
        <Settings />
      </ProtectedRoute>
    } 
  />

  <Route 
    path="/doctor/requests" 
    element={
      <ProtectedRoute allowedRoles="doctor">
        <RequestsPage />
      </ProtectedRoute>
    } 
  />

  <Route 
    path="/doctor/profile" 
    element={
      <ProtectedRoute allowedRoles="doctor">
        <ProfilePage />
      </ProtectedRoute>
    } 
  />

  <Route 
    path="/doctor/medical-records/new" 
    element={
      <ProtectedRoute allowedRoles="doctor">
        <NewMedicalRecordPage />
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
                <HomeRedirect />
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
          
          {/* 404 - Catch All */}
          <Route path="*" element={<NotFound />} />

        </Routes>
        <ChatBotWrapper />
      </Router>
      </ErrorBoundary>
      </DoctorWorkflowProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;