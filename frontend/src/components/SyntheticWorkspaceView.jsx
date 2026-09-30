import React from 'react';
import { Folder, Table, FileText, CheckCircle2, ArrowRight, HardDrive } from 'lucide-react';

export default function SyntheticWorkspaceView({ syntheticData, systemPhase }) {
  const { inbox = [], processedFiles = [], spreadsheetLedger = [] } = syntheticData || {};

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase m-0">
              Synthetic Workspace & Ledger State
            </h3>
            <p className="text-xs text-slate-400">
              Live inspection of sandboxed documents and spreadsheet rows
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60 font-semibold">
          SANDBOXED DATA
        </span>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Document File System */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300 font-bold">
            <span className="flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-amber-400" />
              C:/SyntheticWorkspace/Invoices/
            </span>
            <span className="text-slate-500">{processedFiles.length + inbox.length} Files</span>
          </div>

          <div className="space-y-1.5 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs">
            {/* Pending file */}
            {inbox.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-900/90 border border-slate-700/60"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-cyan-300 font-medium">{file.filename}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {file.status}
                </span>
              </div>
            ))}

            {/* Processed / Renamed files */}
            {processedFiles.map((file, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-2 rounded-lg border ${
                  file.processedBy.includes('MIRROR')
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className={`w-4 h-4 ${file.processedBy.includes('MIRROR') ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <div>
                    <span className="font-mono font-medium block">{file.currentName}</span>
                    <span className="text-[10px] text-slate-500">Orig: {file.original}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      file.processedBy.includes('MIRROR')
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {file.processedBy}
                  </span>
                  <span className="block text-[10px] text-slate-500 font-mono mt-0.5">{file.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Spreadsheet Ledger */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300 font-bold">
            <span className="flex items-center gap-1.5">
              <Table className="w-4 h-4 text-emerald-400" />
              Finance_Ledger_Q3.xlsx [Payables]
            </span>
            <span className="text-slate-500">{spreadsheetLedger.length} Records</span>
          </div>

          <div className="overflow-x-auto bg-slate-950/80 p-2 rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="pb-1.5 pl-2">Row</th>
                  <th className="pb-1.5">Invoice #</th>
                  <th className="pb-1.5">Vendor</th>
                  <th className="pb-1.5">Amount</th>
                  <th className="pb-1.5 pr-2">Origin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {spreadsheetLedger.map((row) => {
                  const isMirrorCreated = row.source.includes('MIRROR');
                  return (
                    <tr
                      key={row.row}
                      className={
                        isMirrorCreated
                          ? 'bg-emerald-950/40 text-emerald-200 font-bold animate-pulse'
                          : 'text-slate-300'
                      }
                    >
                      <td className="py-2 pl-2 text-slate-500">{row.row}</td>
                      <td className="py-2 text-cyan-300">{row.invoiceNumber}</td>
                      <td className="py-2">{row.vendor}</td>
                      <td className="py-2 text-emerald-400">{row.amount}</td>
                      <td className="py-2 pr-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] border ${
                            isMirrorCreated
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {isMirrorCreated ? 'MIRROR' : 'HUMAN'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
