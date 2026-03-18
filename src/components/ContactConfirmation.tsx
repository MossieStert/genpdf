// src/components/ContactConfirmation.tsx
import React from "react";
import { CheckCircle } from "lucide-react";

export const ContactConfirmation: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="max-w-xl mx-auto px-6 py-16 text-center animate-in fade-in">
      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Thanks — we received your message</h2>
      <p className="text-slate-600 mb-6">{message || "We will respond as soon as possible."}</p>
      <a href="/" className="inline-block bg-rose-600 text-white px-6 py-3 rounded-xl hover:bg-rose-700 transition">Return Home</a>
    </div>
  );
};
