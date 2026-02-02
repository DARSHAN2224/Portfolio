import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CopilotWidget from '../components/CopilotWidget';

const Skills = ({ chatHistory, setChatHistory }) => {
    const navigate = useNavigate();
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await fetch('/api/skills');
                const data = await response.json();
                setSkills(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch skills:", error);
                setLoading(false);
            }
        };
        fetchSkills();
    }, []);

    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
        const cat = skill.category || 'other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill);
        return acc;
    }, {});

    const SkillCard = ({ skill, accentColor }) => (
        <div key={skill._id} className="relative group bg-slate-900 border border-slate-700/50 rounded-lg p-4 hover:border-primary/50 transition-all hover:-translate-y-1">
            <div className={`absolute top-0 right-0 p-2 opacity-50 text-${accentColor}-400 group-hover:opacity-100 transition-opacity`}>
                <span className="material-symbols-outlined text-2xl">{skill.icon || 'code'}</span>
            </div>
            <h4 className="text-md font-bold text-white mb-2">{skill.name}</h4>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                <div className={`bg-${accentColor}-500 h-full rounded-full transition-all duration-1000`} style={{ width: `${skill.load}%` }}></div>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>VER: {skill.version || 'LATEST'}</span>
                <span className={`text-${accentColor}-400`}>{skill.load}% LOAD</span>
            </div>
        </div>
    );

    return (
        <div className="h-full w-full bg-background-dark p-6 overflow-hidden flex flex-col font-sans">
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Content Column (Skill Matrix Window) */}
                <div className="lg:col-span-8 flex flex-col h-full bg-[#161b22] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
                    {/* Window Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#0d1117] border-b border-white/10 select-none">
                        <div className="flex items-center gap-3">
                            <div className="p-1 rounded bg-green-500/20">
                                <span className="material-symbols-outlined text-green-400 text-sm">memory</span>
                            </div>
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Skill Matrix</span>
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
                            <span className="text-primary">skills</span>
                        </div>
                        <div className="w-[1px] h-3 bg-white/10"></div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            System Kernel: ONLINE
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#0d1117]/30">
                        {loading ? (
                            <div className="text-primary font-mono text-center mt-20 animate-pulse">
                                &gt; SCANNING_MODULES...
                            </div>
                        ) : (skills.length === 0 ? (
                            <div className="text-red-400 font-mono text-center mt-20">
                                &gt; SYSTEM_ERR: NO_MODULES_FOUND
                            </div>
                        ) : (
                            Object.entries(groupedSkills).map(([category, skills]) => (
                                <section key={category} className="mb-8">
                                    <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-[0.1em] border-b border-white/5 pb-2 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-base">
                                            {category === 'frontend' ? 'html' :
                                                category === 'backend' ? 'dns' :
                                                    category === 'devops' ? 'settings' : 'extension'}
                                        </span>
                                        {category}
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {skills.map((skill) => (
                                            <SkillCard key={skill._id} skill={skill} accentColor={
                                                category === 'frontend' ? 'blue' :
                                                    category === 'backend' ? 'green' :
                                                        category === 'devops' ? 'orange' :
                                                            category === 'servicenow' ? 'pink' : 'purple'
                                            } />
                                        ))}
                                    </div>
                                </section>
                            ))
                        ))}
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

export default Skills;
