import React from 'react';
import { Sparkles, RefreshCw, Shield, Play, Activity } from 'lucide-react';

export default function Header({
  systemPhase,
  onStartObservation,
  onReset,
  isExecuting,
  isObserving
}) {
  const getBadge = () => {
    switch (systemPhase) {
      case 'READY':
        return { text: 'SYSTEM READY', color: 'bg-slate-800 text-slate-300 border-slate-700' };
      case 'OBSERVING':
        return { text: 'OBSERVING USER WORKFLOW', color: 'bg-blue-950 text-blue-400 border-blue-800 animate-pulse' };
      case 'PATTERN_DETECTED':
        return { text: 'PATTERN DETECTED', color: 'bg-indigo-950 text-indigo-400 border-indigo-800' };
      case 'PROPOSED':
        return { text: 'AWAITING APPROVAL', color: 'bg-amber-950 text-amber-400 border-amber-800' };
      case 'APPROVED':
        return { text: 'HUMAN APPROVED', color: 'bg-emerald-950 text-emerald-400 border-emerald-800' };
      case 'EXECUTING':
        return { text: 'EXECUTING WORKFLOW', color: 'bg-purple-950 text-purple-400 border-purple-800 animate-pulse' };
      case 'VERIFIED':
        return { text: 'AUTOMATION VERIFIED ✓', color: 'bg-emerald-950 text-emerald-300 border-emerald-700' };
      default:
        return { text: systemPhase, color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const badge = getBadge();

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-500/20">
            <Sparkles className="w-6 h-6" />
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-black tracking-tight text-white m-0">MIRROR</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-slate-800/80 text-cyan-400 border-cyan-800/60 font-mono">
                MVP v1.0
              </span>
            </div>
            <p className="text-xs font-medium text-slate-400 tracking-wide">
              Workflow Intelligence & Semantic Synthesis
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          <div className={`px-3 py-1 rounded-full text-xs font-mono font-medium border flex items-center gap-1.5 ${badge.color}`}>
            <span className="w-2 h-2 rounded-full bg-current"></span>
            {badge.text}
          </div>

          {systemPhase === 'READY' && (
            <button
              onClick={onStartObservation}
              disabled={isObserving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Start Observation Feed
            </button>
          )}

          <button
            onClick={onReset}
            title="Reset demonstration state"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isExecuting ? 'animate-spin' : ''}`} />
            RESET DEMO
          </button>
        </div>
      </div>
    </header>
  );
}
