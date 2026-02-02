import { useState, useEffect } from 'react';

const TypingText = ({ texts = [], speed = 150, pause = 2000, className = "" }) => {
    const [textIndex, setTextIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!texts.length) return;

        const currentText = texts[textIndex];
        let timer;

        if (isDeleting) {
            timer = setTimeout(() => {
                setCharIndex(prev => prev - 1);
            }, speed / 2);
        } else {
            timer = setTimeout(() => {
                setCharIndex(prev => prev + 1);
            }, speed);
        }

        if (!isDeleting && charIndex === currentText.length) {
            clearTimeout(timer);
            timer = setTimeout(() => setIsDeleting(true), pause);
        } else if (isDeleting && charIndex === 0) {
            setIsDeleting(false);
            setTextIndex(prev => (prev + 1) % texts.length);
        }

        return () => clearTimeout(timer);
    }, [charIndex, isDeleting, texts, textIndex, speed, pause]);

    // Handle empty texts
    if (!texts.length) return null;

    return (
        <span className={className}>
            {texts[textIndex]?.substring(0, charIndex)}
            <span className="animate-blink">|</span>
        </span>
    );
};

export default TypingText;
