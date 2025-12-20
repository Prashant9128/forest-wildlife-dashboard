// src/pages/Reports.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import { io } from "socket.io-client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // 🔹 Fetch reports (approved + pending)
  const fetchReports = async () => {
    try {
      const res = await api.get("/observations");
      setReports(res.data || []);
    } catch (err) {
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();

    const socket = io("http://localhost:5000", {
      withCredentials: true,
    });

    // 🔔 Real-time new/approved report
    socket.on("new-report", (report) => {
      setReports((prev) => {
        const exists = prev.find((r) => r._id === report._id);
        if (exists) return prev;
        return [report, ...prev];
      });

      if (report.approved === true) {
        alert(`✅ Report Approved: ${report.species}`);
      }
    });

    return () => socket.disconnect();
  }, []);

  // 🔍 Search + Filter
  const filteredReports = reports.filter((r) => {
    const matchSearch =
      r.species?.toLowerCase().includes(search.toLowerCase()) ||
      r.location?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "all" || r.status === statusFilter;

    return matchSearch && matchStatus;
  });

  // 🛡️ Admin action
  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/observations/${id}/status`, { status: newStatus });
      fetchReports();
    } catch (err) {
      alert("Action failed");
    }
  };

  // 📄 PDF Export
  const downloadPDF = async () => {
    const element = document.getElementById("reports");
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("reports.pdf");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">Reports</h1>
          <p className="text-white/60">
            Live conservation reports submitted by users
          </p>
        </div>

        {/* Search + Filter + PDF */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by species or location"
            className="px-4 py-2 rounded bg-slate-800 border border-white/10 w-full"
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="px-4 py-2 rounded bg-slate-800 border border-white/10"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            onClick={downloadPDF}
            className="bg-blue-600 px-4 py-2 rounded"
          >
            Download PDF
          </button>
        </div>

        {/* States */}
        {loading && <p className="text-white/50">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {/* Reports */}
        <div id="reports" className="space-y-4">
          {!loading && filteredReports.length === 0 && (
            <p className="text-white/50">No reports found.</p>
          )}

          {filteredReports.map((report) => (
            <div
              key={report._id}
              className="bg-slate-800 border border-white/10 rounded-xl p-6"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">
                  {report.species}
                </h2>

                {/* ✅ STATUS BADGE */}
                <span
                  className={`text-xs px-3 py-1 rounded-full ${report.status === "approved"
                      ? "bg-green-500/20 text-green-400"
                      : report.status === "rejected"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                >
                  {report.status}
                </span>
              </div>

              <p className="text-white/60 text-sm mb-1">
                📍 {report.location}
              </p>

              <p className="text-white/70 text-sm mb-3">
                {report.description}
              </p>

              {/* 🛡️ Admin Buttons (only if pending) */}
              {report.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(report._id, 'approved')}
                    className="bg-green-600 px-4 py-1 rounded text-sm hover:bg-green-500"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(report._id, 'rejected')}
                    className="bg-red-600 px-4 py-1 rounded text-sm hover:bg-red-500"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
