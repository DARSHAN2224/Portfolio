import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CopilotWidget from '../components/CopilotWidget';

const About = ({ chatHistory, setChatHistory }) => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetch('/api/profile')
            .then(res => res.json())
            .then(data => setProfile(data))
            .catch(err => console.error('Failed to fetch profile:', err));
    }, []);

    return (
        <div className="h-full w-full bg-background-dark p-6 overflow-hidden flex flex-col font-sans">
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Content Column (User Bio Window) */}
                <div className="lg:col-span-8 flex flex-col h-full bg-[#161b22] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
                    {/* Window Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#0d1117] border-b border-white/10 select-none">
                        <div className="flex items-center gap-3">
                            <div className="p-1 rounded bg-teal-500/20">
                                <span className="material-symbols-outlined text-teal-400 text-sm">person</span>
                            </div>
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">User Bio</span>
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
                            <span className="text-primary">about</span>
                        </div>
                        <div className="w-[1px] h-3 bg-white/10"></div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[10px] text-green-500">fingerprint</span>
                            Identity verification complete.
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#0d1117]/30">
                        <div className="bg-[#111] border border-white/5 rounded-xl p-8 md:p-12 shadow-inner relative overflow-hidden">
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <span className="material-symbols-outlined text-9xl">person</span>
                            </div>

                            <div className="relative z-10">
                                <h1 className="text-4xl font-bold text-white mb-6">Hello, I'm <span className="text-primary">{profile?.name || 'Darshan P'}</span>.</h1>

                                <div className="space-y-6 max-w-3xl text-gray-300 leading-relaxed">
                                    <p className="text-lg">
                                        {profile?.bio || "Full Stack Engineer with 2+ years of experience in building scalable web applications and AI-powered solutions. Proficient in the MERN stack (MongoDB, Express, React, Node.js), Next.js, and Python. Passionate about solving real-world problems through code."}
                                    </p>

                                    <div className="p-4 bg-black/50 border border-white/10 rounded-lg font-mono text-sm text-green-400 my-8 shadow-sm">
                                        <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-2 text-gray-500">
                                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <span className="ml-2">current_status.txt</span>
                                        </div>
                                        <p>&gt; Current Role: Open to Work</p>
                                        <p>&gt; Main Stack: MERN, Next.js, Python, AWS</p>
                                        <p>&gt; Obsessions: AI Agents, Cyberpunk Aesthetics, Clean Code</p>
                                    </div>

                                    <h2 className="text-2xl font-bold text-white mt-8 mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">rocket_launch</span>
                                        My Journey
                                    </h2>
                                    <p>
                                        My coding journey began with a curiosity for how things work under the hood.
                                        From hacking together simple scripts to architecting complex cloud-native applications,
                                        I've always been driven by the desire to create tools that solve real problems.
                                    </p>
                                    <p>
                                        When I'm not coding, you can find me exploring new tech stacks, contributing to open-source,
                                        or designing futuristic user interfaces (like this OS!).
                                    </p>
                                </div>

                                <div className="mt-12 flex gap-4">
                                    <button onClick={() => navigate('/projects')} className="px-6 py-3 bg-primary text-black font-bold rounded hover:shadow-[0_0_20px_rgba(13,204,242,0.6)] transition-all flex items-center gap-2">
                                        <span className="material-symbols-outlined">folder</span>
                                        View Projects
                                    </button>
                                    <button onClick={() => navigate('/contact')} className="px-6 py-3 border border-slate-600 rounded hover:border-white text-white transition-all flex items-center gap-2">
                                        <span className="material-symbols-outlined">mail</span>
                                        Contact Me
                                    </button>
                                </div>
                            </div>
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

export default About;
