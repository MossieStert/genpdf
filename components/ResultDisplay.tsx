import React, { useState } from 'react';
import { ToolType } from '../types';
import { Copy, Download, Check, RotateCcw, FileCheck } from 'lucide-react';
import { downloadFile } from '../services/fileUtils';

interface ResultDisplayProps {
  content: string;
  toolType: ToolType;
  blobUrl?: string | null;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ content, toolType, blobUrl, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (blobUrl) {
      // Binary download (Merge/Split)
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = toolType === ToolType.MERGE_PDF ? 'merged_document.pdf' : 'split_document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Text/Generated content download
    let extension = 'txt';
    let mimeType = 'text/plain';

    switch (toolType) {
      case ToolType.TO_MARKDOWN: 
        extension = 'md'; 
        break;
      case ToolType.TO_HTML: 
        extension = 'html'; 
        mimeType = 'text/html'; 
        break;
      case ToolType.TO_JSON: 
        extension = 'json'; 
        mimeType = 'application/json'; 
        break;
      case ToolType.TO_TEXT:
      case ToolType.OCR_PDF:
        extension = 'txt';
        mimeType = 'text/plain';
        break;
      case ToolType.TO_DOCX:
        extension = 'doc';
        mimeType = 'application/msword';
        break;
      case ToolType.TO_RTF:
        extension = 'rtf';
        mimeType = 'application/rtf';
        break;
      default: 
        extension = 'txt';
    }

    downloadFile(content, `converted_result.${extension}`, mimeType);
  };

  // If we have a binary URL, show a dedicated download card instead of text area
  if (blobUrl) {
    return (
      <div className="max-w-xl mx-auto animate-in fade-in zoom-in duration-300">
        <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-8 text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileCheck className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Success!</h2>
          <p className="text-slate-600 mb-8">{content}</p>
          
          <button 
            onClick={handleDownload}
            className="w-full flex items-center justify-center px-6 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all hover:scale-105 shadow-lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Download PDF
          </button>
          
          <button
             onClick={onReset}
             className="mt-4 text-slate-500 hover:text-slate-800 font-medium text-sm flex items-center justify-center mx-auto"
           >
             <RotateCcw className="w-3 h-3 mr-1" />
             Process another file
           </button>
        </div>
      </div>
    );
  }

  // Standard Text Result
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-[70vh]">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <Check className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-900">Conversion Complete</span>
          </div>
          
          <div className="flex items-center space-x-2">
             <button 
              onClick={handleCopy}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
             >
               {copied ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
               {copied ? 'Copied' : 'Copy Text'}
             </button>
             
             <button 
              onClick={handleDownload}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
             >
               <Download className="w-4 h-4 mr-1.5" />
               Download File
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-auto p-0 relative bg-slate-50/50">
           <textarea 
             readOnly 
             value={content}
             className="w-full h-full p-6 font-mono text-sm text-slate-800 bg-transparent resize-none focus:outline-none leading-relaxed"
           />
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-200 p-4 bg-white flex justify-center">
           <button
             onClick={onReset}
             className="flex items-center px-6 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full font-medium transition-colors"
           >
             <RotateCcw className="w-4 h-4 mr-2" />
             Convert Another File
           </button>
        </div>
      </div>
    </div>
  );
};