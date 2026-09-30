# MIRROR — Live Demo Script (90–120 Seconds)

> **Goal**: Demonstrate how MIRROR watches a human operator perform repetitive invoice processing, discovers the underlying business workflow, enforces an explicit human safety gate, executes the automation, and verifies the outcome with mathematical certainty.

---

### Timing Breakdown

| Time | Phase | On-Screen Action | Verbal Pitch / Narration |
| :--- | :--- | :--- | :--- |
| **0:00 – 0:15** | **The Problem** | Dashboard on `http://localhost:5173` in clean `READY` state. | *"Every day, knowledge workers repeat tedious computer tasks: opening invoices, reading numbers, renaming files, and typing them into spreadsheets. Macro recorders record blind pixel clicks that break instantly. Autonomous agents hallucinate and make dangerous unverified changes. This is MIRROR: Workflow Intelligence."* |
| **0:15 – 0:35** | **OBSERVE & UNDERSTAND** | Click **`Start Observation Feed`**. Live events stream on the left panel. | *"Here, MIRROR is monitoring low-level activity. Notice what's happening: a human opens an invoice, reads the vendor and total, renames the PDF, and appends a row to Excel. They repeat this for a second invoice. MIRROR isn't recording coordinates—it's analyzing the underlying business semantics."* |
| **0:35 – 0:50** | **PATTERN DETECTED** | `PATTERN DETECTED` banner illuminates with 98% confidence. | *"Boom. Repeated workflow identified. MIRROR synthesized raw clicks into 5 structured semantic steps: Find invoice, Extract invoice information, Rename document, Update finance record, and Verify result."* |
| **0:50 – 1:05** | **PROPOSE & HUMAN GATE** | Click **`CREATE AUTOMATION`**. The amber `AUTOMATION READY` gate appears. | *"Now click 'Create Automation'. Notice this crucial safety principle: MIRROR will NEVER blindly execute. It issues a cryptographic approval token and halts at this mandatory Human Approval Gate. The human operator remains in full control."* |
| **1:05 – 1:25** | **EXECUTE** | Click **`APPROVE & RUN`**. Watch steps execute live (`→` running, `✓` complete). | *"I click 'Approve & Run'. MIRROR executes the deterministic workflow on the pending Anthropic invoice. You can see each semantic step execute with live telemetry."* |
| **1:25 – 1:45** | **VERIFY** | Green `AUTOMATION VERIFIED` banner appears. All 4 checkmarks turn green. | *"And finally: VERIFICATION. MIRROR asserts all 4 postconditions: correct invoice identified, correct filename generated, ledger row appended with matching checksum, and zero side effects. Scroll down to the Synthetic Workspace—row 16 is live in the ledger, and the audit trail has full provenance."* |
| **1:45 – 1:55** | **RESET & WRAP** | Click **`RESET DEMO`**. System cleanly returns to `READY`. | *"With one click on 'Reset Demo', the entire sandbox returns to its clean state. MIRROR transforms fragile repetitive desktop labor into verified, safe business automations."* |

---

### Step-by-Step Click Sequence for the Presenter

1. **Check System State**: Ensure backend is active on port 3001 and frontend on port 5173.
2. **Start Observation**: Click the blue button `Start Observation Feed` in the top header or observation panel.
3. **Watch the Stream**: Let the 12 events stream in (~7 seconds). Watch `PATTERN DETECTED` appear.
4. **Create Automation**: Click the purple button `CREATE AUTOMATION`.
5. **Point out the Safety Gate**: Highlight the amber box `AUTOMATION READY: Human approval is strictly required before execution`.
6. **Authorize Execution**: Click the green button `APPROVE & RUN`.
7. **Highlight Verification**: Show the green `AUTOMATION VERIFIED` box and the 4 green checkmark assertions.
8. **Show Real Outputs**: Scroll to `Synthetic Workspace & Ledger State` to show Row 16 in `Finance_Ledger_Q3.xlsx` and the renamed file `2024-091_Anthropic_$2100.pdf`.
9. **Show Audit Trail**: Click on the `Audit Panel` tabs (`APPROVED`, `EXECUTED`, `VERIFIED`).
10. **Reset**: Click `RESET DEMO` to demonstrate clean repeatability.
