import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BootScreen from './pages/BootScreen';
import Desktop from './pages/Desktop';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Experience from './pages/Experience';
import About from './pages/About';
import Contact from './pages/Contact';
import CopilotWidget from './components/CopilotWidget';
import Taskbar from './components/Taskbar';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import Blog from './pages/Blog';
import Certificates from './pages/Certificates';
import Achievements from './pages/Achievements';
import Network from './pages/Network';

function App() {
  const [hasBooted, setHasBooted] = useState(false);

  // 1. Initialize State from LocalStorage
  const [chatHistory, setChatHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('darshan_os_chat_history');
      return saved ? JSON.parse(saved) : [
        { type: 'bot', text: '> SYSTEM_READY. ACCESS GRANTED.\n> Welcome to DARSHAN-OS v2.0 AI.' },
        { type: 'bot', text: "> I can help you navigate. Try 'fetch projects', 'open skills', or just speak." }
      ];
    } catch (e) {
      console.error("Failed to parse chat history", e);
      return [];
    }
  });

  // 2. Client-side Persistence & Backend Sync of Chat History
  useEffect(() => {
    if (!chatHistory || chatHistory.length === 0) return;

    // Save to LocalStorage
    localStorage.setItem('darshan_os_chat_history', JSON.stringify(chatHistory));

    // Sync to Backend (Debounced)
    const syncToBackend = async () => {
      let sessionId = localStorage.getItem('darshan_os_session_id');
      if (!sessionId) {
        sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        localStorage.setItem('darshan_os_session_id', sessionId);
      }

      try {
        await fetch('http://localhost:5000/api/chat/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            messages: chatHistory,
            userAgent: navigator.userAgent
          })
        });
      } catch (err) {
        console.warn('Background chat sync failed:', err); // Silent fail for UX
      }
    };

    const timeoutId = setTimeout(syncToBackend, 2000); // Debounce 2s
    return () => clearTimeout(timeoutId);
  }, [chatHistory]);

  useEffect(() => {
    const booted = sessionStorage.getItem('darshan_os_booted');
    if (booted) {
      setHasBooted(true);
    }
  }, []);

  const handleBootComplete = () => {
    sessionStorage.setItem('darshan_os_booted', 'true');
    setHasBooted(true);
  };

  return (
    <Router>
      {!hasBooted ? (
        <BootScreen onComplete={handleBootComplete} />
      ) : (
        <div className="flex h-screen w-screen overflow-hidden bg-background-dark text-white selection:bg-primary selection:text-white">
          {/* Left: Main Content & Taskbar */}
          <div className="flex-1 flex flex-col h-full relative overflow-hidden transition-all duration-300">
            {/* Scrollable Page Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scrollbar">
              <Routes>
                <Route path="/" element={<Navigate to="/desktop" replace />} />

                {/* Desktop: Embedded Chat */}
                <Route path="/desktop" element={
                  <Desktop
                    chatHistory={chatHistory}
                    setChatHistory={setChatHistory}
                  />
                } />

                <Route path="/projects" element={<Projects chatHistory={chatHistory} setChatHistory={setChatHistory} />} />
                <Route path="/skills" element={<Skills chatHistory={chatHistory} setChatHistory={setChatHistory} />} />
                <Route path="/experience" element={<Experience chatHistory={chatHistory} setChatHistory={setChatHistory} />} />
                <Route path="/about" element={<About chatHistory={chatHistory} setChatHistory={setChatHistory} />} />
                <Route path="/contact" element={<Contact chatHistory={chatHistory} setChatHistory={setChatHistory} />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminPanel />} />
                <Route path="/blog" element={<Blog chatHistory={chatHistory} setChatHistory={setChatHistory} />} />
                <Route path="/certificates" element={<Certificates chatHistory={chatHistory} setChatHistory={setChatHistory} />} />
                <Route path="/achievements" element={<Achievements chatHistory={chatHistory} setChatHistory={setChatHistory} />} />
                <Route path="/network" element={<Network chatHistory={chatHistory} setChatHistory={setChatHistory} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>

            {/* Global Taskbar */}
            <Taskbar />
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
