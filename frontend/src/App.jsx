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
  const [approvalState, setApprovalState] = useState(null);
  const [isObserving, setIsObserving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [events, setEvents] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch full system state
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/status`);
      if (res.ok) {
        const data = await res.json();
        setSystemPhase(data.systemPhase || 'READY');
        setWorkflow(data.workflow || null);
        setApprovalState(data.approvalState || null);
      }
    } catch (err) {
      console.error('Failed to fetch status', err);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const evtSource = new EventSource(`${API_BASE_URL}/api/stream`);

    evtSource.addEventListener('INITIAL_STATE', (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.systemPhase) setSystemPhase(data.systemPhase);
        if (data.workflow) setWorkflow(data.workflow);
        if (data.approvalState) setApprovalState(data.approvalState);
      } catch (err) {
        console.error('SSE INITIAL_STATE error', err);
      }
    });

    evtSource.addEventListener('OBSERVATION_EVENT', (e) => {
      try {
        const eventData = JSON.parse(e.data);
        setEvents((prev) => [...prev, eventData]);
      } catch (err) {
        console.error('SSE OBSERVATION_EVENT error', err);
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

    return () => {
      evtSource.close();
    };
  }, [fetchStatus]);

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
        onReset={handleReset}
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
              approvalState={approvalState}
              isExecuting={isExecuting}
              onCreateAutomation={handleCreateAutomation}
              onApproveAndRun={handleApproveAndRun}
            />
          </div>
        </div>

        {/* Audit Panel & Workspace View */}
        <div className="grid grid-cols-1 gap-6">
          <AuditPanel workflow={workflow} />
          <SyntheticWorkspaceView systemPhase={systemPhase} />
        </div>
      </main>
    </div>
  );
}
