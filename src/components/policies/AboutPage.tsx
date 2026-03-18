import React from "react";
import { Cpu, ShieldCheck, Mail, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageMeta } from "../../hooks/usePageMeta";

export const AboutPage: React.FC = () => {
  usePageMeta({
    title: "About GenPDF | AI-Powered PDF Tools",
    description:
      "Learn about GenPDF — a fast, secure, AI-powered PDF conversion and analysis platform focused on privacy and quality.",
    keywords:
      "PDF tools, AI PDF, PDF converter, OCR PDF, merge PDF, split PDF",
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <Link to="/" className="text-sm text-rose-600 hover:underline">
        ← Back to Home
      </Link>

      <h1 className="text-4xl font-extrabold text-slate-900 flex items-center mt-6">
        <Cpu className="w-8 h-8 text-rose-600 mr-3" />
        About GenPDF
      </h1>

      <p>
        GenPDF is a modern, privacy-focused PDF conversion and document analysis platform
        designed for individuals, professionals, and businesses who need reliable tools
        without unnecessary complexity.
      </p>

      <p>
        Our tools help users extract text, convert formats, perform OCR, summarize content,
        and analyze documents efficiently — all through a clean, intuitive interface.
      </p>

      <p>
        We believe document processing should be fast, transparent, and respectful of user
        privacy. Files are processed only when required to complete a task and are never
        retained longer than necessary.
      </p>

      <div className="mt-10 bg-slate-50 p-6 rounded-xl border">
        <h2 className="text-xl font-bold mb-4">Our Core Principles</h2>

        <ul className="space-y-4">
          <li className="flex items-start">
            <ShieldCheck className="w-5 h-5 text-green-600 mr-3 mt-1" />
            <span>
              <strong>Security First</strong> — Your documents remain private.
            </span>
          </li>

          <li className="flex items-start">
            <Star className="w-5 h-5 text-amber-500 mr-3 mt-1" />
            <span>
              <strong>High Accuracy</strong> — Reliable AI-powered output.
            </span>
          </li>

          <li className="flex items-start">
            <Mail className="w-5 h-5 text-rose-500 mr-3 mt-1" />
            <span>
              <strong>Security & Privacy</strong> — Documents are handled responsibly and never used for training, profiling, or resale.

              <strong>Accuracy & Reliability</strong> — Our tools are built to deliver consistent, high-quality results using modern processing techniques.

              <strong>Human-Centric Support</strong> — We listen to user feedback and continuously improve based on real-world needs.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
