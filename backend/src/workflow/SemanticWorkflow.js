/**
 * MIRROR - Semantic Workflow Definition
 * 
 * Represents high-level business actions discovered from low-level events,
 * rather than rigid pixel clicks or blind keystrokes.
 */

export const WORKFLOW_STATUS = {
  OBSERVING: 'OBSERVING',
  PATTERN_DETECTED: 'PATTERN_DETECTED',
  PROPOSED: 'PROPOSED',
  APPROVED: 'APPROVED',
  EXECUTING: 'EXECUTING',
  EXECUTED: 'EXECUTED',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED'
};

export class SemanticWorkflow {
  constructor(data = {}) {
    this.id = data.id || 'wf-invoice-proc-v1';
    this.name = data.name || 'INVOICE PROCESSING';
    this.category = 'Finance & Accounts Payable';
    this.version = '1.0.0';
    this.confidenceScore = data.confidenceScore || 0.984;
    this.observedRepetitions = data.observedRepetitions || 2;
    this.status = data.status || WORKFLOW_STATUS.PATTERN_DETECTED;
    this.createdAt = data.createdAt || new Date().toISOString();
    
    // Core semantic steps differentiating from macro clicks
    this.steps = [
      {
        id: 'step-01',
        stepNumber: '01',
        name: 'Find invoice',
        actionCode: 'FIND_INVOICE',
        category: 'Ingestion',
        description: 'Scan downloads/inbox folder for unprocessed invoice documents (.pdf)',
        macroContrast: 'Instead of clicking at coordinates (x: 432, y: 810), scans file descriptors semantically',
        inputSignature: { folder: 'C:/Downloads', pattern: 'invoice_*.pdf' },
        expectedOutput: { fileRef: 'invoice_incoming_091.pdf', status: 'LOCATED' },
        status: 'PENDING'
      },
      {
        id: 'step-02',
        stepNumber: '02',
        name: 'Extract invoice information',
        actionCode: 'EXTRACT_INVOICE_DATA',
        category: 'Perception & Extraction',
        description: 'Extract structured metadata: Invoice Number, Vendor Name, Total Amount, Due Date',
        macroContrast: 'Instead of blind mouse-drag highlight and Ctrl+C, extracts semantic schema entities',
        inputSignature: { documentId: 'invoice_incoming_091.pdf' },
        expectedOutput: {
          invoiceNumber: 'INV-2024-091',
          vendor: 'Anthropic AI Services',
          amount: '$2,100.00'
        },
        status: 'PENDING'
      },
      {
        id: 'step-03',
        stepNumber: '03',
        name: 'Rename document',
        actionCode: 'RENAME_DOCUMENT',
        category: 'Filing',
        description: 'Standardize document filename following rule: {Year}-{Seq}_{Vendor}_{Amount}.pdf',
        macroContrast: 'Instead of F2 + backspace keystrokes, applies parameterized template formatting',
        inputSignature: {
          template: '{Year}-{Seq}_{Vendor}_{Amount}.pdf',
          target: 'invoice_incoming_091.pdf'
        },
        expectedOutput: { newFilename: '2024-091_Anthropic_$2100.pdf' },
        status: 'PENDING'
      },
      {
        id: 'step-04',
        stepNumber: '04',
        name: 'Update finance record',
        actionCode: 'UPDATE_RECORD',
        category: 'Ledger Update',
        description: 'Append standardized transaction row to Finance Ledger spreadsheet (Payables)',
        macroContrast: 'Instead of activating Excel and pressing Tab/Enter, updates spreadsheet data model with checksum',
        inputSignature: {
          ledgerFile: 'Finance_Ledger_Q3.xlsx',
          sheet: 'Payables'
        },
        expectedOutput: { rowNumber: 16, status: 'RECORD_APPENDED' },
        status: 'PENDING'
      },
      {
        id: 'step-05',
        stepNumber: '05',
        name: 'Verify result',
        actionCode: 'VERIFY_RESULT',
        category: 'Validation',
        description: 'Assert document existence, ledger integrity, and schema compliance post-execution',
        macroContrast: 'Instead of human eye-check, automated deterministic checksum verification',
        inputSignature: { checks: ['file_exists', 'ledger_matched', 'checksum_valid'] },
        expectedOutput: { verified: true, discrepancyCount: 0 },
        status: 'PENDING'
      }
    ];

    this.safetyChecks = [
      'Zero arbitrary code execution',
      'Synthetic sandbox file paths only',
      'No credential or token inspection',
      'Human approval token required before write operations'
    ];
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      version: this.version,
      confidenceScore: this.confidenceScore,
      observedRepetitions: this.observedRepetitions,
      status: this.status,
      createdAt: this.createdAt,
      steps: this.steps,
      safetyChecks: this.safetyChecks
    };
  }
}
