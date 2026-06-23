import React from "react";
import { Cpu, Layout, Server, Settings, Terminal, Shield } from "lucide-react";

interface SkillItem {
  name: string;
  level: number; // 0-100 indicating experience level
}

interface SkillCardProps {
  category: string;
  icon: "frontend" | "backend" | "tools" | "ai";
  skills: SkillItem[];
  key?: any;
}

export default function SkillCard({ category, icon, skills }: SkillCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "frontend":
        return <Layout size={18} className="text-zinc-600 dark:text-zinc-400" />;
      case "backend":
        return <Server size={18} className="text-zinc-600 dark:text-zinc-400" />;
      case "tools":
        return <Settings size={18} className="text-zinc-600 dark:text-zinc-400" />;
      case "ai":
        return <Cpu size={18} className="text-zinc-600 dark:text-zinc-400" />;
      default:
        return <Terminal size={18} className="text-zinc-600 dark:text-zinc-400" />;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200/50 dark:border-zinc-800/30">
          {getIcon()}
        </div>
        <h3 className="font-mono text-sm uppercase font-bold tracking-wider text-zinc-900 dark:text-zinc-100">
          {category}
        </h3>
      </div>

      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div key={index} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {skill.name}
              </span>
              <span className="font-mono text-zinc-500 dark:text-zinc-500">
                {skill.level}%
              </span>
            </div>
            
            {/* Visual Level indicator bar */}
            <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-950 rounded-full overflow-hidden border border-zinc-200/20 dark:border-zinc-800/10">
              <div 
                className="h-full bg-zinc-800 dark:bg-zinc-300 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
