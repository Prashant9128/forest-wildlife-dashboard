import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown, FaChevronUp, FaQuestionCircle, FaBook, FaUserShield, FaSearch, FaTimes, FaExternalLinkAlt, FaHeadset } from "react-icons/fa";

const FAQS = [
    {
        q: "How do I report a new wildlife sighting?",
        a: "Navigate to the main Dashboard and click the 'Add Observation' button. You'll need to provide the species name, verify your location (using GPS or manual entry), and optionally upload a photo."
    },
    {
        q: "Who reviews the observations?",
        a: "Qualified Forest Rangers and Admins review every submission. Pending reports appear on your status list until they are verified for accuracy."
    },
    {
        q: "Is my location data secure?",
        a: "Yes. Precise location data for sensitive species (like Tigers or Rhinos) is restricted to authorized personnel only to prevent poaching risks."
    },
    {
        q: "Can I edit my submission later?",
        a: "Currently, users cannot edit submissions once approved to maintain data integrity. If you made a mistake, please contact support or delete the entry if it's still pending."
    },
    {
        q: "What should I do if I see an injured animal?",
        a: "Do not approach the animal. Use the 'Report Issue' subject in the Contact form immediately, or call the emergency ranger hotline listed on the Contact page."
    },
    {
        q: "How do I become a verified Ranger?",
        a: "Ranger status is granted after completing the WildGuard Field Training program. Contact your local administration for enrollment details."
    }
];

const DOC_CONTENTS = {
    guide: {
        title: "User Guide",
        content: `
### 1. Getting Started
Welcome to WildGuard. Start by creating an account and logging in. Your dashboard is your central hub for all activities.

### 2. Adding Observations
- Click the "Add Observation" button.
- Allow GPS access for accurate location tagging.
- Upload a clear photo of the wildlife.
- Select the conservation status if known.

### 3. Viewing the Map
The interactive map shows recent verified sightings. Red markers indicate endangered species, while green markers show protected ones.

### 4. Account Settings
You can update your profile and password from the settings menu in the top right corner.
        `
    },
    protocols: {
        title: "Ranger Protocols",
        content: `
### ⚠️ Safety First
- Never approach dangerous wildlife on foot without backup.
- Maintain a minimum distance of 50 meters from large herbivores.

### 📋 Data Collection
- Verify the species identification before submitting.
- Record behavioral notes (feeding, resting, migrating).
- Report any signs of poaching activity immediately via the emergency channel.

### 🤝 Community Interaction
- Educate locals about conservation when safe to do so.
- Do not disclose exact locations of Rhino or Tiger sightings to unauthorized persons.
        `
    }
};

export default function Help() {
    const [openIndex, setOpenIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeDoc, setActiveDoc] = useState(null);

    const faqRef = useRef(null);

    const filteredFAQs = FAQS.filter(f =>
        f.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.a.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const scrollToFAQs = () => {
        faqRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white px-6 py-24">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Hello, how can we help?</h1>
                    <p className="text-slate-400 mb-8">Search our knowledge base or browse frequently asked questions.</p>

                    <div className="relative max-w-xl mx-auto group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                            <FaSearch />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search keywords like 'location', 'image'..."
                            className="w-full bg-slate-800/50 border border-white/10 rounded-full py-4 pl-12 pr-6 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all backdrop-blur-sm"
                        />
                    </div>
                </div>

                {/* Quick Access Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <button
                        onClick={() => setActiveDoc('guide')}
                        className="glass p-6 rounded-2xl hover:bg-slate-800/80 transition-all hover:scale-[1.02] text-left border border-white/5 group"
                    >
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            <FaBook className="text-xl" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-emerald-300 transition-colors">User Guide</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">Complete documentation on how to use the dashboard features effectively.</p>
                    </button>

                    <button
                        onClick={() => setActiveDoc('protocols')}
                        className="glass p-6 rounded-2xl hover:bg-slate-800/80 transition-all hover:scale-[1.02] text-left border border-white/5 group"
                    >
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <FaUserShield className="text-xl" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-blue-300 transition-colors">Ranger Protocols</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">Official safety guidelines and data collection standards for field rangers.</p>
                    </button>

                    <button
                        onClick={scrollToFAQs}
                        className="glass p-6 rounded-2xl hover:bg-slate-800/80 transition-all hover:scale-[1.02] text-left border border-white/5 group"
                    >
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                            <FaQuestionCircle className="text-xl" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-purple-300 transition-colors">FAQs</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">Quick answers to the most common questions about the platform.</p>
                    </button>
                </div>

                {/* FAQ Section */}
                <div ref={faqRef} className="glass rounded-3xl p-8 border border-white/5 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <span className="w-1.5 h-8 bg-emerald-500 rounded-full"></span>
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-4">
                        {filteredFAQs.length > 0 ? (
                            filteredFAQs.map((item, idx) => (
                                <div key={idx} className="border-b border-white/5 last:border-0 pb-4 last:pb-0">
                                    <button
                                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                        className="w-full flex justify-between items-center text-left py-3 hover:text-emerald-400 transition-colors group"
                                    >
                                        <span className={`font-semibold text-lg ${openIndex === idx ? 'text-emerald-400' : 'text-white'}`}>
                                            {item.q}
                                        </span>
                                        <div className={`transition-transform duration-300 text-slate-500 group-hover:text-white ${openIndex === idx ? 'npm rotate-180' : ''}`}>
                                            {openIndex === idx ? <FaChevronUp /> : <FaChevronDown />}
                                        </div>
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
                                    >
                                        <p className="text-slate-400 text-sm leading-relaxed pb-2 pl-1">
                                            {item.a}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-slate-500">
                                <FaSearch className="text-4xl mx-auto mb-4 opacity-20" />
                                <p>No questions found matching "{searchTerm}"</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Link */}
                <div className="mt-16 text-center">
                    <p className="text-slate-400 mb-4">Still need help? Our support team is available 24/7.</p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-full font-medium transition-colors border border-white/10"
                    >
                        <FaHeadset className="text-emerald-400" /> Contact Support
                    </Link>
                </div>
            </div>

            {/* Document Modal */}
            {activeDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-fade-in" onClick={() => setActiveDoc(null)}>
                    <div className="glass w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col rounded-2xl border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-800/50">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <FaBook className="text-emerald-400" />
                                {DOC_CONTENTS[activeDoc].title}
                            </h2>
                            <button onClick={() => setActiveDoc(null)} className="text-slate-400 hover:text-white transition-colors">
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-white prose-a:text-emerald-400">
                                <div dangerouslySetInnerHTML={{
                                    __html: DOC_CONTENTS[activeDoc].content.replace(/\n/g, '<br />') // Simple markdown-like line breaks
                                }} />
                            </div>
                        </div>
                        <div className="p-6 border-t border-white/10 bg-slate-800/50 flex justify-end">
                            <button onClick={() => setActiveDoc(null)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
