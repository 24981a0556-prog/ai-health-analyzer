import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingAnalysisModal from './components/LoadingAnalysisModal';
import LandingPage from './pages/LandingPage';
import AnalysisPage from './pages/AnalysisPage';
import ResultDashboard from './pages/ResultDashboard';
import HistoryPage from './pages/HistoryPage';
import AboutPage from './pages/AboutPage';

import { buildHealthAnalysisPayload } from './services/healthAnalyzer';
import { generateHealthInsights } from './services/aiService';
import { saveAnalysisToHistory } from './utils/historyStorage';
import { SAMPLE_PATIENT_DATA, SAMPLE_REPORT_RAW_TEXT, SAMPLE_REPORT_FILENAME } from './data/sampleReport';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing'); // 'landing' | 'analyze' | 'results' | 'history' | 'about'
  const [prefilledDemo, setPrefilledDemo] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  // Realistic Loading Modal State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [loadingDetail, setLoadingDetail] = useState('');

  // Handle direct demo launch from Navbar or Hero
  const handleLaunchDemo = () => {
    setPrefilledDemo(true);
    setActiveTab('analyze');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Start Analysis from Hero
  const handleStartAnalysis = () => {
    setPrefilledDemo(false);
    setActiveTab('analyze');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Perform full analysis workflow with realistic step progression
  const handlePerformAnalysis = async (formData) => {
    setIsAnalyzing(true);
    setLoadingStep(1);
    setLoadingDetail('Validating document format and patient parameters...');

    try {
      // Step 1: Uploading report
      await new Promise(r => setTimeout(r, 450));
      setLoadingStep(2);
      setLoadingDetail('Reading text layers and running OCR parameter identification...');

      // Step 2: Reading report & OCR
      await new Promise(r => setTimeout(r, 600));
      setLoadingStep(3);
      setLoadingDetail('Extracting numerical results, biomarkers, and clinical units...');

      // Step 3: Extract parameters & assemble payload
      const initialPayload = buildHealthAnalysisPayload(formData);
      await new Promise(r => setTimeout(r, 500));
      
      setLoadingStep(4);
      setLoadingDetail('Comparing measured values against standard lab reference intervals...');
      await new Promise(r => setTimeout(r, 500));

      // Step 5: Generating AI/Rule-based health insights
      setLoadingStep(5);
      setLoadingDetail('Synthesizing plain-language findings, considerations, and next steps...');
      
      const insights = await generateHealthInsights(initialPayload);

      // Final complete payload
      const completedAnalysis = {
        ...initialPayload,
        id: `ANL-${Date.now().toString().slice(-6)}`,
        aiInsights: insights
      };

      setLoadingStep(6);
      setLoadingDetail('Analysis finalized. Rendering results dashboard...');
      await new Promise(r => setTimeout(r, 350));

      // Save to localStorage history
      saveAnalysisToHistory(completedAnalysis);

      setAnalysisData(completedAnalysis);
      setIsAnalyzing(false);
      setActiveTab('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error('Analysis error:', err);
      setIsAnalyzing(false);
      alert(`Analysis notice: ${err.message || 'An error occurred during analysis'}`);
    }
  };

  // Select historical analysis to view
  const handleSelectHistoryItem = (historyData) => {
    setAnalysisData(historyData);
    setActiveTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900">
      
      {/* Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLaunchDemo={handleLaunchDemo}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        {activeTab === 'landing' && (
          <LandingPage
            onStartAnalysis={handleStartAnalysis}
            onTryDemo={handleLaunchDemo}
            onViewHistory={() => setActiveTab('history')}
          />
        )}

        {activeTab === 'analyze' && (
          <AnalysisPage
            onStartAnalysisSubmit={handlePerformAnalysis}
            prefilledDemoData={prefilledDemo}
          />
        )}

        {activeTab === 'results' && (
          <ResultDashboard
            analysisData={analysisData}
            onStartNewAnalysis={handleStartAnalysis}
            onBackToEdit={() => setActiveTab('analyze')}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage
            onSelectAnalysis={handleSelectHistoryItem}
            onStartNewAnalysis={handleStartAnalysis}
          />
        )}

        {activeTab === 'about' && (
          <AboutPage />
        )}

      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Loading Modal */}
      {isAnalyzing && (
        <LoadingAnalysisModal
          currentStep={loadingStep}
          currentDetail={loadingDetail}
        />
      )}

    </div>
  );
}
