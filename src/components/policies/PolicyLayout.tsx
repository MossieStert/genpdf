import React from "react";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  children: React.ReactNode;
}

export const PolicyLayout: React.FC<Props> = ({ title, children }) => {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-slate-900">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{title}</span>
      </nav>

      {/* Title */}
      <h1 className="text-4xl font-extrabold text-slate-900 mb-6">
        {title}
      </h1>

      {/* Content */}
      <section className="prose prose-slate max-w-none">
        {children}
      </section>

    </main>
  );
};
