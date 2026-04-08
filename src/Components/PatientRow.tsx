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
  patient: Patient;
}

export default function PatientRow({ patient }: Props) {
  return (
    <tr className="border-b border-white/10 text-white/80 
      transition-all duration-300 hover:bg-white/10">

      {/* 👤 المريض */}
      <td className="p-3 md:p-4">
        <div className="flex items-center gap-2 md:gap-3">

          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full 
            bg-gradient-to-r from-[#144A89] to-[#008080] 
            flex items-center justify-center text-white text-xs md:text-sm font-bold">
            {patient.avatar}
          </div>

          <div>
            <p className="font-semibold text-xs md:text-sm">
              {patient.name}
            </p>
            <p className="text-[10px] md:text-xs text-gray-400">
              {patient.patientId}
            </p>
          </div>

        </div>
      </td>

      {/* 📊 المعلومات */}
      <td className="p-3 md:p-4">
        <p className="text-xs md:text-sm">{patient.age} سنة</p>
        <p className="text-[10px] md:text-xs text-gray-400">
          {patient.phone}
        </p>
      </td>

      {/* 📅 آخر زيارة */}
      <td className="p-3 md:p-4 text-xs md:text-sm whitespace-nowrap">
        {patient.lastVisit}
      </td>

      {/* 🏷️ الحالة */}
      <td className="p-3 md:p-4">
        <span
          className={`px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-medium
          ${patient.status === "نشط"
            ? "bg-green-500/20 text-green-300"
            : "bg-yellow-500/20 text-yellow-300"
          }`}
        >
          {patient.status}
        </span>
      </td>

    </tr>
  );
}