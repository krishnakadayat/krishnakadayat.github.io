import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import BlogPage from "./pages/Blog";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("portfolio-theme");
    if (saved) return saved === "dark";
    // Default to a gorgeous clean light theme as mandated
    return false;
  });

  useEffect(() => {
    // Sync dark mode class with root HTML element
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("portfolio-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("portfolio-theme", "light");
    }
  }, [darkMode]);

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-[#F4F4F6] dark:bg-[#0A0A0B] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
          
          {/* Main Navigation Header */}
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

          {/* Core Content Layout with smooth entries */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global Branding Footer */}
          <Footer />

        </div>
      </Router>
    </AuthProvider>
  );
}
