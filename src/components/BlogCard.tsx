import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Calendar, User } from "lucide-react";
import { Blog } from "../types";

interface BlogCardProps {
  blog: Blog;
  key?: any;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const dateFormatted = blog.createdAt instanceof Date 
    ? blog.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) 
    : "Recently Published";

  // Create clean short excerpt
  const rawContent = blog.content || "";
  const cleanExcerpt = rawContent.length > 130 
    ? `${rawContent.substring(0, 130).trim()}...` 
    : rawContent;

  return (
    <div className="group flex flex-col h-full bg-white dark:bg-slate-950/60 border border-zinc-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:border-zinc-300 dark:hover:border-slate-705">
      
      {/* Blog Image Frame */}
      <div className="relative overflow-hidden aspect-video bg-zinc-100 dark:bg-[#111115] border-b border-zinc-100 dark:border-slate-800">
        <img
          src={blog.coverImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"}
          alt={blog.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      </div>

      {/* Blog Card Body */}
      <div className="flex flex-col flex-grow p-6">
        
        {/* Date and Author icons row */}
        <div className="flex items-center space-x-4 mb-3 text-[10px] font-mono text-zinc-400">
          <span className="flex items-center space-x-1">
            <Calendar size={11} />
            <span>{dateFormatted}</span>
          </span>
          <span className="flex items-center space-x-1">
            <User size={11} />
            <span>{blog.author || "Krishna Kadayat"}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors mb-2 leading-snug">
          <Link to={`/blog/${blog.slug}`} className="hover:underline">
            {blog.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 flex-grow">
          {cleanExcerpt}
        </p>

        {/* Action Bottom */}
        <div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-4 mt-auto">
          <Link
            to={`/blog/${blog.slug}`}
            className="inline-flex items-center space-x-1 text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-100 group-hover:underline"
          >
            <span>Read Article</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

      </div>

    </div>
  );
}
