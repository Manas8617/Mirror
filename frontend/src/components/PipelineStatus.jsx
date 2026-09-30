import React from 'react';
import { Eye, Lightbulb, ShieldCheck, PlayCircle, CheckCircle2, ChevronRight } from 'lucide-react';

export default function PipelineStatus({ systemPhase }) {
  const phases = [
    {
      id: 'OBSERVE',
      label: 'OBSERVE',
      subtitle: 'Low-level UI monitoring',
      icon: Eye,
      isCompleted: ['PATTERN_DETECTED', 'PROPOSED', 'APPROVED', 'EXECUTING', 'VERIFIED'].includes(systemPhase),
      isActive: systemPhase === 'OBSERVING'
    },
    {
      id: 'PROPOSE',
      label: 'PROPOSE',
      subtitle: 'Semantic action synthesis',
      icon: Lightbulb,
      isCompleted: ['APPROVED', 'EXECUTING', 'VERIFIED'].includes(systemPhase),
      isActive: ['PATTERN_DETECTED', 'PROPOSED'].includes(systemPhase)
    },
    {
      id: 'APPROVE',
      label: 'HUMAN APPROVAL',
      subtitle: 'Mandatory human sign-off',
      icon: ShieldCheck,
      isCompleted: ['APPROVED', 'EXECUTING', 'VERIFIED'].includes(systemPhase),
      isActive: systemPhase === 'PROPOSED',
      isGate: true
    },
    {
      id: 'EXECUTE',
      label: 'EXECUTE',
      subtitle: 'Deterministic workflow run',
      icon: PlayCircle,
      isCompleted: systemPhase === 'VERIFIED',
      isActive: systemPhase === 'EXECUTING'
    },
    {
      id: 'VERIFY',
      label: 'VERIFY',
      subtitle: 'Postcondition proof checks',
      icon: CheckCircle2,
      isCompleted: systemPhase === 'VERIFIED',
      isActive: systemPhase === 'VERIFIED'
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3 px-2">
        <span className="flex items-center gap-1.5 uppercase font-bold tracking-wider text-slate-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          Core Product Loop: Deterministic Safety Pipeline
        </span>
        <span className="text-slate-500 hidden sm:inline">Zero Blind Execution Policy</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {phases.map((phase, idx) => {
          const Icon = phase.icon;
          let containerClasses = 'border-slate-800 bg-slate-950/60 text-slate-500';
          let iconClasses = 'text-slate-600';

          if (phase.isActive) {
            containerClasses = phase.isGate
              ? 'border-amber-500/80 bg-amber-950/30 text-amber-200 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10'
              : 'border-blue-500/80 bg-blue-950/30 text-blue-200 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/10';
            iconClasses = phase.isGate ? 'text-amber-400 animate-bounce' : 'text-blue-400 animate-pulse';
          } else if (phase.isCompleted) {
            containerClasses = 'border-emerald-600/50 bg-emerald-950/20 text-emerald-200';
            iconClasses = 'text-emerald-400';
          }

          return (
            <div
              key={phase.id}
              className={`relative flex flex-col p-3 rounded-xl border transition-all duration-300 ${containerClasses}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-1.5 rounded-lg bg-slate-900/80 ${iconClasses}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {phase.isCompleted ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/80 font-mono">
                    ✓ DONE
                  </span>
                ) : phase.isActive ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/80 font-mono animate-pulse">
                    CURRENT
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-600">
                    0{idx + 1}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <span className="text-xs font-bold tracking-tight">
                  {phase.label}
                </span>
                {phase.isGate && (
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-amber-500/20 text-amber-400 rounded border border-amber-500/30">
                    GATE
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {phase.subtitle}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
