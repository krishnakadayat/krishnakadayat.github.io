import React, { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { getProjects } from "../services/projectService";
import { Project } from "../types";
import { AlertCircle, Search, SlidersHorizontal, Terminal } from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(all => {
        setProjects(all);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Compute all unique technology tags across all projects
  const allTags = ["All", ...Array.from(new Set(projects.flatMap(p => p.technologies || [])))];

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
      p.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesTag = selectedTag === "All" || p.technologies.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-zinc-50/40 dark:bg-zinc-950 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="border-b border-zinc-200/50 dark:border-zinc-800/40 pb-8 mb-12">
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest block mb-2">Coding Portfolio</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Engineering Projects
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            A comprehensive curation of web utilities, structural APIs, and modern AI implementations I have built.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-8">
          {/* Search box */}
          <div className="relative flex-grow max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search project titles, specifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-zinc-500 text-zinc-900 dark:text-zinc-100"
            />
          </div>

          {/* Tag pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 font-mono text-[10px]">
            {allTags.slice(0, 8).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-md border text-[10px] font-medium transition-colors cursor-pointer ${
                  selectedTag === tag
                    ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900"
                    : "bg-white border-zinc-200 hover:border-zinc-300 text-zinc-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-810 h-72 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl max-w-sm mx-auto">
            <AlertCircle size={24} className="mx-auto text-zinc-400 mb-3" />
            <span className="font-mono text-xs uppercase block text-zinc-400 mb-1">State: No matches</span>
            <p className="text-xs text-zinc-500 px-4">No portfolio deliverables match your specific keyword filters or technology tag.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
