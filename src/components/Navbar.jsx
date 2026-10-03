import React, { useState } from 'react';
import { Activity, FileText, History as HistoryIcon, Info, Menu, X, Sparkles, HeartPulse } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onLaunchDemo }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => handleNav('landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-600/20 group-hover:scale-105 transition-transform duration-200">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-sky-700 transition-colors">
                  AI Health Analyzer
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-sky-100 text-sky-800 rounded-full border border-sky-200">
                  Prototype
                </span>
              </div>
              <p className="text-[11px] text-slate-600 hidden md:block">
                Informational Health & Lab Report Insights
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 font-medium text-sm text-slate-600">
            <button
              onClick={() => handleNav('landing')}
              className={`px-3.5 py-2 rounded-lg transition-colors ${
                activeTab === 'landing'
                  ? 'text-sky-700 bg-sky-50 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('analyze')}
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'analyze' || activeTab === 'results'
                  ? 'text-sky-700 bg-sky-50 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-4 h-4 text-sky-600" />
              Analyze
            </button>
            <button
              onClick={() => handleNav('history')}
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'text-sky-700 bg-sky-50 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <HistoryIcon className="w-4 h-4 text-slate-500" />
              History
            </button>
            <button
              onClick={() => handleNav('about')}
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'about'
                  ? 'text-sky-700 bg-sky-50 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Info className="w-4 h-4 text-slate-500" />
              About
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={onLaunchDemo}
              className="px-3.5 py-2 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100/80 transition-colors flex items-center gap-1.5 shadow-sm"
              title="Quickly test with realistic demonstration patient data"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Try Demo
            </button>
            <button
              onClick={() => handleNav('analyze')}
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-lg transition-colors shadow-sm shadow-sky-600/30 flex items-center gap-1.5"
            >
              Start Analysis
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onLaunchDemo}
              className="px-2.5 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg"
            >
              Demo
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 shadow-lg">
          <button
            onClick={() => handleNav('landing')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'landing' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-700'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNav('analyze')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
              activeTab === 'analyze' || activeTab === 'results' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-700'
            }`}
          >
            <Activity className="w-4 h-4 text-sky-600" />
            Analyze Health & Report
          </button>
          <button
            onClick={() => handleNav('history')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
              activeTab === 'history' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-700'
            }`}
          >
            <HistoryIcon className="w-4 h-4 text-slate-500" />
            Analysis History
          </button>
          <button
            onClick={() => handleNav('about')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
              activeTab === 'about' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-700'
            }`}
          >
            <Info className="w-4 h-4 text-slate-500" />
            About Project
          </button>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onLaunchDemo();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              Load Demo Data
            </button>
            <button
              onClick={() => handleNav('analyze')}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg"
            >
              Start Analysis
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
