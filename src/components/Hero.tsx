import React from "react";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export const Hero: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-b from-white to-slate-50 px-6 py-20 text-center">
      
      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-rose-50 px-4 py-1 rounded-full text-rose-600 font-semibold text-sm mb-6 shadow-sm">
        <Sparkles className="w-4 h-4" />
        AI-Powered PDF Tools
      </div>

      {/* Heading */}
      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
        Convert, Edit & Understand  
        <span className="text-rose-600"> PDF Files Instantly</span>
      </h1>

      {/* Subtext */}
      <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
        GenPDF uses advanced AI to convert, extract, summarize, analyze  
        and manipulate your PDF files directly in the browser.  
        Fast. Private. No installation needed.
      </p>

      {/* CTA */}
      <a
        href="#tools"
        className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl text-lg font-semibold 
                   hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
      >
        Explore Tools
        <ArrowRight className="w-5 h-5" />
      </a>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-4 mt-10 text-slate-500 text-sm">
        <ShieldCheck className="w-5 h-5 text-green-500" />
        <span>Your files are processed securely</span>
      </div>
    </section>
  );
};
