import React from "react";
import { Cpu, ShieldCheck, Star, Zap } from "lucide-react";

export const AboutSection: React.FC = () => {
  return (
    <section className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-20">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
            Why choose Gen<span className="text-rose-600">PDF</span>?
          </h2>
          <p className="text-lg text-slate-600">
            A fast, secure, AI-powered PDF toolkit built for everyday users and professionals.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-rose-100 mb-4">
              <Cpu className="w-7 h-7 text-rose-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">AI-Powered</h3>
            <p className="text-slate-600 text-sm">
              Advanced AI converts, summarizes, and analyzes PDFs with high accuracy.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-100 mb-4">
              <ShieldCheck className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Secure & Private</h3>
            <p className="text-slate-600 text-sm">
              Files are processed securely and never stored longer than necessary.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-amber-100 mb-4">
              <Star className="w-7 h-7 text-amber-500" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">High Quality</h3>
            <p className="text-slate-600 text-sm">
              Clean output formats you can actually use right away.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-sky-100 mb-4">
              <Zap className="w-7 h-7 text-sky-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Fast & Simple</h3>
            <p className="text-slate-600 text-sm">
              No accounts required. Upload, convert, download — done.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
