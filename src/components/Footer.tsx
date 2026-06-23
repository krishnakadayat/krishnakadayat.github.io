import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter, Mail, ArrowUp, Code } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full border-t border-zinc-200/50 dark:border-slate-900 bg-[#F4F4F6] dark:bg-[#0A0A0B] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          
          {/* Brand details */}
          <div className="flex items-center space-x-2 text-zinc-900 dark:text-zinc-100 font-mono font-medium text-sm">
            <Code size={16} className="text-zinc-400" />
            <span>Krishna Kadayat &copy; {currentYear}</span>
          </div>

          {/* Navigation Shortcuts */}
          <div className="flex flex-wrap justify-start space-x-6 my-6 md:my-0">
            <Link to="/" className="text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
              Home
            </Link>
            <Link to="/about" className="text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
              About
            </Link>
            <Link to="/projects" className="text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
              Projects
            </Link>
            <Link to="/blog" className="text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
              Blog
            </Link>
            <Link to="/contact" className="text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
              Contact
            </Link>
          </div>

          {/* Socials & Scroller */}
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/krishnakadayat1"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="https://linkedin.com/in/krishnakadayat"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="mailto:krishnakadayat112@gmail.com"
              className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              aria-label="Email Address"
            >
              <Mail size={16} />
            </a>
            
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp size={14} />
            </button>
          </div>

        </div>
        
        <div className="mt-8 border-t border-gray-100 dark:border-gray-900 pt-8 text-center">
          <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 leading-normal">
            Designed and built with full-stack React 19, Express, Tailwind CSS, Firestore, and Google Gemini AI integration.
          </p>
        </div>
      </div>
    </footer>
  );
}
