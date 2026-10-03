import React from 'react';
import { HeartPulse, ShieldAlert, GraduationCap } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-900 text-base">AI Health Analyzer</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
              An educational software prototype exploring human-centered AI assistance for translating complex laboratory parameters and symptom patterns into accessible insights.
            </p>
            <div className="flex items-center gap-2 text-xs text-sky-700 bg-sky-50 px-3 py-1.5 rounded-md border border-sky-100 w-fit">
              <GraduationCap className="w-4 h-4 text-sky-600" />
              <span>Academic Prototype — Computer Science & Health Informatics</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h5 className="font-semibold text-slate-900 mb-3 text-xs tracking-wider uppercase">Application</h5>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button onClick={() => { setActiveTab('landing'); window.scrollTo(0,0); }} className="hover:text-sky-600 transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('analyze'); window.scrollTo(0,0); }} className="hover:text-sky-600 transition-colors">
                  Health Analysis
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('history'); window.scrollTo(0,0); }} className="hover:text-sky-600 transition-colors">
                  Saved History
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('about'); window.scrollTo(0,0); }} className="hover:text-sky-600 transition-colors">
                  Methodology & About
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Disclaimer */}
          <div>
            <h5 className="font-semibold text-slate-900 mb-3 text-xs tracking-wider uppercase flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              Safety Notice
            </h5>
            <p className="text-xs text-slate-500 leading-relaxed">
              This application does not provide clinical diagnosis or medical treatment. For acute symptoms or medical emergencies, consult a certified physician immediately.
            </p>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} AI Health Analyzer. Built for Educational Demonstration.</p>
          <p className="flex items-center gap-1">
            Engineered with React, Tailwind CSS, Vite & Local Storage.
          </p>
        </div>
      </div>
    </footer>
  );
}
