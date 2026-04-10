import { useEffect, useMemo, useState } from "react"; 
import DoctorLayout from "../../Components/DoctorLayout";
import PatientsTable from "../../Components/PatientsTable";
import PatientsToolbar from "../../Components/PatientsToolbar";
import { useTheme } from "../../context/ThemeContext";
import { useLocation } from "react-router-dom";
import doctorApi from "../../services/doctorApi";

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

export default function PatientsPage() {
  const location = useLocation();
  const { isDark } = useTheme();
  const initialTab = new URLSearchParams(location.search).get('tab') === 'records' ? 'records' : 'patients';

  const [activeTab, setActiveTab] = useState<'patients' | 'records'>(initialTab);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filterStatus, setFilterStatus] = useState("الكل");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const mapPatient = (item: any): Patient => ({
    id: String(item.id),
    name: item.name || item.fullName || 'غير معروف',
    patientId: item.patientId || item.patient_id || '',
    age: Number(item.age || 0),
    phone: item.phone || '',
    lastVisit: item.lastVisit || item.last_visit || '-',
    status: (item.status === 'needs_follow_up' || item.status === 'يحتاج متابعة') ? 'يحتاج متابعة' : 'نشط',
    avatar: item.avatarInitials || item.avatar_initials || (item.name || 'م').slice(0, 2),
  });

  const mapRecord = (item: any) => ({
    id: String(item.id),
    patientName: item.patientName || item.patient_name || 'غير معروف',
    patientId: item.patientId || item.patient_id || '',
    visitDate: item.visitDate || item.visit_date || '-',
    diagnosis: item.diagnosis || '-',
    notes: item.notes || item.summary || '-',
    medicationsCount: Number(item.medicationsCount || item.medications_count || 0),
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (activeTab === 'patients') {
          const statusMap: Record<string, string | undefined> = {
            'الكل': undefined,
            'نشط': 'active',
            'يحتاج متابعة': 'needs_follow_up',
          };

          const response = await doctorApi.getDoctorPatients({
            search: searchTerm || undefined,
            status: statusMap[filterStatus],
            page: 1,
            per_page: 50,
          });

          const list = (Array.isArray(response?.data) ? response.data : response?.data?.data || response?.items || []).map(mapPatient);
          setPatients(list);
        } else {
          const response = await doctorApi.getDoctorMedicalRecordsArchive({
            search: searchTerm || undefined,
            page: 1,
            per_page: 50,
          });

          const list = (Array.isArray(response?.data) ? response.data : response?.data?.data || response?.items || []).map(mapRecord);
          setRecords(list);
        }
      } catch {
        if (activeTab === 'patients') setPatients([]);
        else setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [activeTab, filterStatus, searchTerm]);

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "الكل" || patient.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const filteredRecords = useMemo(
    () =>
      records.filter((record) => {
        const q = searchTerm.toLowerCase();
        return (
          record.patientName.toLowerCase().includes(q) ||
          record.patientId.toLowerCase().includes(q) ||
          record.diagnosis.toLowerCase().includes(q)
        );
      }),
    [records, searchTerm]
  );

  return (
    <DoctorLayout>
      <div className="p-4 sm:p-6 md:p-8 min-h-full theme-page">

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('patients')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${activeTab === 'patients' ? 'bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 text-white border-transparent shadow-lg' : isDark ? 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20' : 'bg-white border-[#0f427d]/20 text-[#0f427d] hover:bg-[#0f427d]/10'}`}
          >
            المرضى الحاليون
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${activeTab === 'records' ? 'bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 text-white border-transparent shadow-lg' : isDark ? 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20' : 'bg-white border-[#0f427d]/20 text-[#0f427d] hover:bg-[#0f427d]/10'}`}
          >
            سجلات الكشوفات السابقة
          </button>
        </div>

        {/* Toolbar */}
        {activeTab === 'patients' ? (
          <PatientsToolbar 
            viewMode={viewMode} 
            setViewMode={setViewMode}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        ) : (
          <div className="mb-6">
            <input
              type="text"
              placeholder="ابحث في الأرشيف باسم المريض أو التشخيص..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:max-w-lg rounded-2xl px-4 py-3 theme-input"
            />
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className={`text-center py-16 md:py-20 text-sm md:text-base ${isDark ? "text-white/50" : "text-[#0f427d]/60"}`}>
            جارٍ تحميل البيانات...
          </div>
        ) : activeTab === 'patients' && viewMode === "list" ? (
          <div className="overflow-x-auto">
            <PatientsTable patients={filteredPatients} />
          </div>
        ) : activeTab === 'patients' ? (
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
                    flex items-center justify-center font-bold text-sm sm:text-lg text-white shadow-inner">
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
        ) : (
          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <div key={record.id} className={`rounded-2xl border p-4 sm:p-5 ${isDark ? 'bg-slate-900/60 border-white/15 text-white' : 'bg-white border-[#0f427d]/15 text-[#0f427d]'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <h3 className="font-black text-base sm:text-lg">{record.patientName}</h3>
                  <span className={`text-xs px-3 py-1 rounded-lg ${isDark ? 'bg-white/10 text-white/80' : 'bg-[#0f427d]/10 text-[#0f427d]/80'}`}>
                    {record.visitDate}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className={`${isDark ? 'text-white/50' : 'text-[#0f427d]/55'} text-xs mb-1`}>رقم المريض</p>
                    <p className="font-semibold">{record.patientId}</p>
                  </div>
                  <div>
                    <p className={`${isDark ? 'text-white/50' : 'text-[#0f427d]/55'} text-xs mb-1`}>التشخيص</p>
                    <p className="font-semibold">{record.diagnosis}</p>
                  </div>
                  <div>
                    <p className={`${isDark ? 'text-white/50' : 'text-[#0f427d]/55'} text-xs mb-1`}>عدد أدوية الروشتة</p>
                    <p className="font-semibold">{record.medicationsCount}</p>
                  </div>
                </div>

                <p className={`mt-3 text-sm ${isDark ? 'text-white/70' : 'text-[#0f427d]/70'}`}>{record.notes}</p>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {activeTab === 'patients' && filteredPatients.length === 0 && (
          <div className={`text-center py-16 md:py-20 text-sm md:text-base ${isDark ? "text-white/50" : "text-[#0f427d]/60"}`}>
            لا توجد سجلات تطابق بحثك الحالي..
          </div>
        )}

        {activeTab === 'records' && filteredRecords.length === 0 && (
          <div className={`text-center py-16 md:py-20 text-sm md:text-base ${isDark ? "text-white/50" : "text-[#0f427d]/60"}`}>
            لا توجد كشوفات سابقة مطابقة لبحثك.
          </div>
        )}

      </div>
    </DoctorLayout>
  );
}