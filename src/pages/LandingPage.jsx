import React from 'react';
import { 
  Activity, 
  FileText, 
  History, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  HeartPulse, 
  CheckCircle,
  FileCheck2,
  Stethoscope,
  UploadCloud,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

export default function LandingPage({ onStartAnalysis, onTryDemo, onViewHistory }) {
  return (
    <div className="space-y-16 py-6 sm:py-10">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-sky-50/80 via-white to-slate-50 border border-sky-100 p-8 sm:p-12 lg:p-16 shadow-sm">
        
        {/* Subtle decorative background circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-sky-200 text-sky-800 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>AI-Assisted Educational Prototype</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Understand Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-600">Health Better</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Analyze your symptoms and medical reports in one simple place.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={onStartAnalysis}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold text-sm sm:text-base shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Start Analysis</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onTryDemo}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-teal-50/70 border border-teal-200 text-teal-800 font-semibold text-sm sm:text-base shadow-sm hover:border-teal-300 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Try Demo</span>
            </button>
          </div>

          {/* Micro trust indicators */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              Instant Parameter Extraction
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              PDF & Image OCR Support
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              Private & Local-first
            </span>
          </div>

        </div>

      </section>

      {/* Mandatory Prominent Disclaimer */}
      <section className="max-w-4xl mx-auto">
        <MedicalDisclaimer />
      </section>

      {/* Feature Cards Section */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Designed for Clarity and Patient Empowerment
          </h2>
          <p className="text-sm text-slate-500">
            Translating complex clinical lab sheets into intuitive, plain-language insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Symptom Analysis */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Symptom Analysis</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Understand your symptoms using AI-assisted analysis and structured clinical rule evaluation.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-sky-600">
              <span>Rule-based clinical triaging</span>
            </div>
          </div>

          {/* Card 2: Medical Report Analysis */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Medical Report Analysis</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Upload a medical report and identify important health parameters, reference intervals, and flagged values.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-teal-600">
              <span>PDF parser & OCR support</span>
            </div>
          </div>

          {/* Card 3: Health History */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Health History</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Keep track of previous analyses securely on your device with local client storage.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600">
              <span>Local browser persistence</span>
            </div>
          </div>

        </div>
      </section>

      {/* Simple "How It Works" Section */}
      <section className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">How It Works</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Four simple steps from health information to plain-language explanation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
            <span className="text-3xl font-black text-sky-100 absolute top-3 right-4 select-none">01</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm mb-3">
              1
            </div>
            <h4 className="font-semibold text-slate-900 text-sm mb-1">Enter Health Information</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Provide basic age, biological sex, height, weight, and optional vital signs.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
            <span className="text-3xl font-black text-teal-100 absolute top-3 right-4 select-none">02</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm mb-3">
              2
            </div>
            <h4 className="font-semibold text-slate-900 text-sm mb-1">Upload Report or Symptoms</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload a lab PDF/image, or describe any physical symptoms and their duration.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
            <span className="text-3xl font-black text-indigo-100 absolute top-3 right-4 select-none">03</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm mb-3">
              3
            </div>
            <h4 className="font-semibold text-slate-900 text-sm mb-1">AI Analyzes Data</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Extracts clinical units, maps parameters to reference ranges, and identifies noteworthy findings.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
            <span className="text-3xl font-black text-emerald-100 absolute top-3 right-4 select-none">04</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm mb-3">
              4
            </div>
            <h4 className="font-semibold text-slate-900 text-sm mb-1">Understand the Results</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Review clear explanations, parameter statuses, and suggested safe next steps.
            </p>
          </div>

        </div>
      </section>

      {/* College Project Demo Banner */}
      <section className="bg-gradient-to-r from-sky-900 to-teal-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold border border-white/15">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for Faculty Demonstration</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold">Try the Interactive College Demo</h3>
          <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed">
            Click "Try Demo" to populate a verified 18-parameter demo medical report, calculate real-time BMI, run symptom matching, and preview the full analysis dashboard in seconds.
          </p>
        </div>

        <button
          onClick={onTryDemo}
          className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-sky-950 font-bold text-sm shrink-0 shadow-md transition-all flex items-center gap-2 group"
        >
          <span>Launch Demo Now</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </section>

    </div>
  );
}
