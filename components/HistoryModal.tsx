import React, { useEffect, useState } from 'react';
import { supabase, fetchHistory } from '../services/supabase';
import { HistoryItem, ToolType } from '../types';
import { TOOLS } from '../constants';
import { X, Calendar, FileText, Copy, Check, Loader2, AlertTriangle } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, user }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      setLoading(true);
      fetchHistory(user.id)
        .then(setHistory)
        .finally(() => setLoading(false));
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getToolInfo = (type: ToolType) => {
    return TOOLS.find(t => t.id === type) || { title: type, icon: FileText, color: 'text-slate-500' };
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center rounded-t-2xl">
          <div>
             <h3 className="text-xl font-bold text-slate-900">Interaction History</h3>
             <p className="text-sm text-slate-500">Your saved conversions and activities</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-full border border-slate-200 shadow-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 custom-scrollbar bg-slate-50/30">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p>Loading history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                 <Calendar className="w-8 h-8 text-slate-300" />
              </div>
              <p className="font-medium text-slate-600">No history found</p>
              <p className="text-sm">Process a file to see it here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => {
                const tool = getToolInfo(item.tool_type);
                const ToolIcon = tool.icon;
                const isBinary = !item.content || item.content.length < 50; // Heuristic for non-content items

                return (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-slate-100 ${tool.color.replace('bg-', 'text-')}`}>
                          <ToolIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{tool.title}</h4>
                          <p className="text-xs text-slate-500 flex items-center mt-0.5">
                            <FileText className="w-3 h-3 mr-1" />
                            {item.file_name}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 whitespace-nowrap font-mono bg-slate-50 px-2 py-1 rounded">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {item.content && (
                      <div className="mt-3 relative group">
                        <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600 font-mono max-h-32 overflow-hidden relative">
                           {item.content.slice(0, 300)}
                           {item.content.length > 300 && "..."}
                           <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-50 to-transparent"></div>
                        </div>
                        <button 
                          onClick={() => handleCopy(item.content!, item.id)}
                          className="absolute top-2 right-2 p-1.5 bg-white border border-slate-200 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                          title="Copy Content"
                        >
                          {copiedId === item.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    )}

                    {!item.content && (
                       <div className="mt-3 text-xs text-slate-500 italic flex items-center bg-slate-50 p-2 rounded">
                         <AlertTriangle className="w-3 h-3 mr-1.5" />
                         Binary file output (not stored).
                       </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};