import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  getProjects, addProject, updateProject, deleteProject 
} from "../services/projectService";
import { 
  getBlogs, addBlog, updateBlog, deleteBlog 
} from "../services/blogService";
import { 
  getMessages, deleteMessage, markMessageRead 
} from "../services/contactService";
import { 
  getCertificates, addCertificate, deleteCertificate,
  getGalleryItems, addGalleryItem, deleteGalleryItem
} from "../services/extraService";
import { Project, Blog, Message, Certificate, GalleryItem } from "../types";
import { 
  LayoutDashboard, Server, BookOpen, MessageSquare, 
  Award, Image, LogOut, Plus, Sparkles, Trash2, 
  Check, Eye, Terminal, Star, ExternalLink, Calendar,
  Activity, ArrowDown, ChevronRight, BarChart3, HelpCircle
} from "lucide-react";

export default function Dashboard() {
  const { user, logout, isDemoUser } = useAuth();
  
  // Dashboard state variables
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "blogs" | "messages" | "certs" | "gallery">("overview");
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  
  // Load trackers
  const [loading, setLoading] = useState(true);

  // Modal / Inputs state
  const [showProjModal, setShowProjModal] = useState(false);
  const [editingProj, setEditingProj] = useState<Project | null>(null);
  const [projForm, setProjForm] = useState({
    title: "",
    description: "",
    image: "",
    github: "",
    demo: "",
    technologies: "",
    featured: false
  });

  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: "",
    content: "",
    coverImage: "",
    author: "Krishna Kadayat"
  });

  const [showCertModal, setShowCertModal] = useState(false);
  const [certForm, setCertForm] = useState({
    title: "",
    issuer: "",
    issueDate: "",
    credentialUrl: "",
    image: ""
  });

  const [galleryForm, setGalleryForm] = useState({
    name: "",
    url: ""
  });

  // Gemini AI state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState("");
  const [aiHelperPrompt, setAiHelperPrompt] = useState("");

  const refreshData = async () => {
    setLoading(true);
    try {
      const [allProjs, allBlogs, allMsgs, allCerts, allGallery] = await Promise.all([
        getProjects(),
        getBlogs(),
        getMessages(),
        getCertificates(),
        getGalleryItems()
      ]);
      setProjects(allProjs);
      setBlogs(allBlogs);
      setMessages(allMsgs);
      setCerts(allCerts);
      setGallery(allGallery);
    } catch (e) {
      console.error("Failed loading dashboard assets:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Launch Server-side Gemini auto-analytics coach
  const runGeminiAnalytics = async () => {
    if (messages.length === 0) {
      setAiReport("Gather some client messages first to let Gemini perform synthesis audits!");
      return;
    }
    setAiLoading(true);
    setAiReport("");
    try {
      const response = await fetch("/api/gemini/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages })
      });
      const data = await response.json();
      if (data.analysis) {
        setAiReport(data.analysis);
      } else {
        setAiReport("Gemini returned static signals. Maintain consistent project schedules.");
      }
    } catch (e) {
      console.error("Gemini summary error:", e);
      setAiReport("The Gemini compiler is offline. Try configuring your GEMINI_API_KEY.");
    } finally {
      setAiLoading(false);
    }
  };

  // Gemini content creator helper for description or blog
  const handleGeminiTextGenerate = async (target: "proj_desc" | "blog_body") => {
    const promptValue = target === "proj_desc" ? projForm.title : blogForm.title;
    if (!promptValue) {
      alert("Provide a Title header first for Gemini to parse context!");
      return;
    }
    setAiLoading(true);
    try {
      const context = target === "proj_desc" ? projForm.technologies : "educational software development article";
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: target === "proj_desc" ? "project" : "blog",
          prompt: promptValue,
          context
        })
      });
      const data = await response.json();
      if (data.text) {
        if (target === "proj_desc") {
          setProjForm(prev => ({ ...prev, description: data.text }));
        } else {
          setBlogForm(prev => ({ ...prev, content: data.text }));
        }
      }
    } catch (err) {
      console.error("Gemini text generation failed:", err);
    } finally {
      setAiLoading(false);
    }
  };

  // File to Base64 utility for offline-friendly file uploading
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: "proj" | "blog" | "cert" | "gallery") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (target === "proj") {
        setProjForm(p => ({ ...p, image: base64String }));
      } else if (target === "blog") {
        setBlogForm(b => ({ ...b, coverImage: base64String }));
      } else if (target === "cert") {
        setCertForm(c => ({ ...c, image: base64String }));
      } else if (target === "gallery") {
        setGalleryForm(g => ({ ...g, url: base64String }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit handlings
  const handleProjSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanProj = {
      title: projForm.title,
      description: projForm.description,
      image: projForm.image,
      github: projForm.github,
      demo: projForm.demo,
      featured: projForm.featured,
      technologies: projForm.technologies.split(",").map(t => t.trim()).filter(Boolean)
    };

    try {
      if (editingProj?.id) {
        await updateProject(editingProj.id, cleanProj);
      } else {
        await addProject(cleanProj);
      }
      setShowProjModal(false);
      setEditingProj(null);
      setProjForm({ title: "", description: "", image: "", github: "", demo: "", technologies: "", featured: false });
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slugVal = blogForm.title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .trim();

    const cleanBlog = {
      title: blogForm.title,
      slug: slugVal,
      content: blogForm.content,
      coverImage: blogForm.coverImage,
      author: blogForm.author
    };

    try {
      if (editingBlog?.id) {
        await updateBlog(editingBlog.id, cleanBlog);
      } else {
        await addBlog(cleanBlog);
      }
      setShowBlogModal(false);
      setEditingBlog(null);
      setBlogForm({ title: "", content: "", coverImage: "", author: "Krishna Kadayat" });
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCertificate(certForm);
      setShowCertModal(false);
      setCertForm({ title: "", issuer: "", issueDate: "", credentialUrl: "", image: "" });
      refreshData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.url) return;
    try {
      await addGalleryItem({
        name: galleryForm.name || `Gallery Image ${Date.now()}`,
        url: galleryForm.url
      });
      setGalleryForm({ name: "", url: "" });
      refreshData();
    } catch (e) {
      console.error(e);
    }
  };

  // Deletions
  const handleProjDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await deleteProject(id);
    refreshData();
  };

  const handleBlogDelete = async (id: string) => {
    if (!confirm("Delete this blog article permanently?")) return;
    await deleteBlog(id);
    refreshData();
  };

  const handleMsgDelete = async (id: string) => {
    await deleteMessage(id);
    refreshData();
  };

  const handleMsgToggleRead = async (msg: Message) => {
    if (!msg.id) return;
    await markMessageRead(msg.id, !msg.read);
    refreshData();
  };

  const handleCertDelete = async (id: string) => {
    if (!confirm("Delete this Certificate?")) return;
    await deleteCertificate(id);
    refreshData();
  };

  const handleGalleryDelete = async (id: string) => {
    if (!confirm("Remove item?")) return;
    await deleteGalleryItem(id);
    refreshData();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION Panel */}
      <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo */}
          <div className="flex items-center space-x-2 font-mono font-bold tracking-wider text-sm text-white mb-8 border-b border-zinc-800 pb-4">
            <Terminal size={16} className="text-zinc-400" />
            <span>CENTRAL SYSTEM CORE</span>
          </div>

          <nav className="space-y-1.5 font-mono text-xs">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                activeTab === "overview" ? "bg-white text-zinc-950 font-bold" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <LayoutDashboard size={14} />
              <span>Executive Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                activeTab === "projects" ? "bg-white text-zinc-950 font-bold" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Server size={14} />
              <span>Projects ({projects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("blogs")}
              className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                activeTab === "blogs" ? "bg-white text-zinc-950 font-bold" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <BookOpen size={14} />
              <span>Blog CMS ({blogs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("messages")}
              className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                activeTab === "messages" ? "bg-white text-zinc-950 font-bold" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <MessageSquare size={14} />
              <span>Client Inquiries ({messages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("certs")}
              className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                activeTab === "certs" ? "bg-white text-zinc-950 font-bold" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Award size={14} />
              <span>Credentials</span>
            </button>

            <button
              onClick={() => setActiveTab("gallery")}
              className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                activeTab === "gallery" ? "bg-white text-zinc-950 font-bold" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Image size={14} />
              <span>Asset Gallery</span>
            </button>
          </nav>
        </div>

        {/* User Info / Logout Button */}
        <div className="pt-6 border-t border-zinc-850 mt-8">
          <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400 mb-4">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate">{user?.email || "Demo Admin Session"}</span>
          </div>
          
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 bg-red-950/40 hover:bg-red-900/40 text-red-400 px-4 py-2 rounded-lg font-mono text-xs transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span>Terminate Link</span>
          </button>
        </div>
      </aside>

      {/* WORKSPACE AREA */}
      <main className="flex-grow p-6 sm:p-10 overflow-y-auto max-w-6xl mx-auto w-full">
        
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <span className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
              <span className="animate-spin h-4 w-4 border-2 border-zinc-500 border-t-transparent rounded-full" />
              <span>Syncing database collections...</span>
            </span>
          </div>
        ) : (
          <>
            {/* 1. OVERVIEW Tab Screen */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <span className="font-mono text-xs text-zinc-500 block uppercase">Workspace Statistics</span>
                  <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
                    System Hub Dashboard
                  </h1>
                </div>

                {/* Scorecards mini grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg flex flex-col justify-between">
                    <span className="font-mono text-[10px] text-zinc-400 uppercase">Coded Projects</span>
                    <strong className="text-xl font-bold block mt-3">{projects.length}</strong>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg flex flex-col justify-between">
                    <span className="font-mono text-[10px] text-zinc-400 uppercase">Blog Publications</span>
                    <strong className="text-xl font-bold block mt-3">{blogs.length}</strong>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg flex flex-col justify-between">
                    <span className="font-mono text-[10px] text-zinc-400 uppercase">Client Inquiries</span>
                    <strong className="text-xl font-bold block mt-3 text-zinc-100">{messages.length}</strong>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg flex flex-col justify-between">
                    <span className="font-mono text-[10px] text-zinc-400 uppercase">Dynamic Assets</span>
                    <strong className="text-xl font-bold block mt-3">{gallery.length} img</strong>
                  </div>
                </div>

                {/* Live Gemini AI summaries analyst */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative">
                  <div className="absolute top-4 right-4 text-[10px] font-mono text-zinc-500 flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>Gemini 2.5 Flash</span>
                  </div>

                  <h3 className="font-mono text-sm font-bold text-white mb-2 flex items-center space-x-1.5">
                    <Sparkles size={16} className="text-zinc-400 animate-bounce" />
                    <span>Gemini AI Business Analyst</span>
                  </h3>
                  
                  <p className="text-xs text-zinc-400 leading-relaxed mb-6 max-w-xl">
                    Generate immediate strategic insight reports summarizing client inquiry subject matter and actionable proposal next-steps.
                  </p>

                  <button
                    onClick={runGeminiAnalytics}
                    disabled={aiLoading}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 border border-zinc-700 bg-zinc-950 hover:bg-zinc-850 rounded-lg text-xs font-mono font-semibold text-white cursor-pointer disabled:opacity-40"
                  >
                    <span>{aiLoading ? "Synthesizing dynamic reports..." : "Perform AI Analytics Sweep"}</span>
                  </button>

                  {aiReport && (
                    <div className="mt-6 p-4 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono leading-relaxed text-zinc-300">
                      {aiReport.split("\n").map((line, idx) => (
                        <p key={idx} className="mb-2">{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. PROJECTS TAB VIEW */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-mono font-bold uppercase text-white">Project Registry</h2>
                    <p className="text-xs text-zinc-500">Add, edit, structure, or delete portfolio project files.</p>
                  </div>
                  <button
                    onClick={() => {
                      setProjForm({ title: "", description: "", image: "", github: "", demo: "", technologies: "", featured: false });
                      setEditingProj(null);
                      setShowProjModal(true);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Project</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map(p => (
                    <div key={p.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-mono text-[9px] text-zinc-500">
                            {p.technologies.slice(0, 3).join(", ")}
                          </span>
                          {p.featured && (
                            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[8px] font-mono font-medium text-zinc-300">FEATURED</span>
                          )}
                        </div>
                        <h4 className="font-bold text-white text-sm">{p.title}</h4>
                        <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">{p.description}</p>
                      </div>

                      <div className="flex items-center justify-end space-x-2 border-t border-zinc-850 pt-4 mt-4 font-mono text-[10px]">
                        <button
                          onClick={() => {
                            setEditingProj(p);
                            setProjForm({
                              title: p.title,
                              description: p.description,
                              image: p.image || "",
                              github: p.github || "",
                              demo: p.demo || "",
                              technologies: p.technologies.join(", "),
                              featured: p.featured ?? false
                            });
                            setShowProjModal(true);
                          }}
                          className="px-2.5 py-1.5 bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700"
                        >
                          Modify Specs
                        </button>
                        <button
                          onClick={() => p.id && handleProjDelete(p.id)}
                          className="px-2.5 py-1.5 bg-red-950/30 text-red-400 rounded hover:bg-red-900/30"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. BLOGS CMS TAB VIEW */}
            {activeTab === "blogs" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-mono font-bold uppercase text-white">Publications CMS</h2>
                    <p className="text-xs text-zinc-500">Create, formulate, edit, or delete markdown blogs.</p>
                  </div>
                  <button
                    onClick={() => {
                      setBlogForm({ title: "", content: "", coverImage: "", author: "Krishna Kadayat" });
                      setEditingBlog(null);
                      setShowBlogModal(true);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors"
                  >
                    <Plus size={14} />
                    <span>Create Publication</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {blogs.map(b => (
                    <div key={b.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white text-xs">{b.title}</h4>
                        <span className="font-mono text-[9px] text-zinc-500 block mt-1">/{b.slug}</span>
                      </div>
                      <div className="flex items-center space-x-2 font-mono text-[10px]">
                        <button
                          onClick={() => {
                            setEditingBlog(b);
                            setBlogForm({
                              title: b.title,
                              content: b.content,
                              coverImage: b.coverImage || "",
                              author: b.author || "Krishna Kadayat"
                            });
                            setShowBlogModal(true);
                          }}
                          className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-750"
                        >
                          Edit Content
                        </button>
                        <button
                          onClick={() => b.id && handleBlogDelete(b.id)}
                          className="px-2 py-1 bg-red-950/20 text-red-500 rounded hover:bg-red-900/20"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. CLIENT MESSAGES TAB VIEW */}
            {activeTab === "messages" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-mono font-bold uppercase text-white">Client Inquiry Inbox</h2>
                  <p className="text-xs text-zinc-500">Received contact messages from the directory portal, indexed live.</p>
                </div>

                {messages.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500 font-mono text-xs">
                    Inbound wire reports log currently displays empty status.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((m) => (
                      <div 
                        key={m.id} 
                        className={`border rounded-lg p-5 transition-colors ${
                          m.read ? "bg-zinc-900/60 border-zinc-850" : "bg-zinc-900 border-zinc-700 font-medium"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 text-xs">
                          <div>
                            <strong className="text-white text-xs">{m.name}</strong>
                            <span className="font-mono text-zinc-500 ml-1.5">({m.email})</span>
                          </div>
                          
                          <span className="font-mono text-[9px] text-zinc-400 mt-1 sm:mt-0">
                            {m.createdAt instanceof Date ? m.createdAt.toLocaleString("en-US", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" }) : "Recent"}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-white mb-2 font-sans">
                          Subject: {m.subject}
                        </h4>
                        
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans bg-zinc-950 p-3 rounded border border-zinc-850 mb-4 whitespace-pre-wrap">
                          {m.message}
                        </p>

                        <div className="flex items-center justify-end space-x-2 font-mono text-[9px]">
                          <button
                            onClick={() => handleMsgToggleRead(m)}
                            className="px-2.5 py-1 bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-750"
                          >
                            Mark {m.read ? "Unread" : "Read"}
                          </button>
                          <button
                            onClick={() => m.id && handleMsgDelete(m.id)}
                            className="px-2.5 py-1 bg-red-950/20 text-red-500 rounded hover:bg-red-900/20"
                          >
                            Purge Message
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. ACHIEVEMENTS & CREDENTIALS VIEW */}
            {activeTab === "certs" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-mono font-bold uppercase text-white">Certificates & Credentials</h2>
                    <p className="text-xs text-zinc-500">Organize and publish verified external cloud certificates.</p>
                  </div>
                  <button
                    onClick={() => setShowCertModal(true)}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg text-xs font-mono font-bold cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Certificate</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {certs.map(c => (
                    <div key={c.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <img src={c.image} className="w-12 h-12 rounded object-cover" />
                        <div>
                          <h4 className="font-bold text-white text-xs">{c.title}</h4>
                          <span className="font-mono text-[9px] text-zinc-500 mt-1 block">{c.issuer} ({c.issueDate})</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => c.id && handleCertDelete(c.id)}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. SYSTEM GALLERY MEDIA Tab VIEW */}
            {activeTab === "gallery" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-mono font-bold uppercase text-white">System Assets Gallery</h2>
                  <p className="text-xs text-zinc-500">Review assets. Support pasting links or uploading images directly as Base64 strings.</p>
                </div>

                {/* Create/upload asset form */}
                <form onSubmit={handleGallerySubmit} className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-400">Asset Label Name</label>
                      <input 
                        type="text" 
                        value={galleryForm.name} 
                        onChange={e => setGalleryForm(v => ({ ...v, name: e.target.value }))}
                        placeholder="Project Workspace photo"
                        className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 text-xs text-white uppercase focus:outline-none focus:border-zinc-500 font-mono rounded"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-400">Direct CDN Image URL (Alternate)</label>
                      <input 
                        type="text" 
                        value={galleryForm.url} 
                        onChange={e => setGalleryForm(v => ({ ...v, url: e.target.value }))}
                        placeholder="https://images.unsplash.com/promo-url"
                        className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500 rounded"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between border-t border-zinc-850 pt-4 gap-4">
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-400">
                      <span>Or load file:</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => handleImageUpload(e, "gallery")}
                        className="text-[10px] cursor-pointer"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="px-4 py-2 bg-white text-zinc-950 font-mono text-xs font-medium rounded hover:bg-zinc-200 cursor-pointer"
                    >
                      Save Asset
                    </button>
                  </div>
                </form>

                {/* Gallery Images Render */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {gallery.map((g) => (
                    <div key={g.id} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800 group bg-zinc-900">
                      <img src={g.url} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-200 truncate">{g.name}</span>
                        <button
                          onClick={() => g.id && handleGalleryDelete(g.id)}
                          className="self-end text-red-400 hover:text-red-300 transition-colors p-1 bg-red-950/20 rounded"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </main>

      {/* --- ADD / EDIT PROJECT SPEC MODAL --- */}
      {showProjModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-850">
              <h3 className="font-mono font-bold text-sm text-white uppercase">
                {editingProj ? "Modify Project Specifications" : "Create Portfolio Project"}
              </h3>
              <button onClick={() => setShowProjModal(false)} className="text-zinc-500 hover:text-white font-mono text-sm">CLOSE</button>
            </div>

            <form onSubmit={handleProjSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400">Project Headline Title</label>
                <input 
                  type="text" required
                  value={projForm.title}
                  onChange={e => setProjForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. AI CodeCraft - Automated Editor"
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 rounded-lg font-sans"
                />
              </div>

              {/* Gemini Description Generation block */}
              <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg flex items-center justify-between text-[11px] font-mono">
                <span className="text-zinc-400 flex items-center space-x-1.5">
                  <Sparkles size={13} className="text-zinc-400" />
                  <span>Draft clean summary with Gemini?</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleGeminiTextGenerate("proj_desc")}
                  disabled={aiLoading}
                  className="px-2.5 py-1 bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded text-[10px] cursor-pointer"
                >
                  {aiLoading ? "Generating Description..." : "Gemini Draft"}
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400">Technical Description</label>
                <textarea 
                  required rows={4}
                  value={projForm.description}
                  onChange={e => setProjForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Detailed layout specifications..."
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 rounded-lg font-sans resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400">Technologies (Comma-separated list)</label>
                <input 
                  type="text" required
                  value={projForm.technologies}
                  onChange={e => setProjForm(p => ({ ...p, technologies: e.target.value }))}
                  placeholder="React 19, TypeScript, Firestore, Tailwind CSS, Recharts"
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 rounded-lg font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400">GitHub Repository link</label>
                  <input 
                    type="url"
                    value={projForm.github}
                    onChange={e => setProjForm(p => ({ ...p, github: e.target.value }))}
                    placeholder="https://github.com/krishnakadayat1/repo"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500 rounded-lg font-mono"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400">Deployed App URL</label>
                  <input 
                    type="url"
                    value={projForm.demo}
                    onChange={e => setProjForm(p => ({ ...p, demo: e.target.value }))}
                    placeholder="https://active-app.example.com"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 items-center">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" id="featured"
                    checked={projForm.featured}
                    onChange={e => setProjForm(p => ({ ...p, featured: e.target.checked }))}
                    className="h-3.5 w-3.5 bg-zinc-950 border border-zinc-850 rounded"
                  />
                  <label htmlFor="featured" className="text-[10px] font-mono text-zinc-450 uppercase cursor-pointer">Mark Featured Card</label>
                </div>

                <div className="space-y-1 text-right sm:text-left flex flex-col sm:items-start font-mono text-[9px] text-zinc-500">
                  <span>Manual or Base64 file image upload:</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => handleImageUpload(e, "proj")}
                    className="cursor-pointer max-w-[160px]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-white text-zinc-950 font-mono text-xs font-bold rounded-lg hover:bg-zinc-200 mt-4 cursor-pointer"
              >
                Save Project Node
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- CREATE / EDIT BLOG CMS SPECT MODAL --- */}
      {showBlogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 font-sans">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-850">
              <h3 className="font-mono font-bold text-sm text-white uppercase">
                {editingBlog ? "Edit Publication Body" : "Create Technical Post"}
              </h3>
              <button onClick={() => setShowBlogModal(false)} className="text-zinc-500 hover:text-white font-mono text-sm">CLOSE</button>
            </div>

            <form onSubmit={handleBlogSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400">Article Title</label>
                <input 
                  type="text" required
                  value={blogForm.title}
                  onChange={e => setBlogForm(b => ({ ...b, title: e.target.value }))}
                  placeholder="e.g. Master React 19 Client Actions"
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 rounded-lg"
                />
              </div>

              {/* Gemini Blog Body Generation block */}
              <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg flex items-center justify-between text-[11px] font-mono">
                <span className="text-zinc-400 flex items-center space-x-1.5">
                  <Sparkles size={13} className="text-zinc-400" />
                  <span>Generate Full technical markdown post with Gemini?</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleGeminiTextGenerate("blog_body")}
                  disabled={aiLoading}
                  className="px-2.5 py-1 bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded text-[10px] cursor-pointer"
                >
                  {aiLoading ? "Writing Blog..." : "Gemini Write"}
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400">Content (Markdown supported)</label>
                <textarea 
                  required rows={10}
                  value={blogForm.content}
                  onChange={e => setBlogForm(b => ({ ...b, content: e.target.value }))}
                  placeholder="## Heading 2\nWrite your technical article body here..."
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-mono rounded-lg resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400">Cover Image URL</label>
                  <input 
                    type="text"
                    value={blogForm.coverImage}
                    onChange={e => setBlogForm(b => ({ ...b, coverImage: e.target.value }))}
                    placeholder="https://images.unsplash.com/cover-promo"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500 rounded-lg"
                  />
                </div>
                
                <div className="flex flex-col font-mono text-[9px] text-zinc-500">
                  <span>Upload local cover photograph as base64 asset:</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => handleImageUpload(e, "blog")}
                    className="cursor-pointer max-w-[180px] mt-1"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-white text-zinc-950 font-mono text-xs font-bold rounded-lg hover:bg-zinc-200 mt-4 cursor-pointer"
              >
                Publish CMS Article
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- DYNAMIC CERTIFICATES DURATION SPEC MODAL --- */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-850">
              <h3 className="font-mono font-bold text-sm text-white uppercase">Add Certified Achievement</h3>
              <button onClick={() => setShowCertModal(false)} className="text-zinc-500 hover:text-white font-mono text-sm">CLOSE</button>
            </div>

            <form onSubmit={handleCertSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400">Certificate Title</label>
                <input 
                  type="text" required
                  value={certForm.title}
                  onChange={e => setCertForm(c => ({ ...c, title: e.target.value }))}
                  placeholder="Google Cloud Certified Engineer"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400">Issuer Institution</label>
                  <input 
                    type="text" required
                    value={certForm.issuer}
                    onChange={e => setCertForm(c => ({ ...c, issuer: e.target.value }))}
                    placeholder="Meta / Google"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400">Issue Date Period</label>
                  <input 
                    type="text" required
                    value={certForm.issueDate}
                    onChange={e => setCertForm(c => ({ ...c, issueDate: e.target.value }))}
                    placeholder="Feb 2026"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400">Verification Link URL</label>
                <input 
                  type="url"
                  value={certForm.credentialUrl}
                  onChange={e => setCertForm(c => ({ ...c, credentialUrl: e.target.value }))}
                  placeholder="https://credential.net/verify..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400">Image Asset URL / File</label>
                <input 
                  type="text"
                  value={certForm.image}
                  onChange={e => setCertForm(c => ({ ...c, image: e.target.value }))}
                  placeholder="https://unsplash.com/cert-image"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none rounded-lg mb-2"
                />
                
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => handleImageUpload(e, "cert")}
                  className="text-[9px] font-mono text-zinc-500 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-white text-zinc-950 font-mono text-xs font-bold rounded-lg hover:bg-zinc-200 mt-4 cursor-pointer"
              >
                Register Credentials
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
