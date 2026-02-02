import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const BootScreen = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    onComplete();
                    return 100;
                }
                return prev + 1;
            });
        }, 30);
        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 bg-background-dark text-white font-display overflow-hidden selection:bg-primary selection:text-white">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0"></div>
            <div className="fixed inset-0 scanlines opacity-30 z-40 pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-4xl flex flex-col gap-8 md:gap-12 animate-fade-in">

                {/* Page Heading */}
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
                        </span>
                        <p className="text-xs font-medium text-neon-cyan tracking-widest uppercase">System Online</p>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-[-0.033em] text-white text-glow">
                        DARSHAN-OS v1.0
                    </h1>
                    <p className="text-primary/80 text-lg md:text-xl font-medium tracking-widest font-mono animate-pulse-slow">
            // INITIALIZING BOOT SEQUENCE_
                    </p>
                </div>

                {/* Main Dashboard Area (Glassmorphism) */}
                <div className="relative overflow-hidden rounded-2xl border border-glass-border bg-glass-bg backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(19,91,236,0.3)]">
                    {/* Decorative Top Bar */}
                    <div className="flex h-8 w-full items-center justify-between border-b border-glass-border bg-black/20 px-4">
                        <div className="flex gap-2">
                            <div className="h-2.5 w-2.5 rounded-full bg-red-500/50"></div>
                            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50"></div>
                            <div className="h-2.5 w-2.5 rounded-full bg-green-500/50"></div>
                        </div>
                        <div className="text-[10px] uppercase tracking-widest text-white/30">user: root/admin</div>
                    </div>

                    <div className="p-6 md:p-10 flex flex-col gap-8">
                        {/* Progress Section */}
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-end">
                                <p className="text-white text-sm font-medium tracking-wider uppercase">Loading Core Modules</p>
                                <p className="text-neon-cyan text-xl font-bold font-mono">{progress}%</p>
                            </div>
                            <div className="relative h-4 w-full rounded-full bg-[#1e293b] overflow-hidden shadow-inner">
                                <div
                                    className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-primary to-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.5)] flex items-center justify-end pr-1 transition-all duration-75"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="h-full w-[20px] bg-white/20 skew-x-[-20deg]"></div>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-[#92a4c9] font-mono">
                                <span>/usr/bin/portfolio_assets</span>
                                <span>{Math.floor((progress / 100) * 50)}MB / 50MB</span>
                            </div>
                        </div>

                        {/* Split Layout: Terminal & Status */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Terminal Log */}
                            <div className="lg:col-span-2 rounded-xl border border-glass-border bg-black/40 p-5 font-mono text-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-50">
                                    <span className="material-symbols-outlined text-white/20 text-4xl">terminal</span>
                                </div>
                                <div className="flex flex-col gap-3 relative z-10">
                                    <div className="flex gap-3 border-b border-white/5 pb-2">
                                        <span className="text-[#92a4c9]">{'>'} KERNEL</span>
                                        <span className="text-green-400">[SUCCESS]</span>
                                        <span className="text-white/80">Loading architecture...</span>
                                    </div>
                                    <div className="flex gap-3 border-b border-white/5 pb-2">
                                        <span className="text-[#92a4c9]">{'>'} MEMORY</span>
                                        <span className="text-green-400">[OK]</span>
                                        <span className="text-white/80">Allocating pages...</span>
                                    </div>
                                    <div className="flex gap-3 border-b border-white/5 pb-2">
                                        <span className="text-[#92a4c9]">{'>'} PROJECT_MOUNT</span>
                                        <span className="text-yellow-400 animate-pulse">[BUSY]</span>
                                        <span className="text-white/80">Fetching assets...</span>
                                    </div>
                                    <div className="flex gap-3 pb-2">
                                        <span className="text-[#92a4c9]">{'>'} AI_COPILOT</span>
                                        <span className="text-neon-cyan">[ONLINE]</span>
                                        <span className="text-white/80">Handshake complete</span>
                                    </div>
                                    <div className="flex gap-3 mt-1">
                                        <span className="text-[#92a4c9]">{'>'} _</span>
                                        <span className="w-2 h-4 bg-primary animate-pulse"></span>
                                    </div>
                                </div>
                            </div>

                            {/* System Status Chips */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/10 p-3 hover:bg-primary/20 transition-colors">
                                    <span className="material-symbols-outlined text-neon-cyan">check_circle</span>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-[#92a4c9] uppercase tracking-wider">RAM Status</span>
                                        <span className="text-sm font-bold text-white">OPTIMAL</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/10 p-3 hover:bg-primary/20 transition-colors">
                                    <span className="material-symbols-outlined text-neon-cyan">wifi</span>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-[#92a4c9] uppercase tracking-wider">Network</span>
                                        <span className="text-sm font-bold text-white">SECURE (TLS 1.3)</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/10 p-3 hover:bg-primary/20 transition-colors">
                                    <span className="material-symbols-outlined text-neon-cyan">memory</span>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-[#92a4c9] uppercase tracking-wider">CPU Core</span>
                                        <span className="text-sm font-bold text-white">STABLE 4.2GHz</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/10 p-3 hover:bg-primary/20 transition-colors">
                                    <span className="material-symbols-outlined text-neon-cyan">developer_board</span>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-[#92a4c9] uppercase tracking-wider">GPU Render</span>
                                        <span className="text-sm font-bold text-white">READY</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-4">
                        <p className="text-[#92a4c9] text-xs font-mono opacity-60">
                            © 2024 Darshan Systems. All Rights Reserved. <span className="mx-2">|</span> v1.0.4-beta
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BootScreen;
