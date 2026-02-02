import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple hardcoded check for now (mocking the 'access to me only')
        // In real app, this goes to backend
        if (password === "admin123") {
            localStorage.setItem("isAdmin", "true");
            navigate('/admin/dashboard');
        } else {
            setError(true);
            setPassword("");
        }
    };

    return (
        <div className="h-screen w-screen bg-black flex items-center justify-center font-mono text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

            <div className="w-full max-w-md p-8 bg-[#111] border border-red-900/50 rounded shadow-[0_0_50px_rgba(255,0,0,0.1)] relative z-10">
                <div className="text-center mb-10">
                    <span className="material-symbols-outlined text-5xl text-red-600 mb-4">lock</span>
                    <h1 className="text-2xl font-bold tracking-[0.2em] text-red-500 uppercase">Restricted Access</h1>
                    <p className="text-xs text-red-900 mt-2">AUTHORIZATION REQUIRED // LEVEL 5</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs text-red-700 uppercase font-bold">Passkey Sequence</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black border border-red-900/50 rounded p-4 text-center text-red-500 focus:border-red-500 focus:outline-none focus:shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-all placeholder:text-red-900/30"
                            placeholder="••••••••"
                            autoFocus
                        />
                    </div>
                    {error && <p className="text-xs text-red-500 text-center animate-pulse">ACCESS DENIED. INCORRECT SEQUENCE.</p>}

                    <button
                        type="submit"
                        className="w-full py-3 bg-red-900/20 border border-red-900/50 text-red-500 font-bold hover:bg-red-900 hover:text-white transition-all uppercase tracking-widest text-sm"
                    >
                        Authenticate

                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/desktop')}
                        className="w-full py-2 text-xs text-neutral-600 hover:text-neutral-400 mt-4"
                    >
                        Return to Safe Mode (Desktop)
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
