import React from "react";
import { Cpu } from "lucide-react";
import { AdUnit } from "./AdUnit";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  onLogoClick: () => void;
  onContactClick: () => void;
  onFeedbackClick: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  onLogoClick,
  onContactClick,
  onFeedbackClick,
}) => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* LOGO */}
            <button
              onClick={onLogoClick}
              className="flex items-center group"
              title="GenPDF Home"
            >
              <div className="bg-rose-600 p-2 rounded-lg mr-3 group-hover:bg-rose-700 transition-colors">
                <Cpu className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                Gen<span className="text-rose-600">PDF</span>
              </span>
            </button>

            {/* RIGHT NAV */}
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={onContactClick}
                className="text-slate-600 hover:text-rose-600 font-medium"
              >
                Contact
              </button>
              <button
                onClick={onFeedbackClick}
                className="text-slate-600 hover:text-rose-600 font-medium"
              >
                Feedback
              </button>
            </nav>

          </div>
        </div>
      </header>

      {/* MAIN */}
      <main
        id="app-main"
        className="flex-grow flex flex-col overflow-y-auto"
      >
        {children}

        <div className="max-w-7xl mx-auto w-full px-4">
          <AdUnit />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t mt-20 py-6 text-sm text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap gap-6 justify-center">

          <Link to="/" className="font-medium text-slate-700 hover:text-slate-900">
            Home
          </Link>

          <Link to="/about" className="hover:text-slate-900">About</Link>
          <Link to="/privacy" className="hover:text-slate-900">Privacy</Link>
          <Link to="/terms" className="hover:text-slate-900">Terms</Link>
          <Link to="/cookies" className="hover:text-slate-900">Cookies</Link>
          <Link to="/accessibility" className="hover:text-slate-900">Accessibility</Link>
          <Link to="/faq" className="hover:text-slate-900">FAQ</Link>

          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            Secure & Private
          </span>

        </div>
      </footer>
    </div>
  );
};
