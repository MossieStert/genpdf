import React, { useState } from "react";
import { X, Mail, Loader2, CheckCircle } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSending(true);

    // Simulate 1.2s delay for a smooth UX (replace later with backend)
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);

      // Reset automatically after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        setEmail("");
        setMessage("");
      }, 2200);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">

      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 relative animate-in zoom-in duration-200">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="bg-rose-600 p-3 rounded-xl shadow-inner mr-4">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Contact Us
          </h2>
        </div>

        {/* Success Message */}
        {submitted ? (
          <div className="flex flex-col items-center text-center py-10">
            <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              Message Sent!
            </h3>
            <p className="text-slate-600 max-w-sm">
              Thank you for contacting us. We will respond as soon as possible.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Your Email
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 
                           focus:ring-2 focus:ring-rose-500 focus:border-rose-500 
                           outline-none shadow-sm text-slate-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Message
              </label>
              <textarea
                required
                rows={5}
                placeholder="How can we help?"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 
                           focus:ring-2 focus:ring-rose-500 focus:border-rose-500 
                           outline-none shadow-sm text-slate-800 resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-rose-600 text-white py-3 rounded-xl font-semibold 
                         hover:bg-rose-700 transition shadow-lg shadow-rose-600/20
                         disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {sending ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Sending...
                </span>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
