import { FaMapMarkerAlt, FaClock, FaUser, FaPaw, FaTimes, FaEdit } from "react-icons/fa";

export default function ObservationCard({ species, location, status, conservationStatus, time, observer, createdBy, image, onDelete, onEdit, onClick }) {
  // Get badge class based on status
  const getBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "endangered":
        return "bg-red-500/80 text-white border-red-400/30";
      case "vulnerable":
        return "bg-amber-500/80 text-white border-amber-400/30";
      case "protected":
        return "bg-emerald-500/80 text-white border-emerald-400/30";
      case "pending":
        return "bg-blue-500/80 text-white border-blue-400/30";
      default:
        return "bg-slate-500/80 text-white border-slate-400/30";
    }
  };

  const displayStatus = conservationStatus || status;

  return (
    <div
      onClick={onClick}
      className="glass rounded-2xl overflow-hidden group hover:bg-slate-800/80 transition-all duration-300 h-full flex flex-col border border-white/5 cursor-pointer"
    >
      {/* Image Section */}
      <div className="h-48 overflow-hidden relative">
        {image && !image.startsWith('http') ? (
          <img
            src={image}
            alt={species}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-forest-800 to-slate-900">
            <FaPaw className="text-5xl text-white/20 group-hover:scale-110 transition-transform duration-500" />
          </div>
        )}

        {/* Status Badge (Top Right) */}
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-lg ${getBadgeClass(displayStatus)}`}>
            {displayStatus}
          </span>
        </div>

        {/* Action Buttons (Bottom Right of Image - Fade in on hover) */}
        {(onEdit || onDelete) && (
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {onEdit && (
              <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="bg-blue-600/90 p-2 rounded-lg text-white hover:bg-blue-500 backdrop-blur-sm shadow-lg">
                <FaEdit size={14} />
              </button>
            )}
            {onDelete && (
              <button onClick={(e) => { e.stopPropagation(); if (window.confirm('Delete?')) onDelete(); }} className="bg-red-600/90 p-2 rounded-lg text-white hover:bg-red-500 backdrop-blur-sm shadow-lg">
                <FaTimes size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
          {species}
        </h3>

        <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
          <FaMapMarkerAlt className="text-emerald-500" />
          <span className="truncate">{location}</span>
        </div>

        {/* Footer-like Grid */}
        <div className="mt-auto pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-xs text-slate-500">
          {time && (
            <div className="flex flex-col">
              <span className="uppercase tracking-wider font-semibold text-slate-600 mb-1">Time</span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <FaClock className="text-emerald-500/70" /> {time.split('•')[0]} {/* Just Date */}
              </span>
            </div>
          )}
          {(observer || createdBy) && (
            <div className="flex flex-col">
              <span className="uppercase tracking-wider font-semibold text-slate-600 mb-1">Ranger</span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <FaUser className="text-emerald-500/70" /> {createdBy?.username || observer || "Ranger"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
