import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Upload, 
  FileText, 
  Trash2, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Heart, 
  Thermometer, 
  Gauge, 
  ShieldAlert,
  ArrowRight,
  Info,
  FileCheck
} from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import { calculateBmi } from '../services/healthAnalyzer';
import { extractReportText } from '../services/ocrService';
import { SAMPLE_PATIENT_DATA, SAMPLE_REPORT_RAW_TEXT, SAMPLE_REPORT_FILENAME } from '../data/sampleReport';

export default function AnalysisPage({ onStartAnalysisSubmit, prefilledDemoData = false }) {
  // Form State
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    age: '',
    gender: 'Male',
    height: '',
    weight: '',
    existingConditions: '',
    currentMedications: ''
  });

  const [symptoms, setSymptoms] = useState('');
  const [symptomDuration, setSymptomDuration] = useState('');
  const [symptomSeverity, setSymptomSeverity] = useState('Mild');

  const [vitals, setVitals] = useState({
    systolicBp: '',
    diastolicBp: '',
    heartRate: '',
    temperature: ''
  });

  // Report File State
  const [reportFile, setReportFile] = useState(null);
  const [reportText, setReportText] = useState('');
  const [isExtractingFile, setIsExtractingFile] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState('');
  const [isDemoReport, setIsDemoReport] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Validation & Urgent Alerts
  const [formErrors, setFormErrors] = useState({});
  const [emergencyAlert, setEmergencyAlert] = useState(null);
  const fileInputRef = useRef(null);

  // Auto-calculated BMI
  const bmiData = calculateBmi(personalInfo.height, personalInfo.weight);

  // Check emergency keywords in real time
  useEffect(() => {
    const text = symptoms.toLowerCase();
    if (text.includes('chest pain') || text.includes('severe chest pain')) {
      setEmergencyAlert('Urgent Flag: Chest pain or pressure detected. Please consult emergency medical services immediately if sudden, severe, or radiating.');
    } else if (text.includes('difficulty breathing') || text.includes('shortness of breath')) {
      setEmergencyAlert('Urgent Flag: Breathing difficulty detected. Immediate clinical assessment is recommended for acute shortness of breath.');
    } else if (text.includes('fainting') || text.includes('passed out') || text.includes('slurred speech')) {
      setEmergencyAlert('Urgent Flag: Acute neurological or syncopal symptom reported. Seek prompt medical care.');
    } else {
      setEmergencyAlert(null);
    }
  }, [symptoms]);

  // Load demo data if requested
  const loadDemoData = () => {
    setPersonalInfo({
      name: SAMPLE_PATIENT_DATA.name,
      age: SAMPLE_PATIENT_DATA.age,
      gender: SAMPLE_PATIENT_DATA.gender,
      height: SAMPLE_PATIENT_DATA.height,
      weight: SAMPLE_PATIENT_DATA.weight,
      existingConditions: SAMPLE_PATIENT_DATA.existingConditions,
      currentMedications: SAMPLE_PATIENT_DATA.currentMedications
    });
    setSymptoms(SAMPLE_PATIENT_DATA.symptoms);
    setSymptomDuration(SAMPLE_PATIENT_DATA.symptomDuration);
    setSymptomSeverity(SAMPLE_PATIENT_DATA.symptomSeverity);
    setVitals({
      systolicBp: SAMPLE_PATIENT_DATA.systolicBp,
      diastolicBp: SAMPLE_PATIENT_DATA.diastolicBp,
      heartRate: SAMPLE_PATIENT_DATA.heartRate,
      temperature: SAMPLE_PATIENT_DATA.temperature
    });
    setReportFile({
      name: SAMPLE_REPORT_FILENAME,
      size: 48200,
      type: 'application/pdf'
    });
    setReportText(SAMPLE_REPORT_RAW_TEXT);
    setIsDemoReport(true);
    setFormErrors({});
  };

  // Trigger demo load if passed via prop
  useEffect(() => {
    if (prefilledDemoData) {
      loadDemoData();
    }
  }, [prefilledDemoData]);

  // Handle file selection
  const handleFileDrop = async (file) => {
    if (!file) return;

    // Validate size (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      setFormErrors(prev => ({ ...prev, file: 'File is too large. Maximum allowed size is 10 MB.' }));
      return;
    }

    // Validate type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'text/plain'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (!validTypes.includes(file.type) && !['pdf', 'jpg', 'jpeg', 'png', 'txt'].includes(ext)) {
      setFormErrors(prev => ({ ...prev, file: 'Unsupported file type. Please upload a PDF, JPG, JPEG, or PNG.' }));
      return;
    }

    setFormErrors(prev => {
      const copy = { ...prev };
      delete copy.file;
      return copy;
    });

    setReportFile(file);
    setIsDemoReport(false);
    setIsExtractingFile(true);
    setExtractionProgress('Initiating document extraction...');

    try {
      if (ext === 'txt') {
        const text = await file.text();
        setReportText(text);
        setIsExtractingFile(false);
      } else {
        const text = await extractReportText(file, (prog) => {
          setExtractionProgress(`${prog.step} (${prog.percent}%)`);
        });
        setReportText(text);
        setIsExtractingFile(false);
      }
    } catch (err) {
      console.error('File parsing error:', err);
      setIsExtractingFile(false);
      setFormErrors(prev => ({
        ...prev,
        file: `Text extraction note: ${err.message || 'Could not parse document'}. You may still paste or edit report text below.`
      }));
    }
  };

  const removeFile = () => {
    setReportFile(null);
    setReportText('');
    setIsDemoReport(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Form Validation & Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!personalInfo.name.trim()) errors.name = 'Please provide a name or identifier';
    if (!personalInfo.age || isNaN(personalInfo.age) || personalInfo.age < 1 || personalInfo.age > 120) {
      errors.age = 'Please enter a valid age (1 - 120)';
    }
    if (!personalInfo.height || isNaN(personalInfo.height) || personalInfo.height < 50 || personalInfo.height > 250) {
      errors.height = 'Please enter a valid height in cm (50 - 250)';
    }
    if (!personalInfo.weight || isNaN(personalInfo.weight) || personalInfo.weight < 15 || personalInfo.weight > 300) {
      errors.weight = 'Please enter a valid weight in kg (15 - 300)';
    }

    // Must have either symptoms or report text
    if (!symptoms.trim() && !reportText.trim()) {
      errors.general = 'Please describe symptoms OR upload/provide a medical report to perform analysis.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    // Call submit handler
    onStartAnalysisSubmit({
      personalInfo,
      symptoms,
      symptomDuration,
      symptomSeverity,
      vitals,
      reportText,
      reportFileName: reportFile ? reportFile.name : null
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Header & Demo Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Health & Medical Report Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete the form sections below to generate AI-assisted informational insights.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDemoData}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 rounded-xl transition-colors shadow-sm self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>Populate Faculty Demo Data</span>
        </button>
      </div>

      {/* Emergency Banner if triggered */}
      {emergencyAlert && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 flex items-start gap-3 animate-in fade-in">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm space-y-1">
            <h5 className="font-bold text-rose-950">Safety Notice: High-Priority Symptom</h5>
            <p className="leading-relaxed">{emergencyAlert}</p>
            <p className="text-[11px] text-rose-700 font-semibold">
              This application is not an emergency medical service. Please seek urgent care.
            </p>
          </div>
        </div>
      )}

      {/* General Validation Error */}
      {formErrors.general && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{formErrors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: Personal Information */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Personal Information</h2>
              <p className="text-xs text-slate-500">Basic physical attributes used for metric calculation.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Name or Alias <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Demo User"
                value={personalInfo.name}
                onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  formErrors.name ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-sky-500 focus:ring-sky-100'
                }`}
              />
              {formErrors.name && <p className="text-[11px] text-rose-500 mt-1">{formErrors.name}</p>}
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Age (years) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="120"
                placeholder="e.g. 21"
                value={personalInfo.age}
                onChange={(e) => setPersonalInfo({ ...personalInfo, age: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  formErrors.age ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-sky-500 focus:ring-sky-100'
                }`}
              />
              {formErrors.age && <p className="text-[11px] text-rose-500 mt-1">{formErrors.age}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Biological Sex <span className="text-rose-500">*</span>
              </label>
              <select
                value={personalInfo.gender}
                onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other / Not specified</option>
              </select>
              <span className="text-[10px] text-slate-600 block mt-0.5">Used for sex-adjusted lab reference ranges</span>
            </div>

            {/* Height */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Height (cm) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 175"
                value={personalInfo.height}
                onChange={(e) => setPersonalInfo({ ...personalInfo, height: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  formErrors.height ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-sky-500 focus:ring-sky-100'
                }`}
              />
              {formErrors.height && <p className="text-[11px] text-rose-500 mt-1">{formErrors.height}</p>}
            </div>

            {/* Weight */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Weight (kg) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 72"
                value={personalInfo.weight}
                onChange={(e) => setPersonalInfo({ ...personalInfo, weight: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  formErrors.weight ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-sky-500 focus:ring-sky-100'
                }`}
              />
              {formErrors.weight && <p className="text-[11px] text-rose-500 mt-1">{formErrors.weight}</p>}
            </div>

            {/* BMI Preview Card */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col justify-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Calculated BMI</span>
              {bmiData ? (
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold text-slate-900">{bmiData.value}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${bmiData.categoryColor}`}>
                    {bmiData.category}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-slate-600 mt-1">Enter height & weight</span>
              )}
            </div>

          </div>

          {/* Optional Conditions & Medications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Existing Health Conditions <span className="text-slate-600">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Hypertension, Asthma, None"
                value={personalInfo.existingConditions}
                onChange={(e) => setPersonalInfo({ ...personalInfo, existingConditions: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Current Medications <span className="text-slate-600">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Multivitamins, Antihistamines, None"
                value={personalInfo.currentMedications}
                onChange={(e) => setPersonalInfo({ ...personalInfo, currentMedications: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: Symptoms */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Symptoms & Clinical Context</h2>
              <p className="text-xs text-slate-500">Describe what you are currently feeling.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Describe Symptoms
              </label>
              <textarea
                rows={3}
                placeholder="Describe your symptoms, when they started, and anything that makes them better or worse. (e.g. Occasional headache and mild fatigue for the last 3 days)"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3 days, 1 week, 2 hours"
                  value={symptomDuration}
                  onChange={(e) => setSymptomDuration(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Perceived Severity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Mild', 'Moderate', 'Severe'].map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSymptomSeverity(sev)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                        symptomSeverity === sev
                          ? sev === 'Severe'
                            ? 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-500/20'
                            : sev === 'Moderate'
                            ? 'bg-amber-50 text-amber-700 border-amber-300 ring-2 ring-amber-500/20'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-500/20'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Additional Health Information (Vitals) */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Vital Signs <span className="text-xs font-normal text-slate-600">(Optional)</span>
              </h2>
              <p className="text-xs text-slate-500">If you have recent clinical measurements available.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-slate-400" />
                Systolic BP (mmHg)
              </label>
              <input
                type="number"
                placeholder="e.g. 118"
                value={vitals.systolicBp}
                onChange={(e) => setVitals({ ...vitals, systolicBp: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-slate-400" />
                Diastolic BP (mmHg)
              </label>
              <input
                type="number"
                placeholder="e.g. 78"
                value={vitals.diastolicBp}
                onChange={(e) => setVitals({ ...vitals, diastolicBp: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                Heart Rate (bpm)
              </label>
              <input
                type="number"
                placeholder="e.g. 72"
                value={vitals.heartRate}
                onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                Temperature (°C)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 36.8"
                value={vitals.temperature}
                onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </section>

        {/* SECTION 4: Medical Report Upload (CORE) */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Medical Report Upload <span className="text-xs text-sky-600 font-semibold">(Core Feature)</span>
                </h2>
                <p className="text-xs text-slate-500">Supports PDF, JPG, JPEG, PNG (max 10 MB).</p>
              </div>
            </div>

            {/* "Try Sample Report" Button */}
            <button
              type="button"
              onClick={() => {
                setReportFile({
                  name: SAMPLE_REPORT_FILENAME,
                  size: 48200,
                  type: 'application/pdf'
                });
                setReportText(SAMPLE_REPORT_RAW_TEXT);
                setIsDemoReport(true);
                setFormErrors(prev => {
                  const copy = { ...prev };
                  delete copy.file;
                  return copy;
                });
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <FileCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Try Sample Report</span>
            </button>
          </div>

          {/* Upload Dropzone */}
          {!reportFile ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileDrop(e.dataTransfer.files[0]);
                }
              }}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                isDragOver ? 'border-sky-500 bg-sky-50/50' : 'border-slate-300 hover:border-sky-400 bg-slate-50/50'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileDrop(e.target.files[0]);
                  }
                }}
              />

              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-sky-600 mx-auto mb-3">
                <Upload className="w-6 h-6" />
              </div>

              <h4 className="text-sm font-semibold text-slate-800">
                Drop your medical report here, or <span className="text-sky-600 underline">browse</span>
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                PDF, JPG, PNG up to 10 MB. Text and OCR will be processed client-side.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Info Bar */}
              <div className="p-4 bg-sky-50/60 rounded-xl border border-sky-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {reportFile.name}
                      </span>
                      {isDemoReport && (
                        <span className="text-[10px] font-semibold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200 shrink-0">
                          Demo Report — Not a real patient record
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">
                      {(reportFile.size / 1024).toFixed(1)} KB • {reportFile.type || 'Document'} • Ready for analysis
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                  title="Remove report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Extraction Progress Indicator */}
              {isExtractingFile && (
                <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-800 flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin shrink-0" />
                  <span>{extractionProgress}</span>
                </div>
              )}

              {/* Extracted Text Inspector / Editor */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <span>Extracted Report Text Content</span>
                    <span className="text-[11px] text-slate-600 font-normal">
                      ({reportText.length} characters parsed)
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setReportText(SAMPLE_REPORT_RAW_TEXT)}
                    className="text-[11px] text-sky-600 hover:underline"
                  >
                    Reset to Demo Report Text
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Extracted laboratory text will appear here. You can also paste raw report values manually."
                  className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          )}

          {formErrors.file && (
            <p className="text-xs text-rose-500 mt-2">{formErrors.file}</p>
          )}
        </section>

        {/* Submit Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3.5">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-sm shadow-md shadow-sky-600/30 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Analyze My Health</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </form>
    </div>
  );
}
