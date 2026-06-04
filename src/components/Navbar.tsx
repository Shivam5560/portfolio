import { motion } from "framer-motion";
import { User, Briefcase, Code2, Cpu, Mail, ShieldAlert } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "About", href: "#about", icon: User },
  { label: "Experience", href: "#experience", icon: Briefcase },
  { label: "Projects", href: "#projects", icon: Code2 },
  { label: "Skills", href: "#skills", icon: Cpu },
  { label: "Contact", href: "#contact", icon: Mail },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("");

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      for (const link of navLinks) {
        const el = document.getElementById(link.href.slice(1));
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(link.href);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Balanced Status Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-40 px-6 py-4 pointer-events-none"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          {/* Logo badge */}
          <motion.a
            href="#"
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-xl border border-accent/20 bg-surface/80 backdrop-blur-md font-sans text-sm font-bold text-accent shadow-lg shadow-accent/5"
            whileHover={{ scale: 1.05, borderColor: "#d4af37", color: "#d4af37" }}
            whileTap={{ scale: 0.95 }}
          >
            SS
          </motion.a>

          {/* System status display */}
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-accent/10 bg-surface/60 backdrop-blur-md px-3.5 py-1.5 font-mono text-[10px] font-semibold text-text-muted shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
            </span>
            SYSTEM: ONLINE
          </div>
        </div>
      </motion.div>

      {/* Floating Bottom macOS-Style Glass Dock */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 25, delay: 0.2 }}
        className="fixed bottom-6 left-0 right-0 mx-auto w-fit z-50 flex items-center gap-2 rounded-full border border-white/5 bg-[#090e0c]/75 px-4 py-3 backdrop-blur-xl shadow-[0_24px_50px_rgba(0,0,0,0.4),0_0_24px_rgba(0,229,117,0.05)]"
      >
        {/* Socials Sub-dock */}
        <div className="flex items-center gap-2 pr-2 border-r border-white/10">
          <motion.a
            href="https://github.com/Shivam5560"
            target="_blank"
            rel="noreferrer"
            className="group relative flex h-10 w-10 items-center justify-center rounded-full text-text-muted hover:text-white transition-colors"
            whileHover={{ scale: 1.15, y: -4, backgroundColor: "rgba(212, 175, 55, 0.1)" }}
            whileTap={{ scale: 0.9 }}
          >
            <GithubIcon width={18} height={18} />
            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 scale-75 rounded-md border border-cyan/20 bg-[#090e0c] px-2.5 py-1 font-mono text-[9px] text-cyan opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap shadow-md">
              GitHub
            </span>
          </motion.a>
          
          <motion.a
            href="https://www.linkedin.com/in/shivam-sourav-b889aa204/"
            target="_blank"
            rel="noreferrer"
            className="group relative flex h-10 w-10 items-center justify-center rounded-full text-text-muted hover:text-white transition-colors"
            whileHover={{ scale: 1.15, y: -4, backgroundColor: "rgba(0, 229, 117, 0.1)" }}
            whileTap={{ scale: 0.9 }}
          >
            <LinkedinIcon width={18} height={18} />
            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 scale-75 rounded-md border border-accent/20 bg-[#090e0c] px-2.5 py-1 font-mono text-[9px] text-accent opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap shadow-md">
              LinkedIn
            </span>
          </motion.a>
        </div>

        {/* Navigation items */}
        <div className="flex items-center gap-1 px-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeSection === link.href;
            return (
              <motion.a
                key={link.href}
                href={link.href}
                className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                  isActive ? "text-accent bg-accent-glow" : "text-text-muted hover:text-white"
                }`}
                whileHover={{ scale: 1.15, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={18} />
                
                {/* Active Under-Dot */}
                {isActive && (
                  <motion.span
                    layoutId="activeIndicator"
                    className="absolute bottom-1.5 h-1 w-1 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Tooltip */}
                <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 scale-75 rounded-md border border-white/5 bg-[#090e0c] px-2.5 py-1 font-mono text-[9px] text-text opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap shadow-md">
                  {link.label}
                </span>
              </motion.a>
            );
          })}
        </div>

        {/* Hire Me trigger */}
        <div className="pl-2 border-l border-white/10">
          <motion.a
            href="mailto:shivamsourav2003@gmail.com"
            className="group relative flex h-10 w-10 items-center justify-center rounded-full text-accent"
            whileHover={{ scale: 1.15, y: -4, backgroundColor: "rgba(0, 229, 117, 0.1)" }}
            whileTap={{ scale: 0.9 }}
          >
            <ShieldAlert size={18} className="text-cyan animate-pulse" />
            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 scale-75 rounded-md border border-cyan/20 bg-[#090e0c] px-2.5 py-1 font-mono text-[9px] text-cyan opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap shadow-md">
              Hire me!
            </span>
          </motion.a>
        </div>
      </motion.div>
    </>
  );
}
