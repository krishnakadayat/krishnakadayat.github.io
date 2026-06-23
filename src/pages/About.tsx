import React, { useState, useEffect } from "react";
import { getCertificates } from "../services/extraService";
import { Certificate } from "../types";
import { Cpu, Globe, GraduationCap, MapPin, Terminal, Award, FileSpreadsheet, Send } from "lucide-react";

export default function About() {
  const [certs, setCerts] = useState<Certificate[]>([]);

  useEffect(() => {
    getCertificates().then(all => setCerts(all));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50/40 dark:bg-zinc-950 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* About heading */}
        <div className="border-b border-zinc-200/55 dark:border-zinc-800/40 pb-10">
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest block mb-2">Architect Profile</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
            About Me — Krishna Kadayat
          </h1>
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 font-mono text-xs text-zinc-500">
            <span className="flex items-center space-x-1">
              <MapPin size={13} />
              <span>Kathmandu, Nepal (Remote Workspace)</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center space-x-1">
              <Terminal size={13} />
              <span>Full-Stack Systems Engineer</span>
            </span>
          </div>
        </div>

        {/* Story details */}
        <div className="py-12 space-y-8 text-zinc-650 dark:text-zinc-400 text-sm leading-relaxed">
          <p>
            I am a software engineer dedicated to building clean, maintainable, and highly high-performance web systems. For me, coding goes beyond just generating functional scripts — it's about engineering resilient ecosystems, designing highly responsive user interfaces, and automating operational workloads.
          </p>

          <p>
            Over the course of my engineering journey, I have had the privilege to deliver multiple full-stack React systems, robust backend server integrations, and seamless developer productivity CLI integrations. I focus my development around safe Type systems (TypeScript), modular component setups, and durably-modeled cloud storage layouts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-6 my-4 border-y border-zinc-200/50 dark:border-zinc-800/20">
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 font-mono text-xs uppercase tracking-wider mb-3">
                My Philosophy
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                Avoid unnecessary complexity. Build clean single-responsibility components and focus on precise performance benchmarks, robust caching policies, and safe database indexes.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 font-mono text-xs uppercase tracking-wider mb-3">
                Core Core Specialties
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                React 19 Hooks & Server actions, Firebase Firestore, Express architectures, GitHub API adapters, data-driven visualizations with D3.js, and Google GenAI prompt engineering pipelines.
              </p>
            </div>
          </div>

          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-mono uppercase tracking-tight pt-6">
            Certifications & Training
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {certs.map((c) => (
              <div 
                key={c.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 p-5 rounded-xl flex items-start space-x-4 shadow-sm"
              >
                <div className="p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800 rounded-lg flex-shrink-0">
                  <Award size={18} className="text-zinc-500" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-50 text-xs leading-snug">
                    {c.title}
                  </h4>
                  <span className="font-mono text-[10px] text-zinc-400 block mt-1">{c.issuer} ({c.issueDate})</span>
                  {c.credentialUrl && (
                    <a
                      href={c.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-0.5 text-[9px] font-mono text-zinc-500 hover:text-zinc-900 mt-2 hover:underline"
                    >
                      <span>Credentials link</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
