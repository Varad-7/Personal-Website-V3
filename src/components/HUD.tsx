import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Instagram } from 'lucide-react';

const navItems = [
  { label: 'Home', section: 0 },
  { label: 'Education', section: 1 },
  { label: 'Experience', section: 2 },
  { label: 'Interests', section: 3 },
  { label: 'Contact', section: 4 },
];

export const HUD = () => {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScrollSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      setActiveSection(customEvent.detail);
    };
    window.addEventListener('syncActiveSection', handleScrollSync);
    return () => window.removeEventListener('syncActiveSection', handleScrollSync);
  }, []);

  const isAtBottom = activeSection === navItems.length - 1;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute top-3 sm:top-6 left-3 sm:left-6 right-3 sm:right-6 flex flex-col md:flex-row items-center justify-between pointer-events-auto gap-3 sm:gap-4"
      >
        <div className="glass-panel px-4 sm:px-5 py-2 sm:py-3 hidden sm:block">
          <span className="font-display font-bold text-lg tracking-wide neon-text-blue">
            VP
          </span>
        </div>

        <nav className="glass-panel px-2 sm:px-3 py-2 sm:py-2.5 flex flex-wrap justify-center gap-0.5 sm:gap-2 max-w-full">
          {navItems.map((item, i) => (
            <button
              key={item.label}
              onClick={() => {
                setActiveSection(i);
                window.dispatchEvent(new CustomEvent('scrollToSection', { detail: i }));
              }}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm font-display font-medium transition-all duration-300 ${
                activeSection === i
                  ? 'bg-primary/20 neon-text-blue'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </motion.div>

      {/* Footer Center Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 sm:gap-6 pointer-events-auto"
      >
        {/* Scroll indicator - hidden when at bottom */}
        <AnimatePresence>
          {!isAtBottom && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-2 pointer-events-none"
            >
              <span className="text-[10px] sm:text-xs font-mono text-muted-foreground tracking-widest uppercase">
                Scroll to explore
              </span>
              <div className="scroll-indicator w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
                <div className="w-1 h-2 rounded-full bg-primary" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Social links - only visible when scrolled to bottom */}
        <AnimatePresence>
          {isAtBottom && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="glass-panel px-6 sm:px-8 py-3 sm:py-4 flex gap-6 sm:gap-8"
            >
              <a href="https://github.com/Varad-7" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-300">
                <Github className="w-6 h-6 sm:w-7 sm:h-7" />
              </a>
              <a href="https://www.linkedin.com/in/varad-patil-ab2008256/" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-300">
                <Linkedin className="w-6 h-6 sm:w-7 sm:h-7" />
              </a>
              <a href="https://www.instagram.com/varadpatil_262/" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-300">
                <Instagram className="w-6 h-6 sm:w-7 sm:h-7" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Side progress dots */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 pointer-events-auto"
      >
        {navItems.map((item, i) => (
          <button
            key={item.label}
            onClick={() => {
              setActiveSection(i);
              window.dispatchEvent(new CustomEvent('scrollToSection', { detail: i }));
            }}
            className="group flex items-center gap-3"
            title={item.label}
          >
            <span className={`text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              activeSection === i ? 'neon-text-blue' : 'text-muted-foreground'
            }`}>
              {item.label}
            </span>
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeSection === i
                ? 'bg-primary neon-glow-blue scale-150'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
            }`} />
          </button>
        ))}
      </motion.div>

      {/* Corner decorations - hidden on mobile for cleaner look */}
      <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-primary/20 pointer-events-none hidden sm:block" />
      <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-primary/20 pointer-events-none hidden sm:block" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-primary/20 pointer-events-none hidden sm:block" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-primary/20 pointer-events-none hidden sm:block" />
    </div>
  );
};
