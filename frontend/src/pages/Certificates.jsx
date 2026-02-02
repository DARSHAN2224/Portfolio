import { useNavigate } from 'react-router-dom';
import CopilotWidget from '../components/CopilotWidget';
import { useState, useEffect } from 'react';

const Certificates = ({ chatHistory, setChatHistory }) => {
    const navigate = useNavigate();
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCerts = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/certificates');
                const data = await res.json();
                setCerts(data);
            } catch (err) {
                console.error("Failed to fetch certs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCerts();
    }, []);

    return (
        <div className="h-full w-full bg-background-dark p-6 overflow-hidden flex flex-col font-sans">
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Content Column (Certification Vault Window) */}
                <div className="lg:col-span-8 flex flex-col h-full bg-[#161b22] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
                    {/* Window Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#0d1117] border-b border-white/10 select-none">
                        <div className="flex items-center gap-3">
                            <div className="p-1 rounded bg-purple-500/20">
                                <span className="material-symbols-outlined text-purple-400 text-sm">verified</span>
                            </div>
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Certification Vault</span>
                        </div>
                        <div className="flex gap-1.5 opacity-100 transition-opacity group">
                            <button onClick={() => navigate('/desktop')} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center text-[8px] text-black/50 transition-colors" title="Close">✕</button>
                            <button onClick={() => navigate('/desktop')} className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 flex items-center justify-center text-[8px] text-black/50 transition-colors cursor-pointer" title="Minimize">─</button>
                            <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center text-[8px] text-black/50 transition-colors cursor-pointer" title="Expand">⤢</button>
                        </div>
                    </div>

                    {/* Toolbar (New addition) */}
                    <div className="px-4 py-2 border-b border-white/5 bg-[#0d1117]/50 flex items-center gap-4 text-[10px] font-mono text-gray-400">
                        <div className="flex items-center gap-2">
                            <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate('/desktop')}>~/home</span>
                            <span>/</span>
                            <span className="text-primary">certs</span>
                        </div>
                        <div className="w-[1px] h-3 bg-white/10"></div>
                        <span className="material-symbols-outlined text-[10px] text-purple-400">verified_user</span>
                        <span>Credentials verified.</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#0d1117]/30">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {certs.map((cert) => (
                                <div key={cert.id} className="relative group bg-[#111] border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-lg">
                                    {/* Background Icon Watermark */}
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                        <span className={`material-symbols-outlined text-9xl ${cert.color}`}>{cert.icon}</span>
                                    </div>

                                    <div className="relative z-10">
                                        <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 group-hover:border-white/10 backdrop-blur-sm">
                                            <span className={`material-symbols-outlined text-3xl ${cert.color}`}>{cert.icon}</span>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{cert.title}</h3>
                                        <p className="text-gray-400 text-sm mb-6 font-medium">{cert.issuer}</p>

                                        <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-auto">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Reference ID</span>
                                                <span className="text-xs font-mono text-gray-300 group-hover:text-white">{cert.id_code}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Issued</span>
                                                <span className="text-xs font-mono text-gray-300">{cert.date}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Embedded Copilot */}
                <div className="hidden lg:block lg:col-span-4 h-full bg-[#050a10] rounded-xl overflow-hidden border border-white/5">
                    <CopilotWidget chatHistory={chatHistory} setChatHistory={setChatHistory} className="h-full" />
                </div>
            </div>
        </div>
    );
};

export default Certificates;
