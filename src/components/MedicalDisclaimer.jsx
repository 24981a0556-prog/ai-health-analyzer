import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function MedicalDisclaimer({ compact = false, variant = 'info' }) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs font-medium">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Educational Prototype:</strong> Informational insights only. Not a medical diagnosis or substitute for professional medical advice.
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50/60 p-4 shadow-sm text-slate-800">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-100 rounded-lg text-amber-800 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="text-sm space-y-1">
          <h4 className="font-semibold text-amber-950 flex items-center gap-1.5">
            Important Medical & Prototype Disclaimer
          </h4>
          <p className="text-amber-900/90 leading-relaxed text-xs sm:text-sm">
            AI Health Analyzer is a college student prototype designed to provide educational and informational health insights. 
            It is <strong>not a medical diagnosis system</strong>, medical device, or replacement for a qualified healthcare professional. 
            Always consult a licensed medical provider regarding any health condition or lab results. In case of emergency, immediately call local emergency services.
          </p>
        </div>
      </div>
    </div>
  );
}
