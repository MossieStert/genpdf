import React from "react";
import { ShieldCheck } from "lucide-react";
import { usePageMeta } from "../../hooks/usePageMeta";
import { PolicyLayout } from "./PolicyLayout";

export const SecurePage: React.FC = () => {
  usePageMeta({
    title: "Security & Privacy | GenPDF",
    description:
      "Learn how GenPDF protects your documents with privacy-first design, encryption, and secure PDF processing.",
    keywords: "secure PDF tools, document privacy, PDF security"
  });

  return (
    <PolicyLayout title="Security & Privacy">
      <div className="flex items-center gap-3 mb-4">
        <ShieldCheck className="w-6 h-6 text-emerald-600" />
        <p className="text-slate-600">
            Security and privacy are foundational principles at GenPDF. We design our tools
            to minimize data exposure and reduce unnecessary risk.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-8">
        File Security
      </h2>
      <p>
        Uploaded documents are processed only for the duration required to complete
        the requested task. Files are not stored permanently or reused.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-8">
        Data Protection
      </h2>
      <p>
        All data transfers are protected using modern encryption standards.
        Sensitive processing occurs in controlled environments with restricted access.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-8">
        Transparency
      </h2>
      <p>
        We clearly explain how our tools work and what data is involved.
        There is no hidden tracking or silent data collection.
      </p>

      <p className="text-sm text-slate-500 mt-12">
        Last updated: 2024
      </p>
    </PolicyLayout>
  );
};
