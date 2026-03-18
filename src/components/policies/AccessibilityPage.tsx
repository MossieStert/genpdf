import React from "react";
import { Accessibility } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageMeta } from "../../hooks/usePageMeta";

export const AccessibilityPage: React.FC = () => {
    usePageMeta({
    title: "Accessibility | GenPDF",
    description:
      "GenPDF is committed to accessibility and inclusive design for all users.",
    keywords: "accessibility statement, inclusive design",
     });
  return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link to="/" className="text-sm text-rose-600 hover:underline">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-extrabold text-slate-900 flex items-center mt-6">
          <Accessibility className="w-8 h-8 text-purple-600 mr-3" />
          Accessibility
        </h1>

        <p className="mt-6 text-slate-600">
          GenPDF is committed to providing an accessible experience for all
          users, including individuals with disabilities.
        </p>

        <h2 className="mt-10 text-xl font-bold">Accessibility Commitments</h2>
        <ul className="mt-2 list-disc ml-6 text-slate-600 space-y-2">
          <li>Readable contrast and scalable fonts</li>
          <li>Keyboard-friendly navigation</li>
          <li>Semantic HTML for screen readers</li>
        </ul>

        <h2 className="mt-8 text-xl font-bold">Need Help?</h2>
        <p className="mt-2 text-slate-600">
          If you encounter accessibility barriers or have suggestions for improvement,
          please contact us. We are committed to ongoing accessibility enhancements.
        </p>

        <p className="mt-12 text-sm text-slate-500">
          Last updated: 2024
        </p>
      </div>
  );
};
