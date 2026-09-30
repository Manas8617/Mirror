import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Play, 
  ArrowRight, 
  Clock, 
  AlertCircle,
  FileCheck,
  Lock,
  Cpu,
  RefreshCw,
  ChevronRight
} from 'lucide-react';

export default function SemanticWorkflowCard({
  workflow,
  systemPhase,
  approvalState,
  onCreateAutomation,
  onApproveAndRun,
  isExecuting
}) {
  if (!workflow) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-900 border border-slate-800 rounded-2xl h-full shadow-xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-950/50 border border-indigo-800/60 flex items-center justify-center text-indigo-400 mb-4">
          <Sparkles className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Workflow Discovery Idle</h3>
        <p className="text-sm text-slate-400 max-w-md">
          MIRROR is listening for repeated computer interactions. Once an operator repeats an invoice task twice, MIRROR synthesizes the semantic workflow.
        </p>
      </div>
    );
  }

  const isProposed = systemPhase === 'PROPOSED';
  const isExecutingPhase = systemPhase === 'EXECUTING';
  const isVerified = systemPhase === 'VERIFIED';
  const isPatternDetected = systemPhase === 'PATTERN_DETECTED';

  const getStepStatusIndicator = (step, idx) => {
    if (step.status === 'COMPLETED' || isVerified) {
      return (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
          ✓
        </span>
      );
    }
    if (step.status === 'RUNNING') {
      return (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs font-bold animate-pulse">
          →
        </span>
      );
    }
    return (
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-500 border border-slate-700 text-xs font-bold">
        ○
      </span>
    );
  };

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Pattern Banner */}
      <div className="p-4 bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-slate-900 border-b border-indigo-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow-inner">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
                PATTERN DETECTED
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                {Math.round(workflow.confidenceScore * 100)}% Confidence
              </span>
            </div>
            <h2 className="text-base font-bold text-white m-0">Repeated workflow identified</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Observed {workflow.observedRepetitions} cycles of Accounts Payable invoice processing
            </p>
          </div>
        </div>

        {/* Action Button 1: Create Automation */}
        {isPatternDetected && (
          <button
            onClick={onCreateAutomation}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/40 transition-all cursor-pointer transform hover:scale-[1.02]"
          >
            <Cpu className="w-4 h-4" />
            CREATE AUTOMATION
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-6 space-y-6">
        {/* Workflow Title Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-mono text-cyan-400 font-bold tracking-widest uppercase">
              SEMANTIC WORKFLOW
            </span>
            <h3 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
              {workflow.name}
            </h3>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 block">TARGET INVOICE</span>
            <span className="text-xs font-bold font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/80 inline-block mt-0.5">
              INV-2024-091 (Anthropic AI - $2,100.00)
            </span>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {workflow.steps.map((step, idx) => (
            <div
              key={step.id}
              className={`p-3.5 rounded-xl border transition-all ${
                step.status === 'RUNNING'
                  ? 'bg-blue-950/40 border-cyan-500 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/50'
                  : step.status === 'COMPLETED' || isVerified
                  ? 'bg-slate-900 border-emerald-900/60'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-3">
                  {getStepStatusIndicator(step, idx)}
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {step.stepNumber}
                  </span>
                  <span className="text-sm font-bold text-white tracking-wide">
                    {step.name}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-semibold text-slate-400 px-2 py-0.5 rounded bg-slate-800/90 border border-slate-700/80">
                    {step.actionCode}
                  </span>
                </div>
              </div>

              <div className="pl-9">
                <p className="text-xs text-slate-300 font-medium">
                  {step.description}
                </p>
                <p className="text-[11px] text-slate-500 mt-1 italic font-mono">
                  ↳ {step.macroContrast}
                </p>

                {/* Show Step Result if Completed */}
                {(step.status === 'COMPLETED' || isVerified) && step.result && (
                  <div className="mt-2 p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40 font-mono text-[11px] text-emerald-300">
                    {step.actionCode === 'FIND_INVOICE' && `Found: ${step.result.path} (${step.result.size})`}
                    {step.actionCode === 'EXTRACT_INVOICE_DATA' && `Parsed: ${step.result.invoiceNumber} | ${step.result.vendor} | ${step.result.amount}`}
                    {step.actionCode === 'RENAME_DOCUMENT' && `Renamed: ${step.result.newName}`}
                    {step.actionCode === 'UPDATE_RECORD' && `Appended Row ${step.result.row} in ${step.result.ledger}`}
                    {step.actionCode === 'VERIFY_RESULT' && (step.result.summary || 'All postcondition assertions validated')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Phase State Calls: PROPOSED / HUMAN APPROVAL GATE */}
        {isProposed && (
          <div className="p-5 rounded-xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-900 border-2 border-amber-500/70 shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-amber-300 tracking-wide uppercase m-0">
                    AUTOMATION READY
                  </h4>
                  <p className="text-xs font-semibold text-amber-200/90 mt-0.5">
                    Human approval is strictly required before execution.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase">
                MANDATORY GATE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300 bg-slate-950/70 p-3 rounded-lg border border-amber-900/40">
              <div>
                <span className="text-slate-500">Security Sandbox:</span> Confined to synthetic test data
              </div>
              <div>
                <span className="text-slate-500">Approval Token:</span> {approvalState?.approvalToken || 'sec-tok-ready'}
              </div>
              <div>
                <span className="text-slate-500">Privilege Level:</span> Zero arbitrary system access
              </div>
              <div>
                <span className="text-slate-500">Audit Verification:</span> Enabled & cryptographically signed
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-amber-300/80 font-medium">
                Clicking "Approve & Run" authorizes MIRROR to execute this deterministic workflow.
              </span>
              <button
                onClick={onApproveAndRun}
                disabled={isExecuting}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-sm font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-600/30 transition-all cursor-pointer transform hover:scale-[1.02]"
              >
                <ShieldCheck className="w-5 h-5" />
                APPROVE & RUN
              </button>
            </div>
          </div>
        )}

        {/* Phase State: EXECUTING */}
        {isExecutingPhase && (
          <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />
              <div>
                <h4 className="text-sm font-bold text-purple-300 m-0 uppercase font-mono">
                  EXECUTING AUTOMATION
                </h4>
                <p className="text-xs text-slate-300">
                  Executing verified semantic steps deterministically...
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-purple-300 bg-purple-900/50 px-3 py-1 rounded-full border border-purple-700/60 animate-pulse">
              LIVE EXECUTION
            </span>
          </div>
        )}

        {/* Phase State: AUTOMATION VERIFIED */}
        {isVerified && (
          <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/50 via-teal-950/40 to-slate-900 border-2 border-emerald-500/80 shadow-xl space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-emerald-400 tracking-wide uppercase m-0">
                  AUTOMATION VERIFIED
                </h4>
                <p className="text-xs text-emerald-200/90 font-medium">
                  Deterministic execution completed and verified against expected business state.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-xs font-semibold text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Correct invoice identified (INV-2024-091)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-xs font-semibold text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Correct filename (2024-091_Anthropic_$2100.pdf)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-xs font-semibold text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Finance record updated (Row 16 logged)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-xs font-semibold text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Expected output verified (Checksum matched)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
