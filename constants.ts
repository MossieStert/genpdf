import { ToolType, ToolDef } from './types';
import { FileJson, FileText, FileCode, AlignLeft, Sparkles, BookOpen, FilePenLine, FileType, ScanText, Layers, Scissors, MessageCircleQuestion, FileSearch } from 'lucide-react';

export const TOOLS: ToolDef[] = [
  {
    id: ToolType.MERGE_PDF,
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into one single document.',
    icon: Layers,
    color: 'bg-violet-600',
    category: 'PDF Management'
  },
  {
    id: ToolType.SPLIT_PDF,
    title: 'Split PDF',
    description: 'Separate one page or a whole set for easy conversion.',
    icon: Scissors,
    color: 'bg-pink-500',
    category: 'PDF Management'
  },
  {
    id: ToolType.SUMMARIZE,
    title: 'AI Summarizer',
    description: 'Get a concise summary of the document content.',
    icon: Sparkles,
    color: 'bg-rose-500',
    badge: 'AI',
    category: 'AI Intelligence'
  },
  {
    id: ToolType.CHAT_PDF,
    title: 'Chat PDF',
    description: 'Ask questions and generate an FAQ based on your document.',
    icon: MessageCircleQuestion,
    color: 'bg-blue-600',
    badge: 'AI',
    category: 'AI Intelligence'
  },
  {
    id: ToolType.DOCUMENT_ANALYSIS,
    title: 'Document Analysis',
    description: 'Deep dive into the tone, intent, and structure of your PDF.',
    icon: FileSearch,
    color: 'bg-cyan-600',
    badge: 'AI',
    category: 'AI Intelligence'
  },
  {
    id: ToolType.EXPLAIN,
    title: 'Explain Document',
    description: 'Simplify complex documents into easy-to-read explanations.',
    icon: BookOpen,
    color: 'bg-emerald-500',
    badge: 'AI',
    category: 'AI Intelligence'
  },
  {
    id: ToolType.OCR_PDF,
    title: 'OCR PDF',
    description: 'Extract text from scanned documents and images.',
    icon: ScanText,
    color: 'bg-amber-500',
    badge: 'AI',
    category: 'AI Intelligence'
  },
  {
    id: ToolType.TO_DOCX,
    title: 'PDF to DOCX',
    description: 'Convert PDF to a Word-compatible document format.',
    icon: FilePenLine,
    color: 'bg-indigo-600',
    category: 'Document Conversion'
  },
  {
    id: ToolType.TO_RTF,
    title: 'PDF to RTF',
    description: 'Convert content to Rich Text Format (RTF).',
    icon: FileType,
    color: 'bg-teal-500',
    category: 'Document Conversion'
  },
  {
    id: ToolType.TO_TEXT,
    title: 'PDF to Text',
    description: 'Extract raw text content from your PDF file.',
    icon: AlignLeft,
    color: 'bg-slate-500',
    category: 'Document Conversion'
  },
  {
    id: ToolType.TO_MARKDOWN,
    title: 'PDF to Markdown',
    description: 'Convert PDF documents into clean, formatted Markdown.',
    icon: FileText,
    color: 'bg-blue-500',
    category: 'Web & Data Extraction'
  },
  {
    id: ToolType.TO_HTML,
    title: 'PDF to HTML',
    description: 'Transform your PDF into semantic HTML code.',
    icon: FileCode,
    color: 'bg-orange-500',
    category: 'Web & Data Extraction'
  },
  {
    id: ToolType.TO_JSON,
    title: 'PDF to JSON',
    description: 'Extract structured data and content into JSON format.',
    icon: FileJson,
    color: 'bg-purple-500',
    badge: 'AI',
    category: 'Web & Data Extraction'
  }
];