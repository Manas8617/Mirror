/**
 * MIRROR - Synthetic Data Store
 * Contains deterministic mock files, folders, and finance records for safe demonstration.
 */

export class SyntheticStore {
  constructor() {
    this.reset();
  }

  reset() {
    this.inbox = [
      {
        id: 'inv-091',
        filename: 'invoice_incoming_091.pdf',
        status: 'UNPROCESSED',
        content: {
          invoiceNumber: 'INV-2024-091',
          vendor: 'Anthropic AI Services',
          shortVendor: 'Anthropic',
          amount: '$2,100.00',
          amountRaw: 2100.00,
          date: '2024-09-30',
          dueDate: '2024-10-30',
          category: 'Software & Compute'
        }
      }
    ];

    this.processedFiles = [
      {
        original: 'invoice_temp_089.pdf',
        currentName: '2024-089_AcmeCloud_$1450.pdf',
        processedBy: 'Human (Observed)',
        timestamp: '14:32:10'
      },
      {
        original: 'invoice_temp_090.pdf',
        currentName: '2024-090_DataDog_$820.pdf',
        processedBy: 'Human (Observed)',
        timestamp: '14:33:14'
      }
    ];

    this.spreadsheetLedger = [
      {
        row: 14,
        invoiceNumber: 'INV-2024-089',
        vendor: 'Acme Cloud Services',
        amount: '$1,450.00',
        date: '2024-09-28',
        status: 'Complete',
        source: 'Human (Observed)'
      },
      {
        row: 15,
        invoiceNumber: 'INV-2024-090',
        vendor: 'DataDog Network',
        amount: '$820.00',
        date: '2024-09-29',
        status: 'Complete',
        source: 'Human (Observed)'
      }
    ];

    this.auditTrail = [
      {
        stage: 'INITIALIZED',
        message: 'Synthetic workspace environment ready. Guardrails enabled.',
        timestamp: new Date().toISOString()
      }
    ];
  }

  getPendingInvoice() {
    return this.inbox.find(item => item.status === 'UNPROCESSED') || null;
  }

  executeFileRename(invoiceId, newFilename) {
    const item = this.inbox.find(i => i.id === invoiceId);
    if (!item) throw new Error(`Invoice ${invoiceId} not found`);
    const prev = item.filename;
    item.filename = newFilename;
    item.status = 'RENAMED';
    this.processedFiles.push({
      original: prev,
      currentName: newFilename,
      processedBy: 'MIRROR Automation Engine',
      timestamp: new Date().toLocaleTimeString()
    });
    return item;
  }

  appendSpreadsheetRow(entry) {
    const nextRow = this.spreadsheetLedger.length + 14;
    const record = {
      row: nextRow,
      ...entry,
      source: 'MIRROR Automation Engine'
    };
    this.spreadsheetLedger.push(record);
    return record;
  }

  addAudit(stage, message, metadata = {}) {
    const entry = {
      stage,
      message,
      metadata,
      timestamp: new Date().toISOString()
    };
    this.auditTrail.push(entry);
    return entry;
  }
}

export const syntheticStore = new SyntheticStore();
