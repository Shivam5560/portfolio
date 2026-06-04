import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 px-6 py-8 mt-12">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-text-dim font-mono">
          &copy; 2026 Shivam Sourav. Built with care.
        </p>
        <div className="flex gap-4">
          {[
            { icon: GithubIcon, href: "https://github.com/Shivam5560", color: "#d4af37" },
            { icon: LinkedinIcon, href: "https://www.linkedin.com/in/shivam-sourav-b889aa204/", color: "#00e575" },
            { icon: Mail, href: "mailto:shivamsourav2003@gmail.com", color: "#ebd07f" },
          ].map(({ icon: Icon, href, color }) => (
            <motion.a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-text-muted transition-colors"
              whileHover={{ scale: 1.2, rotate: 5, color }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon size={18} />
            </motion.a>
          ))}
        </div>
      </div>
    </footer>
  );
}
