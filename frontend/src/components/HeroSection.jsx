import { Link } from "react-router-dom";
import { FaPlus, FaMapMarkedAlt, FaLeaf } from "react-icons/fa";

export default function HeroSection({ greeting, username, onToggleMap, showMap }) {
    return (
        <div className="relative h-[500px] flex items-center justify-center text-center px-4 overflow-hidden rounded-b-[3rem] shadow-2xl mb-12 group">
            {/* Dynamic Background */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-[10s] ease-in-out group-hover:scale-105"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=2000")' }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-forest-950/60 to-slate-900"></div>
            </div>

            <div className="relative z-10 max-w-4xl animate-slide-up">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-forest-500/10 border border-forest-400/20 text-forest-300 font-medium mb-8 backdrop-blur-md shadow-lg shadow-black/20">
                    <FaLeaf className="text-sm animate-pulse-slow" />
                    <span className="uppercase tracking-wider text-xs font-bold">{greeting}, {username || 'Ranger'}</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight drop-shadow-2xl tracking-tight text-white">
                    Protecting Wildlife, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-300% animate-gradient">
                        Preserving Nature
                    </span>
                </h1>

                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-5">
                    <Link
                        to="/add-observation"
                        className="group relative px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1 overflow-hidden"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        <FaPlus className="text-lg" />
                        <span>Log Observation</span>
                    </Link>

                    <button
                        onClick={onToggleMap}
                        className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-3 border border-white/10 backdrop-blur-md transition-all hover:-translate-y-1"
                    >
                        <FaMapMarkedAlt className="text-lg text-blue-300" />
                        {showMap ? "Hide Map View" : "Explore Map"}
                    </button>
                </div>
            </div>
        </div>
    );
}
