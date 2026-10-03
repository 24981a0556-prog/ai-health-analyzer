import React from 'react';
import { CheckCircle2, Loader2, Sparkles, FileSearch, Scale, BrainCircuit, Activity } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Uploading & validating report...', icon: FileSearch },
  { id: 2, label: 'Reading report document & text extraction...', icon: FileSearch },
  { id: 3, label: 'Extracting health parameters & clinical units...', icon: Activity },
  { id: 4, label: 'Comparing values against standard reference ranges...', icon: Scale },
  { id: 5, label: 'Generating plain-language health insights...', icon: BrainCircuit },
  { id: 6, label: 'Analysis complete!', icon: Sparkles }
];

export default function LoadingAnalysisModal({ currentStep = 1, currentDetail = '' }) {
  const progressPercent = Math.min(100, Math.round((currentStep / 6) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-sky-600 to-teal-600 text-white text-center relative">
          <div className="w-12 h-12 mx-auto rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
            <Loader2 className="w-6 h-6 animate-spin text-white" />
          </div>
          <h3 className="text-xl font-bold tracking-tight">Processing Health Data</h3>
          <p className="text-sky-100 text-xs sm:text-sm mt-1">
            Analyzing symptoms, laboratory parameters, and reference ranges
          </p>

          {/* Progress bar */}
          <div className="mt-4 w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[11px] text-sky-100 font-medium">
            <span>Step {Math.min(currentStep, 6)} of 6</span>
            <span>{progressPercent}% Complete</span>
          </div>
        </div>

        {/* Steps List */}
        <div className="p-6 space-y-3.5 bg-slate-50/50">
          {STEPS.map((step) => {
            const isFinished = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const StepIcon = step.icon;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3.5 p-3 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? 'bg-white border border-sky-300 shadow-sm ring-2 ring-sky-500/10'
                    : isFinished
                    ? 'bg-emerald-50/60 border border-emerald-200/60 text-slate-700'
                    : 'bg-white/40 border border-transparent text-slate-400'
                }`}
              >
                <div className="shrink-0">
                  {isFinished ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center animate-spin">
                      <Loader2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-200/80 text-slate-500 flex items-center justify-center text-xs font-semibold">
                      {step.id}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs sm:text-sm font-medium ${isCurrent ? 'text-sky-950 font-semibold' : isFinished ? 'text-slate-800' : 'text-slate-400'}`}>
                      {step.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[11px] font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200 animate-pulse">
                        In progress
                      </span>
                    )}
                  </div>
                  {isCurrent && currentDetail && (
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {currentDetail}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Informational reassurance */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-500">
            Running privacy-safe client-side processing & clinical rule synthesis.
          </p>
        </div>
      </div>
    </div>
  );
}
