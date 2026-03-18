import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { usePageMeta } from "../../hooks/usePageMeta";
import { useJsonLd } from "../../hooks/useJsonLd";

export const FaqPage: React.FC = () => {
  /* =========================
     SEO META
  ========================= */
  usePageMeta({
    title: "FAQ | GenPDF – PDF Conversion & AI Tools",
    description:
      "Frequently asked questions about GenPDF, including PDF privacy, AI processing, OCR limits, supported files, and troubleshooting.",
    keywords:
      "GenPDF FAQ, PDF conversion questions, OCR PDF help, AI PDF tools, PDF privacy"
  });

  /* =========================
     FAQ SCHEMA
  ========================= */
  useJsonLd({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is GenPDF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "GenPDF is an AI-powered PDF processing platform that allows users to convert, analyze, extract text, and perform OCR on PDF documents securely."
        }
      },
      {
        "@type": "Question",
        "name": "Are my PDF files stored?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "No. Files are processed temporarily and are never permanently stored. GenPDF does not retain document contents or build user profiles."
        }
      },
      {
        "@type": "Question",
        "name": "What is OCR and when is it used?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "OCR is used when a PDF contains scanned images instead of selectable text. GenPDF automatically detects this and applies OCR when needed."
        }
      },
      {
        "@type": "Question",
        "name": "Why does OCR have page limits?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "OCR is computationally intensive. Page limits ensure system stability, performance, and fair usage for all users."
        }
      },
      {
        "@type": "Question",
        "name": "Why did my conversion fail?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Conversions may fail due to large file sizes, scanned PDFs exceeding OCR limits, unsupported formats, or temporary service issues."
        }
      }
    ]
  });

  /* =========================
     BREADCRUMB SCHEMA
  ========================= */
  useJsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://genpdf.io/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "FAQ",
        "item": "https://genpdf.io/faq"
      }
    ]
  });

  /* =========================
     SCROLL TO TOP
  ========================= */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* =========================
     UI
  ========================= */
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      {/* Breadcrumb UI */}
      <nav className="text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-slate-900">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">FAQ</span>
      </nav>

      {/* Title */}
      <h1 className="text-4xl font-extrabold text-slate-900 mb-10">
        Frequently Asked Questions
      </h1>

      {/* FAQ CONTENT */}
      <section className="space-y-10">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            What is GenPDF?
          </h2>
          <p className="text-slate-600">
            GenPDF is a modern PDF processing platform that allows you to convert,
            analyze, extract text, perform OCR, and work with documents using AI —
            without installing software or creating an account.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Is GenPDF free to use?
          </h2>
          <p className="text-slate-600">
            GenPDF offers free access to core tools with fair usage limits.
            Advanced features and higher limits may be introduced later.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Are my PDF files stored?
          </h2>
          <p className="text-slate-600">
            No. Files are processed temporarily and are not permanently stored.
            GenPDF does not build user profiles or retain document contents.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Who can access my documents?
          </h2>
          <p className="text-slate-600">
            Only automated systems process files when required. Documents are not
            shared, sold, or reviewed manually.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            What is OCR and when is it used?
          </h2>
          <p className="text-slate-600">
            OCR (Optical Character Recognition) is used when a PDF contains scanned
            images instead of selectable text. GenPDF automatically detects this.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Why does OCR have page limits?
          </h2>
          <p className="text-slate-600">
            OCR is computationally intensive. Page limits ensure performance,
            stability, and fair usage for all users.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Why did my conversion fail?
          </h2>
          <p className="text-slate-600">
            Conversions may fail due to very large files, scanned PDFs exceeding
            OCR limits, unsupported formats, or temporary service issues.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            What should I do if I see an error?
          </h2>
          <p className="text-slate-600">
            Try reducing file size, splitting large PDFs, or retrying later.
            Clear error messages will guide you when limits are exceeded.
          </p>
        </div>
      </section>

      <p className="mt-16 text-sm text-slate-500">
        Last updated: 2024
      </p>
    </main>
  );
};
