import React from 'react';
import { Shield, Zap, Globe, Users } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="bg-white py-16 sm:py-24 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* About & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 relative inline-block">
              About Us
              <span className="absolute bottom-0 left-0 w-full h-1 bg-rose-500 rounded-full opacity-30"></span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              GenPDF is a cutting-edge document intelligence platform designed to transform how you interact with PDFs. 
              Born from the need to make static documents dynamic and accessible, we leverage the power of Google's 
              <span className="font-semibold text-rose-600"> Gemini 2.5 Flash</span> to extract, summarize, and convert 
              content with unprecedented accuracy. Whether you're a student, professional, or developer, GenPDF bridges 
              the gap between your files and your workflow.
            </p>
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 relative inline-block">
              Our Mission
              <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 rounded-full opacity-30"></span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              We believe that information shouldn't be trapped in rigid formats. Our mission is to democratize document 
              processing technology, making high-end OCR and AI analysis available to everyone for free. We strive to 
              build tools that are not only powerful but also intuitive and privacy-conscious, ensuring you spend less time 
              managing files and more time acting on insights.
            </p>
          </div>
        </div>

        {/* What We Offer */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">What We Offer</h2>
            <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">A complete suite of tools powered by next-gen AI capabilities</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-lg transition-shadow duration-300 group">
              <div className="bg-rose-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Lightning Fast AI</h3>
              <p className="text-slate-600 leading-relaxed">
                Powered by Gemini 2.5 Flash, our converters process documents with incredible speed without sacrificing quality. 
                Get results in seconds, not minutes.
              </p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-lg transition-shadow duration-300 group">
              <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Privacy First</h3>
              <p className="text-slate-600 leading-relaxed">
                Your privacy is paramount. Files for merging and splitting are processed entirely in your browser. 
                AI processing is stateless—we don't store your documents.
              </p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-lg transition-shadow duration-300 group">
              <div className="bg-emerald-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Universal Formats</h3>
              <p className="text-slate-600 leading-relaxed">
                Convert to Markdown, HTML, JSON, DOCX, and more. We support the formats that modern workflows demand, 
                making data extraction seamless.
              </p>
            </div>
          </div>
        </div>

        {/* Who We Are */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          <div className="relative z-10">
            <div className="mx-auto w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-8 ring-4 ring-white/5">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Who We Are</h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              GenPDF is built by a small, dedicated team of developers and AI researchers. We are passionate about the 
              intersection of productivity and generative AI. We built this platform because we needed it ourselves—a 
              reliable, free, and smart way to handle the endless stream of PDF documents in our daily lives.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};