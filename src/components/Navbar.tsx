import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-light" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <motion.a
          href="#"
          className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-terracotta font-serif text-lg font-bold text-terracotta"
          whileHover={{
            scale: 1.1,
            boxShadow: "0 0 20px rgba(196, 127, 90, 0.2)",
          }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          SS
        </motion.a>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="relative rounded-lg px-4 py-2 text-sm font-medium text-sand transition-colors hover:text-terracotta"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {link.label}
            </motion.a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <motion.a
            href="https://github.com/Shivam5560"
            target="_blank"
            rel="noreferrer"
            className="text-sand hover:text-terracotta transition-colors"
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <GithubIcon width={18} height={18} />
          </motion.a>
          <motion.a
            href="https://www.linkedin.com/in/shivam-sourav-b889aa204/"
            target="_blank"
            rel="noreferrer"
            className="text-sand hover:text-terracotta transition-colors"
            whileHover={{ scale: 1.2, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <LinkedinIcon width={18} height={18} />
          </motion.a>
          <motion.a
            href="mailto:shivamsourav2003@gmail.com"
            className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-canvas transition-all hover:bg-terracotta"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 4px 24px rgba(196, 127, 90, 0.25)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail size={14} className="inline mr-1" /> Hire me
          </motion.a>
        </div>
      </div>
    </motion.header>
  );
}
