import PatientRow from "./PatientRow";

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
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 md:p-6 w-full">

      {/* Table-like grid for md and up */}
      <div className="hidden md:flex flex-col w-full overflow-visible">
        {/* Header */}
        <div className="grid grid-cols-4 text-white border-b border-white/10 text-xs sm:text-sm md:text-base p-3 md:p-4">
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
              className="grid grid-cols-4 items-center text-white bg-white/5 p-3 rounded-xl transition-transform duration-300 ease-out hover:scale-105 hover:z-10"
            >
              {/* المريض */}
              <div className="flex items-center justify-end gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#144A89] to-[#008080] flex items-center justify-center font-bold text-sm">
                  {patient.avatar}
                </div>
                <span>{patient.name}</span>
              </div>

              {/* المعلومات */}
              <div className="text-right">
                <div className="text-xs text-white/50">{patient.patientId}</div>
                <div className="text-xs text-white/50">{patient.age} عام</div>
              </div>

              {/* آخر زيارة */}
              <div className="text-right">{patient.lastVisit}</div>

              {/* الحالة */}
              <div className="text-right">
                <span
                  className={`px-2 py-1 rounded-lg text-[10px] ${
                    patient.status === "نشط"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-yellow-500/20 text-yellow-300"
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
            className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white shadow-lg min-w-[250px] overflow-visible"
          >
            <div className="transition-transform duration-300 ease-out hover:scale-105">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#144A89] to-[#008080] flex items-center justify-center font-bold">
                  {patient.avatar}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm">{patient.name}</span>
                  <span className="text-xs text-white/50">{patient.patientId}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-white/40 text-[10px] mb-1">العمر</p>
                  <p>{patient.age} عام</p>
                </div>
                <div>
                  <p className="text-white/40 text-[10px] mb-1">الحالة</p>
                  <span
                    className={`px-3 py-1 rounded-lg text-[10px] ${
                      patient.status === "نشط"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-yellow-500/20 text-yellow-300 w-full"
                    }`}
                  >
                    {patient.status}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-white/40 text-[10px] mb-1">آخر زيارة</p>
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