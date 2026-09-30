/**
 * MIRROR - Backend API Server
 * 
 * Express API and Event Server exposing the clean architecture pipeline:
 * ObservationAdapter -> EventStream -> WorkflowDiscovery -> SemanticWorkflow -> HumanApproval -> ExecutionEngine -> VerificationEngine
 */

import express from 'express';
import cors from 'cors';
import { DemoInvoiceObservationAdapter } from './adapters/ObservationAdapter.js';
import { eventStream } from './stream/EventStream.js';
import { workflowDiscovery } from './discovery/WorkflowDiscovery.js';
import { humanApprovalManager } from './safety/HumanApproval.js';
import { executionEngine } from './engine/ExecutionEngine.js';
import { syntheticStore } from './data/syntheticStore.js';
import { WORKFLOW_STATUS } from './workflow/SemanticWorkflow.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Global system state
let systemPhase = 'READY'; // READY | OBSERVING | PATTERN_DETECTED | PROPOSED | APPROVED | EXECUTING | VERIFIED
let currentWorkflow = null;
const observationAdapter = new DemoInvoiceObservationAdapter();

// Wire observation adapter events into event stream and discovery
observationAdapter.onEvent((evt) => {
  if (evt.type === 'OBSERVATION_COMPLETE') {
    // Automatically trigger discovery pattern analysis
    const analysis = workflowDiscovery.analyzeEvents(eventStream.getAllEvents());
    if (analysis.patternFound) {
      systemPhase = 'PATTERN_DETECTED';
      currentWorkflow = analysis.workflow;
      broadcastSSE('PATTERN_DETECTED', {
        workflow: currentWorkflow.toJSON(),
        analysis
      });
      syntheticStore.addAudit('PROPOSED', 'Repeated pattern discovered. Proposed semantic workflow generated.');
    }
    broadcastSSE('OBSERVATION_COMPLETE', { eventsCount: eventStream.getAllEvents().length });
    return;
  }

  // Push raw event to stream
  eventStream.push(evt);
  broadcastSSE('OBSERVED_EVENT', evt);
});

// Wire execution progress into SSE
executionEngine.onProgress((prog) => {
  broadcastSSE('EXECUTION_PROGRESS', prog);
  if (prog.type === 'EXECUTION_COMPLETE') {
    systemPhase = 'VERIFIED';
    broadcastSSE('WORKFLOW_VERIFIED', {
      results: prog.results,
      audit: syntheticStore.auditTrail
    });
  }
});

// SSE Subscribers
const sseClients = new Set();

function broadcastSSE(type, data) {
  const payload = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

// 1. SSE Endpoint
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  sseClients.add(res);

  // Send initial ping and current state
  res.write(`event: INITIAL_STATE\ndata: ${JSON.stringify(getSystemState())}\n\n`);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

function getSystemState() {
  return {
    systemPhase,
    workflow: currentWorkflow ? currentWorkflow.toJSON() : null,
    events: eventStream.getAllEvents(),
    approvalState: humanApprovalManager.getState(),
    syntheticData: {
      inbox: syntheticStore.inbox,
      processedFiles: syntheticStore.processedFiles,
      spreadsheetLedger: syntheticStore.spreadsheetLedger
    },
    auditTrail: syntheticStore.auditTrail
  };
}

// 2. State & Audit Endpoints
app.get('/api/status', (req, res) => {
  res.json(getSystemState());
});

app.get('/api/audit', (req, res) => {
  res.json({
    auditTrail: syntheticStore.auditTrail,
    approvalState: humanApprovalManager.getState()
  });
});

app.get('/api/data', (req, res) => {
  res.json({
    inbox: syntheticStore.inbox,
    processedFiles: syntheticStore.processedFiles,
    spreadsheetLedger: syntheticStore.spreadsheetLedger
  });
});

// 3. Step 1: Start Observation
app.post('/api/demo/start-observation', (req, res) => {
  systemPhase = 'OBSERVING';
  syntheticStore.addAudit('OBSERVED', 'Human observation stream initialized. Ingesting window and file events.');
  observationAdapter.reset();
  eventStream.clear();
  workflowDiscovery.reset();
  currentWorkflow = null;

  // Start feeding controlled events at 600ms cadence for snappy demo
  observationAdapter.start(600);

  broadcastSSE('STATE_CHANGE', { systemPhase: 'OBSERVING' });
  res.json({ success: true, message: 'Observation started' });
});

// 4. Step 2: Create Automation (Propose Workflow)
app.post('/api/demo/create-automation', (req, res) => {
  if (!currentWorkflow) {
    const analysis = workflowDiscovery.analyzeEvents(eventStream.getAllEvents());
    if (analysis.patternFound) {
      currentWorkflow = analysis.workflow;
    } else {
      return res.status(400).json({ error: 'No pattern detected yet to create automation' });
    }
  }

  currentWorkflow.status = WORKFLOW_STATUS.PROPOSED;
  systemPhase = 'PROPOSED';

  // Request approval token (Safety requirement)
  const approvalReq = humanApprovalManager.requestApproval(currentWorkflow);

  syntheticStore.addAudit('PROPOSED', 'Semantic workflow created and presented for mandatory Human Approval.', {
    approvalToken: approvalReq.token
  });

  const state = getSystemState();
  broadcastSSE('STATE_CHANGE', state);

  res.json({
    success: true,
    workflow: currentWorkflow.toJSON(),
    approvalRequest: approvalReq
  });
});

// 5. Step 3: Human Approval & Execution
app.post('/api/demo/approve-and-run', async (req, res) => {
  try {
    if (!currentWorkflow) {
      return res.status(400).json({ error: 'No workflow proposal available for execution' });
    }

    // Step A: Explicit Human Approval
    const approval = humanApprovalManager.grantApproval('Human Operator');
    currentWorkflow.status = WORKFLOW_STATUS.APPROVED;
    systemPhase = 'APPROVED';

    syntheticStore.addAudit('APPROVED', 'Human operator explicitly approved automation execution.', {
      approvalToken: approval.token,
      approvedAt: approval.approvedAt
    });

    broadcastSSE('STATE_CHANGE', { systemPhase: 'APPROVED', approval });

    // Step B: Execution
    systemPhase = 'EXECUTING';
    currentWorkflow.status = WORKFLOW_STATUS.EXECUTING;
    broadcastSSE('STATE_CHANGE', { systemPhase: 'EXECUTING' });

    // Run execution asynchronously with stepDelay
    executionEngine.runWorkflow(currentWorkflow, 750)
      .then(results => {
        currentWorkflow.status = WORKFLOW_STATUS.VERIFIED;
        systemPhase = 'VERIFIED';
      })
      .catch(err => {
        console.error('Execution failed:', err);
      });

    res.json({
      success: true,
      message: 'Human approval validated. Execution engine started.',
      approval
    });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

// 6. Reset Demo
app.post('/api/demo/reset', (req, res) => {
  observationAdapter.reset();
  eventStream.clear();
  workflowDiscovery.reset();
  humanApprovalManager.reset();
  executionEngine.reset();
  syntheticStore.reset();
  systemPhase = 'READY';
  currentWorkflow = null;

  const state = getSystemState();
  broadcastSSE('RESET_COMPLETE', state);

  res.json({ success: true, message: 'MIRROR environment reset to clean state', state });
});

app.listen(PORT, () => {
  console.log(`MIRROR backend server running on http://localhost:${PORT}`);
});
