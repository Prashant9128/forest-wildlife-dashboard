import { FaSearch, FaFilter, FaCalendarAlt, FaSortAmountDown, FaCheck } from "react-icons/fa";

export default function FilterBar({
    searchTerm,
    onSearchChange,
    filterStatus,
    onFilterChange,
    isSortedAsc,
    onSortChange,
    filterDate,
    onDateChange
}) {
    // Status Options Configuration
    const statusOptions = [
        { value: 'all', label: 'All', color: 'bg-slate-700 text-slate-200' },
        { value: 'Endangered', label: 'Endangered', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
        { value: 'Vulnerable', label: 'Vulnerable', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
        { value: 'Protected', label: 'Protected', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    ];

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            {/* Search Input */}
            <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-emerald-400 transition-colors">
                    <FaSearch className="text-sm" />
                </div>
                <input
                    type="text"
                    placeholder="Search wildlife..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
                />
            </div>

            {/* Status Filter (Pills) */}
            <div>
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FaFilter className="text-[10px]" /> Status
                </h4>
                <div className="flex flex-wrap gap-2">
                    {statusOptions.map((option) => {
                        const isSelected = filterStatus.toLowerCase() === option.value.toLowerCase();
                        return (
                            <button
                                key={option.value}
                                onClick={() => onFilterChange(option.value)}
                                className={`
                                    relative px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 flex items-center gap-1.5
                                    ${isSelected
                                        ? `${option.color} border-current shadow-lg shadow-black/20 ring-1 ring-white/10`
                                        : 'bg-transparent border-white/5 text-slate-400 hover:bg-white/5 hover:border-white/10'
                                    }
                                `}
                            >
                                {isSelected && <FaCheck className="text-[10px]" />}
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Date Filter */}
            <div>
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FaCalendarAlt className="text-[10px]" /> Time Period
                </h4>
                <div className="relative">
                    <select
                        value={filterDate}
                        onChange={(e) => onDateChange(e.target.value)}
                        className="w-full appearance-none bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-emerald-500/50 cursor-pointer hover:bg-slate-900/80 transition-colors"
                    >
                        <option value="Any Date" className="bg-slate-900">Any Time</option>
                        <option value="today" className="bg-slate-900">Last 24 Hours</option>
                        <option value="week" className="bg-slate-900">Past Week</option>
                        <option value="month" className="bg-slate-900">Past Month</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none text-xs">
                        ▼
                    </div>
                </div>
            </div>

            {/* Sort Toggle */}
            <div>
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FaSortAmountDown className="text-[10px]" /> Sort Order
                </h4>
                <button
                    onClick={onSortChange}
                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-sm text-white hover:bg-slate-900/80 transition-all active:scale-[0.98]"
                >
                    <span className="font-medium text-slate-300">
                        {isSortedAsc ? "Oldest First" : "Newest First"}
                    </span>
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${isSortedAsc ? 'bg-emerald-500/20' : 'bg-slate-700'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-300 ${isSortedAsc ? 'left-4.5 bg-emerald-400 translate-x-4' : 'left-0.5 translate-x-0'}`} />
                    </div>
                </button>
            </div>
        </div>
    );
}
