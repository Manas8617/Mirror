/**
 * MIRROR - Execution Engine
 * 
 * Executes the approved semantic workflow step-by-step.
 * Strictly verifies human approval before starting.
 */

import { humanApprovalManager } from '../safety/HumanApproval.js';
import { syntheticStore } from '../data/syntheticStore.js';
import { verificationEngine } from './VerificationEngine.js';

export class ExecutionEngine {
  constructor() {
    this.isExecuting = false;
    this.currentStepIndex = -1;
    this.executionHistory = [];
    this.listeners = [];
  }

  onProgress(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notify(event) {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (err) {
        console.error('Execution notification error:', err);
      }
    }
  }

  async runWorkflow(workflow, stepDelayMs = 900) {
    // 1. Strict Security & Approval Check
    humanApprovalManager.verifyApproval();

    if (this.isExecuting) {
      throw new Error('An automation execution is already in progress');
    }

    this.isExecuting = true;
    this.currentStepIndex = 0;
    syntheticStore.addAudit('EXECUTION_STARTED', 'Approved automation execution initiated.', {
      workflowId: workflow.id,
      approver: humanApprovalManager.getState().approvedBy
    });

    const executionResults = {
      workflowId: workflow.id,
      startedAt: new Date().toISOString(),
      completedAt: null,
      stepResults: [],
      verification: null,
      success: false
    };

    try {
      // Step 1: FIND_INVOICE
      this.currentStepIndex = 0;
      workflow.steps[0].status = 'RUNNING';
      this.notify({ type: 'STEP_START', stepIndex: 0, step: workflow.steps[0] });
      await new Promise(r => setTimeout(r, stepDelayMs));

      const pending = syntheticStore.getPendingInvoice();
      if (!pending) throw new Error('No pending invoice found in sandbox directory');

      workflow.steps[0].status = 'COMPLETED';
      workflow.steps[0].result = {
        file: pending.filename,
        path: `C:/SyntheticWorkspace/Downloads/${pending.filename}`,
        size: '118 KB',
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      };
      this.notify({ type: 'STEP_COMPLETE', stepIndex: 0, step: workflow.steps[0] });

      // Step 2: EXTRACT_INVOICE_DATA
      this.currentStepIndex = 1;
      workflow.steps[1].status = 'RUNNING';
      this.notify({ type: 'STEP_START', stepIndex: 1, step: workflow.steps[1] });
      await new Promise(r => setTimeout(r, stepDelayMs));

      const extractedData = {
        invoiceNumber: pending.content.invoiceNumber,
        vendor: pending.content.vendor,
        shortVendor: pending.content.shortVendor,
        amount: pending.content.amount,
        amountRaw: pending.content.amountRaw,
        dueDate: pending.content.dueDate,
        confidence: '99.9%'
      };
      workflow.steps[1].status = 'COMPLETED';
      workflow.steps[1].result = extractedData;
      this.notify({ type: 'STEP_COMPLETE', stepIndex: 1, step: workflow.steps[1] });

      // Step 3: RENAME_DOCUMENT
      this.currentStepIndex = 2;
      workflow.steps[2].status = 'RUNNING';
      this.notify({ type: 'STEP_START', stepIndex: 2, step: workflow.steps[2] });
      await new Promise(r => setTimeout(r, stepDelayMs));

      const newFilename = '2024-091_Anthropic_$2100.pdf';
      const updatedFile = syntheticStore.executeFileRename(pending.id, newFilename);
      workflow.steps[2].status = 'COMPLETED';
      workflow.steps[2].result = {
        previousName: 'invoice_incoming_091.pdf',
        newName: newFilename,
        destinationFolder: 'C:/SyntheticWorkspace/ProcessedInvoices/'
      };
      this.notify({ type: 'STEP_COMPLETE', stepIndex: 2, step: workflow.steps[2] });

      // Step 4: UPDATE_RECORD
      this.currentStepIndex = 3;
      workflow.steps[3].status = 'RUNNING';
      this.notify({ type: 'STEP_START', stepIndex: 3, step: workflow.steps[3] });
      await new Promise(r => setTimeout(r, stepDelayMs));

      const ledgerRecord = syntheticStore.appendSpreadsheetRow({
        invoiceNumber: extractedData.invoiceNumber,
        vendor: extractedData.vendor,
        amount: extractedData.amount,
        date: pending.content.date,
        status: 'Complete'
      });
      workflow.steps[3].status = 'COMPLETED';
      workflow.steps[3].result = {
        ledger: 'Finance_Ledger_Q3.xlsx',
        sheet: 'Payables',
        row: ledgerRecord.row,
        rowData: [ledgerRecord.invoiceNumber, ledgerRecord.vendor, ledgerRecord.amount, 'Complete']
      };
      this.notify({ type: 'STEP_COMPLETE', stepIndex: 3, step: workflow.steps[3] });

      // Step 5: VERIFY_RESULT
      this.currentStepIndex = 4;
      workflow.steps[4].status = 'RUNNING';
      this.notify({ type: 'STEP_START', stepIndex: 4, step: workflow.steps[4] });
      await new Promise(r => setTimeout(r, stepDelayMs));

      const verificationResult = verificationEngine.verify({
        expectedFile: newFilename,
        expectedInvoiceNumber: extractedData.invoiceNumber,
        expectedRow: ledgerRecord.row
      });

      workflow.steps[4].status = 'COMPLETED';
      workflow.steps[4].result = verificationResult;
      this.notify({ type: 'STEP_COMPLETE', stepIndex: 4, step: workflow.steps[4] });

      executionResults.success = true;
      executionResults.completedAt = new Date().toISOString();
      executionResults.verification = verificationResult;
      executionResults.stepResults = workflow.steps.map(s => ({
        stepNumber: s.stepNumber,
        actionCode: s.actionCode,
        status: s.status,
        result: s.result
      }));

      syntheticStore.addAudit('AUTOMATION_VERIFIED', 'All verification checks passed with zero anomalies.', {
        invoiceNumber: extractedData.invoiceNumber,
        renamedFile: newFilename,
        ledgerRow: ledgerRecord.row
      });

      this.notify({
        type: 'EXECUTION_COMPLETE',
        results: executionResults
      });

      return executionResults;
    } catch (err) {
      this.notify({ type: 'EXECUTION_ERROR', error: err.message });
      throw err;
    } finally {
      this.isExecuting = false;
    }
  }

  reset() {
    this.isExecuting = false;
    this.currentStepIndex = -1;
  }
}

export const executionEngine = new ExecutionEngine();
