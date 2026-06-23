import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import SkillCard from "../components/SkillCard";
import ProjectCard from "../components/ProjectCard";
import BlogCard from "../components/BlogCard";
import ContactForm from "../components/ContactForm";
import { getProjects } from "../services/projectService";
import { getBlogs } from "../services/blogService";
import { getCertificates } from "../services/extraService";
import { Project, Blog, Certificate } from "../types";
import { motion } from "motion/react";
import { Github, BookOpen, GraduationCap, Briefcase, ChevronRight, Activity, GitCommit, GitBranch, ShieldCheck, Terminal } from "lucide-react";

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [githubData, setGithubData] = useState<any>(null);
  const [loadingGit, setLoadingGit] = useState(true);

  // Hardcoded skills categories
  const skillCategories = [
    {
      category: "Frontend Development",
      icon: "frontend" as const,
      skills: [
        { name: "React 19 & Next.js", level: 96 },
        { name: "TypeScript", level: 92 },
        { name: "Tailwind CSS & Framer Motion", level: 95 },
        { name: "State Engines (Zustand/Redux)", level: 88 }
      ]
    },
    {
      category: "Backend & Systems",
      icon: "backend" as const,
      skills: [
        { name: "Node.js & Express", level: 90 },
        { name: "Cloud Firestore / Realtime DB", level: 93 },
        { name: "PostgreSQL & Prisma SQL", level: 85 },
        { name: "Restful & GraphQL APIs", level: 89 }
      ]
    },
    {
      category: "AI & Developer Tools",
      icon: "ai" as const,
      skills: [
        { name: "@google/genai Integration", level: 94 },
        { name: "Git & CI/CD Actions", level: 88 },
        { name: "Docker Containers", level: 80 },
        { name: "Google Cloud Platform", level: 82 }
      ]
    }
  ];

  // Hardcoded Experience timeline
  const experiences = [
    {
      role: "Lead Systems Architect & AI Engineer",
      company: "Synthetix Solutions (Remote)",
      period: "Jul 2025 - Present",
      description: "Designed core serverless backends integrated with Gemini 2.5 Flash agents to execute multi-step analysis on real estate agreements. Accelerated React micro-frontends speeds by 40% with memoization audits."
    },
    {
      role: "Full Stack Software Developer",
      company: "Inovise Tech Systems",
      period: "Sep 2024 - Jun 2025",
      description: "Built scalable relational schema engines and synchronized real-time collaboration tables on Firestore. Established rigorous CI/CD test gates preventing regression bugs."
    },
    {
      role: "Junior Front-End Intern",
      company: "WebLabs Studio",
      period: "Jan 2024 - Aug 2024",
      description: "Implemented fully-responsive UI dashboards using Tailwind CSS and React Router. Participated in structural scrum sprints and code review workshops."
    }
  ];

  useEffect(() => {
    // Retrieve projects, blogs, certs
    getProjects().then(all => {
      setFeaturedProjects(all.filter(p => p.featured).slice(0, 3));
    });
    getBlogs().then(all => {
      setLatestBlogs(all.slice(0, 2));
    });
    getCertificates().then(all => {
      setCertificates(all.slice(0, 3));
    });

    // Retrieve real GitHub stats from local Express endpoint
    fetch("/api/github")
      .then(res => res.json())
      .then(data => {
        setGithubData(data);
        setLoadingGit(false);
      })
      .catch(err => {
        console.error("Error retrieving github statistics:", err);
        setLoadingGit(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F4F6] dark:bg-[#0A0A0B] py-8 sm:py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
        
        {/* Bento Grid layout container */}
        <div className="grid grid-cols-12 gap-5">
          
          {/* Card 1: Intro Section (col-span-12 lg:col-span-8) */}
          <div className="col-span-12 lg:col-span-8 bg-white dark:bg-[#111115]/80 border border-zinc-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-10 flex flex-col justify-center relative overflow-hidden min-h-[380px] shadow-sm">
            <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 text-zinc-900 dark:text-white pointer-events-none">
              <Terminal className="w-56 h-56" />
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-slate-200/50 dark:bg-slate-900/40 px-3.5 py-1.5 rounded-full border border-zinc-200/30 dark:border-slate-800/20">
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                  Kathmandu, Nepal • Available for new contracts
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
                Building Digital <br/>
                <span className="text-zinc-500 dark:text-zinc-400 font-mono font-medium">Experiences that Matter</span>
              </h1>

              <p className="text-sm sm:text-base text-zinc-605 dark:text-zinc-400 max-w-xl leading-relaxed">
                Hi, I'm <span className="text-zinc-900 dark:text-white font-semibold">Krishna Kadayat</span>. A performance-focused Software Engineer building scalable code ecosystems. Specializing in React 19 apps, Cloud Firestores, and custom-engineered Gemini API systems.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Link
                  to="/projects"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 font-mono text-xs font-semibold rounded-xl text-white transition-all shadow-sm cursor-pointer"
                >
                  Explore My Projects
                  <ChevronRight size={13} className="ml-1" />
                </Link>
                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 border border-zinc-200 dark:border-slate-800 text-xs font-mono font-medium rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-colors cursor-pointer"
                >
                  Get In Touch
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: GitHub Stats Box (col-span-12 lg:col-span-4) */}
          <div className="col-span-12 lg:col-span-4 bg-[#1b1f23] border border-[#30363d]/80 text-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-lg">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">GitHub Activity</span>
              <span className="text-[10px] bg-green-500/10 text-green-450 px-2 py-0.5 rounded-full font-mono flex items-center space-x-1">
                <span className="h-1.5 w-1.5 bg-green-400 rounded-full animate-ping" />
                <span>Active Now</span>
              </span>
            </div>

            {loadingGit ? (
              <div className="animate-pulse space-y-4 my-6">
                <div className="h-10 w-10 bg-slate-800 rounded-full" />
                <div className="h-4 w-28 bg-slate-800 rounded" />
                <div className="h-3 w-4/5 bg-slate-800 rounded" />
              </div>
            ) : (
              <div className="my-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <img 
                    src={githubData?.profile?.avatar_url || "https://avatars.githubusercontent.com/u/120610931?v=4"} 
                    alt="GitHub Profile Avatar" 
                    className="h-10 w-10 rounded-full border border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm">{githubData?.profile?.name || "Krishna Kadayat"}</h4>
                    <span className="font-mono text-xs text-slate-500">@{githubData?.profile?.login || "krishnakadayat1"}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {githubData?.profile?.bio || "Full stack developer specializing in fast, smart and resilient cloud systems."}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-800/30 border border-slate-800 rounded-xl">
                    <p className="text-xl font-bold text-white">{githubData?.profile?.public_repos ?? "34"}</p>
                    <p className="text-[9px] uppercase text-slate-500 tracking-wider">Repositories</p>
                  </div>
                  <div className="p-3 bg-slate-800/30 border border-slate-805 rounded-xl">
                    <p className="text-xl font-bold text-white">{githubData?.contributions?.total ?? "1.2k"}</p>
                    <p className="text-[9px] uppercase text-slate-500 tracking-wider">Contributions</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-1 h-10 items-end border-t border-slate-800/65 pt-4">
              <div className="flex-1 bg-green-900/40 h-[30%] rounded-sm"></div>
              <div className="flex-1 bg-green-700 h-[60%] rounded-sm"></div>
              <div className="flex-1 bg-green-500 h-[45%] rounded-sm"></div>
              <div className="flex-1 bg-green-900/50 h-[20%] rounded-sm"></div>
              <div className="flex-1 bg-green-500 h-[80%] rounded-sm"></div>
              <div className="flex-1 bg-green-400 h-[95%] rounded-sm"></div>
              <div className="flex-1 bg-green-700 h-[55%] rounded-sm"></div>
              <div className="flex-1 bg-green-900/30 h-[40%] rounded-sm"></div>
              {githubData?.profile?.html_url && (
                <a 
                  href={githubData.profile.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center space-x-1 pl-1"
                >
                  <span>Link</span>
                  <ChevronRight size={10} />
                </a>
              )}
            </div>
          </div>

          {/* Card 3: Skills cloud (col-span-12 lg:col-span-6) */}
          <div className="col-span-12 lg:col-span-6 bg-white dark:bg-[#111115]/80 border border-zinc-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div>
              <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest block mb-1">My Toolbelt</span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
                Technical Stack Cloud
              </h2>

              <div className="space-y-4">
                {skillCategories.map((sc, index) => (
                  <div key={index} className="space-y-2">
                    <span className="text-xs font-semibold text-zinc-500 block">{sc.category}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {sc.skills.map((skill, si) => (
                        <span 
                          key={si}
                          className="px-2.5 py-1 bg-zinc-100 dark:bg-slate-900/80 border border-zinc-200/50 dark:border-slate-800 rounded-full text-xs text-zinc-800 dark:text-zinc-300 transition-colors"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-slate-800/60 text-[10px] font-mono text-zinc-400 flex items-center space-x-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>Constantly active integration cycles</span>
            </div>
          </div>

          {/* Card 4: Historical Trajectory / Experiences (col-span-12 lg:col-span-6) */}
          <div className="col-span-12 lg:col-span-6 bg-white dark:bg-[#111115]/80 border border-zinc-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm">
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest block mb-1">History & Trajectory</span>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
              Professional Journey
            </h2>

            <div className="space-y-6 relative pl-3.5 border-l border-zinc-200 dark:border-slate-800">
              {experiences.map((exp, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -left-[20.5px] top-1.5 w-3 h-3 rounded-full border-2 border-zinc-850 bg-white dark:border-zinc-300 dark:bg-[#0A0A0B] group-hover:bg-zinc-900 dark:group-hover:bg-white transition-colors" />
                  <span className="font-mono text-[9px] text-zinc-400 dark:text-zinc-500 block">
                    {exp.period}
                  </span>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-150 text-xs sm:text-sm leading-snug mt-0.5">
                    {exp.role} <span className="font-normal text-zinc-500">at {exp.company}</span>
                  </h3>
                  <p className="mt-1 text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Card 5: Featured Projects Grid (col-span-12 lg:col-span-8) */}
          <div className="col-span-12 lg:col-span-8 bg-white dark:bg-[#111115]/80 border border-zinc-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="font-mono text-xs text-zinc-450 uppercase block mb-0.5">Coded work</span>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    Featured Systems
                  </h2>
                </div>
                <Link
                  to="/projects"
                  className="inline-flex items-center space-x-1 font-mono text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                >
                  <span>Gallery</span>
                  <ChevronRight size={12} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {featuredProjects.slice(0, 2).map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
                {featuredProjects.length === 0 && (
                  <p className="text-xs text-zinc-400 font-mono italic p-4">Create projects in dashboard admin link to view them live.</p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-slate-800 text-right">
              <Link 
                to="/projects"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-500 hover:text-blue-600 font-mono"
              >
                <span>Read Full Archive</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>

          {/* Card 6: Blog publication snippets (col-span-12 lg:col-span-4) */}
          <div className="col-span-12 lg:col-span-4 bg-white dark:bg-[#111115]/80 border border-zinc-200/80 dark:border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest block mb-1">Publications</span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
                Latest Articles
              </h2>

              <div className="space-y-5">
                {latestBlogs.map((b) => (
                  <div key={b.id} className="group flex flex-col space-y-1">
                    <span className="text-[9px] font-mono text-blue-500">
                      {b.createdAt instanceof Date ? b.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent"}
                    </span>
                    <Link 
                      to={`/blog/${b.slug}`}
                      className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors line-clamp-2"
                    >
                      {b.title}
                    </Link>
                  </div>
                ))}
                {latestBlogs.length === 0 && (
                  <p className="text-xs text-zinc-400 font-mono italic">No publications created yet. Create a blog in the Admin section!</p>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-slate-800/60">
              <Link
                to="/blog"
                className="w-full inline-flex items-center justify-center py-2.5 bg-blue-600/10 text-blue-500 hover:bg-blue-600/15 border border-blue-500/20 rounded-xl text-xs font-bold font-mono transition-colors"
              >
                Read All Posts
              </Link>
            </div>
          </div>

          {/* Card 7: Verified Certificates (col-span-12 lg:col-span-6) */}
          <div className="col-span-12 lg:col-span-6 bg-white dark:bg-[#111115]/80 border border-zinc-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div>
              <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest block mb-1">Certs</span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
                Certificates & Credentials
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certificates.slice(0, 2).map((cert) => (
                  <div key={cert.id} className="p-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-slate-800/60 rounded-xl flex items-start space-x-3 text-left">
                    <img 
                      src={cert.image} 
                      alt={cert.title} 
                      className="w-10 h-10 rounded object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-[8px] text-zinc-400 block">{cert.issuer}</span>
                      <h4 className="font-bold text-zinc-950 dark:text-zinc-50 text-[11px] leading-snug truncate">{cert.title}</h4>
                      {cert.credentialUrl && (
                        <a 
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[9px] font-mono text-blue-500 hover:underline flex items-center space-x-0.5 mt-1"
                        >
                          <span>Verify</span>
                          <ChevronRight size={8} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                {certificates.length === 0 && (
                  <p className="text-xs text-zinc-400 font-mono italic col-span-2">No certificates verified yet. Add some in administrative dashboard!</p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-slate-800/60 text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center justify-between">
              <span>Google Cloud & Meta Verified</span>
              <span>Total certs: {certificates.length}</span>
            </div>
          </div>

          {/* Card 8: Inquiries Gateway & Contact Portal (col-span-12 lg:col-span-6) */}
          <div className="col-span-12 lg:col-span-6 bg-white dark:bg-[#111115]/80 border border-zinc-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div>
              <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest block mb-1">Direct wire link</span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
                Establish Collaborative Channels
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-405 leading-relaxed mb-6">
                Have an architecture contract, software build projects, or strategic consulting proposal? Wire an active request node!
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/contact"
                className="w-full inline-flex items-center justify-center py-3 bg-zinc-950 hover:bg-zinc-850 dark:bg-white text-white dark:text-zinc-950 dark:hover:bg-zinc-100 rounded-2xl text-xs font-mono font-bold transition-all shadow-md cursor-pointer"
              >
                <span>Launch Direct Inquiry Socket</span>
                <ChevronRight size={13} className="ml-1" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
