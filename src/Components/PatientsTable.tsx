import { useTheme } from "../context/ThemeContext";

interface Patient {
  id: string;
  name: string;
  patientId: string;
  age: number;
  phone: string;
  lastVisit: string;
  status: "نشط" | "يحتاج متابعة";
  avatar: string;
}

interface Props {
  patients: Patient[];
}

export default function PatientsTable({ patients }: Props) {
  const { isDark } = useTheme();

  return (
    <div className="theme-card backdrop-blur-xl rounded-3xl p-4 md:p-6 w-full">

      {/* Table-like grid for md and up */}
      <div className="hidden md:flex flex-col w-full overflow-visible">
        {/* Header */}
        <div className={`grid grid-cols-4 border-b text-xs sm:text-sm md:text-base p-3 md:p-4 ${isDark ? "text-white border-white/10" : "text-[#0f427d] border-[#0f427d]/15"}`}>
          <div className="text-right">المريض</div>
          <div className="text-right">المعلومات</div>
          <div className="text-right">آخر زيارة</div>
          <div className="text-right">الحالة</div>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-2 mt-2">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className={`grid grid-cols-4 items-center p-3 rounded-xl transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-md ${isDark ? "text-white bg-white/5 hover:bg-white/10" : "text-[#0f427d] bg-[#0f427d]/5 hover:bg-[#0f427d]/10"}`}
            >
              {/* المريض */}
              <div className="flex items-center justify-start gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 flex items-center justify-center font-bold text-sm text-white">
                  {patient.avatar}
                </div>
                <span>{patient.name}</span>
              </div>

              {/* المعلومات */}
              <div className="text-right">
                <div className={`text-xs ${isDark ? "text-white/50" : "text-[#0f427d]/60"}`}>{patient.patientId}</div>
                <div className={`text-xs ${isDark ? "text-white/50" : "text-[#0f427d]/60"}`}>{patient.age} عام</div>
              </div>

              {/* آخر زيارة */}
              <div className="text-right">{patient.lastVisit}</div>

              {/* الحالة */}
              <div className="text-right">
                <span
                  className={`px-2 py-1 rounded-lg text-[10px] ${
                    patient.status === "نشط"
                      ? isDark
                        ? "bg-green-500/20 text-green-300"
                        : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : isDark
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-amber-100 text-amber-700 border border-amber-200"
                  }`}
                >
                  {patient.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card view for small screens */}
      <div className="flex flex-col gap-4 md:hidden">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className={`backdrop-blur-md rounded-2xl p-4 shadow-lg min-w-[250px] overflow-visible ${isDark ? "bg-white/10 text-white" : "bg-white text-[#0f427d] border border-[#0f427d]/15"}`}
          >
            <div className="transition-all duration-200 ease-out hover:-translate-y-[1px]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 flex items-center justify-center font-bold">
                  {patient.avatar}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm">{patient.name}</span>
                  <span className={`text-xs ${isDark ? "text-white/50" : "text-[#0f427d]/60"}`}>{patient.patientId}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className={`text-[10px] mb-1 ${isDark ? "text-white/40" : "text-[#0f427d]/50"}`}>العمر</p>
                  <p>{patient.age} عام</p>
                </div>
                <div>
                  <p className={`text-[10px] mb-1 ${isDark ? "text-white/40" : "text-[#0f427d]/50"}`}>الحالة</p>
                  <span
                    className={`px-3 py-1 rounded-lg text-[10px] ${
                      patient.status === "نشط"
                        ? isDark
                          ? "bg-green-500/20 text-green-300"
                          : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : isDark
                          ? "bg-yellow-500/20 text-yellow-300 w-full"
                          : "bg-amber-100 text-amber-700 border border-amber-200 w-full"
                    }`}
                  >
                    {patient.status}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className={`text-[10px] mb-1 ${isDark ? "text-white/40" : "text-[#0f427d]/50"}`}>آخر زيارة</p>
                  <p>{patient.lastVisit}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}