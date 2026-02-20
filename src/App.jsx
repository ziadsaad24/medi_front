import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import RoleSelection from './Pages/RoleSelection';
import AuthPage from './Pages/AuthPage';
import SuccessPage from './Pages/SuccessPage';
import PatientHome from './Pages/PatientHome';
import DoctorsGridPage from './Components/DoctorsGridPage';
// يمكنك وضع هذا الجزء في ملف منفصل باسم doctorsData.js أو في أعلى ملف App.js
import Doctor1 from './assets/images/doctor.png';
import Doctor2 from './assets/images/doctor2.png';
import Doctor3 from './assets/images/doctor3.png';



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
    <Router>
      <Routes>
        {/* <Route path="/" element={<Login />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/success" element={<SuccessPage />} /> */}
    
        <Route path="/" element={<PatientHome allDoctors={allDoctors} />} />
        <Route path="/doctors" element={<DoctorsGridPage allDoctors={allDoctors} />} />
      </Routes>
    </Router>
  );
}

export default App;