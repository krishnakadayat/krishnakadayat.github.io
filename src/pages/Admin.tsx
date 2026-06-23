import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Dashboard from "../dashboard/Dashboard";
import { Terminal, Lock, AlertCircle, KeyRound, Sparkles } from "lucide-react";

export default function Admin() {
  const { user, isDemoUser, login, loginDemo, loading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Parse active auth state
  const isAuthenticated = !!user || isDemoUser;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorCode("Username credentials required.");
      return;
    }

    setLoggingIn(true);
    setErrorCode("");

    try {
      await login(email, password);
    } catch (err: any) {
      console.error("Firebase auth login failure:", err);
      // Give readable security reports
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setErrorCode("Invalid credential signature. Access authorization denied.");
      } else {
        setErrorCode(err.message || "An unexpected authenticator report arose.");
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const handleDemoBypass = () => {
    loginDemo();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50/40 dark:bg-zinc-950 flex items-center justify-center">
        <span className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
          <span className="animate-spin h-4 w-4 border-2 border-zinc-500 border-t-transparent rounded-full" />
          <span>Syncing administrative credential records...</span>
        </span>
      </div>
    );
  }

  // If already authenticated, redirect to full workspace UI
  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-zinc-50/40 dark:bg-zinc-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl p-8 shadow-sm">
        
        <div>
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 text-zinc-900 dark:text-zinc-50 font-mono font-bold tracking-wider mb-6">
            <Terminal size={22} className="text-zinc-500" />
            <span className="text-lg">ADMIN CORE TERMINAL</span>
          </div>
          
          <h2 className="text-center text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Administrative Access Link
          </h2>
          <p className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Sign in using Firebase Auth, or launch the Live Preview bypass demo.
          </p>
        </div>

        {errorCode && (
          <div className="p-3.5 bg-red-50 dark:bg-zinc-950 border border-red-200/50 dark:border-red-900/40 rounded-lg flex items-start space-x-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
            <span>{errorCode}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            <div className="space-y-1.5">
              <label htmlFor="email-address" className="text-xs font-mono text-zinc-400">
                Username or Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="krishna or administrator@example.com"
                className="appearance-none relative block w-full px-3.5 py-2.5 border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 placeholder-zinc-400 text-zinc-900 dark:text-white rounded-lg text-sm focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password-credentials" className="text-xs font-mono text-zinc-400">
                Security Password Phrase
              </label>
              <input
                id="password-credentials"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="appearance-none relative block w-full px-3.5 py-2.5 border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 placeholder-zinc-400 text-zinc-900 dark:text-white rounded-lg text-sm focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={loggingIn}
            className="w-full inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 border border-transparent text-sm font-mono font-medium rounded-lg text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 transition-all cursor-pointer disabled:opacity-50"
          >
            <Lock size={13} />
            <span>{loggingIn ? "Verifying Keys..." : "Access Administrative Link"}</span>
          </button>
        </form>

        {/* Demo Live Preview Bypassing link */}
        <div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-6 mt-6">
          <button
            type="button"
            onClick={handleDemoBypass}
            className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 border border-dashed border-zinc-200 dark:border-zinc-800 text-xs font-mono font-medium rounded-lg text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white bg-white hover:bg-zinc-50 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/80 transition-all cursor-pointer"
          >
            <Sparkles size={13} className="text-zinc-400 animate-pulse" />
            <span>Launch Live Preview (1-Click Admin)</span>
          </button>
          
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 text-center mt-3 leading-normal">
            *Demo admin mode grants instant access to explore, add, coordinate, edit, and delete projects, write blogs, and analyze client inquiries.*
          </p>
        </div>

      </div>
    </div>
  );
}
