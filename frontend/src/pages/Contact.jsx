import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import CopilotWidget from '../components/CopilotWidget';

const Contact = ({ chatHistory, setChatHistory }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            // Simulate network
            await new Promise(r => setTimeout(r, 1500));
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <div className="h-full w-full bg-background-dark p-6 overflow-hidden flex flex-col font-sans">
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Content Column (Secure Communication Window) */}
                <div className="lg:col-span-8 flex flex-col h-full bg-[#161b22] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
                    {/* Window Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#0d1117] border-b border-white/10 select-none">
                        <div className="flex items-center gap-3">
                            <div className="p-1 rounded bg-red-500/20">
                                <span className="material-symbols-outlined text-red-400 text-sm">lock</span>
                            </div>
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Secure Communication</span>
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
                            <span className="text-primary">contact</span>
                        </div>
                        <div className="w-[1px] h-3 bg-white/10"></div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Establishing encrypted tunnel...
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#0d1117]/30 flex items-center justify-center">
                        <div className="w-full max-w-2xl bg-[#111] border border-white/5 rounded-xl shadow-2xl overflow-hidden relative">
                            {/* Terminal Header */}
                            <div className="w-full h-10 border-b border-white/5 bg-[#0a0f16] flex items-center px-4 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                <div className="text-xs font-mono text-gray-500 ml-4 flex-1 text-center">/bin/mail_client</div>
                            </div>

                            <div className="p-8">
                                <div className="mb-8 text-center">
                                    <h3 className="text-xl font-bold text-white mb-2">Initialize Transmission</h3>
                                    <p className="text-gray-400 text-sm">Send a message directly to my neural inbox.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Sender_Identity</label>
                                            <input
                                                type="text"
                                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-700 font-mono text-sm"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Return_Address</label>
                                            <input
                                                type="email"
                                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-700 font-mono text-sm"
                                                placeholder="user@example.com"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-primary uppercase tracking-wider block">Payload_Data</label>
                                        <textarea
                                            rows="6"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-700 font-mono text-sm resize-none"
                                            placeholder="Enter your message sequence here..."
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className="w-full py-4 bg-primary/10 border border-primary/50 text-primary hover:bg-primary hover:text-white rounded-lg font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-3 group"
                                    >
                                        {status === 'sending' ? (
                                            <span className="animate-pulse">Transmitting...</span>
                                        ) : (
                                            <>
                                                EXECUTE_SEND <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">send</span>
                                            </>
                                        )}
                                    </button>
                                    {status === 'success' && <p className="text-green-400 text-center font-mono text-sm mt-2">&gt; Transmission Successful.</p>}
                                    {status === 'error' && <p className="text-red-400 text-center font-mono text-sm mt-2">&gt; Error: Transmission Failed.</p>}
                                </form>
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

export default Contact;
