import React, { useState } from 'react';
import { ShieldCheck, History, CheckCircle2, Clock, FileText, ChevronDown, ChevronUp } from 'lucide-react';

export default function AuditPanel({ auditTrail, approvalState }) {
  const [activeTab, setActiveTab] = useState('ALL'); // ALL | OBSERVED | PROPOSED | APPROVED | EXECUTED | VERIFIED
  const [isExpanded, setIsExpanded] = useState(true);

  const stages = ['ALL', 'OBSERVED', 'PROPOSED', 'APPROVED', 'EXECUTED', 'VERIFIED'];

  const getStageBadgeColor = (stage) => {
    switch (stage) {
      case 'OBSERVED':
        return 'text-blue-400 bg-blue-950/60 border-blue-800/80';
      case 'PROPOSED':
        return 'text-indigo-400 bg-indigo-950/60 border-indigo-800/80';
      case 'APPROVED':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/80';
      case 'EXECUTED':
      case 'EXECUTION_STARTED':
        return 'text-purple-400 bg-purple-950/60 border-purple-800/80';
      case 'VERIFIED':
      case 'AUTOMATION_VERIFIED':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  const filteredTrail = auditTrail.filter(item => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'EXECUTED') return item.stage === 'EXECUTED' || item.stage === 'EXECUTION_STARTED';
    if (activeTab === 'VERIFIED') return item.stage === 'VERIFIED' || item.stage === 'AUTOMATION_VERIFIED';
    return item.stage === activeTab;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase m-0">Activity & Audit Panel</h3>
            <p className="text-xs text-slate-400">Cryptographically verifiable execution & human governance trail</p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-400 hover:text-white p-1 rounded transition cursor-pointer"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Stage Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800">
            {stages.map((stg) => (
              <button
                key={stg}
                onClick={() => setActiveTab(stg)}
                className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === stg
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {stg}
              </button>
            ))}
          </div>

          {/* Audit Events List */}
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {filteredTrail.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 font-mono">
                No audit entries recorded for stage {activeTab}
              </div>
            ) : (
              filteredTrail.map((entry, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getStageBadgeColor(
                        entry.stage
                      )}`}
                    >
                      {entry.stage}
                    </span>
                    <span className="text-slate-200 font-medium">
                      {entry.message}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400 text-[11px] font-mono shrink-0">
                    {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                      <span className="text-slate-500 hidden md:inline">
                        [{Object.keys(entry.metadata).join(', ')}]
                      </span>
                    )}
                    <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
