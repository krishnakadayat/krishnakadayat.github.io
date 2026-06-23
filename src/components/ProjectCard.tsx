import React from "react";
import { Github, ExternalLink, Award } from "lucide-react";
import { Project } from "../types";

interface ProjectCardProps {
  project: Project;
  key?: any;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const dateFormatted = project.createdAt instanceof Date 
    ? project.createdAt.toLocaleDateString("en-US", { month: "short", year: "numeric" }) 
    : "Recently Built";

  return (
    <div className="group flex flex-col h-full bg-white dark:bg-slate-950/60 border border-zinc-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:border-zinc-300 dark:hover:border-slate-705">
      
      {/* Project Image Frame */}
      <div className="relative overflow-hidden aspect-video bg-zinc-100 dark:bg-[#111115] border-b border-zinc-100 dark:border-slate-800">
        <img
          src={project.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"}
          alt={project.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Featured Pill */}
        {project.featured && (
          <div className="absolute top-4 left-4 inline-flex items-center space-x-1 bg-zinc-950/90 text-white dark:bg-white dark:text-zinc-950 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider shadow-sm select-none border border-white/10 dark:border-black/5">
            <Award size={10} className="text-zinc-400 dark:text-zinc-600 animate-pulse" />
            <span>Featured Project</span>
          </div>
        )}
      </div>

      {/* Project Body */}
      <div className="flex flex-col flex-grow p-6">
        <div className="flex justify-between items-start mb-2">
          <span className="font-mono text-[10px] uppercase text-zinc-400">
            {dateFormatted}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors mb-3 leading-snug">
          {project.title}
        </h3>
        
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 flex-grow">
          {project.description}
        </p>

        {/* Tech Badges */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.technologies.map((tech, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-[#15151b] border border-zinc-200 dark:border-slate-800 text-[10px] font-mono text-zinc-600 dark:text-zinc-300 font-medium select-none"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Links */}
        <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60 pt-4 mt-auto">
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              <Github size={14} />
              <span>Source Code</span>
            </a>
          ) : (
            <span className="text-[10px] font-mono text-zinc-300 dark:text-zinc-700">Internal Repo</span>
          )}

          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 text-xs font-mono font-medium text-zinc-900 dark:text-zinc-100 hover:underline transition-all"
            >
              <span>Deployed Demo</span>
              <ExternalLink size={13} />
            </a>
          ) : (
            <span className="text-[10px] font-mono text-zinc-300 dark:text-zinc-700">No live link</span>
          )}
        </div>
      </div>
    </div>
  );
}
