import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Filter
} from 'lucide-react';

export default function ParameterTable({ parameters = [], summary = {} }) {
  const [filter, setFilter] = useState('all'); // 'all', 'abnormal', 'normal'
  const [expandedRow, setExpandedRow] = useState(null);

  if (!parameters || parameters.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <h4 className="text-base font-semibold text-slate-700">No Parameters Detected</h4>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
          No structured laboratory test parameters were identified in the uploaded report text.
        </p>
      </div>
    );
  }

  const filteredParams = parameters.filter(param => {
    if (filter === 'abnormal') return param.status === 'Above Range' || param.status === 'Below Range';
    if (filter === 'normal') return param.status === 'Within Range';
    return true;
  });

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Within Range':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Within Range
          </span>
        );
      case 'Above Range':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
            Above Range
          </span>
        );
      case 'Below Range':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <ArrowDownRight className="w-3.5 h-3.5 text-amber-600" />
            Below Range
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            Unable to Determine
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Parameters</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {summary.total ?? parameters.length}
          </div>
          <p className="text-[11px] text-slate-600 mt-1">Identified from report</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm bg-gradient-to-b from-white to-emerald-50/20">
          <span className="text-xs font-medium text-emerald-700 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Within Range
          </span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {summary.within ?? parameters.filter(p => p.status === 'Within Range').length}
          </div>
          <p className="text-[11px] text-emerald-600/80 mt-1">Standard clinical levels</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm bg-gradient-to-b from-white to-rose-50/20">
          <span className="text-xs font-medium text-rose-700 uppercase tracking-wider flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
            Above Range
          </span>
          <div className="text-2xl font-bold text-rose-700 mt-1">
            {summary.above ?? parameters.filter(p => p.status === 'Above Range').length}
          </div>
          <p className="text-[11px] text-rose-600/80 mt-1">Higher than reference</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm bg-gradient-to-b from-white to-amber-50/20">
          <span className="text-xs font-medium text-amber-700 uppercase tracking-wider flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5 text-amber-600" />
            Below Range
          </span>
          <div className="text-2xl font-bold text-amber-700 mt-1">
            {summary.below ?? parameters.filter(p => p.status === 'Below Range').length}
          </div>
          <p className="text-[11px] text-amber-600/80 mt-1">Lower than reference</p>
        </div>

      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Filter view:</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'all'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({parameters.length})
          </button>
          <button
            onClick={() => setFilter('abnormal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'abnormal'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Outside Range ({(summary.above || 0) + (summary.below || 0)})
          </button>
          <button
            onClick={() => setFilter('normal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'normal'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Within Range ({summary.within || 0})
          </button>
        </div>
      </div>

      {/* Responsive Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Parameter</th>
                <th className="py-3.5 px-4">Result</th>
                <th className="py-3.5 px-4">Unit</th>
                <th className="py-3.5 px-4">Reference Range</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParams.map((param) => {
                const isExpanded = expandedRow === param.id;
                const isAbnormal = param.status === 'Above Range' || param.status === 'Below Range';

                return (
                  <React.Fragment key={param.id}>
                    <tr 
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        isAbnormal ? 'bg-amber-50/20' : ''
                      }`}
                      onClick={() => toggleRow(param.id)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{param.name}</div>
                        <div className="text-[11px] text-slate-600">{param.category}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-base font-bold ${
                          param.status === 'Above Range' ? 'text-rose-600' :
                          param.status === 'Below Range' ? 'text-amber-600' :
                          'text-slate-900'
                        }`}>
                          {param.value}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                        {param.unit}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-700">{param.referenceRange}</div>
                        {!param.isCustomRange && (
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            General reference
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(param.status)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRow(param.id);
                          }}
                          className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800 font-medium px-2 py-1 rounded-md hover:bg-sky-50 transition-colors"
                        >
                          <span>{isExpanded ? 'Hide' : 'Explain'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Explanation Row */}
                    {isExpanded && (
                      <tr className="bg-sky-50/50">
                        <td colSpan="6" className="p-4 border-y border-sky-100">
                          <div className="space-y-2 text-xs sm:text-sm">
                            <div className="flex items-center gap-2 text-sky-900 font-semibold">
                              <Info className="w-4 h-4 text-sky-600" />
                              <span>What does {param.name} mean?</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed pl-6">
                              {param.explanation}
                            </p>
                            <div className="pl-6 pt-1">
                              <span className="font-medium text-slate-800">Clinical Context: </span>
                              <span className="text-slate-600">{param.advice}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredParams.map((param) => {
            const isExpanded = expandedRow === param.id;
            const isAbnormal = param.status === 'Above Range' || param.status === 'Below Range';

            return (
              <div 
                key={param.id} 
                className={`p-4 space-y-3 ${isAbnormal ? 'bg-amber-50/30' : 'bg-white'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-semibold text-slate-900 text-sm">{param.name}</h5>
                    <span className="text-[11px] text-slate-600">{param.category}</span>
                  </div>
                  <div>
                    {getStatusBadge(param.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-600 block text-[11px]">Measured Result</span>
                    <span className={`text-base font-bold ${
                      param.status === 'Above Range' ? 'text-rose-600' :
                      param.status === 'Below Range' ? 'text-amber-600' :
                      'text-slate-900'
                    }`}>
                      {param.value} <span className="text-xs font-normal text-slate-500">{param.unit}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600 block text-[11px]">Reference Range</span>
                    <span className="font-medium text-slate-700">{param.referenceRange}</span>
                    {!param.isCustomRange && (
                      <span className="block text-[10px] text-slate-600">General reference</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => toggleRow(param.id)}
                  className="w-full text-center py-1.5 text-xs font-medium text-sky-700 bg-sky-50 rounded-lg hover:bg-sky-100 flex items-center justify-center gap-1 transition-colors"
                >
                  <span>{isExpanded ? 'Hide Explanation' : 'What does this mean?'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {isExpanded && (
                  <div className="p-3 bg-white rounded-lg border border-sky-100 text-xs space-y-2">
                    <p className="text-slate-600 leading-relaxed">
                      {param.explanation}
                    </p>
                    <p className="text-slate-700 pt-1 border-t border-slate-100">
                      <strong>Observation: </strong>{param.advice}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
