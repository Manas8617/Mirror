import React, { useRef, useEffect } from 'react';
import { Eye, Terminal, Layers, ArrowRight, Zap, CheckCircle2, FileText, Table, Monitor } from 'lucide-react';

export default function ObservationFeed({ events, isObserving, onStartObservation }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [events]);

  const getEventIcon = (type, app) => {
    if (app === 'Excel') return <Table className="w-4 h-4 text-emerald-400" />;
    if (app === 'PDF Viewer') return <FileText className="w-4 h-4 text-red-400" />;
    if (type === 'FILE_RENAME') return <Layers className="w-4 h-4 text-cyan-400" />;
    return <Monitor className="w-4 h-4 text-blue-400" />;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-blue-950/80 text-blue-400 border border-blue-800/60">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase m-0">Live Observation</h2>
            <p className="text-xs text-slate-400">Controlled Event Stream Adapter</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isObserving && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 rounded-full animate-pulse">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              CAPTURING
            </span>
          )}
          <span className="text-xs font-mono text-slate-400 bg-slate-800/90 px-2 py-1 rounded-md border border-slate-700">
            {events.length} Events
          </span>
        </div>
      </div>

      {/* Macro vs Semantic Contrast Pill */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900 border-b border-slate-800/80 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-amber-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />
            Semantic vs Macro:
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Filters out blind coordinate clicks and discovers business intent
          </span>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50">
          INTENT ENGINE
        </span>
      </div>

      {/* Events List */}
      <div 
        ref={containerRef}
        className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[360px] max-h-[580px] bg-slate-950/30"
      >
        {events.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/60 flex items-center justify-center mb-3 text-slate-400 border border-slate-700/60">
              <Terminal className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-300 mb-1">No workflow events captured yet</p>
            <p className="text-xs text-slate-500 max-w-xs mb-4">
              Click Start Observation to watch the human operator process incoming invoices.
            </p>
            <button
              onClick={onStartObservation}
              disabled={isObserving}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 cursor-pointer transition"
            >
              Start Observing Workflow
            </button>
          </div>
        ) : (
          events.map((evt, idx) => (
            <div
              key={evt.id || idx}
              className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col gap-1.5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-slate-800 border border-slate-700/60">
                    {getEventIcon(evt.type, evt.app)}
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {evt.timeDisplay || '14:32:00'}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-300 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/80">
                    {evt.app}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider">
                  {evt.type}
                </span>
              </div>

              <div className="pl-6 text-xs text-slate-200 font-medium">
                Observed: {evt.details}
              </div>

              {evt.rawPayload && (
                <div className="mt-1 pl-6">
                  <div className="p-1.5 rounded bg-slate-950/80 border border-slate-800 font-mono text-[10px] text-slate-400 overflow-x-auto">
                    {JSON.stringify(evt.rawPayload)}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
