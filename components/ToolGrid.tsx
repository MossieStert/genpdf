import React, { useState, useEffect, useMemo } from 'react';
import { TOOLS } from '../constants';
import { ToolType, ToolDef } from '../types';
import { ArrowRight, Star, ChevronDown, Folder, Sparkles, FileText, Globe, Filter } from 'lucide-react';
import { AdUnit } from './AdUnit';
import { logEvent } from '../services/analytics';

interface ToolGridProps {
  onSelectTool: (tool: ToolType) => void;
}

interface ToolCardProps {
  tool: ToolDef;
  isBookmarked: boolean;
  onToggleBookmark: (e: React.MouseEvent, toolId: ToolType) => void;
  onClick: (toolId: ToolType) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, isBookmarked, onToggleBookmark, onClick }) => {
  return (
    <div 
      onClick={() => onClick(tool.id)}
      className="group relative bg-slate-50 hover:bg-white border border-slate-200 hover:border-rose-200 p-8 rounded-2xl transition-all duration-200 cursor-pointer hover:shadow-xl hover:shadow-rose-100/50 flex flex-col h-full"
    >
      {/* Bookmark Button */}
      <div className="absolute top-4 right-4 z-20">
          <button 
              onClick={(e) => onToggleBookmark(e, tool.id)}
              className={`p-2 rounded-full transition-all duration-200 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-200 ${
                  isBookmarked ? 'text-amber-400 scale-110' : 'text-slate-300 hover:text-amber-400'
              }`}
              title={isBookmarked ? "Remove from favorites" : "Add to favorites"}
          >
              <Star className={`w-5 h-5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
          </button>
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className={`${tool.color} bg-opacity-10 p-3 rounded-xl group-hover:scale-110 transition-transform duration-200`}>
          <tool.icon className={`w-8 h-8 ${tool.color.replace('bg-', 'text-')}`} />
        </div>
        {tool.badge && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
            {tool.badge}
          </span>
        )}
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors pr-8">
        {tool.title}
      </h3>
      
      <p className="text-slate-600 mb-4 flex-grow">
        {tool.description}
      </p>

      <div className="flex items-center text-rose-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
        Start Now <ArrowRight className="ml-2 w-4 h-4" />
      </div>
    </div>
  );
};

const CategoryHeader: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  count: number;
  icon?: React.ReactNode;
}> = ({ title, isOpen, onToggle, count, icon }) => {
  return (
    <button 
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 mb-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors shadow-sm group"
    >
      <div className="flex items-center space-x-3">
        <div className="bg-slate-100 p-2 rounded-lg text-slate-600 group-hover:text-rose-600 group-hover:bg-rose-50 transition-colors">
           {icon || <Folder className="w-5 h-5" />}
        </div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
          {count}
        </span>
      </div>
      <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
        <ChevronDown className="w-5 h-5 text-slate-400" />
      </div>
    </button>
  );
};

export const ToolGrid: React.FC<ToolGridProps> = ({ onSelectTool }) => {
  const [bookmarks, setBookmarks] = useState<ToolType[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  // Define category display order and icons
  const categoryConfig = [
    { id: 'PDF Management', icon: <Folder className="w-5 h-5" /> },
    { id: 'AI Intelligence', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'Document Conversion', icon: <FileText className="w-5 h-5" /> },
    { id: 'Web & Data Extraction', icon: <Globe className="w-5 h-5" /> },
  ];

  // State for open/closed categories (default all open)
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'PDF Management': true,
    'AI Intelligence': true,
    'Document Conversion': true,
    'Web & Data Extraction': true
  });

  useEffect(() => {
    const saved = localStorage.getItem('genpdf_bookmarks');
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    }
    setLoaded(true);
  }, []);

  const toggleBookmark = (e: React.MouseEvent, toolId: ToolType) => {
    e.stopPropagation(); // Prevent card selection when clicking the star
    const newBookmarks = bookmarks.includes(toolId)
      ? bookmarks.filter(id => id !== toolId)
      : [...bookmarks, toolId];
    
    setBookmarks(newBookmarks);
    localStorage.setItem('genpdf_bookmarks', JSON.stringify(newBookmarks));
    
    logEvent('toggle_bookmark', { 
      tool_id: toolId, 
      action: bookmarks.includes(toolId) ? 'remove' : 'add' 
    });
  };

  const handleToolClick = (toolId: ToolType) => {
    logEvent('select_tool', { tool_id: toolId });
    onSelectTool(toolId);
  };

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Filter bookmarks
  const favoriteTools = TOOLS.filter(t => bookmarks.includes(t.id));

  // Group tools by category
  const toolsByCategory = useMemo(() => {
    const groups: Record<string, ToolDef[]> = {};
    TOOLS.forEach(tool => {
      if (!groups[tool.category]) {
        groups[tool.category] = [];
      }
      groups[tool.category].push(tool);
    });
    return groups;
  }, []);

  // Prevent hydration mismatch or flash by waiting for load
  if (!loaded) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white/50 rounded-3xl mb-10">
      
      {/* Favorites Section - Visible if favorites exist and no filter is active */}
      {activeFilter === 'All' && favoriteTools.length > 0 && (
        <div className="mb-12 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <Star className="w-6 h-6 text-amber-400 mr-2 fill-amber-400" />
                Your Favorites
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteTools.map((tool) => (
                    <ToolCard 
                      key={`fav-${tool.id}`} 
                      tool={tool} 
                      isBookmarked={true}
                      onToggleBookmark={toggleBookmark}
                      onClick={handleToolClick}
                    />
                ))}
            </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Tool Categories</h2>
        
        {/* Category Filter Dropdown */}
        <div className="relative min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-slate-400" />
          </div>
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="block w-full pl-10 pr-10 py-2.5 text-base border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent sm:text-sm rounded-xl bg-white shadow-sm text-slate-700 font-medium appearance-none cursor-pointer hover:border-rose-300 transition-colors"
          >
            <option value="All">All Categories</option>
            {categoryConfig.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.id}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>
      
      {/* Categorized Dropdowns */}
      <div className="space-y-6">
        {categoryConfig
          .filter(config => activeFilter === 'All' || config.id === activeFilter)
          .map((config) => {
            const categoryTools = toolsByCategory[config.id] || [];
            if (categoryTools.length === 0) return null;

            // If a filter is active, always show the category as open
            const isOpen = activeFilter !== 'All' ? true : openCategories[config.id];

            return (
              <div key={config.id} className="bg-slate-50/50 rounded-2xl transition-all">
                 <CategoryHeader 
                   title={config.id} 
                   isOpen={isOpen} 
                   onToggle={() => toggleCategory(config.id)}
                   count={categoryTools.length}
                   icon={config.icon}
                 />
                 
                 {isOpen && (
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                     {categoryTools.map((tool) => (
                       <ToolCard 
                         key={tool.id} 
                         tool={tool}
                         isBookmarked={bookmarks.includes(tool.id)}
                         onToggleBookmark={toggleBookmark}
                         onClick={handleToolClick}
                       />
                     ))}
                   </div>
                 )}
              </div>
            );
        })}
      </div>

      {/* Ad Space */}
      <AdUnit slotId="tool-grid-bottom" />
    </div>
  );
};