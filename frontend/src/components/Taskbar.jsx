import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Taskbar = () => {
    const navigate = useNavigate();
    const [showStartMenu, setShowStartMenu] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // Fetch profile data
        fetch('/api/profile')
            .then(res => res.json())
            .then(data => setProfile(data))
            .catch(err => console.error('Failed to fetch profile:', err));
    }, []);

    // Close start menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showStartMenu && !event.target.closest('.start-menu-container') && !event.target.closest('.start-button')) {
                setShowStartMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showStartMenu]);

    return (
        <>
            {/* Start Menu Popup */}
            {showStartMenu && (
                <div className="start-menu-container absolute bottom-16 left-4 w-72 bg-[#121825]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden animate-slide-up">
                    <div className="p-4 bg-gradient-to-r from-primary to-blue-600">
                        <h3 className="text-white font-bold text-sm">{profile?.name || 'Guest User'}</h3>
                        <p className="text-white/70 text-xs">{profile?.title || 'Administrator'}</p>
                    </div>
                    <div className="p-2 grid grid-cols-1 gap-1">
                        <MenuLink icon="folder_open" label="Projects" onClick={() => { navigate('/projects'); setShowStartMenu(false); }} />
                        <MenuLink icon="bolt" label="Skills" onClick={() => { navigate('/skills'); setShowStartMenu(false); }} />
                        <MenuLink icon="rss_feed" label="Blog Logs" onClick={() => { navigate('/blog'); setShowStartMenu(false); }} />
                        <MenuLink icon="hub" label="Network Hub" onClick={() => { navigate('/network'); setShowStartMenu(false); }} />
                        <MenuLink icon="school" label="Certificates" onClick={() => { navigate('/certificates'); setShowStartMenu(false); }} />
                        <MenuLink icon="person" label="About Me" onClick={() => { navigate('/about'); setShowStartMenu(false); }} />
                        <MenuLink icon="mail" label="Contact" onClick={() => { navigate('/contact'); setShowStartMenu(false); }} />
                    </div>
                    <div className="p-2 border-t border-white/10 mt-2 bg-black/20">
                        <MenuLink icon="lock" label="Admin Login" onClick={() => { navigate('/admin'); setShowStartMenu(false); }} color="text-red-400" />
                    </div>
                </div>
            )}

            {/* Taskbar */}
            <div className="h-14 glass-panel border-t border-white/10 border-x-0 border-b-0 flex items-center justify-between px-4 z-40 relative shrink-0 bg-[#0a0f18]/80 backdrop-blur-md w-full">
                {/* Start Button */}
                <button
                    onClick={() => setShowStartMenu(!showStartMenu)}
                    className={`start-button flex items-center justify-center gap-2 px-3 py-1.5 rounded transition-colors group ${showStartMenu ? 'bg-white/10' : 'hover:bg-white/5'}`}
                >
                    <span className="material-symbols-outlined text-2xl text-white group-hover:text-primary transition-colors icon-glow">dataset</span>
                    <span className="font-bold text-sm tracking-wide hidden sm:block group-hover:text-white">START</span>
                </button>

                {/* Centered Dock */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
                    <DockIcon icon="folder_open" label="Projects" color="blue" onClick={() => navigate('/projects')} />
                    <DockIcon icon="bolt" label="Skills" color="yellow" onClick={() => navigate('/skills')} />
                    <DockIcon icon="hub" label="Network" color="purple" onClick={() => navigate('/network')} />
                    <DockIcon icon="rss_feed" label="Blog" color="orange" onClick={() => navigate('/blog')} />
                    <DockIcon icon="school" label="Certificates" color="teal" onClick={() => navigate('/certificates')} />
                    <DockIcon icon="person" label="About" color="green" onClick={() => navigate('/about')} />
                    <DockIcon icon="mail" label="Contact" color="cyan" onClick={() => navigate('/contact')} />
                    <DockIcon icon="terminal" label="Admin" color="red" onClick={() => navigate('/admin')} />
                </div>

                {/* System Tray */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 cursor-default">
                        <span className="material-symbols-outlined text-white/60 text-[18px]">wifi</span>
                        <span className="material-symbols-outlined text-white/60 text-[18px]">volume_up</span>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-medium text-white">{currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-[10px] text-white/60">{currentTime.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div className="w-1 h-8 bg-white/10 mx-1"></div>
                    <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/5">
                        <span className="material-symbols-outlined text-white/80 text-[20px]">notifications</span>
                    </button>
                </div>
            </div>
        </>
    );
};

const DockIcon = ({ icon, label, color, onClick }) => (
    <div className="group/dock relative flex flex-col items-center">
        <button onClick={onClick} className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all hover:-translate-y-1">
            <span className={`material-symbols-outlined text-[#92a4c9] text-2xl group-hover/dock:text-${color}-400`}>{icon}</span>
        </button>
        <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white/50 opacity-0 group-hover/dock:opacity-100"></div>
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#101622] border border-white/10 rounded text-[10px] text-white opacity-0 group-hover/dock:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {label}
        </div>
    </div>
);

const MenuLink = ({ icon, label, onClick, color }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5 text-sm ${color || 'text-slate-300 hover:text-white'}`}>
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
        {label}
    </button>
);

export default Taskbar;
