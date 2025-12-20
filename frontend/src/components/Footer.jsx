import { Link } from "react-router-dom";
import { FaLeaf, FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-white/10 pt-12 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="bg-green-600 p-2 rounded-lg">
                <FaLeaf className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-white">
                WildGuard
              </span>
            </Link>

            <p className="text-white/60 max-w-sm mb-4">
              Protecting wildlife through technology and community awareness.
            </p>

            <div className="flex gap-4">
              <a href="https://github.com/Prashant9128" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white">
                <FaGithub size={20} />
              </a>
              <a href="https://x.com/Prashant941709" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white">
                <FaTwitter size={20} />
              </a>
              <a href="https://www.linkedin.com/in/imprashant9417" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="footer-link">Dashboard</Link></li>
              <li><Link to="/species" className="footer-link">Species</Link></li>
              <li><Link to="/reports" className="footer-link">Reports</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-3">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="footer-link">Help</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
              <li><Link to="/privacy" className="footer-link">Privacy</Link></li>
              <li><Link to="/terms" className="footer-link">Terms</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-4 text-center text-sm text-white/50">
          © {new Date().getFullYear()} WildGuard. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
