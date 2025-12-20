import { useState, useEffect, useMemo, useContext } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch, FaTree, FaPaw,
  FaTimes, FaUsers, FaShieldAlt, FaSyncAlt, FaArrowRight,
  FaMapMarkerAlt, FaUser, FaClock, FaEdit
} from "react-icons/fa";
import AddObservation from "../components/AddObservation";
import Footer from "../components/Footer";
import StatsCard from "../components/StatsCard";
import FilterBar from "../components/FilterBar";
import ObservationCard from "../components/ObservationCard";
import WildlifeMap from "../components/WildlifeMap";
import HeroSection from "../components/HeroSection";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [isSortedAsc, setIsSortedAsc] = useState(false);
  const [greeting, setGreeting] = useState("Hello");
  const [editingObservation, setEditingObservation] = useState(null); // State for editing
  const [selectedObservation, setSelectedObservation] = useState(null); // State for viewing details
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    date: "Any Date",
  });

  // Dynamic Greeting Logic
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Fetch Observations from Backend (Real API Call)
  const fetchObservations = async () => {
    setLoading(true);
    try {
      const response = await api.get("/observations");
      if (response.data) {
        setObservations(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch observations:", err);
      // Fallback or Toast here
    } finally {
      setLoading(false);
    }
  };

  // Admin Delete Handler
  const handleDelete = async (id) => {
    try {
      await api.delete(`/observations/${id}`);
      // Remove from state immediately
      setObservations(prev => prev.filter(obs => obs._id !== id));
      alert("Observation deleted successfully");
    } catch (err) {
      console.error("Failed to delete observation:", err);
      alert("Failed to delete. You might not have permission.");
    }
  };

  useEffect(() => {
    fetchObservations();
  }, []);

  // Optimized Filter Logic
  const filteredObservations = useMemo(() => {
    return observations
      .filter((obs) => {
        const searchLower = filters.search.toLowerCase();

        const descMatch = obs.description?.toLowerCase().includes(searchLower) || "";

        const matchesSearch =
          obs.species?.toLowerCase().includes(searchLower) ||
          obs.location?.toLowerCase().includes(searchLower) ||
          obs.observer?.toLowerCase().includes(searchLower) ||
          descMatch;

        const matchesStatus =
          filters.status === "all" ||
          obs.status?.toLowerCase() === filters.status.toLowerCase();

        let matchesDate = true;
        if (filters.date !== "Any Date" && obs.createdAt) {
          const obsDate = new Date(obs.createdAt);
          const now = new Date();
          const diffHours = (now - obsDate) / (1000 * 60 * 60);

          if (filters.date === "today") matchesDate = diffHours < 24;
          else if (filters.date === "week") matchesDate = diffHours < 24 * 7;
          else if (filters.date === "month") matchesDate = diffHours < 24 * 30;
        }

        return matchesSearch && matchesStatus && matchesDate;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return isSortedAsc ? dateA - dateB : dateB - dateA;
      });
  }, [observations, filters, isSortedAsc]);

  // Dynamic Stats Calculation
  const stats = useMemo(() => {
    return {
      total: observations.length,
      endangered: observations.filter(o => o.status?.toLowerCase() === 'endangered').length,
      rangers: new Set(observations.map(o => o.observer || "Ranger")).size,
      locations: new Set(observations.map(o => o.location)).size
    };
  }, [observations]);

  const resetFilters = () => {
    setFilters({ search: "", status: "all", date: "Any Date" });
    setIsSortedAsc(false);
  };

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        greeting={greeting}
        username={user?.username}
        onToggleMap={() => setShowMap(!showMap)}
        showMap={showMap}
      />

      <div className="px-4 md:px-8 max-w-7xl mx-auto -mt-20 relative z-20 pb-20">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard
            label="Total Observations"
            value={stats.total}
            trend="up"
            icon={FaTree}
            color="from-forest-500 to-emerald-700"
          />
          <StatsCard
            label="Endangered Species"
            value={stats.endangered}
            trend="warning"
            icon={FaPaw}
            color="from-amber-500 to-orange-700"
          />
          <StatsCard
            label="Active Rangers"
            value={stats.rangers}
            trend="up"
            icon={FaUsers}
            color="from-blue-500 to-indigo-700"
          />
          <StatsCard
            label="Locations Monitored"
            value={stats.locations}
            trend="up"
            icon={FaShieldAlt}
            color="from-violet-500 to-purple-700"
          />
        </div>

        {/* Map Section */}
        {showMap && (
          <div className="mb-10 animate-scale-in relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 group">
            <button
              onClick={() => setShowMap(false)}
              className="absolute top-4 right-4 z-[1001] bg-slate-900/80 text-white p-2.5 rounded-full hover:bg-red-500/80 transition-colors backdrop-blur-md shadow-lg"
            >
              <FaTimes />
            </button>
            <WildlifeMap observations={observations} />
          </div>
        )}

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-serif font-bold text-white mb-6 border-b border-white/10 pb-4">Filters</h3>
              <FilterBar
                searchTerm={filters.search}
                onSearchChange={(val) => setFilters(prev => ({ ...prev, search: val }))}
                filterStatus={filters.status}
                onFilterChange={(val) => setFilters(prev => ({ ...prev, status: val }))}
                filterDate={filters.date}
                onDateChange={(val) => setFilters(prev => ({ ...prev, date: val }))}
                isSortedAsc={isSortedAsc}
                onSortChange={() => setIsSortedAsc(!isSortedAsc)}
              />
            </div>
          </div>

          {/* Feed */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-serif font-bold text-white flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-forest-500 box-content border-4 border-forest-500/20"></span>
                Recent Sightings
              </h2>
              <button
                onClick={fetchObservations}
                className={`p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-white/5 ${loading ? 'animate-spin' : ''}`}
                title="Refresh Data"
              >
                <FaSyncAlt />
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-64 rounded-2xl bg-slate-800/50 animate-pulse border border-white/5"></div>
                ))}
              </div>
            ) : filteredObservations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredObservations.map((obs) => (
                  <ObservationCard
                    key={obs._id || obs.id}
                    {...obs}
                    createdBy={obs.createdBy}
                    time={new Date(obs.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' • ' + new Date(obs.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    onDelete={user?.role === 'admin' ? () => handleDelete(obs._id) : null}
                    onEdit={user?.role === 'admin' ? () => setEditingObservation(obs) : null}
                    onClick={() => setSelectedObservation(obs)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-slate-800/30 border border-dashed border-slate-700 rounded-3xl p-16 text-center">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaSearch className="text-3xl text-slate-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">No sightings found</h3>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                  We couldn't find any observations matching your current filters. Try adjusting them or add a new one.
                </p>
                {observations.length === 0 ? (
                  <Link to="/add-observation" className="bg-forest-600 hover:bg-forest-500 text-white px-8 py-3 rounded-xl font-medium transition-colors inline-block shadow-lg shadow-forest-500/20">
                    Add First Observation
                  </Link>
                ) : (
                  <button onClick={resetFilters} className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-2 mx-auto hover:underline">
                    Clear all filters <FaArrowRight className="text-sm" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Edit Modal Logic */}
      {editingObservation && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-4xl relative">
            <AddObservation
              onClose={() => {
                setEditingObservation(null);
                fetchObservations(); // Refresh list after edit
              }}
              initialData={editingObservation}
            />
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {selectedObservation && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedObservation(null)}
        >
          <div
            className="w-full max-w-3xl bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedObservation(null)}
              className="absolute top-4 right-4 z-50 bg-black/40 text-white p-2 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <FaTimes />
            </button>

            {/* Image Side */}
            <div className="w-full md:w-1/2 h-64 md:h-auto relative">
              {selectedObservation.image ? (
                <img
                  src={selectedObservation.image}
                  alt={selectedObservation.species}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                  <FaPaw className="text-6xl text-slate-600" />
                </div>
              )}
              <div className="absolute bottom-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-lg 
                        ${selectedObservation.status === 'endangered' ? 'bg-red-500/90' :
                    selectedObservation.status === 'vulnerable' ? 'bg-amber-500/90' : 'bg-emerald-500/90'} text-white`}>
                  {selectedObservation.conservationStatus || selectedObservation.status}
                </span>
              </div>
            </div>

            {/* Content Side */}
            <div className="w-full md:w-1/2 p-8 flex flex-col bg-slate-900/50">
              <h2 className="text-3xl font-serif font-bold text-white mb-2">{selectedObservation.species}</h2>

              <div className="space-y-4 flex-grow">
                <div className="flex items-center gap-2 text-slate-400">
                  <FaMapMarkerAlt className="text-emerald-500" />
                  <span>{selectedObservation.location}</span>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Field Notes</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {selectedObservation.description || "No description provided by the ranger."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <span className="block text-xs text-slate-500 mb-1">OBSERVER</span>
                    <div className="flex items-center gap-2 text-white">
                      <FaUser className="text-emerald-500/50" />
                      <span>{selectedObservation.createdBy?.username || selectedObservation.observer || "Unknown Ranger"}</span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 mb-1">DATE</span>
                    <div className="flex items-center gap-2 text-white">
                      <FaClock className="text-emerald-500/50" />
                      <span>{new Date(selectedObservation.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {user?.role === 'admin' && (
                <div className="mt-8 pt-6 border-t border-white/10 flex gap-3">
                  <button
                    onClick={() => {
                      setEditingObservation(selectedObservation);
                      setSelectedObservation(null);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(selectedObservation._id);
                      setSelectedObservation(null);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
