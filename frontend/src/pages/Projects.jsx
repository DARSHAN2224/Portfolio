import { useState, useEffect } from 'react';
import CopilotWidget from '../components/CopilotWidget';
import { useNavigate } from 'react-router-dom';

const Projects = ({ chatHistory, setChatHistory }) => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Use relative path to leverage Vite proxy
                const response = await fetch('/api/projects');
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
                // Fallback data for demo if backend is down
                setProjects([
                    { _id: '1', title: 'HealthCare AI', domain: 'AI-ML', description: 'Mental health assistant with emotion analysis.', tags: ['Python', 'React', 'NLP'], links: { github: '#' }, metrics: { uptime: '99%', latency: '40ms' } },
                    { _id: '2', title: 'Drone Delivery', domain: 'Simulation', description: 'Autonomous drone fleet management system.', tags: ['C++', 'Unreal', 'AirSim'], links: { github: '#' }, metrics: { uptime: '98%', latency: '12ms' } }
                ]);
            }
        };
        fetchProjects();
    }, []);

    const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.domain === filter);
    const filters = ['All', 'Full-Stack', 'AI-ML', 'Simulation', 'Frontend'];

    return (
        <div className="h-full w-full bg-background-dark p-6 overflow-hidden flex flex-col font-sans">
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Content Column (Project Explorer Window) */}
                <div className="lg:col-span-8 flex flex-col h-full bg-[#161b22] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
                    {/* Window Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#0d1117] border-b border-white/10 select-none">
                        <div className="flex items-center gap-3">
                            <div className="p-1 rounded bg-blue-500/20">
                                <span className="material-symbols-outlined text-blue-400 text-sm">folder_open</span>
                            </div>
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Project Explorer</span>
                        </div>
                        <div className="flex gap-1.5 opacity-100 transition-opacity group">
                            <button onClick={() => navigate('/desktop')} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center text-[8px] text-black/50 transition-colors" title="Close">✕</button>
                            <button onClick={() => navigate('/desktop')} className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 flex items-center justify-center text-[8px] text-black/50 transition-colors cursor-pointer" title="Minimize">─</button>
                            <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center text-[8px] text-black/50 transition-colors cursor-pointer" title="Expand">⤢</button>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="px-4 py-3 border-b border-white/5 bg-[#0d1117]/50 flex items-center justify-between gap-4 overflow-x-auto custom-scrollbar">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 mr-4">
                            <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate('/desktop')}>~/home</span>
                            <span>/</span>
                            <span className="text-primary">projects</span>
                        </div>
                        <div className="flex gap-2">
                            {filters.map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${filter === f ? 'bg-primary/10 border-primary text-primary' : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#0d1117]/30">
                        {projects.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
                                <span className="material-symbols-outlined text-4xl mb-2">dns</span>
                                <p className="text-xs font-mono">Fetching Archives...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredProjects.map((project) => (
                                    <div key={project._id} className="group bg-[#161b22] border border-white/5 hover:border-primary/40 rounded-lg overflow-hidden transition-all flex flex-col hover:-translate-y-1 hover:shadow-lg">
                                        <div className="p-4 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-3">
                                                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${project.domain === 'AI-ML' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'}`}>
                                                    {project.domain}
                                                </span>
                                                {project.links?.github && (
                                                    <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                                                        <span className="material-symbols-outlined text-[16px]">code</span>
                                                    </a>
                                                )}
                                            </div>

                                            <h3 className="text-sm font-bold text-gray-200 mb-1 group-hover:text-white">{project.title}</h3>
                                            <p className="text-gray-500 text-[11px] leading-relaxed mb-3 line-clamp-2">{project.description}</p>

                                            <div className="mt-auto pt-3 border-t border-white/5 flex gap-2 flex-wrap text-[9px] text-gray-600">
                                                {project.tags?.slice(0, 3).map(tag => (
                                                    <span key={tag} className="px-1 bg-white/5 rounded">#{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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

export default Projects;
