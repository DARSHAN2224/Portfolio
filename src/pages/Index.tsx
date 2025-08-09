import { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Projects } from '@/components/Projects';
import { Skills } from '@/components/Skills';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { Admin } from '@/components/Admin';
import { useTheme } from '@/stores/useTheme';

const Index = () => {
  const { isDark, setTheme } = useTheme();

  useEffect(() => {
    // Apply theme on initial load
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme) {
      const preferredTheme = JSON.parse(savedTheme);
      setTheme(preferredTheme);
    } else {
      // Default to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark);
    }
  }, [setTheme]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <Hero />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <Admin />
    </div>
  );
};

export default Index;
