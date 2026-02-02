import { useState } from 'react';
import CopilotWidget from './CopilotWidget';

const FloatingCopilot = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">

            {/* Widget Container */}
            <div className={`pointer-events-auto transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-10 pointer-events-none'}`}>
                <div className="w-[350px] h-[450px] shadow-2xl">
                    <CopilotWidget compact={true} className="h-full w-full bg-[#102023]/95 backdrop-blur-xl border border-primary/50 shadow-[0_0_50px_-10px_rgba(13,204,242,0.3)]" />
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto group relative flex items-center justify-center w-14 h-14 rounded-full border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen ? 'bg-primary text-black rotate-90' : 'bg-[#121825]/80 backdrop-blur-md text-primary hover:bg-[#1a2333]'}`}
            >
                <div className="absolute inset-0 rounded-full border border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity animate-ping-slow"></div>
                <span className="material-symbols-outlined text-2xl transition-transform duration-300">
                    {isOpen ? 'close' : 'smart_toy'}
                </span>

                {/* Tooltip */}
                {!isOpen && (
                    <span className="absolute right-full mr-4 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                        AI Chat
                    </span>
                )}
            </button>
        </div>
    );
};

export default FloatingCopilot;
