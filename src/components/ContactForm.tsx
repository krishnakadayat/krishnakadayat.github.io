import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { addMessage } from "../services/contactService";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError("Please complete all form fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await addMessage(formData);
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (err: any) {
      console.error("Failed to forward contact inquiry:", err);
      setError("An unexpected error occurred while transmitting your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl p-6 sm:p-8 shadow-sm">
      
      {success ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-50 dark:bg-zinc-950 rounded-full border border-emerald-200/60 dark:border-emerald-800/40 mb-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Message Sent Successfully
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Thank you for reaching out, Krishna! Your message is safely indexed in Firestore. Krishna Kadayat will coordinate a reply to your inbox shortly.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-6 inline-flex items-center space-x-1.5 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-mono font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors cursor-pointer"
          >
            <span>Send Another Message</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <h2 className="text-base font-mono uppercase font-bold tracking-wider text-zinc-900 dark:text-zinc-100 mb-6 flex items-center space-x-2">
            <span>Direct Inquiry Terminal</span>
          </h2>

          {error && (
            <div className="p-3.5 bg-red-50 dark:bg-zinc-950 border border-red-200/50 dark:border-red-900/40 rounded-lg flex items-start space-x-2 text-xs text-red-600 dark:text-red-400">
              <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Grid rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-xs font-mono text-zinc-500 dark:text-zinc-400">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-400 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-mono text-zinc-500 dark:text-zinc-400">
                Your Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-400 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="subject" className="block text-xs font-mono text-zinc-500 dark:text-zinc-400">
              Subject Header
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Collaboration Proposal / Project Consultation"
              required
              className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-400 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="message" className="block text-xs font-mono text-zinc-500 dark:text-zinc-400">
              Inquiry Body
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              placeholder="Please describe your project scope, timeline, and tech specs..."
              required
              className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-400 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center space-x-2 px-5 py-3 border border-transparent text-sm font-mono font-medium rounded-lg text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center space-x-1.5">
                <span className="animate-spin rounded-full h-3 w-3 border-2 border-white dark:border-zinc-900 border-t-transparent" />
                <span>Transmitting message...</span>
              </span>
            ) : (
              <>
                <span>Transmit Message Terminal</span>
                <Send size={13} />
              </>
            )}
          </button>
          
        </form>
      )}

    </div>
  );
}
