import React from "react";
import { Helmet } from "react-helmet-async";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageMeta } from "../../hooks/usePageMeta";

export const TermsPage: React.FC = () => {
  usePageMeta({
    title: "Terms of Service | GenPDF",
    description:
      "Terms and conditions for using GenPDF PDF conversion and AI tools.",
    keywords: "terms of service, PDF tools terms",
  });
  return (
    <>
      <Helmet>
        <title>Terms of Service | GenPDF</title>
        <meta
          name="description"
          content="Review GenPDF's terms of service, acceptable use policies, and liability limitations."
        />
        <link rel="canonical" href="https://genpdf.app/terms" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link to="/" className="text-sm text-rose-600 hover:underline">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-extrabold text-slate-900 flex items-center mt-6">
          <FileText className="w-8 h-8 text-sky-600 mr-3" />
          Terms of Service
        </h1>

        <p className="mt-6 text-slate-600">
          By using GenPDF, you agree to these terms and to comply with all applicable laws
          and regulations.
        </p>

        <h2 className="mt-10 text-xl font-bold">1. Acceptable Use</h2>
        <p className="mt-2 text-slate-600">
          Users may not upload illegal content, malicious files, or copyrighted material
          without proper authorization. GenPDF may restrict access if misuse is detected.
        </p>

        <h2 className="mt-8 text-xl font-bold">2. No Warranty</h2>
        <p className="mt-2 text-slate-600">
          GenPDF is provided on an “as-is” basis without guarantees regarding availability,
          accuracy, or suitability for a particular purpose.
        </p>

        <h2 className="mt-8 text-xl font-bold">3. Limitation of Liability</h2>
        <p className="mt-2 text-slate-600">
          To the fullest extent permitted by law, GenPDF is not liable for damages resulting
          from misuse, interruptions, or data loss beyond our reasonable control.
        </p>

        <p className="mt-12 text-sm text-slate-500">
          Last updated: 2024
        </p>
      </div>
    </>
  );
};
