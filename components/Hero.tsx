import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div className="bg-slate-50 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center px-4">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
        Every tool you need to work with PDFs in <span className="text-rose-600">one place</span>
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
        Use the power of Gemini AI to convert, summarize, and extract data from your PDF documents. 
        100% free and easy to use.
      </p>
      <div className="flex justify-center space-x-4">
        <div className="flex items-center space-x-2 text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Gemini 2.5 Flash Active</span>
        </div>
      </div>
    </div>
  );
};
