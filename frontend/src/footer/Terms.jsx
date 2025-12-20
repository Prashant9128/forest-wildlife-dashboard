import { FaGavel, FaHandshake, FaExclamationCircle } from "react-icons/fa";

export default function Terms() {
    return (
        <div className="min-h-screen bg-slate-900 text-white px-6 py-24">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
                    <p className="text-slate-400">
                        Please read these terms carefully before using the WildGuard platform.
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-8">

                    <div className="glass p-8 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <FaHandshake className="text-emerald-400 text-2xl" />
                            <h2 className="text-2xl font-bold">1. Agreement to Terms</h2>
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                            By accessing our website and using the WildGuard dashboard, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access the platform. We reserve the right to update these terms at any time.
                        </p>
                    </div>

                    <div className="glass p-8 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <FaGavel className="text-blue-400 text-2xl" />
                            <h2 className="text-2xl font-bold">2. Proper Use</h2>
                        </div>
                        <p className="text-slate-300 mb-4">Users must ensure that:</p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-300">
                            <li>All wildlife observation data submitted is accurate and truthful to the best of their knowledge.</li>
                            <li>They do not use the platform for poaching, illegal tracking, or harming wildlife in any way.</li>
                            <li>They do not attempt to hack, disrupt, or gain unauthorized access to the platform's backend systems.</li>
                        </ul>
                    </div>

                    <div className="glass p-8 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <FaExclamationCircle className="text-red-400 text-2xl" />
                            <h2 className="text-2xl font-bold">3. Acceptable Content</h2>
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                            You retain ownership of the images and data you submit, but you grant WildGuard a license to use, display, and analyze this content for conservation purposes. Offensive, harmful, or irrelevant content will be removed, and the user account may be suspended.
                        </p>
                    </div>

                    <div className="glass p-8 rounded-2xl border border-white/10">
                        <h2 className="text-2xl font-bold mb-4">4. Termination</h2>
                        <p className="text-slate-300 leading-relaxed">
                            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                        </p>
                    </div>

                </div>

                <div className="mt-12 text-center text-slate-500 text-sm">
                    <p>Effective Date: December 20, 2025</p>
                </div>
            </div>
        </div>
    );
}
