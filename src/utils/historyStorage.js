const STORAGE_KEY = 'ai_health_analyzer_history_v1';

export function getAnalysisHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read analysis history from localStorage:', err);
    return [];
  }
}

export function saveAnalysisToHistory(analysisRecord) {
  try {
    const existing = getAnalysisHistory();
    const newRecord = {
      id: analysisRecord.id || `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      date: new Date().toISOString(),
      name: analysisRecord.personalInfo?.name || 'Anonymous User',
      symptoms: analysisRecord.personalInfo?.symptoms || analysisRecord.symptomResults?.symptomsText || 'None reported',
      reportFileName: analysisRecord.reportFileName || 'None',
      parametersCount: analysisRecord.reportResults?.parameters?.length || 0,
      overallStatus: analysisRecord.overallStatus?.statusText || 'No Significant Finding',
      badgeColor: analysisRecord.overallStatus?.badgeColor || 'bg-slate-100 text-slate-700',
      summary: analysisRecord.aiInsights?.summary || 'Analysis completed.',
      data: analysisRecord
    };

    const updated = [newRecord, ...existing.filter(item => item.id !== newRecord.id)].slice(0, 50); // limit 50 items
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newRecord;
  } catch (err) {
    console.error('Failed to save analysis to localStorage:', err);
    return null;
  }
}

export function deleteAnalysisFromHistory(id) {
  try {
    const existing = getAnalysisHistory();
    const updated = existing.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete analysis from localStorage:', err);
    return [];
  }
}

export function clearAllHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (err) {
    console.error('Failed to clear history:', err);
    return [];
  }
}
