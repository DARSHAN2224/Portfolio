import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CopilotWidget = ({ className = "", chatHistory, setChatHistory }) => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState("");
    // chatHistory state is now lifted to App.jsx
    const chatEndRef = useRef(null);
    const [isListening, setIsListening] = useState(false);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    // --- Voice Recognition Logic ---
    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setChatHistory(prev => [...prev, { type: 'bot', text: "> ERROR: Speech recognition not supported in this browser environment." }]);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInputValue(transcript);
            handleCommand(null, transcript); // Auto-submit
        };

        recognition.onerror = (event) => {
            console.error("Speech Error:", event.error);
            setIsListening(false);
        };

        recognition.start();
    };

    const handleCommand = async (e, voiceCmd = null) => {
        // Allow if it's a Click (e is null), Voice Command, or Enter Key
        if (e && e.type === 'keydown' && e.key !== 'Enter') return;

        const userText = voiceCmd || inputValue.trim();
        if (!userText) return;

        setInputValue("");

        // Optimistic update: Show user message immediately
        const newUserMsg = { type: 'user', text: `darshan@os:~$ ${userText}` };
        const updatedHistory = [...chatHistory, newUserMsg];
        setChatHistory(updatedHistory);

        // Typing Indicator
        setChatHistory(prev => [...prev, { type: 'bot', text: 'Analyzing input...', isTyping: true }]);

        try {
            // Call Backend AI
            const res = await fetch('/api/chat/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userText,
                    sessionId: localStorage.getItem('chatSessionId') || 'guest'
                })
            });

            const data = await res.json();

            // Remove typing indicator (filter out messages with isTyping)
            setChatHistory(prev => prev.filter(msg => !msg.isTyping));

            if (data.text) {
                setChatHistory(prev => [...prev, {
                    type: 'bot',
                    text: `> ${data.text}`,
                    action: data.action, // Persist action
                    payload: data.payload // Persist payload
                }]);
            }

            // Handle Actions (Navigation)
            if (data.action === 'NAVIGATE' && data.payload) {
                setTimeout(() => {
                    navigate(data.payload);
                }, 1000);
            }

        } catch (err) {
            setChatHistory(prev => prev.filter(msg => !msg.isTyping));
            setChatHistory(prev => [...prev, { type: 'bot', text: `> ERROR: Uplink failed. (${err.message})` }]);
        }
    };


    return (
        <div className={`flex flex-col bg-[#050a10] border-l border-white/10 h-full w-full relative overflow-hidden ${className}`}>

            {/* Background Effects */}
            <div className="absolute inset-0 z-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
            <div className="absolute inset-0 scanlines z-10 opacity-10 pointer-events-none mix-blend-overlay"></div>

            {/* Terminal Header */}
            <header className="flex items-center justify-between px-4 py-3 bg-[#0a0f18] border-b border-primary/20 select-none z-50 relative shrink-0">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded bg-primary/10 text-primary animate-pulse">
                        <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                    </div>
                    <h2 className="text-primary text-xs font-bold tracking-[0.2em] leading-none pt-0.5 font-display flex flex-col">
                        <span>AI_COPILOT</span>
                        <span className="text-[8px] opacity-50">V2.4.0-STABLE</span>
                    </h2>
                </div>

                {/* Window Controls */}
                <div className="flex gap-1.5 opacity-100 transition-opacity group">
                    <button
                        onClick={() => navigate('/desktop')}
                        className="w-2.5 h-2.5 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center text-[8px] text-black/50 transition-colors"
                        title="Close Protocol"
                    >
                        ✕
                    </button>
                    <button
                        onClick={() => navigate('/desktop')}
                        className="w-2.5 h-2.5 rounded-full bg-yellow-500 hover:bg-yellow-400 flex items-center justify-center text-[8px] text-black/50 transition-colors"
                        title="Minimize"
                    >
                        ─
                    </button>
                    <button
                        onClick={() => alert("Expanding neural interface to fullscreen...")}
                        className="w-2.5 h-2.5 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center text-[8px] text-black/50 transition-colors"
                        title="Expand"
                    >
                        ⤢
                    </button>
                </div>
            </header>

            {/* Terminal Content Area */}
            <div className="flex-1 p-4 font-mono text-xs md:text-sm overflow-y-auto custom-scrollbar relative z-30 flex flex-col gap-3 min-h-0">
                {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`animate-fade-in ${msg.type === 'bot' ? '' : 'text-right'}`}>
                        <div className={`inline-block p-2 rounded max-w-[90%] ${msg.type === 'bot' ? 'text-terminal-green bg-green-900/10 border-l-2 border-green-500/50' : 'text-primary font-bold bg-primary/5 border-r-2 border-primary/50'}`}>
                            <span className="whitespace-pre-wrap leading-relaxed">{msg.text}</span>
                        </div>

                        {/* Project Card Rendering */}
                        {msg.action === 'RENDER_PROJECTS' && msg.payload && Array.isArray(msg.payload) && (
                            <div className="mt-3 flex flex-col gap-2 pl-2">
                                {msg.payload.map((proj, pIdx) => (
                                    <div key={pIdx} className="bg-[#0f1623] border border-white/10 rounded p-3 hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => navigate('/projects')}>
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="text-primary font-bold text-xs group-hover:text-neon-cyan transition-colors">{proj.title}</h4>
                                            <span className="material-symbols-outlined text-[10px] text-gray-500 group-hover:text-white">open_in_new</span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mb-2 line-clamp-2">{proj.description}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {proj.tech.split(',').slice(0, 3).map((t, tIdx) => (
                                                <span key={tIdx} className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded text-gray-500 uppercase tracking-wider">{t.trim()}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Experience Card Rendering */}
                        {msg.action === 'RENDER_EXPERIENCE' && msg.payload && Array.isArray(msg.payload) && (
                            <div className="mt-3 flex flex-col gap-2 pl-2">
                                {msg.payload.map((exp, eIdx) => (
                                    <div key={eIdx} className="bg-[#0f1623] border border-white/10 rounded p-3 hover:border-blue-500/50 transition-colors cursor-pointer group" onClick={() => navigate('/experience')}>
                                        <div className="flex justify-between items-start mb-1">
                                            <div>
                                                <h4 className="text-white font-bold text-xs group-hover:text-blue-400 transition-colors">{exp.company}</h4>
                                                <span className="text-[10px] text-gray-500">{exp.position}</span>
                                            </div>
                                            <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-mono">{exp.years}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 line-clamp-2 mt-1">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Skills Rendering */}
                        {msg.action === 'RENDER_SKILLS' && msg.payload && Array.isArray(msg.payload) && (
                            <div className="mt-3 flex flex-wrap gap-1.5 pl-2 max-w-[90%]">
                                {msg.payload.map((skill, sIdx) => (
                                    <span key={sIdx} className="text-[9px] bg-white/5 border border-white/10 px-2 py-1 rounded-sm text-gray-300 hover:border-primary/50 hover:text-white transition-colors cursor-default">
                                        {typeof skill === 'string' ? skill : skill.name || skill.title}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Contact Rendering */}
                        {msg.action === 'RENDER_CONTACT' && msg.payload && (
                            <div className="mt-3 bg-[#0f1623] border border-white/10 rounded p-3 pl-4 max-w-[85%] ml-2 hover:border-green-500/50 transition-colors">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded bg-green-500/10 flex items-center justify-center text-green-500">
                                        <span className="material-symbols-outlined text-sm">mail</span>
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Direct Channel</p>
                                        <p className="text-xs text-white truncate font-mono select-all">darshan.patel@example.com</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <button onClick={() => navigate('/contact')} className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 rounded py-1.5 text-gray-300 flex items-center justify-center gap-1 transition-colors">
                                        <span className="material-symbols-outlined text-[10px]">send</span> Open Form
                                    </button>
                                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-[10px] bg-[#0077b5]/10 hover:bg-[#0077b5]/20 border border-[#0077b5]/30 rounded py-1.5 text-[#0077b5] flex items-center justify-center gap-1 transition-colors">
                                        LinkedIn
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Tour / Menu Rendering */}
                        {msg.action === 'RENDER_TOUR' && msg.payload && Array.isArray(msg.payload) && (
                            <div className="mt-3 grid grid-cols-2 gap-2 pl-2 max-w-[90%]">
                                {msg.payload.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => navigate(item.path)}
                                        className="flex items-center gap-2 bg-[#0f1623] border border-white/10 hover:bg-white/5 hover:border-primary/50 text-gray-300 hover:text-white p-2 rounded transition-all text-left group"
                                    >
                                        <span className="material-symbols-outlined text-[14px] text-primary/70 group-hover:text-primary">{item.icon}</span>
                                        <span className="text-[10px] font-mono">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Certificates Rendering */}
                        {msg.action === 'RENDER_CERTIFICATES' && msg.payload && Array.isArray(msg.payload) && (
                            <div className="mt-3 flex flex-col gap-2 pl-2">
                                {msg.payload.map((cert, cIdx) => (
                                    <div key={cIdx} className="bg-[#0f1623] border border-white/10 rounded p-3 hover:border-purple-500/50 transition-colors cursor-pointer group" onClick={() => navigate('/certificates')}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center text-purple-400">
                                                <span className="material-symbols-outlined text-sm">verified</span>
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold text-xs group-hover:text-purple-400 transition-colors">{cert.title}</h4>
                                                <p className="text-[10px] text-gray-500">{cert.issuer} • {cert.date}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {isListening && <div className="text-red-400 italic text-xs animate-pulse">&gt; Listening for voice input...</div>}
                <div ref={chatEndRef}></div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#0a0f18] border-t border-white/10 z-20 shrink-0">
                <div className="flex items-center gap-2 bg-[#050a10] border border-white/10 rounded-md p-2 focus-within:border-primary/50 transition-colors">
                    <span className="text-primary font-bold text-xs shrink-0">{'>'}</span>
                    <input
                        type="text"
                        className="bg-transparent border-none outline-none text-white w-full font-mono text-sm placeholder-white/20"
                        placeholder="Type or Speak..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleCommand}
                    />
                    <button
                        onClick={startListening}
                        className={`p-1.5 rounded transition-all ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'hover:bg-white/10 text-slate-400 hover:text-white'}`}
                        title="Voice Command"
                    >
                        <span className="material-symbols-outlined text-[18px]">mic</span>
                    </button>
                    <button
                        onClick={() => handleCommand(null)}
                        className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">send</span>
                    </button>
                </div>
                <div className="flex justify-between mt-2 px-1">
                    <span className="text-[9px] text-slate-500 font-mono uppercase">System: ONLINE ({process.env.NODE_ENV === 'production' ? 'CLOUD_LPU' : 'LOCAL_NPU'})</span>
                    <span className="text-[9px] text-slate-500 font-mono uppercase">Latency: {process.env.NODE_ENV === 'production' ? '12ms' : 'Variable'}</span>
                </div>
            </div>
        </div>
    );
};

export default CopilotWidget;
