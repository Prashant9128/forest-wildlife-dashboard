import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEffect } from "react";

export default function Layout({ children }) {
    const location = useLocation();

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-white font-sans selection:bg-forest-500 selection:text-white">
            {/* Navbar always visible */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 w-full relative">
                {children}
            </main>

            {/* Footer always visible */}
            <Footer />
        </div>
    );
}
