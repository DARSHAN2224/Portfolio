import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CopilotWidget from '../components/CopilotWidget';

const Network = ({ chatHistory, setChatHistory }) => {
    const navigate = useNavigate();
    const [socialLinks, setSocialLinks] = useState([]);
    const [codingPlatforms, setCodingPlatforms] = useState([]);

    useEffect(() => {
        // Fetch social links and coding platforms
        fetch('/api/social-links')
            .then(res => res.json())
            .then(data => {
                const social = data.filter(link => link.platform === 'social');
                const coding = data.filter(link => link.platform === 'coding');
                setSocialLinks(social);
                setCodingPlatforms(coding);
            })
            .catch(err => console.error('Failed to fetch social links:', err));
    }, []);

    return (
        <div className="h-full w-full bg-background-dark p-6 overflow-hidden flex flex-col font-sans">
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Content Column (Network Uplink Window) */}
                <div className="lg:col-span-8 flex flex-col h-full bg-[#161b22] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
                    {/* Window Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#0d1117] border-b border-white/10 select-none">
                        <div className="flex items-center gap-3">
                            <div className="p-1 rounded bg-blue-500/20">
                                <span className="material-symbols-outlined text-blue-400 text-sm">hub</span>
                            </div>
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Network Uplink</span>
                        </div>
                        <div className="flex gap-1.5 opacity-100 transition-opacity group">
                            <button onClick={() => navigate('/desktop')} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center text-[8px] text-black/50 transition-colors" title="Close">✕</button>
                            <button onClick={() => navigate('/desktop')} className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 flex items-center justify-center text-[8px] text-black/50 transition-colors cursor-pointer" title="Minimize">─</button>
                            <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center text-[8px] text-black/50 transition-colors cursor-pointer" title="Expand">⤢</button>
                        </div>
                    </div>

                    {/* Toolbar / Status Bar */}
                    <div className="px-4 py-2 border-b border-white/5 bg-[#0d1117]/50 flex items-center gap-4 text-[10px] font-mono text-gray-400">
                        <div className="flex items-center gap-2">
                            <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate('/desktop')}>~/home</span>
                            <span>/</span>
                            <span className="text-primary">network</span>
                        </div>
                        <div className="w-[1px] h-3 bg-white/10"></div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[10px] text-green-500">wifi</span>
                            Connection established. Latency: 12ms
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#0d1117]/30">
                        <div className="space-y-8">
                            {/* Status Dashboard */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-[#161b22] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-gray-400 text-xs font-mono uppercase">Status</span>
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-1">ONLINE</div>
                                    <div className="text-xs text-gray-500 font-mono">Uptime: 99.99%</div>
                                </div>
                                <div className="bg-[#161b22] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-gray-400 text-xs font-mono uppercase">Packets</span>
                                        <span className="material-symbols-outlined text-primary text-sm">swap_vert</span>
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-1">842 TB</div>
                                    <div className="text-xs text-gray-500 font-mono">Total Transferred</div>
                                </div>
                                <div className="bg-[#161b22] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-gray-400 text-xs font-mono uppercase">Security</span>
                                        <span className="material-symbols-outlined text-yellow-500 text-sm">lock</span>
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-1">SECURE</div>
                                    <div className="text-xs text-gray-500 font-mono">AES-256 Encrypted</div>
                                </div>
                            </div>

                            {/* Socials Section */}
                            <section>
                                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                    Social_Nodes
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {socialLinks.map((link) => (
                                        <a
                                            key={link.name}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-[#161b22] hover:bg-[#1c2431] hover:border-primary/50 transition-all group relative overflow-hidden"
                                        >
                                            <div className={`p-3 rounded-lg bg-black/30 ${link.color} group-hover:scale-110 transition-transform`}>
                                                <span className="material-symbols-outlined text-2xl">{link.icon}</span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-white group-hover:text-primary transition-colors">{link.name}</h4>
                                                <p className="text-xs text-gray-500 font-mono">{link.url.replace('https://', '')}</p>
                                            </div>
                                            <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 border border-white/5 text-gray-400 group-hover:text-green-400 group-hover:border-green-400/30 transition-colors">
                                                {link.status}
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </section>

                            {/* Coding Platforms Section */}
                            <section>
                                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                                    Algorithmic_Rankings
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {codingPlatforms.map((platform) => (
                                        <a
                                            key={platform.name}
                                            href={platform.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-5 rounded-xl border border-white/10 bg-[#161b22] hover:-translate-y-1 hover:border-yellow-500/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.1)] transition-all group"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <span className={`material-symbols-outlined text-3xl ${platform.color}`}>{platform.icon}</span>
                                                <span className="material-symbols-outlined text-gray-600 group-hover:text-white transition-colors text-sm">open_in_new</span>
                                            </div>
                                            <div className="mb-2">
                                                <h4 className="font-bold text-lg text-white">{platform.name}</h4>
                                                <p className="text-xs text-yellow-400 font-mono">{platform.rank}</p>
                                            </div>
                                            <div className="w-full bg-gray-800 h-1 rounded-full mt-3 overflow-hidden">
                                                <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full w-[70%] group-hover:w-[85%] transition-all duration-700"></div>
                                            </div>
                                            <p className="text-[10px] text-right text-gray-500 mt-1 font-mono">{platform.solved} problems solved</p>
                                        </a>
                                    ))}
                                </div>
                            </section>
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

export default Network;
