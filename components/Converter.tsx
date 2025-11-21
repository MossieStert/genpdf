import React, { useState, useCallback, useMemo } from 'react';
import { ToolType } from '../types';
import { TOOLS } from '../constants';
import { ArrowLeft, FileUp, AlertCircle, Loader2, CheckCircle, FileText, X, Plus, Bookmark, ChevronUp, ChevronDown, Eye } from 'lucide-react';
import { fileToBase64 } from '../services/fileUtils';
import { processDocument } from '../services/geminiService';
import { mergePdfs, splitPdf, getPdfPageCount, parsePageRange } from '../services/pdfService';
import { saveHistory } from '../services/supabase';
import { ResultDisplay } from './ResultDisplay';
import { logEvent } from '../services/analytics';

interface ConverterProps {
  toolType: ToolType;
  onBack: () => void;
  user?: any;
}

export const Converter: React.FC<ConverterProps> = ({ toolType, onBack, user }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [binaryResultUrl, setBinaryResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [splitRange, setSplitRange] = useState('');
  const [totalPages, setTotalPages] = useState<number>(0);

  const tool = TOOLS.find(t => t.id === toolType);
  const isMerge = toolType === ToolType.MERGE_PDF;
  const isSplit = toolType === ToolType.SPLIT_PDF;

  // Calculate selected pages for preview whenever range or totalPages changes
  const selectedPageNumbers = useMemo(() => {
    if (!isSplit || totalPages === 0) return [];
    return parsePageRange(splitRange, totalPages);
  }, [isSplit, splitRange, totalPages]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleFileSelection = useCallback((selectedFiles: File[]) => {
    const validPdfFiles = selectedFiles.filter(f => f.type === 'application/pdf');
    
    if (validPdfFiles.length === 0) {
      setError('Please upload valid PDF files.');
      return;
    }

    // If not merging, only take the first one
    const filesToProcess = isMerge ? validPdfFiles : [validPdfFiles[0]];

    setError(null);
    setResult(null);
    setBinaryResultUrl(null);
    setIsUploading(true);
    setUploadProgress(0);
    setTotalPages(0);
    setSplitRange('');

    // Log upload event
    logEvent('upload_files', {
      tool: toolType,
      file_count: filesToProcess.length,
      total_size: filesToProcess.reduce((acc, f) => acc + f.size, 0)
    });

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Finalize upload
          setTimeout(async () => {
            setFiles(prevFiles => isMerge ? [...prevFiles, ...filesToProcess] : filesToProcess);
            setIsUploading(false);
            
            // Logic for Split PDF: Get page count
            if (toolType === ToolType.SPLIT_PDF && filesToProcess.length > 0) {
              try {
                const count = await getPdfPageCount(filesToProcess[0]);
                setTotalPages(count);
              } catch (e) {
                console.error("Could not get page count", e);
              }
            }
          }, 200); 
          return 100;
        }
        return prev + 20;
      });
    }, 80);
  }, [isMerge, toolType]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(Array.from(e.dataTransfer.files));
    }
  }, [handleFileSelection]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(Array.from(e.target.files));
    }
  }, [handleFileSelection]);

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (files.length <= 1) {
      setError(null);
      setResult(null);
      setBinaryResultUrl(null);
      setUploadProgress(0);
      setTotalPages(0);
    }
  };

  const handleMoveFile = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === files.length - 1)) return;
    
    const newFiles = [...files];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const handleProcess = async () => {
    if (files.length === 0 || !tool) return;

    setIsProcessing(true);
    setError(null);

    try {
      let outputContent: string | null = null;

      if (isMerge) {
        const mergedBytes = await mergePdfs(files);
        const blob = new Blob([mergedBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setBinaryResultUrl(url);
        setResult("Merge complete! Your file is ready.");
      } else if (isSplit) {
        if (!splitRange) throw new Error("Please specify page ranges.");
        const splitBytes = await splitPdf(files[0], splitRange);
        const blob = new Blob([splitBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setBinaryResultUrl(url);
        setResult("Split complete! Your file is ready.");
      } else {
        // Standard AI processing
        const file = files[0];
        const base64 = await fileToBase64(file);
        outputContent = await processDocument(base64, file.type, toolType);
        setResult(outputContent);
      }

      // Log success event
      logEvent('conversion_success', {
        tool: toolType,
        method: isMerge || isSplit ? 'local_pdf_lib' : 'gemini_ai'
      });

      // Save to History if User is Logged In
      if (user) {
        const primaryFileName = files[0].name;
        const displayName = isMerge ? `Merged ${files.length} files` : primaryFileName;
        await saveHistory(user.id, toolType, displayName, outputContent);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while processing the document.");
      
      // Log error event
      logEvent('conversion_error', {
        tool: toolType,
        error: err.message
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper to set ranges
  const setRangeHelper = (type: 'all' | 'odd' | 'even' | 'first' | 'last') => {
    if (totalPages === 0) return;
    
    switch(type) {
      case 'all':
        setSplitRange(`1-${totalPages}`);
        break;
      case 'odd':
        const odd = [];
        for(let i=1; i<=totalPages; i+=2) odd.push(i);
        setSplitRange(odd.join(', '));
        break;
      case 'even':
        const even = [];
        for(let i=2; i<=totalPages; i+=2) even.push(i);
        setSplitRange(even.join(', '));
        break;
      case 'first':
        setSplitRange('1');
        break;
      case 'last':
        setSplitRange(`${totalPages}`);
        break;
    }
  };

  if (!tool) return null;

  const hasFiles = files.length > 0;
  const ToolIcon = tool.icon;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 w-full flex-grow">
      <button 
        onClick={onBack}
        className="flex items-center text-slate-500 hover:text-slate-800 mb-8 transition-colors font-medium"
        title="Return to the main tool menu"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to tools
      </button>

      <div className="flex flex-col items-center text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className={`p-5 rounded-3xl ${tool.color} bg-opacity-10 mb-6 shadow-sm`}>
          <ToolIcon className={`w-12 h-12 ${tool.color.replace('bg-', 'text-')}`} />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">{tool.title}</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">{tool.description}</p>
      </div>

      {!result ? (
        <div className="max-w-xl mx-auto">
          <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border transition-all duration-300 ${
            isDragging ? 'border-rose-500 bg-rose-50/50 scale-[1.02]' : 'border-slate-100'
          }`}>
            
            {/* Upload Area / File List */}
            <div 
              className="p-8 sm:p-12 relative"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isUploading ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Loader2 className="w-8 h-8 text-rose-600 animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Uploading...</h3>
                  <div className="w-full max-w-xs mx-auto bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                    <div 
                      className="bg-rose-500 h-2 rounded-full transition-all duration-100 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : !hasFiles ? (
                // Empty State - Upload Box
                <div className="text-center relative z-10">
                  <div className="relative group cursor-pointer inline-block w-full">
                    <input 
                      type="file" 
                      accept=".pdf" 
                      multiple={isMerge}
                      onChange={handleFileInput}
                      className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                      title={isMerge ? "Click or drag to upload multiple PDF files" : "Click or drag to upload a PDF file"}
                    />
                    <div className={`border-3 border-dashed rounded-2xl p-10 transition-colors ${
                      isDragging 
                        ? 'border-rose-500 bg-rose-100/20' 
                        : 'border-slate-200 hover:border-rose-400 bg-slate-50 hover:bg-rose-50/30'
                    }`}>
                      <div className={`bg-white p-4 rounded-full inline-flex mb-4 shadow-sm transition-transform duration-300 ${isDragging ? 'scale-110' : 'group-hover:scale-110'}`}>
                        <FileUp className={`w-8 h-8 ${isDragging ? 'text-rose-600' : 'text-rose-500'}`} />
                      </div>
                      <p className="text-xl font-semibold text-slate-900 mb-2">
                        {isDragging ? 'Drop PDF here' : `Upload PDF file${isMerge ? 's' : ''}`}
                      </p>
                      <p className="text-slate-500 text-sm">
                        or click to select from your computer
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Files Loaded State
                <div className="text-center">
                  {isMerge ? (
                    <div className="space-y-3 mb-8 max-h-60 overflow-y-auto custom-scrollbar p-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 animate-in fade-in slide-in-from-bottom-1 duration-300">
                          <div className="flex items-center space-x-3 truncate flex-1">
                            <div className="bg-violet-100 p-2 rounded text-violet-600 shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="text-left truncate">
                               <span className="text-sm font-medium text-slate-700 truncate block max-w-[180px] sm:max-w-[240px]">{file.name}</span>
                               <span className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center ml-2">
                             {/* Reordering Controls */}
                            <div className="flex items-center mr-2 border-r border-slate-200 pr-2 space-x-1">
                              <button 
                                onClick={() => handleMoveFile(index, 'up')} 
                                disabled={index === 0}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-200 rounded transition-colors"
                                title="Move Up"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleMoveFile(index, 'down')} 
                                disabled={index === files.length - 1}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-200 rounded transition-colors"
                                title="Move Down"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </button>
                            </div>

                            <button 
                              onClick={() => handleRemoveFile(index)} 
                              className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors" 
                              title="Remove this file"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="relative mt-4">
                        <input 
                            type="file" 
                            accept=".pdf" 
                            multiple
                            onChange={handleFileInput}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            title="Upload additional PDF files"
                        />
                        <button className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:border-violet-500 hover:text-violet-600 transition-colors flex items-center justify-center">
                          <Plus className="w-4 h-4 mr-2" /> Add more files
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Single File Display
                    <div className="relative inline-block mb-8">
                       <div className="bg-rose-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                         <FileText className="w-10 h-10 text-rose-600" />
                       </div>
                       <button 
                         onClick={() => handleRemoveFile(0)}
                         disabled={isProcessing}
                         className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-slate-100 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-0"
                         title="Remove this file"
                       >
                         <X className="w-4 h-4" />
                       </button>
                       <h3 className="text-lg font-semibold text-slate-900 mb-1 truncate max-w-[300px] mx-auto">
                        {files[0].name}
                      </h3>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-sm text-slate-500">
                          {(files[0].size / 1024 / 1024).toFixed(2)} MB
                        </span>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                  )}

                  {/* Split Tool specific input */}
                  {isSplit && (
                    <div className="mb-8 text-left bg-slate-50 p-5 rounded-xl border border-slate-200 transition-all">
                      <div className="flex justify-between items-end mb-3">
                        <label className="flex items-center text-sm font-bold text-slate-700">
                          <Bookmark className="w-4 h-4 mr-2 text-rose-500" />
                          Page Ranges to Extract
                        </label>
                        {totalPages > 0 && (
                          <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-1 rounded-md border border-rose-100">
                            Total Pages: {totalPages}
                          </span>
                        )}
                      </div>
                      
                      <div className="relative">
                        <input 
                          type="text" 
                          value={splitRange}
                          onChange={(e) => setSplitRange(e.target.value)}
                          placeholder={totalPages > 0 ? `e.g. 1-3, 5, ${Math.min(8, totalPages)}-${totalPages}` : "e.g. 1-5, 8, 11-13"}
                          className="w-full pl-4 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none shadow-sm transition-shadow text-slate-700 font-medium"
                          title="Enter page numbers (e.g. 1, 5) or ranges (e.g. 1-5). Use commas to separate."
                        />
                      </div>
                      
                      {totalPages > 0 && (
                        <>
                          <div className="mt-3 flex flex-wrap gap-2">
                             <button onClick={() => setRangeHelper('all')} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-colors" title="Select all pages">All</button>
                             <button onClick={() => setRangeHelper('first')} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-colors" title="Select first page">First</button>
                             <button onClick={() => setRangeHelper('last')} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-colors" title="Select last page">Last</button>
                             <button onClick={() => setRangeHelper('odd')} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-colors" title="Select odd pages">Odd</button>
                             <button onClick={() => setRangeHelper('even')} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-colors" title="Select even pages">Even</button>
                          </div>

                          {/* Visual Preview Grid */}
                          <div className="mt-6 border-t border-slate-200 pt-5">
                            <h4 className="text-sm font-bold text-slate-700 mb-3 flex justify-between items-center">
                              <span className="flex items-center"><Eye className="w-3 h-3 mr-1.5 text-slate-400"/> Page Preview</span>
                              <span className="text-xs font-normal text-slate-500">
                                <span className={selectedPageNumbers.length > 0 ? "text-rose-600 font-bold" : ""}>{selectedPageNumbers.length}</span> selected
                              </span>
                            </h4>
                            
                            <div className="max-h-48 overflow-y-auto p-3 bg-slate-100/50 rounded-lg border border-slate-200 custom-scrollbar">
                              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                                  const isSelected = selectedPageNumbers.includes(pageNum);
                                  return (
                                    <div 
                                      key={pageNum}
                                      className={`
                                        aspect-square flex items-center justify-center text-xs font-medium rounded border transition-all cursor-default
                                        ${isSelected 
                                          ? 'bg-rose-500 text-white border-rose-600 shadow-sm scale-105' 
                                          : 'bg-white text-slate-400 border-slate-200 opacity-60'}
                                      `}
                                      title={`Page ${pageNum}`}
                                    >
                                      {pageNum}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={handleProcess}
                    disabled={isProcessing || (isSplit && selectedPageNumbers.length === 0)}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all hover:scale-[1.01] shadow-lg shadow-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
                    title="Start processing the document"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {isMerge ? 'Merge PDFs' : isSplit ? 'Split PDF' : `Convert to ${tool.title.replace('PDF to ', '')}`}
                      </>
                    )}
                  </button>

                   {error && (
                    <div className="mt-6 p-4 bg-red-50 rounded-xl flex items-start text-red-600 animate-in fade-in slide-in-from-top-2">
                      <div className="bg-red-100 p-1 rounded-full mr-3 mt-0.5">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">{error}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <ResultDisplay 
          content={result} 
          toolType={toolType} 
          blobUrl={binaryResultUrl}
          onReset={() => {
            setResult(null);
            setBinaryResultUrl(null);
            setFiles([]);
            setSplitRange('');
            setTotalPages(0);
          }}
        />
      )}
    </div>
  );
};