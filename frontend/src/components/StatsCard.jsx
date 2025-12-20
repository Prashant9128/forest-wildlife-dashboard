export default function StatsCard({ label, value, trend, icon: Icon, color }) {
    // Parsing visual styles based on trend/color manually if needed, 
    // but trusting the props for flexibility.

    return (
        <div className="relative overflow-hidden p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-white/20">
            {/* Colored Gradient Background Layer (Low Opacity) */}
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>

            {/* Decorative Glow Blob */}
            <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${color} opacity-20 blur-3xl rounded-full group-hover:scale-125 transition-transform duration-700`}></div>

            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-white/60 mb-1 tracking-wide uppercase">{label}</p>
                    <h3 className="text-3xl font-bold text-white font-sans tracking-tight">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-20 backdrop-blur-sm border border-white/10 shadow-inner group-hover:rotate-12 transition-transform duration-300`}>
                    <Icon className="text-xl text-white opacity-90" />
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2 relative z-10">
                <div className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 text-emerald-300 inline-flex items-center gap-1 border border-white/5`}>
                    {trend === 'up' ? '↗ +12%' : trend === 'down' ? '↘ -5%' : '• Stable'}
                </div>
                <span className="text-xs text-white/40">vs last week</span>
            </div>
        </div>
    );
}
