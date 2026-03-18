import React from "react";
import { Helmet } from "react-helmet-async";
import { Cookie } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageMeta } from "../../hooks/usePageMeta";

export const CookiesPage: React.FC = () => {
    usePageMeta({
    title: "Cookie Policy | GenPDF",
    description:
      "Learn how GenPDF uses minimal cookies for performance and analytics.",
    keywords: "cookie policy, analytics cookies",
  });
  return (
    <>
      <Helmet>
        <title>Cookie Policy | GenPDF</title>
        <meta
          name="description"
          content="Learn how GenPDF uses essential and analytics cookies to improve performance while respecting privacy."
        />
        <link rel="canonical" href="https://genpdf.app/cookies" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link to="/" className="text-sm text-rose-600 hover:underline">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-extrabold text-slate-900 flex items-center mt-6">
          <Cookie className="w-8 h-8 text-amber-600 mr-3" />
          Cookie Policy
        </h1>

        <p className="mt-6 text-slate-600">
          GenPDF uses a minimal number of cookies required for essential functionality and
          basic, privacy-respecting analytics.
        </p>

        <h2 className="mt-10 text-xl font-bold">Essential Cookies</h2>
        <p className="mt-2 text-slate-600">
          These cookies support core features such as navigation, security, and service
          stability. They cannot be disabled.
        </p>

        <h2 className="mt-8 text-xl font-bold">Analytics Cookies</h2>
        <p className="mt-2 text-slate-600">
          These cookies support core features such as navigation, security, and service
          stability. They cannot be disabled.
        </p>

        <p className="mt-12 text-sm text-slate-500">
          Last updated: 2024
        </p>
      </div>
    </>
  );
};
