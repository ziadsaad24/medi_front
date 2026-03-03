import React from 'react';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import DoctorRequests from '../Components/Admin/DoctorRequests';

const AdminDoctorRequests = () => {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AdminSidebar />
      
      <div className="mr-64 p-8">
        <DoctorRequests />
      </div>
    </div>
  );
};

export default AdminDoctorRequests;
