import { LucideIcon } from 'lucide-react';

export enum ToolType {
  TO_MARKDOWN = 'TO_MARKDOWN',
  TO_HTML = 'TO_HTML',
  TO_JSON = 'TO_JSON',
  TO_TEXT = 'TO_TEXT',
  TO_DOCX = 'TO_DOCX',
  TO_RTF = 'TO_RTF',
  OCR_PDF = 'OCR_PDF',
  SUMMARIZE = 'SUMMARIZE',
  EXPLAIN = 'EXPLAIN',
  MERGE_PDF = 'MERGE_PDF',
  SPLIT_PDF = 'SPLIT_PDF',
  CHAT_PDF = 'CHAT_PDF',
  DOCUMENT_ANALYSIS = 'DOCUMENT_ANALYSIS'
}

export interface ToolDef {
  id: ToolType;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  badge?: string;
  category: string;
}

export interface ConversionResult {
  text: string;
  format: string; // 'markdown' | 'html' | 'json' | 'text'
}

export interface FileData {
  file: File;
  base64: string;
}

export interface HistoryItem {
  id: string;
  user_id: string;
  tool_type: ToolType;
  file_name: string;
  content: string | null;
  created_at: string;
}