import { useState } from "react";
import { Search, Filter, Grid3x3, List, Check } from "lucide-react";

export default function PatientsToolbar({
  viewMode,
  setViewMode,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const statuses = ["الكل", "نشط", "يحتاج متابعة"];

  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 relative">

      {/* 🔍 Search + Filter */}
      <div className="flex items-center gap-2 sm:gap-3 w-full md:flex-1 md:max-w-md">

        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-white/40" />
          <input
            type="text"
            placeholder="البحث..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 md:pr-12 pl-3 md:pl-4 py-2.5 md:py-3 
              text-sm md:text-base
              rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 
              text-white placeholder-white/40 
              focus:outline-none focus:ring-2 focus:ring-[#008080]/50 transition-all"
          />
        </div>

        {/* Filter */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-2.5 md:p-3 rounded-2xl backdrop-blur-xl border transition-all
              ${isFilterOpen
                ? "bg-gradient-to-r from-[#144A89] to-[#008080] border-white/40"
                : "bg-white/10 border-white/10"
              }`}
          >
            <Filter className={`w-4 h-4 md:w-5 md:h-5 ${
              filterStatus !== "الكل" ? "text-[#008080]" : "text-white/70"
            }`} />
          </button>

          {/* Dropdown */}
          {isFilterOpen && (
            <div className="absolute left-0 mt-2 w-40 md:w-48 
              rounded-2xl bg-[#0f2f57]/30 backdrop-blur-2xl 
              border border-white/10 shadow-2xl z-50 overflow-hidden">

              <div className="p-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilterStatus(status);
                      setIsFilterOpen(false);
                    }}
                    className="w-full flex items-center justify-between 
                      px-3 md:px-4 py-2.5 md:py-3 
                      text-xs md:text-sm
                      rounded-xl text-white hover:bg-white/10 transition-all"
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
              ? "bg-gradient-to-r from-[#144A89] to-[#008080] text-white border-transparent shadow-lg"
              : "bg-white/10 border-white/10 text-white/60 hover:bg-white/20"
          }`}
        >
          <Grid3x3 className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        <button
          onClick={() => setViewMode("list")}
          className={`p-2.5 md:p-3 rounded-2xl backdrop-blur-xl border transition-all ${
            viewMode === "list"
              ? "bg-gradient-to-r from-[#144A89] to-[#008080] text-white border-transparent shadow-lg"
              : "bg-white/10 border-white/10 text-white/60 hover:bg-white/20"
          }`}
        >
          <List className="w-4 h-4 md:w-5 md:h-5" />
        </button>

      </div>
    </div>
  );
}