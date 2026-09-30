/**
 * MIRROR - Observation Adapter Interface & Demo Implementation
 * 
 * In a production system, this adapter hooks into OS accessibility APIs,
 * eBPF / window event listeners, or screen perception models.
 * For this demo, DemoInvoiceObservationAdapter produces controlled, realistic
 * low-level interaction events representing repetitive user invoice processing.
 */

export class ObservationAdapter {
  constructor() {
    this.listeners = [];
  }

  onEvent(callback) {
    this.listeners.push(callback);
  }

  emit(event) {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (err) {
        console.error('Error in event listener:', err);
      }
    }
  }

  start() {
    throw new Error('start() must be implemented by adapter subclass');
  }

  stop() {
    throw new Error('stop() must be implemented by adapter subclass');
  }
}

export class DemoInvoiceObservationAdapter extends ObservationAdapter {
  constructor() {
    super();
    this.timer = null;
    this.currentIndex = 0;
    this.isRunning = false;
  }

  // Synthetic low-level events demonstrating repeated human workflows
  getDemoEventSequences() {
    return [
      // Sequence 1: Human processes Invoice 1 (INV-2024-089)
      {
        id: 'evt-001',
        timestamp: new Date(Date.now() - 36000).toISOString(),
        timeDisplay: '14:31:45',
        type: 'WINDOW_FOCUS',
        app: 'Windows Explorer',
        details: 'Focused Downloads directory',
        rawPayload: { window: 'Downloads', target: 'invoice_temp_089.pdf' }
      },
      {
        id: 'evt-002',
        timestamp: new Date(Date.now() - 32000).toISOString(),
        timeDisplay: '14:31:52',
        type: 'FILE_OPEN',
        app: 'PDF Viewer',
        details: 'Opened invoice_temp_089.pdf',
        rawPayload: { file: 'invoice_temp_089.pdf', size: '142KB' }
      },
      {
        id: 'evt-003',
        timestamp: new Date(Date.now() - 28000).toISOString(),
        timeDisplay: '14:32:01',
        type: 'TEXT_SELECTION',
        app: 'PDF Viewer',
        details: 'Highlighted "INV-2024-089" and copied to clipboard',
        rawPayload: { text: 'INV-2024-089', clipboardAction: 'COPY' }
      },
      {
        id: 'evt-004',
        timestamp: new Date(Date.now() - 24000).toISOString(),
        timeDisplay: '14:32:04',
        type: 'TEXT_SELECTION',
        app: 'PDF Viewer',
        details: 'Highlighted "Acme Cloud Services" and copied to clipboard',
        rawPayload: { text: 'Acme Cloud Services', clipboardAction: 'COPY' }
      },
      {
        id: 'evt-005',
        timestamp: new Date(Date.now() - 20000).toISOString(),
        timeDisplay: '14:32:06',
        type: 'TEXT_SELECTION',
        app: 'PDF Viewer',
        details: 'Highlighted "$1,450.00" and copied to clipboard',
        rawPayload: { text: '$1,450.00', clipboardAction: 'COPY' }
      },
      {
        id: 'evt-006',
        timestamp: new Date(Date.now() - 16000).toISOString(),
        timeDisplay: '14:32:10',
        type: 'FILE_RENAME',
        app: 'Windows Explorer',
        details: 'Renamed invoice_temp_089.pdf -> 2024-089_AcmeCloud_$1450.pdf',
        rawPayload: { oldName: 'invoice_temp_089.pdf', newName: '2024-089_AcmeCloud_$1450.pdf' }
      },
      {
        id: 'evt-007',
        timestamp: new Date(Date.now() - 12000).toISOString(),
        timeDisplay: '14:32:15',
        type: 'WINDOW_FOCUS',
        app: 'Excel',
        details: 'Focused Finance_Ledger_Q3.xlsx',
        rawPayload: { workbook: 'Finance_Ledger_Q3.xlsx', sheet: 'Payables' }
      },
      {
        id: 'evt-008',
        timestamp: new Date(Date.now() - 8000).toISOString(),
        timeDisplay: '14:32:20',
        type: 'CELL_UPDATE',
        app: 'Excel',
        details: 'Appended row 14: [INV-2024-089, Acme Cloud Services, $1,450.00, Complete]',
        rawPayload: { row: 14, values: ['INV-2024-089', 'Acme Cloud Services', '$1,450.00', 'Complete'] }
      },

      // Sequence 2: Human processes Invoice 2 (INV-2024-090)
      {
        id: 'evt-009',
        timestamp: new Date(Date.now() - 6000).toISOString(),
        timeDisplay: '14:33:02',
        type: 'FILE_OPEN',
        app: 'PDF Viewer',
        details: 'Opened invoice_temp_090.pdf',
        rawPayload: { file: 'invoice_temp_090.pdf', size: '98KB' }
      },
      {
        id: 'evt-010',
        timestamp: new Date(Date.now() - 4000).toISOString(),
        timeDisplay: '14:33:08',
        type: 'TEXT_SELECTION',
        app: 'PDF Viewer',
        details: 'Highlighted "INV-2024-090" -> "DataDog Network" -> "$820.00"',
        rawPayload: { invoiceNo: 'INV-2024-090', vendor: 'DataDog Network', amount: '$820.00' }
      },
      {
        id: 'evt-011',
        timestamp: new Date(Date.now() - 2000).toISOString(),
        timeDisplay: '14:33:14',
        type: 'FILE_RENAME',
        app: 'Windows Explorer',
        details: 'Renamed invoice_temp_090.pdf -> 2024-090_DataDog_$820.pdf',
        rawPayload: { oldName: 'invoice_temp_090.pdf', newName: '2024-090_DataDog_$820.pdf' }
      },
      {
        id: 'evt-012',
        timestamp: new Date().toISOString(),
        timeDisplay: '14:33:20',
        type: 'CELL_UPDATE',
        app: 'Excel',
        details: 'Appended row 15: [INV-2024-090, DataDog Network, $820.00, Complete]',
        rawPayload: { row: 15, values: ['INV-2024-090', 'DataDog Network', '$820.00', 'Complete'] }
      }
    ];
  }

  start(intervalMs = 700) {
    if (this.isRunning) return;
    this.isRunning = true;
    const events = this.getDemoEventSequences();
    this.currentIndex = 0;

    this.timer = setInterval(() => {
      if (this.currentIndex < events.length) {
        const evt = events[this.currentIndex++];
        this.emit(evt);
      } else {
        this.stop();
        this.emit({ type: 'OBSERVATION_COMPLETE' });
      }
    }, intervalMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
  }

  reset() {
    this.stop();
    this.currentIndex = 0;
  }
}
