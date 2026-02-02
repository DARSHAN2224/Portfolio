import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CopilotWidget from '../components/CopilotWidget';
import TypingText from '../components/TypingText';

const Desktop = ({ chatHistory, setChatHistory }) => {
    const navigate = useNavigate();
    const [roles, setRoles] = useState(['Full Stack Engineer']);
    const [trends, setTrends] = useState([]);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        // Fetch Configuration and Trends
        const fetchData = async () => {
            try {
                // Fetch Roles
                const rolesRes = await fetch('/api/meta/config/user_roles');
                if (rolesRes.ok) {
                    const data = await rolesRes.json();
                    if (Array.isArray(data.value)) setRoles(data.value);
                }

                // Fetch Trends
                const trendsRes = await fetch('/api/meta/trends');
                if (trendsRes.ok) {
                    const data = await trendsRes.json();
                    setTrends(data);
                }

                // Fetch Profile
                const profileRes = await fetch('/api/profile');
                if (profileRes.ok) {
                    const data = await profileRes.json();
                    setProfile(data);
                }
            } catch (err) {
                console.error("Failed to fetch desktop meta:", err);
            }
        };

        fetchData();
    }, []);

    const [currentTrendIndex, setCurrentTrendIndex] = useState(0);

    // Trend Slideshow
    useEffect(() => {
        if (trends.length === 0) return;
        const interval = setInterval(() => {
            setCurrentTrendIndex(prev => (prev + 1) % Math.min(trends.length, 3)); // Cycle top 3
        }, 4000);
        return () => clearInterval(interval);
    }, [trends]);

    return (
        <div className="relative font-display bg-background-dark text-white h-full w-full overflow-hidden flex flex-col">
            {/* Desktop Background Wallpaper */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-40 pointer-events-none"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBuji9lxxI9j53PNX6sEPj4eIEMwqEo_8iChzSWYrhQP4b4bs_JCooKrumsjXoDwln9GaQIKiDYLzI7YXRVERVx2gte-tx_5vrj2T8i9byiImi_jyOmcmSu3Wmp2TGhaUoM6Vf2kbK66C2_6Okd0tfhF7WG_0HtQhDuh6sMJ8xezUiq0hs_SkKSLuONUdbaSpCZpjdgJ3UZpLGM8Q6-P2NoLTlatZt6QJeWvjhJNbf6ByfE7zuo6JeXunveTW8hAZu5LlGWn-GXEh0")' }}
            ></div>

            {/* Trending Ticker (AI Analysis) */}
            <div className="absolute top-0 left-0 w-full bg-black/40 backdrop-blur-sm border-b border-white/5 z-20 overflow-hidden h-8 flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-primary uppercase animate-pulse">AI_ANALYSIS_V2:</span>
                    <div className="h-5 w-64 relative overflow-hidden flex items-center justify-center">
                        {trends.slice(0, 3).map((t, i) => (
                            <span
                                key={i}
                                className={`text-[10px] font-mono text-gray-400 absolute transition-all duration-1000 transform ${i === currentTrendIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                            >
                                "{t.word}" <span className="text-green-500">({t.count} hits)</span>
                            </span>
                        ))}
                        {trends.length === 0 && <span className="text-[10px] font-mono text-gray-500">Establishing monthly connection...</span>}
                    </div>
                </div>
            </div>

            {/* Main Container */}
            <div className="relative z-10 flex flex-col h-full w-full p-6 pt-12 overflow-hidden">

                {/* Desktop Area */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden min-h-0">

                    {/* Desktop Icons (Left Side) */}
                    <div className="col-span-12 lg:col-span-2 flex lg:flex-col flex-row flex-wrap gap-8 items-start lg:items-center justify-start lg:justify-center p-4">
                        {/* Resume */}
                        <a href="/Darshan_P_resume.pdf" download="Darshan_P_resume.pdf" className="group flex flex-col items-center gap-2 cursor-pointer w-24">
                            <div className="w-16 h-16 rounded-xl bg-[#232f48]/50 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-[#232f48] group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(19,91,236,0.5)] shadow-sm">
                                <span className="material-symbols-outlined text-4xl text-[#92a4c9] group-hover:text-primary transition-colors">description</span>
                            </div>
                            <p className="text-xs font-medium text-center text-gray-300 bg-black/30 rounded px-2 py-0.5 backdrop-blur-sm group-hover:text-white">Resume</p>
                        </a>

                        {/* Contact */}
                        <div onClick={() => navigate('/contact')} className="group flex flex-col items-center gap-2 cursor-pointer w-24">
                            <div className="w-16 h-16 rounded-xl bg-[#232f48]/50 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-[#232f48] group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(19,91,236,0.5)] shadow-sm">
                                <span className="material-symbols-outlined text-4xl text-[#92a4c9] group-hover:text-primary transition-colors">alternate_email</span>
                            </div>
                            <p className="text-xs font-medium text-center text-gray-300 bg-black/30 rounded px-2 py-0.5 backdrop-blur-sm group-hover:text-white">Contact</p>
                        </div>

                        {/* Experience */}
                        <div onClick={() => navigate('/experience')} className="group flex flex-col items-center gap-2 cursor-pointer w-24">
                            <div className="w-16 h-16 rounded-xl bg-[#232f48]/50 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-[#232f48] group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(19,91,236,0.5)] shadow-sm">
                                <span className="material-symbols-outlined text-4xl text-[#92a4c9] group-hover:text-primary transition-colors">history</span>
                            </div>
                            <p className="text-xs font-medium text-center text-gray-300 bg-black/30 rounded px-2 py-0.5 backdrop-blur-sm group-hover:text-white">Experience</p>
                        </div>
                    </div>

                    {/* Central Identity Card */}
                    <div className="col-span-12 lg:col-span-6 flex items-center justify-center">
                        <div className="w-full max-w-lg bg-[#102023]/80 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden shadow-2xl relative group transform hover:scale-[1.01] transition-transform duration-500">
                            <div className="absolute inset-0 pointer-events-none z-0 bg-grid-pattern opacity-10"></div>

                            {/* Header */}
                            <header className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-white/10 select-none z-10">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <span className="material-symbols-outlined text-[18px]">badge</span>
                                    <span className="text-xs font-bold uppercase tracking-widest">User_Identity_V2</span>
                                </div>
                                <div className="flex gap-1.5 opacity-100 transition-opacity group">
                                    <button onClick={() => navigate('/desktop')} className="w-2.5 h-2.5 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center text-[8px] text-black/50 transition-colors" title="Close Protocol">✕</button>
                                    <button className="w-2.5 h-2.5 rounded-full bg-yellow-500 hover:bg-yellow-400 flex items-center justify-center text-[8px] text-black/50 transition-colors" title="Minimize">─</button>
                                    <button className="w-2.5 h-2.5 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center text-[8px] text-black/50 transition-colors" title="Expand">⤢</button>
                                </div>
                            </header>

                            {/* Content */}
                            <div className="p-8 flex flex-col items-center justify-center font-mono relative z-10">
                                <div className="w-28 h-28 rounded-full bg-primary/20 mb-6 border-2 border-primary/50 flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(13,204,242,0.3)]">
                                    <img src={profile?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCwZOJVkZU2KW4RX0c5lPzSF_jQdc3jheBDtr8sDtWW9jndD7JINNq-vAt0sDbxFq3WvqkVM5_MAwDWekGQZ0VuGW4ZDQacMeUJFBj2wdjX964ePuvsVr5mDMm9vznWS45LEt2QeqGSzZhg0_cpZJTNJNKyPkuFI-xyKFnCfG8mGz-9CJ7kEs9PBdz-bVn8ZLQP9ea5w4R1X0hi7DWxJIdE7TEF2gerwet_aG3jvA_XPRGjcxvsI0fJwhMzd3z1iVNgaf83dflSo0I"} alt="User" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500" />
                                </div>

                                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">{profile?.name?.toUpperCase() || 'DARSHAN P'}</h1>
                                <div className="flex items-center gap-2 text-primary text-xs tracking-widest uppercase mb-6 bg-primary/10 px-3 py-1 rounded min-h-[28px] whitespace-nowrap overflow-hidden">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-blink flex-shrink-0"></span>
                                    <TypingText texts={roles} speed={100} pause={2000} />
                                </div>

                                <div className="w-full grid grid-cols-2 gap-4 text-xs text-gray-400 mb-8 border-t border-white/5 pt-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-slate-500 font-bold">LOCATION</span>
                                        <span>{profile?.location || 'San Francisco, CA'}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-slate-500 font-bold">STATUS</span>
                                        <span className="text-green-400">{profile?.systemStatus === 'OPTIMAL' ? 'OPEN TO WORK' : profile?.systemStatus === 'WARNING' ? 'CURRENTLY EMPLOYED' : 'NOT AVAILABLE'}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-slate-500 font-bold">SYSTEM</span>
                                        <span className="text-[10px] leading-tight line-clamp-3">{profile?.systemDescription || 'DarshanOS v2.4'}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-slate-500 font-bold">UPTIME</span>
                                        <span>{profile?.uptime || '12 Years'}</span>
                                    </div>
                                </div>

                                <button onClick={() => navigate('/about')} className="w-full mt-4 py-3 border border-slate-600 rounded hover:bg-white/5 hover:border-white hover:text-white transition-all text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 group/btn">
                                    Initialize Bio Protocol
                                    <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Embedded Copilot (Right Side) */}
                    <div className="hidden lg:block lg:col-span-4 h-full bg-[#050a10] rounded-xl overflow-hidden border border-white/5 relative z-10 shadow-2xl flex flex-col min-h-0">
                        <CopilotWidget chatHistory={chatHistory} setChatHistory={setChatHistory} className="flex-1 border-none min-h-0" />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Desktop;
