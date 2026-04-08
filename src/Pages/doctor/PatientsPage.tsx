import { useState } from "react"; 
import DoctorLayout from "../../Components/DoctorLayout";
import PatientsTable from "../../Components/PatientsTable";
import PatientsToolbar from "../../Components/PatientsToolbar";
import { useTheme } from "../../context/ThemeContext";

export interface Patient {
  id: string;
  name: string;
  patientId: string;
  age: number;
  phone: string;
  lastVisit: string;
  status: "نشط" | "يحتاج متابعة";
  avatar: string;
}

const mockPatients: Patient[] = [
  { id: "1", name: "أحمد محمد علي", patientId: "P-1001", age: 45, phone: "0501234567", lastVisit: "2026-03-10", status: "نشط", avatar: "أ.م" },
  { id: "2", name: "سارة محمود حسن", patientId: "P-1002", age: 32, phone: "0507654321", lastVisit: "2026-03-12", status: "يحتاج متابعة", avatar: "س.م" },
  { id: "3", name: "محمود إبراهيم خليل", patientId: "P-1003", age: 58, phone: "0559876543", lastVisit: "2026-03-14", status: "نشط", avatar: "م.ا" },
  { id: "4", name: "ليلى عبد الرحمن", patientId: "P-1004", age: 27, phone: "0541122334", lastVisit: "2026-03-15", status: "نشط", avatar: "ل.ع" },
  { id: "5", name: "عمر خالد الصاوي", patientId: "P-1005", age: 50, phone: "0565544332", lastVisit: "2026-03-09", status: "يحتاج متابعة", avatar: "ع.خ" },
  { id: "6", name: "فاطمة الزهراء", patientId: "P-1006", age: 63, phone: "0529988776", lastVisit: "2026-03-16", status: "نشط", avatar: "ف.ز" },
  { id: "7", name: "يوسف منصور", patientId: "P-1007", age: 19, phone: "0590011223", lastVisit: "2026-03-11", status: "نشط", avatar: "ي.م" },
  { id: "8", name: "منى عبد الله رجب", patientId: "P-1008", age: 41, phone: "0534455667", lastVisit: "2026-03-13", status: "يحتاج متابعة", avatar: "م.ع" },
  { id: "9", name: "كريم يحيى فؤاد", patientId: "P-1009", age: 36, phone: "0511122233", lastVisit: "2026-03-08", status: "نشط", avatar: "ك.ي" },
  { id: "10", name: "هند سعيد مبارك", patientId: "P-1010", age: 29, phone: "0577788899", lastVisit: "2026-03-15", status: "يحتاج متابعة", avatar: "ه.س" }
];

export default function PatientsPage() {
  const { isDark } = useTheme();
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filterStatus, setFilterStatus] = useState("الكل");

  const filteredPatients = mockPatients.filter((patient) => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "الكل" || patient.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <DoctorLayout>
      <div className="p-4 sm:p-6 md:p-8 min-h-full theme-page">

        {/* Toolbar */}
        <PatientsToolbar 
          viewMode={viewMode} 
          setViewMode={setViewMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        {/* Content */}
        {viewMode === "list" ? (
          <div className="overflow-x-auto">
            <PatientsTable patients={filteredPatients} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
            {filteredPatients.map((patient) => (
              <div 
                key={patient.id} 
                className={`flex flex-col justify-between w-full backdrop-blur-md p-4 sm:p-5 md:p-6 rounded-2xl md:rounded-3xl border shadow-lg transition-all cursor-pointer ${isDark ? "bg-white/10 border-white/20 text-white hover:bg-white/20" : "bg-white border-[#0f427d]/15 text-[#0f427d] hover:bg-[#0f427d]/5"}`}
              >
                {/* Header */}
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl 
                    bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 
                    flex items-center justify-center font-bold text-sm sm:text-lg shadow-inner">
                    {patient.avatar}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm sm:text-base md:text-lg truncate">{patient.name}</h3>
                    <p className={`text-[10px] sm:text-xs truncate ${isDark ? "text-white/50" : "text-[#0f427d]/60"}`}>{patient.patientId}</p>
                  </div>
                </div>

                {/* Info */}
                <div className={`grid grid-cols-2 gap-y-3 text-xs sm:text-sm border-t pt-3 md:pt-4 ${isDark ? "border-white/10" : "border-[#0f427d]/12"}`}>
                  <div>
                    <p className={`text-[10px] sm:text-xs mb-1 ${isDark ? "text-white/40" : "text-[#0f427d]/50"}`}>العمر</p>
                    <p className="font-medium">{patient.age} عام</p>
                  </div>
                  <div>
                    <p className={`text-[10px] sm:text-xs mb-1 ${isDark ? "text-white/40" : "text-[#0f427d]/50"}`}>الحالة</p>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] sm:text-xs ${
                      patient.status === "نشط" 
                        ? isDark
                          ? "bg-green-500/20 text-green-300"
                          : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : isDark
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-amber-100 text-amber-700 border border-amber-200"
                    }`}>
                      {patient.status}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <p className={`text-[10px] sm:text-xs mb-1 ${isDark ? "text-white/40" : "text-[#0f427d]/50"}`}>آخر زيارة</p>
                    <p className="font-medium text-xs sm:text-sm">{patient.lastVisit}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredPatients.length === 0 && (
          <div className={`text-center py-16 md:py-20 text-sm md:text-base ${isDark ? "text-white/50" : "text-[#0f427d]/60"}`}>
            لا توجد سجلات تطابق بحثك الحالي..
          </div>
        )}

      </div>
    </DoctorLayout>
  );
}