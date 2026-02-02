import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VoiceCommand = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [command, setCommand] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [response, setResponse] = useState('');

    const navigate = useNavigate();

    const toggleCommand = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setCommand('');
            setResponse('Listening for command...');
            startListening();
        } else {
            stopListening();
        }
    };

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setResponse("Speech recognition not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setCommand(transcript);
            handleCommand(transcript);
        };

        recognition.onerror = (event) => {
            setResponse(`Error: ${event.error}`);
        };

        recognition.start();
    };

    const stopListening = () => {
        // Logic to stop if needed, mostly handled by toggle
    };

    const handleCommand = (cmd) => {
        const lowerCmd = cmd.toLowerCase();
        setResponse(`Processing: "${cmd}"...`);

        setTimeout(() => {
            if (lowerCmd.includes('open projects') || lowerCmd.includes('show projects')) {
                setResponse('Opening Projects Folder...');
                navigate('/projects');
            } else if (lowerCmd.includes('show skills') || lowerCmd.includes('skills')) {
                setResponse('Opening Skills Matrix...');
                navigate('/skills');
            } else if (lowerCmd.includes('show experience') || lowerCmd.includes('open experience')) {
                setResponse('Opening Experience Timeline...');
                navigate('/experience');
            } else if (lowerCmd.includes('about') || lowerCmd.includes('contact')) {
                setResponse('Opening About & Contact...');
                navigate('/about');
            } else if (lowerCmd.includes('home') || lowerCmd.includes('desktop')) {
                setResponse('Navigating to Desktop...');
                navigate('/desktop');
            } else {
                setResponse(`Command not recognized: "${cmd}"`);
            }
        }, 1000);
    };

    return (
        <>
            <button
                onClick={toggleCommand}
                className="fixed bottom-6 right-6 p-4 rounded-full bg-primary hover:bg-primary-dark transition-smooth shadow-lg z-50 text-white"
                title="Voice Command"
            >
                <span className="material-symbols-outlined text-2xl">
                    {isOpen ? 'mic_off' : 'mic'}
                </span>
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 glass-strong rounded-xl p-4 z-50 fade-in border-l-4 border-primary">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-mono text-primary font-bold">CMD PROMPT</span>
                        <button onClick={() => setIsOpen(false)} className="text-muted hover:text-white">✕</button>
                    </div>
                    <div className="font-mono text-sm">
                        <div className="text-secondary mb-1">$ voice-input</div>
                        <div className="text-white mb-2">{command || '...'}</div>
                        {response && <div className="text-teal-400 border-t border-glass pt-2">{response}</div>}
                    </div>
                    {isListening && (
                        <div className="mt-2 h-1 bg-primary/20 rounded-full overflow-hidden">
                            <div className="h-full bg-primary animate-pulse w-1/2 mx-auto"></div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default VoiceCommand;
