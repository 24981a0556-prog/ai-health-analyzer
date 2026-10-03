import React from 'react';
import { 
  HeartPulse, 
  GraduationCap, 
  ShieldCheck, 
  Activity, 
  FileText, 
  History, 
  Scale, 
  Cpu, 
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-12">
      
      {/* Title & Introduction */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-md shadow-sky-600/20">
          <HeartPulse className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About AI Health Analyzer
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          AI Health Analyzer is a student project that explores how Artificial Intelligence can help users understand health-related information in a simple and accessible way.
        </p>
      </div>

      {/* Prominent Disclaimer */}
      <section>
        <MedicalDisclaimer />
      </section>

      {/* Core Project Modules */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl font-bold text-slate-900">Key Capabilities Explored</h2>
          <p className="text-xs text-slate-500">Core functional domains developed for this prototype.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Symptom Analysis</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Provides structured rule-based symptom review and safety triaging, highlighting acute emergency flags such as severe chest pain or breathing difficulty.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Medical Report Analysis</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Accepts PDF and image formats (JPG, PNG) up to 10 MB, executing document OCR to extract clinical parameters, laboratory units, and reference intervals.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Basic Health Metrics</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Calculates Body Mass Index (BMI) dynamically and cross-evaluates vital sign baselines (blood pressure, resting pulse, and body temperature).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">AI-Assisted Explanations</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Translates complex numerical laboratory tables into plain-language explanations with possible considerations and actionable physician-consultation steps.
            </p>
          </div>

        </div>
      </section>

      {/* Engineering Design & Privacy */}
      <section className="bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-sky-600" />
          <span>Architecture & Reliability Principles</span>
        </h2>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>100% Reliable Offline Fallback:</strong> While external AI endpoints can be connected via environment variables, the system never breaks if an API key is missing or offline. A robust local clinical rules engine provides complete parameter analysis.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Privacy-Preserving Prototype:</strong> No patient records are stored on remote third-party databases. Analyses are saved exclusively in your browser's private LocalStorage session.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Responsible Medical Informatics:</strong> Strict safeguards prevent the generation of medical diagnoses. All outputs are explicitly presented as informational insights requiring clinical validation.
            </div>
          </div>
        </div>
      </section>

      {/* Academic Attribution */}
      <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-100">
        <p>College Demonstration Prototype — AI Health Analyzer</p>
      </div>

    </div>
  );
}
