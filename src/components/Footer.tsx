import { motion } from 'framer-motion';
import { ArrowUp, Linkedin, Github, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { personalInfo } from '@/lib/data';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-card border-t">
      <div className="container-max">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-primary">{personalInfo.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Backend Developer & AI Innovator passionate about building scalable solutions 
                and pushing the boundaries of technology.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <div className="space-y-2">
                {['Projects', 'Skills', 'Contact'].map((link) => (
                  <button
                    key={link}
                    onClick={() => document.querySelector(`#${link.toLowerCase()}`)?.scrollIntoView({ behavior: 'smooth' })}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Get In Touch</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>📧 {personalInfo.email}</p>
                <p>📍 Available for remote work</p>
                <p>⏰ Response within 24 hours</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hover:text-primary"
              >
                <a
                  href={personalInfo.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hover:text-primary"
              >
                <a
                  href={personalInfo.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={scrollToTop}
                className="ml-4"
              >
                <ArrowUp className="mr-2 h-4 w-4" />
                Back to Top
              </Button>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} {personalInfo.name}. Built with React, TypeScript & Tailwind CSS.
              </p>
              
              <motion.p 
                className="text-sm text-muted-foreground flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Built with{' '}
                <motion.span
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="mx-1"
                >
                  <Heart className="h-4 w-4 text-red-500 fill-current" />
                </motion.span>
                using React & Tailwind CSS
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};