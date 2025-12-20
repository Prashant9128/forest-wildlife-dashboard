import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { FaLeaf, FaHome, FaSignInAlt, FaUserPlus, FaShieldAlt, FaBars, FaTimes, FaSignOutAlt, FaUser } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      // LocalStorage aur Context dono se user ko hataya
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // --- UPDATED LOGIC: Role-based Navigation Links ---
  const navLinks = [
    { path: "/", label: "Dashboard", icon: FaHome },
  ];

  // 1. Agar user 'admin' hai, toh Admin Panel ka link add karo
  if (user && user.role === 'admin') {
    navLinks.push({ path: "/admin", label: "Admin Panel", icon: FaShieldAlt });
  }

  // 2. Agar user logged in nahi hai, toh Login/Register links add karo
  if (!user) {
    navLinks.push({ path: "/login", label: "Login", icon: FaSignInAlt });
    navLinks.push({ path: "/register", label: "Register", icon: FaUserPlus });
  }
  // ----------------------------------------------------

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-forest-500 to-forest-700 p-2.5 rounded-xl shadow-lg group-hover:shadow-forest-500/50 transition-all duration-300 group-hover:scale-110">
              <FaLeaf className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold bg-gradient-to-r from-forest-400 to-emerald-200 bg-clip-text text-transparent tracking-tight">
                WildGuard
              </h1>
              <p className="text-[10px] uppercase tracking-[0.15em] text-white/50 -mt-0.5 font-medium">Conservation</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 text-sm ${isActive(link.path)
                    ? "bg-forest-600 text-white shadow-lg shadow-forest-900/20"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <Icon className="text-sm opacity-80" />
                  {link.label}
                </Link>
              );
            })}

            {user && (
              <div className="flex items-center gap-4 ml-6 pl-6 border-l border-white/10">
                <div className="flex items-center gap-3 text-white/90" title={user.email}>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-forest-500 to-emerald-600 flex items-center justify-center text-xs font-bold shadow-inner ring-2 ring-forest-900/50">
                    {(user.username || user.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:flex flex-col">
                    <span className="text-sm font-semibold leading-tight">
                      {(user.username || user.name || "User").split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-white/50 uppercase tracking-wider">
                      {user.role || "Ranger"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-full text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
                  title="Logout"
                >
                  <FaSignOutAlt className="text-lg" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white/80 hover:bg-white/10 transition-all duration-300"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-slide-down border-t border-white/5 bg-slate-900/95 backdrop-blur-xl">
          <div className="px-4 py-6 flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl font-medium transition-all duration-300 ${isActive(link.path)
                    ? "bg-forest-600/20 text-forest-300 border border-forest-500/20"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <Icon className="text-lg" />
                  {link.label}
                </Link>
              );
            })}

            {user && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-4 px-4 py-4 rounded-xl font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-300 w-full text-left"
                >
                  <FaSignOutAlt className="text-lg" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
