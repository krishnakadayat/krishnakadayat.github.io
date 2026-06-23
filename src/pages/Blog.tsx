import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import { getBlogs, getBlogBySlug } from "../services/blogService";
import { Blog } from "../types";
import { ArrowLeft, Calendar, User, Search, BookOpen, Clock, Copy, Check } from "lucide-react";

export default function BlogPage() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      getBlogBySlug(slug)
        .then(blog => {
          if (blog) {
            setCurrentBlog(blog);
          } else {
            setCurrentBlog(null);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(true);
      getBlogs()
        .then(all => {
          setBlogs(all);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [slug]);

  // Copy code utility
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Safe blog custom markdown text-renderer
  const renderFormattedContent = (content: string) => {
    if (!content) return null;
    
    const lines = content.split("\n");
    let inCodeBlock = false;
    let codeChunk: string[] = [];
    let codeLang = "";

    return lines.map((line, idx) => {
      // Code block toggle
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const fullCode = codeChunk.join("\n");
          codeChunk = [];
          return (
            <div key={idx} className="relative my-6 font-mono text-xs text-white bg-zinc-950 dark:bg-black rounded-lg overflow-hidden border border-zinc-800">
              <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-850 bg-zinc-900/50 text-[10px] text-zinc-400 font-sans tracking-wide">
                <span>{codeLang || "code segment"}</span>
                <button
                  onClick={() => handleCopy(fullCode)}
                  className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check size={11} className="text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={11} />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto">
                <code>{fullCode}</code>
              </pre>
            </div>
          );
        } else {
          inCodeBlock = true;
          codeLang = line.replace("```", "").trim();
          return null;
        }
      }

      if (inCodeBlock) {
        codeChunk.push(line);
        return null;
      }

      // Headers
      if (line.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-base font-bold text-zinc-900 dark:text-zinc-100 font-sans mt-6 mb-2 leading-snug">
            {line.substring(4)}
          </h3>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-sans mt-8 mb-3 border-b border-zinc-100 dark:border-zinc-800 pb-2 leading-snug">
            {line.substring(3)}
          </h2>
        );
      }
      if (line.startsWith("# ")) {
        return (
          <h1 key={idx} className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-sans mt-10 mb-4 leading-tight">
            {line.substring(2)}
          </h1>
        );
      }

      // Inline bullet points
      if (line.startsWith("- ")) {
        return (
          <li key={idx} className="ml-5 list-disc text-xs sm:text-sm text-zinc-700 dark:text-zinc-350 my-1 pb-1">
            {line.substring(2)}
          </li>
        );
      }

      // Standard paragraph
      if (line.trim() === "") {
        return <div key={idx} className="h-3" />;
      }

      return (
        <p key={idx} className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-350 leading-relaxed mb-4">
          {line}
        </p>
      );
    });
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.content.toLowerCase().includes(search.toLowerCase())
  );

  // If detailed state :slug is matching
  if (slug) {
    if (loading) {
      return (
        <div className="min-h-screen bg-zinc-50/40 dark:bg-zinc-950 flex items-center justify-center">
          <span className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
            <span className="animate-spin h-4 w-4 border-2 border-zinc-500 border-t-transparent rounded-full" />
            <span>Loading publication details...</span>
          </span>
        </div>
      );
    }

    if (!currentBlog) {
      return (
        <div className="min-h-screen bg-zinc-50/40 dark:bg-zinc-950 py-16 sm:py-24 text-center">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Publication Not Registered</h2>
          <p className="text-xs text-zinc-400 mt-2">The specified blog article slug does not match any index in Firestore.</p>
          <Link to="/blog" className="mt-6 inline-flex text-xs font-mono text-zinc-500 hover:underline">
            ← Return to index
          </Link>
        </div>
      );
    }

    const readTimeFormatted = `${Math.max(1, Math.ceil((currentBlog.content || "").split(/\s+/).length / 200))} min read`;
    const dateFormatted = currentBlog.createdAt instanceof Date 
      ? currentBlog.createdAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) 
      : "Recent Publication";

    return (
      <article className="min-h-screen bg-white dark:bg-zinc-950 py-12 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          
          {/* Back button */}
          <Link
            to="/blog"
            className="inline-flex items-center space-x-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-10 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Articles Directory</span>
          </Link>

          {/* Detailed Header */}
          <header className="mb-10 text-left">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.25] mb-5">
              {currentBlog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 border-y border-zinc-100 dark:border-zinc-900 py-3.5 font-mono text-xs text-zinc-400">
              <span className="flex items-center space-x-1.5">
                <User size={12} />
                <span className="font-semibold text-zinc-600 dark:text-zinc-300">{currentBlog.author || "Krishna Kadayat"}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Calendar size={12} />
                <span>{dateFormatted}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Clock size={12} />
                <span>{readTimeFormatted}</span>
              </span>
            </div>
          </header>

          {/* Banner cover */}
          {currentBlog.coverImage && (
            <div className="aspect-video bg-zinc-50 dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-900 mb-10">
              <img
                src={currentBlog.coverImage}
                alt={currentBlog.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Safe Markdown Content Body */}
          <div className="prose dark:prose-invert max-w-none">
            {renderFormattedContent(currentBlog.content)}
          </div>

          {/* Bottom Back Button */}
          <div className="border-t border-zinc-100 dark:border-zinc-900 pt-8 mt-12 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center space-x-1 text-xs font-mono text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              <span>← Back to all posts</span>
            </Link>
          </div>

        </div>
      </article>
    );
  }

  // Blog Directory Listing screen
  return (
    <div className="min-h-screen bg-zinc-50/40 dark:bg-zinc-950 py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Head */}
        <div className="border-b border-zinc-200/50 dark:border-zinc-800/40 pb-8 mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest block mb-2">Technical Publications</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Blog CMS Directory
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Articles and insights covering modern React setups, systems engineering, database modeling, and AI prompts.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:max-w-xs flex-shrink-0">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search written articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs focus:outline-none focus:border-zinc-500 text-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>

        {/* Directory Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900 h-64 animate-pulse rounded-xl" />
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900 h-64 animate-pulse rounded-xl" />
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-16 max-w-sm mx-auto">
            <BookOpen size={24} className="mx-auto text-zinc-400 mb-3" />
            <span className="font-mono text-xs uppercase block text-zinc-400 mb-1">Articles index empty</span>
            <p className="text-xs text-zinc-500 px-4 leading-normal">No technical publications are found reflecting your search filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
