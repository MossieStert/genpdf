import React, { useState } from 'react';
import { Cpu, ShieldCheck, User, LogOut, History as HistoryIcon, LogIn, Mail, Star } from 'lucide-react';
import { AdUnit } from './AdUnit';

interface LayoutProps {
  children: React.ReactNode;
  onLogoClick: () => void;
  user?: any;
  onLoginClick?: () => void;
  onHistoryClick?: () => void;
  onLogoutClick?: () => void;
  onContactClick: () => void;
  onFeedbackClick: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onLogoClick, 
  user, 
  onLoginClick, 
  onHistoryClick, 
  onLogoutClick,
  onContactClick,
  onFeedbackClick
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center cursor-pointer group" 
              onClick={onLogoClick}
              title="GenPDF Home - View All Tools"
            >
              <div className="bg-rose-600 p-2 rounded-lg mr-3 group-hover:bg-rose-700 transition-colors">
                <Cpu className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                Gen<span className="text-rose-600">PDF</span>
              </span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={onLogoClick} 
                className="text-slate-600 hover:text-rose-600 font-medium transition-colors"
                title="Browse all PDF conversion tools"
              >
                All Tools
              </button>
              <button 
                onClick={onContactClick} 
                className="text-slate-600 hover:text-rose-600 font-medium transition-colors"
                title="Get support or send a message"
              >
                Contact
              </button>
            </nav>

            <div className="flex items-center">
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors text-slate-700"
                    title="Open account menu"
                  >
                    <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                       {user.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium max-w-[100px] truncate hidden sm:block">
                      {user.email.split('@')[0]}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsUserMenuOpen(false)}
                      ></div>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-3 border-b border-slate-50">
                          <p className="text-xs text-slate-500">Signed in as</p>
                          <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                        </div>
                        <button 
                          onClick={() => {
                            onHistoryClick?.();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center"
                          title="View your conversion history"
                        >
                          <HistoryIcon className="w-4 h-4 mr-2 text-slate-400" />
                          My History
                        </button>
                        <button 
                          onClick={() => {
                            onLogoutClick?.();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center"
                          title="Sign out of your account"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button 
                  onClick={onLoginClick}
                  className="flex items-center bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                  title="Sign in or create an account"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Log In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        {children}
        
        <div className="max-w-7xl mx-auto w-full px-4">
           <AdUnit />
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-lg font-bold text-slate-900 mr-2">GenPDF</span>
              <span className="text-slate-500 text-sm">© 2024 AI Tools Inc.</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-500">
               <button onClick={onFeedbackClick} className="hover:text-amber-500 transition-colors flex items-center" title="Rate us">
                  <Star className="w-4 h-4 mr-2" /> Rate Us
               </button>
               <button onClick={onContactClick} className="hover:text-rose-600 transition-colors flex items-center" title="Contact us">
                  <Mail className="w-4 h-4 mr-2" /> Contact Us
               </button>
               <div className="flex items-center hidden sm:flex" title="We protect your data">
                  <ShieldCheck className="w-4 h-4 mr-2 text-green-500" />
                  <span>Secure & Private</span>
               </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};