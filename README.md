# MIRROR — Workflow Intelligence & Verification Engine

> **Watch. Understand. Propose. Approve. Execute. Verify.**  
> Transforming repetitive human computer operations into safe, verified semantic automations.

---

## 1. Problem

Modern knowledge workers lose hours every week executing repetitive desktop workflows: downloading files, cross-referencing invoice IDs, renaming files to specific schemas, and updating spreadsheets.

Existing solutions fall into two problematic extremes:
1. **Dumb Macro Recorders**: Record fragile coordinates `(x: 432, y: 810)` and blind keystrokes (`[Tab]`, `[Enter]`). If a window shifts by 10 pixels or an invoice has 5 lines instead of 4, the macro crashes or enters garbage into production databases.
2. **Black-box Autonomous Agents**: Blindly take over mouse and keyboard controls without explicit human gates, creating massive risk of unintended data destruction, hallucinations, or unauthorized actions.

---

## 2. Solution: MIRROR

**MIRROR** bridges this gap through **Workflow Intelligence**:
- **Semantic Understanding**: Instead of recording coordinate clicks, MIRROR observes user activity and abstracts low-level events into semantic business actions:
  - `FIND_INVOICE`
  - `EXTRACT_INVOICE_DATA`
  - `RENAME_DOCUMENT`
  - `UPDATE_RECORD`
  - `VERIFY_RESULT`
- **Mandatory Human-in-the-Loop Gate**: MIRROR *never* executes without explicit human review and cryptographic approval.
- **Deterministic Postcondition Verification**: After execution, MIRROR inspects the environment to mathematically assert that the intended business outcome was achieved with zero side effects.

---

## 3. Architecture

MIRROR is built with a strictly decoupled, modular architecture ready for production adapter drop-ins:

```
[ Human User Operations ]
            │
            ▼
┌────────────────────────┐
│   ObservationAdapter   │  (Interface: Pluggable OS hooks / Demo adapter)
└───────────┬────────────┘
            │ Low-level UI events (Window focus, selection, file rename)
            ▼
┌────────────────────────┐
│      EventStream       │  (Circular buffer, SSE / WebSocket broadcast)
└───────────┬────────────┘
            │ Stream of user actions
            ▼
┌────────────────────────┐
│   WorkflowDiscovery    │  (Pattern mining, repetition threshold, clustering)
└───────────┬────────────┘
            │ Synthesized workflow schema
            ▼
┌────────────────────────┐
│    SemanticWorkflow    │  (High-level business steps, parameter bindings)
└───────────┬────────────┘
            │ Proposed automation + safety checklist
            ▼
┌────────────────────────┐
│   HumanApprovalGate    │  [MANDATORY SECURITY GATE] Tokenized human sign-off
└───────────┬────────────┘
            │ Authorized execution token
            ▼
┌────────────────────────┐
│    ExecutionEngine     │  (Step-by-step deterministic executor)
└───────────┬────────────┘
            │ Post-execution state snapshot
            ▼
┌────────────────────────┐
│   VerificationEngine   │  (Assertions: invoice found, renamed, ledger row matched)
└────────────────────────┘
```

### Module Breakdown
* **`ObservationAdapter`** (`backend/src/adapters/ObservationAdapter.js`): Defines the abstract listener interface. Ships with `DemoInvoiceObservationAdapter` producing realistic low-level OS events. Can be replaced with eBPF, UI Automation, or Computer-Vision Perception adapters.
* **`EventStream`** (`backend/src/stream/EventStream.js`): Manages buffering and real-time SSE broadcasts.
* **`WorkflowDiscovery`** (`backend/src/discovery/WorkflowDiscovery.js`): Detects repeating sequence loops and maps low-level UI operations to semantic steps.
* **`SemanticWorkflow`** (`backend/src/workflow/SemanticWorkflow.js`): Strongly-typed representation of steps, input/output schemas, and macro comparisons.
* **`HumanApproval`** (`backend/src/safety/HumanApproval.js`): Cryptographic token generation and strict zero-blind-execution enforcement.
* **`ExecutionEngine`** (`backend/src/engine/ExecutionEngine.js`): Executes approved steps sequentially with live progress telemetry.
* **`VerificationEngine`** (`backend/src/engine/VerificationEngine.js`): Runs 4 deterministic postcondition assertions on the result.
* **`SyntheticStore`** (`backend/src/data/syntheticStore.js`): Safe, fully isolated sandbox containing synthetic invoices and spreadsheet ledgers.

---

## 4. How to Run

### Prerequisites
* Node.js (v18+; tested on Node.js v24)
* npm

### Quick Start
```bash
# 1. Clone or navigate to the project directory
cd C:\Users\manas\.gemini\antigravity\scratch\mirror

# 2. Run backend
cd backend
npm install
node src/server.js

# 3. In another terminal, run frontend
cd ../frontend
npm install
npm run dev
```

Alternatively, on Windows:
```powershell
.\start.ps1
# or
start.bat
```

Open your browser to: **`http://localhost:5173`**

---

## 5. Demo Workflow: Invoice Processing

The hackathon demonstration uses an Accounts Payable workflow:
1. **Human Processing Phase (Observed)**:
   - User opens Invoice 1 (`invoice_temp_089.pdf`), reads Invoice #, Vendor (`Acme Cloud Services`), and Amount (`$1,450.00`).
   - Renames file to `2024-089_AcmeCloud_$1450.pdf` and logs row 14 to `Finance_Ledger_Q3.xlsx`.
   - User repeats the exact procedure for Invoice 2 (`invoice_temp_090.pdf` from `DataDog Network`, `$820.00`).
2. **Discovery & Proposal**:
   - MIRROR detects 2 cycles of repeated behavior with 98.5% confidence.
   - Synthesizes semantic workflow:
     1. `FIND_INVOICE`
     2. `EXTRACT_INVOICE_DATA`
     3. `RENAME_DOCUMENT`
     4. `UPDATE_RECORD`
     5. `VERIFY_RESULT`
3. **Mandatory Human Approval**:
   - MIRROR presents the "AUTOMATION READY" modal and issues a cryptographic approval token.
   - Requires explicit human click: **`APPROVE & RUN`**.
4. **Execution & Telemetry**:
   - MIRROR executes the workflow on pending Invoice 3 (`invoice_incoming_091.pdf` from `Anthropic AI Services`, `$2,100.00`).
   - Displays real-time step execution (`→` running, `✓` complete).
5. **Verification**:
   - Asserts all 4 conditions:
     - `✓ Correct invoice identified (INV-2024-091)`
     - `✓ Correct filename (2024-091_Anthropic_$2100.pdf)`
     - `✓ Finance record updated (Row 16 in Finance_Ledger_Q3.xlsx)`
     - `✓ Expected output exists (Reconciled & checksum verified)`

---

## 6. Safety Model & Guardrails

- **Zero Blind Autonomous Execution**: No workflow can execute without an explicit cryptographic approval token signed by human action.
- **Strict Sandboxing**: All file modifications and spreadsheet operations operate in an isolated synthetic directory structure.
- **No Credential Access**: No passwords, cookies, auth tokens, or private keys are inspected or captured.
- **Deterministic Bounds**: Rejects arbitrary shell command execution. All execution pathways are bounded to verified semantic primitives.
- **Complete Audit Trail**: Every stage (`OBSERVED`, `PROPOSED`, `APPROVED`, `EXECUTED`, `VERIFIED`) is recorded with timestamps, user session, and cryptographic metadata.

---

## 7. Limitations

- **Prototype Scope**: Built for hackathon demonstration using a controlled synthetic invoice processing environment.
- **Deterministic Adapter**: Uses a high-fidelity synthetic event adapter rather than a kernel-level OS accessibility hook to ensure 100% demo reliability.
- **Single Workflow Type**: Specialized in Accounts Payable / File-and-Spreadsheet reconciliation patterns.

---

## 8. Future Work

- **OS Accessibility Hooks**: Implement native Windows UI Automation (UIA) and macOS Accessibility API adapters.
- **Multimodal Visual Grounding**: Integrate vision-language models (e.g. Gemini 2.0 Flash) to verify visual state and detect UI element drift.
- **Complex Branching**: Support conditional workflow logic (e.g., invoices over $5,000 requiring secondary managerial approval).
- **Enterprise Connectors**: Export approved semantic workflows directly to ERP platforms (SAP, NetSuite, QuickBooks).
