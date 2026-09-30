```jsx
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import PipelineStatus from './components/PipelineStatus';
import ObservationFeed from './components/ObservationFeed';
import SemanticWorkflowCard from './components/SemanticWorkflowCard';
import AuditPanel from './components/AuditPanel';
import SyntheticWorkspaceView from './components/SyntheticWorkspaceView';

const API_BASE_URL = 'https://mirror-backend-8koy.onrender.com';

export default function App() {
  const [systemPhase, setSystemPhase] = useState('READY');
  const [workflow, setWorkflow] = useState(null);
  const [events, setEvents] = useState([]);
  const [approvalState, setApprovalState] = useState(null);
  const [syntheticData, setSyntheticData] = useState({
    inbox: [],
    processedFiles: [],
    spreadsheetLedger: []
  });
  const [auditTrail, setAuditTrail] = useState([]);
  const [isObserving, setIsObserving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch full system state
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/status`);
      if (res.ok) {
        const data = await res.json();
        setSystemPhase(data.systemPhase || 'READY');
        setWorkflow(data.workflow);
        setEvents(data.events || []);
        setApprovalState(data.approvalState);
        setSyntheticData(data.syntheticData || {});
        setAuditTrail(data.auditTrail || []);
        setIsObserving(data.systemPhase === 'OBSERVING');
        setIsExecuting(data.systemPhase === 'EXECUTING');
      }
    } catch (err) {
      console.warn('API polling fallback notice:', err);
    }
  }, []);

  // Initialize and connect SSE stream
  useEffect(() => {
    fetchStatus();

    const evtSource = new EventSource(`${API_BASE_URL}/api/stream`);

    evtSource.addEventListener('INITIAL_STATE', (e) => {
      try {
        const data = JSON.parse(e.data);
        setSystemPhase(data.systemPhase || 'READY');
        setWorkflow(data.workflow);
        setEvents(data.events || []);
        setApprovalState(data.approvalState);
        setSyntheticData(data.syntheticData || {});
        setAuditTrail(data.auditTrail || []);
      } catch (err) {
        console.error('SSE INITIAL_STATE parse error', err);
      }
    });

    evtSource.addEventListener('OBSERVED_EVENT', (e) => {
      try {
        const evt = JSON.parse(e.data);
        setEvents((prev) => [...prev, evt]);
      } catch (err) {
        console.error('SSE OBSERVED_EVENT error', err);
      }
    });

    evtSource.addEventListener('PATTERN_DETECTED', (e) => {
      try {
        const data = JSON.parse(e.data);
        setSystemPhase('PATTERN_DETECTED');
        setWorkflow(data.workflow);
        setIsObserving(false);
        fetchStatus();
      } catch (err) {
        console.error('SSE PATTERN_DETECTED error', err);
      }
    });

    evtSource.addEventListener('EXECUTION_PROGRESS', (e) => {
      try {
        const prog = JSON.parse(e.data);

        if (prog.type === 'STEP_START' || prog.type === 'STEP_COMPLETE') {
          setWorkflow((prev) => {
            if (!prev) return prev;

            const updatedSteps = [...prev.steps];

            if (updatedSteps[prog.stepIndex]) {
              updatedSteps[prog.stepIndex] = { ...prog.step };
            }

            return { ...prev, steps: updatedSteps };
          });
        }

        if (prog.type === 'EXECUTION_COMPLETE') {
          setIsExecuting(false);
          setSystemPhase('VERIFIED');
          fetchStatus();
        }
      } catch (err) {
        console.error('SSE EXECUTION_PROGRESS error', err);
      }
    });

    evtSource.addEventListener('STATE_CHANGE', (e) => {
      try {
        const data = JSON.parse(e.data);

        if (data.systemPhase) {
          setSystemPhase(data.systemPhase);
        }

        if (data.workflow) {
          setWorkflow(data.workflow);
        }

        if (data.approvalState) {
          setApprovalState(data.approvalState);
        }

        fetchStatus();
      } catch (err) {
        console.error('SSE STATE_CHANGE error', err);
      }
    });

    evtSource.addEventListener('RESET_COMPLETE', () => {
      fetchStatus();
    });

    evtSource.onerror = (err) => {
      console.warn('SSE connection warning, using fallback sync', err);
    };

    // Polling safety interval
    const interval = setInterval(fetchStatus, 2000);

    return () => {
      evtSource.close();
      clearInterval(interval);
    };
  }, [fetchStatus]);

  // Actions
  const handleStartObservation = async () => {
    try {
      setErrorMessage(null);
      setIsObserving(true);
      setEvents([]);

      const res = await fetch(
        `${API_BASE_URL}/api/demo/start-observation`,
        { method: 'POST' }
      );

      if (!res.ok) {
        throw new Error('Failed to start observation stream');
      }

      setSystemPhase('OBSERVING');
    } catch (err) {
      setErrorMessage(err.message);
      setIsObserving(false);
    }
  };

  const handleCreateAutomation = async () => {
    try {
      setErrorMessage(null);

      const res = await fetch(
        `${API_BASE_URL}/api/demo/create-automation`,
        { method: 'POST' }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create automation');
      }

      setWorkflow(data.workflow);
      setSystemPhase('PROPOSED');
      fetchStatus();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleApproveAndRun = async () => {
    try {
      setErrorMessage(null);
      setIsExecuting(true);

      const res = await fetch(
        `${API_BASE_URL}/api/demo/approve-and-run`,
        { method: 'POST' }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to authorize and run');
      }

      setSystemPhase('EXECUTING');
    } catch (err) {
      setErrorMessage(err.message);
      setIsExecuting(false);
    }
  };

  const handleReset = async () => {
    try {
      setErrorMessage(null);
      setIsObserving(false);
      setIsExecuting(false);

      const res = await fetch(
        `${API_BASE_URL}/api/demo/reset`,
        { method: 'POST' }
      );

      if (!res.ok) {
        throw new Error('Reset failed');
      }

      await fetchStatus();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">

      {/* Top Navigation */}
      <Header
        systemPhase={systemPhase}
        onStartObservation={handleStartObservation}
        onReset={handleReset}
        isExecuting={isExecuting}
        isObserving={isObserving}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">

        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-xl flex items-center justify-between">
            <span>{errorMessage}</span>

            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-white font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* 5-Phase Pipeline Indicator */}
        <PipelineStatus systemPhase={systemPhase} />

        {/* 2-Column Core */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-5 h-full">
            <ObservationFeed
              events={events}
              isObserving={isObserving}
              onStartObservation={handleStartObservation}
            />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 h-full">
            <SemanticWorkflowCard
              workflow={workflow}
              systemPhase={systemPhase}
              approvalState={approvalState}
              onCreateAutomation={handleCreateAutomation}
              onApproveAndRun={handleApproveAndRun}
              isExecuting={isExecuting}
            />
          </div>
        </div>

        {/* Synthetic Workspace Proof Panel */}
        <SyntheticWorkspaceView
          syntheticData={syntheticData}
          systemPhase={systemPhase}
        />

        {/* Activity & Audit Governance Panel */}
        <AuditPanel
          auditTrail={auditTrail}
          approvalState={approvalState}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-4 px-6 text-center text-xs text-slate-500">
        MIRROR MVP — Workflow Intelligence & Verification Engine. Safe deterministic sandbox execution.
      </footer>
    </div>
  );
}
```

### Now do exactly this

1. Replace **all** of your current `App.jsx` with the code above.
2. Click **Commit changes**.
3. Wait for Render to redeploy `Mirror-frontend`.
4. When it says **Live**, open the live site.
5. Hard refresh with **Ctrl + Shift + R**.
6. Click **Start Observing**.

**Don't change anything else.**

If you get an error after that, paste the error here.
