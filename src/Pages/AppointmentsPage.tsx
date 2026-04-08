import { useEffect, useState, useContext } from "react";
import { AppointmentCard } from "../Components/AppointmentCard";
import { motion } from "framer-motion";
import Navbar from "../Components/Layout/Navbar";
import Footer from "../Components/Layout/Footer";
import AuthContext from "../context/AuthContext";

type Appointment = {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time24: string;
  time: string;
  type: string;
  status: string;
  statusColor: string;
  avatarUrl: string;
};

const getAppointmentsStorageKey = (userId?: string | number) => {
  return userId ? `appointments-data-${userId}` : "appointments-data";
};

const defaultAppointments: Appointment[] = [
  {
    id: "1",
    doctorName: "د. فاطمة خالد",
    specialty: "أمراض الجلدية والتجميل",
    date: "2025-11-22",
    time24: "10:00",
    time: "10:00 صباحاً",
    type: "استشارة عبر الإنترنت",
    status: "مؤكد",
    statusColor: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    avatarUrl:
      "https://images.unsplash.com/photo-1706565029539-d09af5896340?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: "2",
    doctorName: "د. أحمد العلي",
    specialty: "أمراض القلب",
    date: "2025-11-23",
    time24: "14:30",
    time: "02:30 مساءً",
    type: "زيارة في العيادة",
    status: "قيد الانتظار",
    statusColor: "bg-amber-100 text-amber-700 border border-amber-200",
    avatarUrl:
      "https://images.unsplash.com/photo-1659353885824-1199aeeebfc6?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: "3",
    doctorName: "د. سارة محمود",
    specialty: "طب الأطفال",
    date: "2025-11-24",
    time24: "11:00",
    time: "11:00 صباحاً",
    type: "استشارة عبر الإنترنت",
    status: "مؤكد",
    statusColor: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    avatarUrl:
      "https://images.unsplash.com/photo-1753487050317-919a2b26a6ed?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: "4",
    doctorName: "د. مريم حسن",
    specialty: "طب العيون",
    date: "2025-11-25",
    time24: "09:00",
    time: "09:00 صباحاً",
    type: "فحص شامل",
    status: "مؤكد",
    statusColor: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    avatarUrl:
      "https://images.unsplash.com/photo-1632053652571-a6a45052bbbd?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: "5",
    doctorName: "د. خالد سعيد",
    specialty: "طب الأعصاب",
    date: "2025-11-26",
    time24: "15:00",
    time: "03:00 مساءً",
    type: "استشارة عبر الإنترنت",
    status: "قيد الانتظار",
    statusColor: "bg-amber-100 text-amber-700 border border-amber-200",
    avatarUrl:
      "https://images.unsplash.com/photo-1642975967602-653d378f3b5b?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: "6",
    doctorName: "د. نور الدين",
    specialty: "الطب العام",
    date: "2025-11-27",
    time24: "13:00",
    time: "01:00 مساءً",
    type: "زيارة في العيادة",
    status: "مؤكد",
    statusColor: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    avatarUrl:
      "https://images.unsplash.com/photo-1632054224659-280be3239aff?auto=format&fit=crop&w=1080&q=80",
  },
];

export default function AppointmentsPage() {
  const authContext = useContext(AuthContext) as any;
  const userId = authContext?.user?.id;
  const APPOINTMENTS_STORAGE_KEY = getAppointmentsStorageKey(userId);

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const stored = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Appointment[]) : defaultAppointments;
  });

  useEffect(() => {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments, APPOINTMENTS_STORAGE_KEY]);

  return (
    <div className="flex flex-col min-h-screen theme-page">
      <Navbar />

      <main className="flex-grow relative overflow-x-hidden">

        {/* Decorative Background */}
        <div className="fixed top-20 right-[-5%] w-96 h-96 rounded-full blur-[120px] pointer-events-none z-0" style={{ background: 'var(--app-glow-a)' }} />
        <div className="fixed bottom-20 left-[-5%] w-96 h-96 rounded-full blur-[120px] pointer-events-none z-0" style={{ background: 'var(--app-glow-b)' }} />

        {/* Content */}
        <div className="relative z-10 px-4 pt-28 pb-24">
          <div className="max-w-7xl mx-auto">

            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-black theme-title mb-4">
                المواعيد <span className="text-blue-500">القادمة</span>
              </h1>

              <p className="theme-text-muted text-lg">
                تابع مواعيدك الطبية القادمة بسهولة
              </p>
            </motion.div>

            {/* Appointments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {appointments.map((appointment, index) => (
                <AppointmentCard
                  key={appointment.id}
                  {...appointment}
                  index={index}
                />
              ))}

            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-16 flex justify-center"
            >
              <div className="theme-surface backdrop-blur-xl rounded-3xl px-10 py-6 flex gap-10 text-center">

                <div>
                  <p className="text-3xl font-black theme-title">
                    {appointments.length}
                  </p>
                  <p className="theme-text-muted text-sm">
                    إجمالي المواعيد
                  </p>
                </div>

                <div>
                  <p className="text-3xl font-black text-emerald-400">
                    {appointments.filter(a => a.status === "مؤكد").length}
                  </p>
                  <p className="theme-text-muted text-sm">
                    مؤكدة
                  </p>
                </div>

                <div>
                  <p className="text-3xl font-black text-amber-400">
                    {appointments.filter(a => a.status === "قيد الانتظار").length}
                  </p>
                  <p className="theme-text-muted text-sm">
                    قيد الانتظار
                  </p>
                </div>

              </div>
            </motion.div>

          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}