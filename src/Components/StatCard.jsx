export default function StatCard({ title, value, icon: Icon }) {
  const brandGradient = "from-[#144A89] to-[#008080]";

  return (
    <div className="relative overflow-hidden mb-10 mt-10 p-6 rounded-3xl 
      bg-gradient-to-b from-blue-950/95 via-blue-900/90 to-cyan-800/85 
      backdrop-blur-xl border border-white/10 shadow-lg 
      transition-all duration-500 hover:shadow-[#008080]/20 hover:-translate-y-2 group
      flex flex-row items-center justify-between gap-4">

      {/* خلفية جمالية */}
      <div className={`absolute inset-0 bg-gradient-to-br ${brandGradient} 
        opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

      {/* النصوص */}
      <div>
        <h3 className="text-white/60 text-sm font-semibold mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white tracking-tight">+{value}</p>
      </div>

      {/* الأيقونة */}
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${brandGradient} 
        flex items-center justify-center shadow-lg border border-white/10`}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* الخط السفلي */}
      <div className="absolute bottom-0 left-0 h-1 bg-[#008080] w-0 group-hover:w-full transition-all duration-500" />
    </div>
  );
}