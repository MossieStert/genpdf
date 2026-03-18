import React, { useState, useMemo } from "react";
import { ToolType } from "../types";
import { Cpu, Search, TrendingUp } from "lucide-react";
import { TOOLS } from '../constants';

interface ToolItem {
  id: ToolType;
  title: string;
  description: string;
  icon: React.FC<any>;
  category: string;
  trending?: boolean;
  color?: string;
}

import {
  FileText,
  FileCode,
  FileJson,
  FileType,
  FileOutput,
  FileSignature,
  FileStack,
  LayoutPanelTop,
  BrainCircuit,
  MessageSquare,
  ScanText,
} from "lucide-react";

/* ------------------------------------------------------
   TOOL DEFINITIONS WITH CATEGORIES
------------------------------------------------------ */

const tools: ToolItem[] = [
  // AI Conversion Tools
  {
    id: ToolType.TO_TEXT,
    title: "PDF to Text",
    description: "Extract clean text from any PDF.",
    icon: FileText,
    category: "AI Conversion",
    trending: true,
    color: "bg-rose-600",
  },
  {
    id: ToolType.TO_MARKDOWN,
    title: "PDF to Markdown",
    description: "Convert PDF into neat Markdown.",
    icon: FileCode,
    category: "AI Conversion",
    color: "bg-rose-600",
  },
  {
    id: ToolType.TO_HTML,
    title: "PDF to HTML",
    description: "Convert PDF into clean HTML.",
    icon: FileOutput,
    category: "AI Conversion",
    color: "bg-rose-600",
  },
  {
    id: ToolType.TO_JSON,
    title: "PDF to JSON",
    description: "Extract structured JSON.",
    icon: FileJson,
    category: "AI Conversion",
    color: "bg-rose-600",
  },
  {
    id: ToolType.TO_DOCX,
    title: "PDF to DOCX",
    description: "Convert PDF into Word format.",
    icon: FileType,
    category: "AI Conversion",
    color: "bg-rose-600",
  },
  {
    id: ToolType.TO_RTF,
    title: "PDF to RTF",
    description: "Convert PDF to rich-text RTF.",
    icon: FileSignature,
    category: "AI Conversion",
    color: "bg-rose-600",
  },

  // AI Understanding
  {
    id: ToolType.SUMMARIZE,
    title: "Summarize PDF",
    description: "AI-powered document summaries.",
    icon: LayoutPanelTop,
    category: "AI Understanding",
    color: "bg-indigo-600",
  },
  {
    id: ToolType.EXPLAIN,
    title: "Explain PDF",
    description: "Turn complex documents into simple explanations.",
    icon: BrainCircuit,
    category: "AI Understanding",
    trending: true,
    color: "bg-indigo-600",
  },
  {
    id: ToolType.CHAT_PDF,
    title: "Chat with PDF",
    description: "Ask questions and get instant answers.",
    icon: MessageSquare,
    category: "AI Understanding",
    color: "bg-indigo-600",
  },
  {
    id: ToolType.DOCUMENT_ANALYSIS,
    title: "Analyze PDF",
    description:
      "AI analysis of tone, structure, strengths & weaknesses.",
    icon: Cpu,
    category: "AI Understanding",
    color: "bg-indigo-600",
  },

  // PDF Tools
  {
    id: ToolType.MERGE_PDF,
    title: "Merge PDFs",
    description: "Combine multiple PDF files.",
    icon: FileStack,
    category: "PDF Tools",
    color: "bg-emerald-600",
  },
  {
    id: ToolType.SPLIT_PDF,
    title: "Split PDF",
    description: "Extract pages or create new PDFs.",
    icon: FileStack,
    category: "PDF Tools",
    color: "bg-emerald-600",
  },

  // OCR
  {
    id: ToolType.OCR_PDF,
    title: "OCR Scan PDF",
    description: "Extract text from scanned PDF images.",
    icon: ScanText,
    category: "OCR",
    color: "bg-amber-600",
  },
];

/* ------------------------------------------------------
   CATEGORY OPTIONS
------------------------------------------------------ */

const categories = ["All", "AI Conversion", "AI Understanding", "PDF Tools", "OCR"];

/* ------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------ */

export const ToolGrid: React.FC<{ onSelectTool: (tool: ToolType) => void }> = ({
  onSelectTool,
}) => {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredTools = useMemo(() => {
  return TOOLS.filter((tool) => {
    const matchesCategory = category === "All" || tool.category === category;
    const matchesSearch =
      tool.title.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}, [category, search]);

  return (
    <section id="tools" className="max-w-6xl mx-auto px-6 py-12">
      
      {/* CATEGORIES */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2 rounded-full border text-sm font-semibold transition-all ${
              category === cat
                ? "bg-rose-600 text-white shadow-md"
                : "bg-white text-slate-600 border-slate-200 hover:bg-rose-50 hover:border-rose-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* SEARCH BAR */}
      <div className="relative max-w-md mx-auto mb-10">
        <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search tools..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-rose-500 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TOOL GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;

          return (
          <button
            key={tool.id}
            onClick={() => {
              console.log("CLICKED TOOL:", tool.id);
              onSelectTool(tool.id);
            }}
            className="group bg-white border border-slate-200 rounded-2xl p-6 text-left shadow-sm relative z-10"
          >
              <div className="flex items-center justify-between">
                <Icon className="w-10 h-10 text-rose-600 group-hover:scale-110 transition-transform" />

                {tool.trending && (
                  <span className="flex items-center gap-1 text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" /> Trending
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-900 mt-4 mb-1">
                {tool.title}
              </h3>

              <p className="text-slate-500 text-sm">{tool.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
};
