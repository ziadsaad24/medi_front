import { useState } from "react";
import { Search, Filter, Grid3x3, List, Check } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function PatientsToolbar({
  viewMode,
  setViewMode,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { isDark } = useTheme();

  const statuses = ["الكل", "نشط", "يحتاج متابعة"];

  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 relative">

      {/* 🔍 Search + Filter */}
      <div className="flex items-center gap-2 sm:gap-3 w-full md:flex-1 md:max-w-md">

        {/* Search */}
        <div className="relative flex-1">
          <Search className={`absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 ${isDark ? "text-white/40" : "text-[#0f427d]/40"}`} />
          <input
            type="text"
            placeholder="البحث..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 md:pr-12 pl-3 md:pl-4 py-2.5 md:py-3 text-sm md:text-base rounded-2xl backdrop-blur-xl theme-input focus:outline-none focus:ring-2 focus:ring-[#008080]/30 transition-all"
          />
        </div>

        {/* Filter */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-2.5 md:p-3 rounded-2xl backdrop-blur-xl border transition-all
              ${isFilterOpen
                ? "bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 border-white/40"
                : isDark
                  ? "bg-white/10 border-white/10"
                  : "bg-[#0f427d]/8 border-[#0f427d]/20"
              }`}
          >
            <Filter className={`w-4 h-4 md:w-5 md:h-5 ${
              filterStatus !== "الكل" ? "text-[#008080]" : isDark ? "text-white/70" : "text-[#0f427d]/70"
            }`} />
          </button>

          {/* Dropdown */}
          {isFilterOpen && (
            <div className="absolute left-0 mt-2 w-40 md:w-48 rounded-2xl backdrop-blur-2xl border shadow-2xl z-50 overflow-hidden">

              <div className={`p-2 ${isDark ? "bg-[#0f2f57]/80 border-white/10" : "bg-white border-[#0f427d]/20"}`}>
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilterStatus(status);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm rounded-xl transition-all ${
                      isDark ? "text-white hover:bg-white/10" : "text-[#0f427d] hover:bg-[#0f427d]/10"
                    }`}
                  >
                    {status}
                    {filterStatus === status && (
                      <Check className="w-4 h-4 text-[#008080]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🔄 View Mode */}
      <div className="flex items-center justify-end gap-2">

        <button
          onClick={() => setViewMode("grid")}
          className={`p-2.5 md:p-3 rounded-2xl backdrop-blur-xl border transition-all ${
            viewMode === "grid"
              ? "bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 text-white border-transparent shadow-lg"
              : isDark
                ? "bg-white/10 border-white/10 text-white/60 hover:bg-white/20"
                : "bg-[#0f427d]/8 border-[#0f427d]/20 text-[#0f427d]/60 hover:bg-[#0f427d]/12"
          }`}
        >
          <Grid3x3 className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        <button
          onClick={() => setViewMode("list")}
          className={`p-2.5 md:p-3 rounded-2xl backdrop-blur-xl border transition-all ${
            viewMode === "list"
              ? "bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 text-white border-transparent shadow-lg"
              : isDark
                ? "bg-white/10 border-white/10 text-white/60 hover:bg-white/20"
                : "bg-[#0f427d]/8 border-[#0f427d]/20 text-[#0f427d]/60 hover:bg-[#0f427d]/12"
          }`}
        >
          <List className="w-4 h-4 md:w-5 md:h-5" />
        </button>

      </div>
    </div>
  );
}