import React, { useState, useEffect } from 'react';
import { 
  History as HistoryIcon, 
  Trash2, 
  Eye, 
  Calendar, 
  FileText, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { getAnalysisHistory, deleteAnalysisFromHistory, clearAllHistory } from '../utils/historyStorage';

export default function HistoryPage({ onSelectAnalysis, onStartNewAnalysis }) {
  const [historyItems, setHistoryItems] = useState([]);

  useEffect(() => {
    setHistoryItems(getAnalysisHistory());
  }, []);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const updated = deleteAnalysisFromHistory(id);
    setHistoryItems(updated);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all saved local analyses?')) {
      const updated = clearAllHistory();
      setHistoryItems(updated);
    }
  };

  if (historyItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center mx-auto shadow-xs">
          <HistoryIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Past Analyses Stored</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Analyses conducted on this device are saved automatically in your browser's private local storage. No analysis has been performed yet.
        </p>
        <div className="pt-2">
          <button
            onClick={onStartNewAnalysis}
            className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-md shadow-sky-600/25 transition-all inline-flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            <span>Start Your First Analysis</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <HistoryIcon className="w-7 h-7 text-sky-600" />
            <span>Health Analysis History</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Locally stored records ({historyItems.length}) saved in your browser session.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleClearAll}
            className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
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

      {/* History Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {historyItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectAnalysis(item.data)}
            className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            
            {/* Record Information */}
            <div className="space-y-2.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-base text-slate-900 group-hover:text-sky-700 transition-colors">
                  {item.name}
                </span>

                <div className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${item.badgeColor}`}>
                  {item.overallStatus}
                </div>

                <span className="text-xs text-slate-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Symptoms */}
              <div className="text-xs text-slate-600 line-clamp-1">
                <span className="font-semibold text-slate-700">Symptoms: </span>
                {item.symptoms}
              </div>

              {/* Lab Parameters & Document */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Report: <strong className="text-slate-700">{item.reportFileName}</strong>
                </span>

                <span className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-sky-500" />
                  Parameters analyzed: <strong className="text-slate-700">{item.parametersCount}</strong>
                </span>
              </div>

              {/* Short summary */}
              <p className="text-xs text-slate-500 line-clamp-2 italic pt-1">
                "{item.summary}"
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAnalysis(item.data);
                }}
                className="px-3.5 py-2 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </button>

              <button
                onClick={(e) => handleDelete(item.id, e)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Delete this record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
