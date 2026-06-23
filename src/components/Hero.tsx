import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Github, Code, Sparkles, Terminal } from "lucide-react";
import { motion } from "motion/react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden py-24 md:py-32 bg-white dark:bg-zinc-950">
      
      {/* Visual background accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-zinc-100/50 dark:bg-zinc-900/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-zinc-200/30 dark:bg-zinc-800/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          
          {/* Animated decorative badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-zinc-50 dark:bg-zinc-90 w-auto px-3.5 py-1.5 rounded-full border border-zinc-200/60 dark:border-zinc-800/40 mb-6"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-zinc-600 dark:text-zinc-300">
              OPEN FOR OFFERS & TEAM COLLABORATIONS
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white max-w-4xl mx-auto leading-[1.1]"
          >
            Crafting Scalable Full-Stack <br />
            <span className="text-zinc-500 dark:text-zinc-400 font-mono">Architectures & Smart AI Systems</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            Hi, I'm <strong className="text-zinc-900 dark:text-zinc-200 font-medium">Krishna Kadayat</strong>. A results-driven Software Engineer building performant code ecosystems. Specializing in high-performance React 19 apps, Cloud Firestores, and customized Gemini API assistants.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/projects"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-mono font-medium rounded-lg text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 transition-all shadow-sm"
            >
              <span>Explore My Projects</span>
              <ArrowRight size={14} className="ml-2" />
            </Link>
            
            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-zinc-200 dark:border-zinc-800 text-sm font-mono font-medium rounded-lg text-zinc-700 hover:text-zinc-900 bg-white hover:bg-zinc-50 dark:bg-zinc-900/40 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-colors"
            >
              <span>Get In Touch</span>
            </Link>
          </motion.div>

          {/* Technical Badges info bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-8 border-t border-zinc-100 dark:border-zinc-900/60 max-w-4xl mx-auto text-zinc-400 font-mono text-xs"
          >
            <div className="flex items-center space-x-1.5">
              <Terminal size={14} />
              <span>React 19 & TypeScript Specialists</span>
            </div>
            <div className="hidden sm:block text-zinc-300 dark:text-zinc-800">•</div>
            <div className="flex items-center space-x-1.5">
              <Code size={14} />
              <span>Full-Stack Cloud Firestore Data Architectures</span>
            </div>
            <div className="hidden sm:block text-zinc-300 dark:text-zinc-800">•</div>
            <div className="flex items-center space-x-1.5">
              <Sparkles size={14} className="text-zinc-500" />
              <span>Gemini AI Integrator</span>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
