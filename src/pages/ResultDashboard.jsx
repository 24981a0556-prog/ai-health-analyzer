import React, { useState } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowLeft, 
  Printer, 
  Bookmark, 
  HelpCircle, 
  Heart, 
  Thermometer, 
  Gauge, 
  Scale, 
  Sparkles, 
  Lightbulb, 
  Stethoscope, 
  Calendar, 
  User, 
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import ParameterTable from '../components/ParameterTable';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

export default function ResultDashboard({ analysisData, onStartNewAnalysis, onBackToEdit }) {
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!analysisData) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">No analysis results to display.</p>
        <button
          onClick={onStartNewAnalysis}
          className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg text-sm"
        >
          Start Analysis
        </button>
      </div>
    );
  }

  const {
    personalInfo,
    bmi,
    vitals,
    vitalsEvaluations,
    symptomResults,
    reportResults,
    reportFileName,
    overallStatus,
    aiInsights
  } = analysisData;

  const isUrgent = symptomResults && symptomResults.isUrgent;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8 print:py-2">
      
      {/* Top Navigation & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 print:hidden">
        <button
          onClick={onBackToEdit}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Edit Inputs</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>
          
          <button
            onClick={onStartNewAnalysis}
            className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Emergency Alert Banner if Urgent Flags Detected */}
      {isUrgent && (
        <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-2 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5 text-rose-700 font-bold text-base">
            <ShieldAlert className="w-6 h-6 shrink-0" />
            <h4>High-Priority Medical Safety Flag</h4>
          </div>
          <p className="text-xs sm:text-sm text-rose-900 leading-relaxed">
            The symptom record mentions <strong>{symptomResults.urgencyReason || 'potential acute discomfort'}</strong>. 
            If symptoms are sudden, severe, accompanied by chest pressure, acute breathlessness, or neurological impairment, 
            seek urgent medical evaluation immediately.
          </p>
          <div className="p-2.5 bg-rose-100/70 rounded-lg text-xs font-semibold text-rose-800">
            This prototype application is NOT an emergency medical service or clinical diagnostic tool.
          </div>
        </div>
      )}

      {/* Header Card: Overall Informational Status */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{new Date(analysisData.timestamp || Date.now()).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
              <span>•</span>
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{personalInfo?.name || 'User'}, {personalInfo?.age} y/o ({personalInfo?.gender})</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Your Health Analysis
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {aiInsights?.summary || 'Analysis computed from physical metrics, reported symptoms, and laboratory data.'}
            </p>
          </div>

          {/* Overall Informational Status Badge */}
          <div className="shrink-0 p-5 rounded-2xl border bg-slate-50/70 flex flex-col items-center md:items-end justify-center text-center md:text-right gap-1.5 min-w-[240px]">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Informational Status
            </span>
            <div className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold border inline-flex items-center gap-1.5 shadow-sm ${overallStatus?.badgeColor || 'bg-slate-100 text-slate-700'}`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{overallStatus?.statusText || 'Informational Review'}</span>
            </div>
            <p className="text-[11px] text-slate-600 max-w-[200px] mt-0.5">
              Based solely on provided data. Not a clinical diagnosis.
            </p>
          </div>

        </div>

        {/* Source badge (AI Assisted vs Local Clinical Rule Engine) */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 font-medium border border-sky-100 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-600" />
              <span>Engine: {aiInsights?.source || 'Local Clinical Rules'}</span>
            </span>
            {aiInsights?.isFallback && (
              <span className="text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                Guaranteed offline fallback active
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-600">
            Demo Reference ID: {analysisData.id || 'DEMO-HEALTH-01'}
          </span>
        </div>
      </section>

      {/* SECTION: Health Metrics (BMI & Vitals) */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-sky-600" />
          <span>Health Metrics & Physical Baseline</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* BMI Card */}
          {bmi && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Scale className="w-4 h-4 text-sky-500" />
                  Body Mass Index
                </span>
                <div className="text-2xl font-bold text-slate-900 mt-2">
                  {bmi.value} <span className="text-xs font-normal text-slate-500">kg/m²</span>
                </div>
                <div className="mt-2">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${bmi.categoryColor}`}>
                    {bmi.category}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-3 border-t border-slate-100 pt-2">
                Standard range: 18.5 – 24.9
              </p>
            </div>
          )}

          {/* Blood Pressure Card */}
          {vitals?.systolicBp && vitals?.diastolicBp && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Gauge className="w-4 h-4 text-indigo-500" />
                  Blood Pressure
                </span>
                <div className="text-2xl font-bold text-slate-900 mt-2">
                  {vitals.systolicBp}/{vitals.diastolicBp} <span className="text-xs font-normal text-slate-500">mmHg</span>
                </div>
                <div className="mt-2">
                  <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                    Resting BP
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-3 border-t border-slate-100 pt-2">
                Standard optimal: &lt; 120/80 mmHg
              </p>
            </div>
          )}

          {/* Heart Rate Card */}
          {vitals?.heartRate && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Heart className="w-4 h-4 text-rose-500" />
                  Heart Rate
                </span>
                <div className="text-2xl font-bold text-slate-900 mt-2">
                  {vitals.heartRate} <span className="text-xs font-normal text-slate-500">bpm</span>
                </div>
                <div className="mt-2">
                  <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                    Pulse Rate
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-3 border-t border-slate-100 pt-2">
                Standard resting: 60 – 100 bpm
              </p>
            </div>
          )}

          {/* Temperature Card */}
          {vitals?.temperature && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Thermometer className="w-4 h-4 text-amber-500" />
                  Body Temperature
                </span>
                <div className="text-2xl font-bold text-slate-900 mt-2">
                  {vitals.temperature} <span className="text-xs font-normal text-slate-500">°C</span>
                </div>
                <div className="mt-2">
                  <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                    Tympanic / Oral
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-3 border-t border-slate-100 pt-2">
                Standard baseline: 36.1 – 37.2 °C
              </p>
            </div>
          )}

        </div>
      </section>

      {/* SECTION: Symptom Analysis */}
      {symptomResults && symptomResults.hasSymptoms && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-600" />
              <span>Symptom Evaluation</span>
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-700">Duration:</span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-800">
                {symptomResults.duration || 'Not specified'}
              </span>
              <span className="font-semibold text-slate-700 ml-2">Severity:</span>
              <span className={`px-2.5 py-1 rounded-md font-semibold ${
                symptomResults.severity === 'Severe' ? 'bg-rose-100 text-rose-800' :
                symptomResults.severity === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                'bg-emerald-100 text-emerald-800'
              }`}>
                {symptomResults.severity}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700">
            <strong>Reported Statement: </strong>
            <span className="italic">"{symptomResults.symptomsText}"</span>
          </div>

          <div className="space-y-3">
            {symptomResults.findings.map((f, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-sky-50/30 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-sky-600 mt-2 shrink-0" />
                <div className="text-xs sm:text-sm space-y-1">
                  <h4 className="font-semibold text-slate-900">{f.category}</h4>
                  <p className="text-slate-600 leading-relaxed">{f.interpretation}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-600">
            Informational triage note: {symptomResults.recommendation}
          </p>
        </section>
      )}

      {/* SECTION: Medical Report Analysis (Header & Table) */}
      {reportResults && reportResults.parameters.length > 0 && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-sky-600" />
                <span>Medical Report Analysis</span>
              </h2>
              <p className="text-xs text-slate-500">
                Source Document: <span className="font-semibold text-slate-700">{reportFileName || 'Uploaded Medical Report'}</span>
              </p>
            </div>
          </div>

          <ParameterTable 
            parameters={reportResults.parameters} 
            summary={reportResults.summary} 
          />
        </section>
      )}

      {/* SECTION: Important Findings & Clinical Context */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <span>Important Findings</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiInsights?.findings?.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                <span className="text-[10px] uppercase font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {item.category}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: Possible Reasons (General Possibilities, Non-Diagnostic) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-500" />
          <span>Possible Considerations & Mechanisms</span>
        </h2>
        <p className="text-xs text-slate-500">
          The following possibilities represent general physiological considerations and are explicitly not medical diagnoses.
        </p>

        <ul className="space-y-2.5">
          {aiInsights?.possibleReasons?.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
              <span className="text-indigo-600 font-bold shrink-0 mt-0.5">•</span>
              <span className="leading-relaxed">{reason}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* SECTION: Suggested Next Steps */}
      <section className="bg-gradient-to-br from-sky-50 via-teal-50/50 to-white rounded-3xl p-6 sm:p-8 border border-sky-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-sky-950 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-sky-600" />
          <span>Suggested Next Steps</span>
        </h2>
        <p className="text-xs text-slate-600">
          Actionable informational guidance to discuss with your healthcare professional.
        </p>

        <div className="space-y-2.5">
          {aiInsights?.nextSteps?.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-sky-100 shadow-xs">
              <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Medical Disclaimer Alert */}
      <MedicalDisclaimer />

      {/* Bottom Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 print:hidden">
        <button
          onClick={onBackToEdit}
          className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          ← Edit Information
        </button>

        <button
          onClick={onStartNewAnalysis}
          className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
        >
          <span>Start Another Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
