import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard";
import AddObservation from "./components/AddObservation";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Species from "./footer/Species"
import Reports from "./footer/Reports"
import Help from "./footer/Help"
import Contact from "./footer/Contact"
import Privacy from "./footer/Privacy"
import Terms from "./footer/Terms"

export default function App() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/species" element={<Species />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        {/* Protected Feature Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        {/* Protected/Feature Routes */}
        <Route path="/add-observation" element={
          <ProtectedRoute>
            <div className="min-h-screen flex items-center justify-center p-4 py-20 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=2000")' }}>
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
              <div className="w-full max-w-2xl relative z-10">
                <AddObservation />
              </div>
            </div>
          </ProtectedRoute>
        } />

        {/* Admin Protected Route */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </Layout>
  );
}
