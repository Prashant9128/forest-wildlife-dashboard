import { FaShieldAlt, FaLock, FaUserSecret, FaDatabase } from "react-icons/fa";

export default function Privacy() {
    return (
        <div className="min-h-screen bg-slate-900 text-white px-6 py-24">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-12 border-b border-white/10 pb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <FaShieldAlt className="text-emerald-400 text-3xl" />
                        <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
                    </div>
                    <p className="text-slate-400">
                        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-12">

                    <section>
                        <h2 className="text-2xl font-bold text-emerald-300 mb-4">1. Information We Collect</h2>
                        <div className="glass p-6 rounded-xl space-y-4 text-slate-300">
                            <p>
                                At WildGuard, we collect minimal personal information necessary to provide our wildlife monitoring services. This includes:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong className="text-white">Account Information:</strong> Username, email address, and role (Ranger/Admin).</li>
                                <li><strong className="text-white">Observation Data:</strong> GPS coordinates, images, and species details submitted by rangers.</li>
                                <li><strong className="text-white">Usage Data:</strong> Timestamps of logins and report submissions for audit trails.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-emerald-300 mb-4">2. How We Use Your Data</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass p-6 rounded-xl border-l-4 border-blue-500">
                                <div className="flex items-center gap-3 mb-3">
                                    <FaDatabase className="text-blue-400" />
                                    <h3 className="font-bold text-lg">Conservation Analysis</h3>
                                </div>
                                <p className="text-sm text-slate-400">
                                    Observation data is aggregated to track species populations, migration patterns, and potential threats to wildlife habitats.
                                </p>
                            </div>

                            <div className="glass p-6 rounded-xl border-l-4 border-emerald-500">
                                <div className="flex items-center gap-3 mb-3">
                                    <FaUserSecret className="text-emerald-400" />
                                    <h3 className="font-bold text-lg">Platform Security</h3>
                                </div>
                                <p className="text-sm text-slate-400">
                                    User accounts are verified to prevent unauthorized access to sensitive location data of endangered species.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-emerald-300 mb-4">3. Data Protection</h2>
                        <div className="glass p-6 rounded-xl text-slate-300">
                            <p className="mb-4">
                                We implement industry-standard security measures to protect your data:
                            </p>
                            <div className="flex items-start gap-4 mb-4">
                                <FaLock className="text-emerald-400 mt-1 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-white">Encryption</h4>
                                    <p className="text-sm">All sensitive data is encrypted in transit using SSL/TLS and at rest in our secure databases.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <FaShieldAlt className="text-emerald-400 mt-1 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-white">Access Control</h4>
                                    <p className="text-sm">Strict role-based access control (RBAC) ensures only authorized rangers and admins can view sensitive location data.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-emerald-300 mb-4">4. Contact Us</h2>
                        <p className="text-slate-400">
                            If you have any questions about this Privacy Policy, please contact us at <a href="/contact" className="text-emerald-400 hover:underline">support@wildguard.org</a>.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}
