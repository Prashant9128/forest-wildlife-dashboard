import { useState, useEffect } from "react";
import {
  FaChartPie, FaUsers,
  FaClipboardList, FaCheckCircle,
  FaExclamationTriangle, FaDownload, FaEnvelope, FaTimes
} from "react-icons/fa";
import { io } from "socket.io-client";

import Navbar from "../components/Navbar";
import AnalyticsChart from "../components/AnalyticsChart";
import StatsCard from "../components/StatsCard";
import api from "../api/axios";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [observations, setObservations] = useState([]);
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    totalObservations: 0,
    pendingApprovals: 0,
    flaggedContent: 0,
  });
  const [chartData, setChartData] = useState({
    species: [],
    trend: [],
    status: [],
  });
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  /* =========================
     FETCH DATA
  ========================= */
  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Observations
      const obsRes = await api.get("/observations/all");
      const obs = obsRes.data || [];
      setObservations(obs);

      // Users count
      const usersRes = await api.get("/auth/count");
      const totalUsers = usersRes.data.count || 0;

      // Messages
      const msgRes = await api.get("/messages");
      setMessages(msgRes.data || []);

      const totalObservations = obs.length;
      const pendingApprovals = obs.filter(o => o.status === 'pending').length;

      /* =========================
         SYSTEM FLAGS (REAL)
      ========================= */
      const now = new Date();
      const flaggedContent = obs.filter(o => {
        // pending > 3 days
        if (o.status === 'pending') {
          const days =
            (now - new Date(o.createdAt)) / (1000 * 60 * 60 * 24);
          if (days > 3) return true;
        }

        // missing critical data
        if (!o.coordinates || !o.image) return true;

        return false;
      }).length;

      setStatsData({
        totalUsers,
        totalObservations,
        pendingApprovals,
        flaggedContent,
      });

      /* =========================
         CHARTS
      ========================= */
      const speciesCounts = {};
      const statusCounts = { approved: 0, pending: 0, rejected: 0 };
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const trendMap = {};

      obs.forEach(o => {
        const sp = o.species || "Unknown";
        speciesCounts[sp] = (speciesCounts[sp] || 0) + 1;

        if (o.status === 'approved') statusCounts.approved++;
        else if (o.status === 'pending') statusCounts.pending++;
        else if (o.status === 'rejected') statusCounts.rejected++;

        const m = months[new Date(o.createdAt).getMonth()];
        trendMap[m] = (trendMap[m] || 0) + 1;
      });

      setChartData({
        species: Object.keys(speciesCounts)
          .map(k => ({ name: k, value: speciesCounts[k] }))
          .slice(0, 5),
        status: [
          { name: "Approved", value: statusCounts.approved },
          { name: "Pending", value: statusCounts.pending },
          { name: "Rejected", value: statusCounts.rejected },
        ],
        trend: months.slice(-6).map(m => ({
          name: m,
          value: trendMap[m] || 0,
        })),
      });

    } catch (err) {
      console.error("Admin fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     APPROVE / REJECT ACTION
  ========================= */
  const handleAction = async (id, newStatus) => {
    await api.put(`/observations/${id}/status`, { status: newStatus });
    fetchAdminData();
  };

  const deleteMessage = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await api.delete(`/messages/${id}`);
        if (selectedMessage?._id === id) setSelectedMessage(null); // Close modal if current message deleted
        fetchAdminData();
      } catch (error) {
        alert("Failed to delete message");
      }
    }
  };

  /* =========================
     SOCKET
  ========================= */
  useEffect(() => {
    fetchAdminData();

    const socket = io("https://forest-wildlife-dashboard.onrender.com", {
      withCredentials: true,
    });

    socket.on("admin-approved", fetchAdminData);
    socket.on("new-report", fetchAdminData);

    return () => socket.disconnect();
  }, []);

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-slate-900 text-white pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FaChartPie className="text-emerald-400" /> Admin Dashboard
          </h1>
          <button className="btn-secondary flex items-center gap-2">
            <FaDownload /> Export Data
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatsCard icon={FaClipboardList} label="Pending Approvals" value={statsData.pendingApprovals} />
              <StatsCard icon={FaCheckCircle} label="Total Observations" value={statsData.totalObservations} />
              <StatsCard icon={FaUsers} label="Total Rangers" value={statsData.totalUsers} />
              <StatsCard icon={FaExclamationTriangle} label="System Flags" value={statsData.flaggedContent} />
            </div>

            {/* 🔥 RESTORED CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              <div className="h-[350px] glass p-6 rounded-xl">
                <AnalyticsChart type="area" data={chartData.trend} title="Trends" />
              </div>
              <div className="h-[350px] glass p-6 rounded-xl">
                <AnalyticsChart type="bar" data={chartData.species} title="Top Species" />
              </div>
            </div>

            {statsData.pendingApprovals > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">
                  Pending Approvals
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {observations
                    .filter(o => o.status === 'pending')
                    .map(o => (
                      <div key={o._id} className="glass p-4 rounded-xl">
                        <h4 className="font-bold">{o.species}</h4>
                        <p className="text-sm text-slate-400">{o.location}</p>

                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleAction(o._id, 'approved')}
                            className="flex-1 bg-green-600 hover:bg-green-500 py-2 rounded text-sm transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(o._id, 'rejected')}
                            className="flex-1 bg-red-600 hover:bg-red-500 py-2 rounded text-sm transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* 🔥 Messages Section */}
            <div className="mt-10">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaEnvelope className="text-blue-400" /> User Messages
              </h3>
              {messages.length === 0 ? (
                <p className="text-slate-500">No messages yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {messages.map((msg) => (
                    <div
                      key={msg._id}
                      className="glass p-4 rounded-xl border border-blue-500/20 cursor-pointer hover:bg-slate-800/80 transition-all active:scale-[0.98]"
                      onClick={() => setSelectedMessage(msg)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-white text-lg">{msg.subject}</h4>
                        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">{new Date(msg.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-300 mb-4 line-clamp-2">{msg.message}</p>

                      <div className="flex justify-between items-center border-t border-white/10 pt-3">
                        <div>
                          <span className="block text-xs text-emerald-400 font-mono mb-1">{msg.email}</span>
                          <span className="text-xs text-slate-500 block">{msg.name}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMessage(msg._id);
                          }}
                          className="text-red-400 hover:text-red-300 text-xs px-3 py-1.5 rounded border border-red-500/30 hover:bg-red-500/20 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 🔥 Message Detail Modal */}
            {selectedMessage && (
              <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
                onClick={() => setSelectedMessage(null)}
              >
                <div
                  className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-2xl p-8 relative shadow-2xl"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition-colors"
                  >
                    <FaTimes />
                  </button>

                  <h2 className="text-3xl font-bold mb-2 text-white">{selectedMessage.subject}</h2>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400 mb-6 border-b border-white/10 pb-4">
                    <span className="text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">{selectedMessage.email}</span>
                    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                    <span className="text-white">{selectedMessage.name}</span>
                    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                    <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                  </div>

                  <div className="bg-slate-800/50 p-6 rounded-xl text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[50vh] overflow-y-auto border border-white/5">
                    {selectedMessage.message}
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => deleteMessage(selectedMessage._id)}
                      className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      Delete Message
                    </button>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
