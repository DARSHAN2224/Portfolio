import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CopilotWidget from '../components/CopilotWidget'; // Ensure this is imported if used

const Experience = ({ chatHistory, setChatHistory }) => {
    const navigate = useNavigate();
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const res = await fetch('/api/experience');
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();

                // Transform DB data to UI format if needed, or use directly
                // DB has: company, position, startDate, endDate, description, systemLogs (achievements)
                const formatted = data.map((exp, idx) => ({
                    id: exp._id,
                    role: exp.position,
                    company: exp.company,
                    period: `${new Date(exp.startDate).getFullYear()} - ${exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}`,
                    description: exp.description,
                    achievements: exp.systemLogs.map(log => log.achievement || log.outcome),
                    color: ['teal', 'blue', 'purple'][idx % 3]
                }));
                setExperiences(formatted);
            } catch (err) {
                console.error("Experience Load Error:", err);
                // Fallback to empty or error state
            } finally {
                setLoading(false);
            }
        };

        fetchExperience();
    }, []);

    // ... (keep JSX structure but use 'experiences' state)

    return (
        <div className="h-full w-full bg-background-dark p-6 overflow-hidden flex flex-col font-sans">
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Content Column (Combat Logs Window) */}
                <div className="lg:col-span-8 flex flex-col h-full bg-[#161b22] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
                    {/* Window Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#0d1117] border-b border-white/10 select-none">
                        <div className="flex items-center gap-3">
                            <div className="p-1 rounded bg-yellow-500/20">
                                <span className="material-symbols-outlined text-yellow-400 text-sm">history</span>
                            </div>
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Experience Logs</span>
                        </div>
                        <div className="flex gap-1.5 opacity-100 transition-opacity group">
                            <button onClick={() => navigate('/desktop')} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center text-[8px] text-black/50 transition-colors" title="Close">✕</button>
                            <button onClick={() => navigate('/desktop')} className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 flex items-center justify-center text-[8px] text-black/50 transition-colors cursor-pointer" title="Minimize">─</button>
                            <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center text-[8px] text-black/50 transition-colors cursor-pointer" title="Expand">⤢</button>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="px-4 py-2 border-b border-white/5 bg-[#0d1117]/50 flex items-center gap-4 text-[10px] font-mono text-gray-400">
                        <div className="flex items-center gap-2">
                            <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate('/desktop')}>~/home</span>
                            <span>/</span>
                            <span className="text-primary">experience</span>
                        </div>
                        <div className="w-[1px] h-3 bg-white/10"></div>
                        <span>&gt; Employment history loaded.</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#0d1117]/30">
                        <div className="relative border-l-2 border-white/10 ml-4 space-y-8 py-2">
                            {loading ? (
                                <div className="text-primary font-mono text-xs animate-pulse pl-8">Accessing Archives...</div>
                            ) : experiences.map((exp, index) => (
                                <div key={index} className="relative pl-8 group">
                                    {/* Timeline Node */}
                                    <div className="absolute -left-[9px] top-2 w-4 h-4 bg-background-dark border-2 border-primary rounded-full group-hover:bg-primary transition-colors"></div>

                                    {/* Content Card */}
                                    <div className="bg-[#111] border border-white/5 p-6 rounded-xl hover:border-primary/50 transition-all duration-300 group-hover:translate-x-1">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                                                <p className="text-primary font-mono text-sm">{exp.company}</p>
                                            </div>
                                            <div className="px-3 py-1 bg-white/5 rounded border border-white/10 text-xs font-mono text-gray-400 whitespace-nowrap">
                                                {exp.period}
                                            </div>
                                        </div>

                                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                                            {exp.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                                            {exp.achievements.length > 0 && exp.achievements.map((ach, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-black rounded text-[10px] text-gray-500 font-bold border border-white/10 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[10px] text-green-500">check</span>
                                                    {ach}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
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

export default Experience;
