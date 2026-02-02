import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CopilotWidget from '../components/CopilotWidget';

const Achievements = ({ chatHistory, setChatHistory }) => {
    const navigate = useNavigate();
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const res = await fetch('/api/profile');
                const data = await res.json();
                if (data.achievements && Array.isArray(data.achievements)) {
                    setAchievements(data.achievements);
                }
            } catch (err) {
                console.error('Failed to fetch achievements:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, []);

    return (
        <div className="h-full w-full bg-background-dark p-6 overflow-hidden flex flex-col">
            <header className="mb-6 shrink-0">
                <h2 className="text-3xl font-display font-bold text-white tracking-wide">
                    ACHIE VEMENT <span className="text-primary">LOGS</span>
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-400 font-mono mt-1">
                    <span className="material-symbols-outlined text-[16px]">military_tech</span>
                    &gt; Unlocked milestones.
                </div>
            </header>

            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Achievements List */}
                <div className="lg:col-span-8 overflow-y-auto custom-scrollbar pr-2">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-32 bg-white/5 rounded-xl border border-white/5"></div>
                            ))}
                        </div>
                    ) : achievements.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {achievements.map(ach => (
                                <div key={ach.id || ach._id} className="flex items-start gap-4 p-6 bg-[#161b22] border border-white/5 rounded-xl hover:border-primary/50 transition-all duration-300 group hover:-translate-y-1">
                                    <div className={`shrink-0 w-16 h-16 rounded-xl bg-black/30 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors`}>
                                        <span className={`material-symbols-outlined text-3xl ${ach.color || 'text-cyan-400'}`}>{ach.icon || 'star'}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{ach.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">{ach.desc || ach.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            <p className="text-center">No achievements found. Update your profile to add achievements.</p>
                        </div>
                    )}
                </div>

                {/* Embedded Copilot */}
                <div className="hidden lg:block lg:col-span-4 h-full bg-[#050a10] rounded-xl overflow-hidden border border-white/5">
                    <CopilotWidget chatHistory={chatHistory} setChatHistory={setChatHistory} className="h-full" />
                </div>
            </div>
        </div>
    );
};

export default Achievements;
