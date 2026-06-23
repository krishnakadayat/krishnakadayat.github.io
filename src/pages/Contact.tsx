import React from "react";
import ContactForm from "../components/ContactForm";
import { Mail, MapPin, Terminal, Calendar, ArrowUpRight } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-zinc-50/40 dark:bg-zinc-950 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Head */}
        <div className="border-b border-zinc-200/50 dark:border-zinc-800/40 pb-8 mb-16">
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest block mb-2">Operational Links</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Get In Touch
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Have a project scope, contract opportunity, or feedback you'd like to share?
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-4 space-y-8">
            {/* Context block */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 font-mono text-xs uppercase tracking-wider mb-4 flex items-center space-x-1.5">
                <Terminal size={14} className="text-zinc-500" />
                <span>Contact Routing Directory</span>
              </h3>
              
              <ul className="space-y-4 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                <li className="flex items-start space-x-3">
                  <Mail size={14} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-400 block">General Inquiries</span>
                    <a href="mailto:krishnakadayat112@gmail.com" className="hover:underline text-zinc-800 dark:text-zinc-200 break-all">
                      krishnakadayat112@gmail.com
                    </a>
                  </div>
                </li>
                
                <li className="flex items-start space-x-3">
                  <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Engineering Base</span>
                    <span className="text-zinc-800 dark:text-zinc-200">Kathmandu, Nepal</span>
                  </div>
                </li>

                <li className="flex items-start space-x-3">
                  <Calendar size={14} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Availability</span>
                    <span className="text-zinc-850 dark:text-zinc-200 font-bold">Open for Remote Positions</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Professional networks links */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-200 font-mono text-xs uppercase tracking-wider mb-3">
                Professional Connections
              </h3>
              
              <div className="space-y-3 pt-1">
                <a
                  href="https://github.com/krishnakadayat1"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2 rounded hover:bg-zinc-50 dark:hover:bg-zinc-950 font-mono text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  <span>GitHub Profile</span>
                  <ArrowUpRight size={13} className="text-zinc-400" />
                </a>

                <a
                  href="https://linkedin.com/in/krishnakadayat"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2 rounded hover:bg-zinc-50 dark:hover:bg-zinc-950 font-mono text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  <span>LinkedIn Credentials</span>
                  <ArrowUpRight size={13} className="text-zinc-400" />
                </a>
              </div>
            </div>

          </div>

          <div className="lg:col-span-8">
            <ContactForm />
          </div>

        </div>

      </div>
    </div>
  );
}
