/**
 * DemoControlPanel Component
 *
 * Hidden panel for demo presentations accessible via Ctrl+Shift+D.
 * Provides quick access to demo scenarios, wow moments, and state reset.
 */

import { useState, useEffect } from 'react';
import { Settings, RotateCcw, Play, Sparkles, Users, Zap, Clock, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DemoScenario {
  id: string;
  name: string;
  duration: string;
  description: string;
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'investor',
    name: 'Investor Demo (10 min)',
    duration: '10 min',
    description: 'High-level overview focusing on ROI and market potential',
  },
  {
    id: 'enterprise',
    name: 'Sales Demo (Enterprise)',
    duration: '30 min',
    description: 'Full feature walkthrough with compliance focus',
  },
  {
    id: 'technical',
    name: 'Technical Demo (CTO)',
    duration: '20 min',
    description: 'Architecture, integrations, and security deep-dive',
  },
];

export function DemoControlPanel(): JSX.Element | null {
  const [isOpen, setIsOpen] = useState(false);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  // Keyboard shortcut: Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleScenarioSelect = (scenarioId: string): void => {
    setActiveScenario(scenarioId);
    // TODO: In production, this would set up the demo state for the scenario
  };

  const handleWowMoment = (_momentId: string): void => {
    // TODO: In production, this would trigger the specific wow moment
  };

  const handleResetDemo = (): void => {
    setActiveScenario(null);
    // TODO: In production, this would reset all demo state
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed bottom-4 left-4 z-50 w-80 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl"
      role="dialog"
      aria-label="Demo Control Panel"
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-700">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Demo Control Panel
        </h3>
        <p className="text-xs text-zinc-500 mt-1">Ctrl+Shift+D to toggle</p>
      </div>

      {/* Scenarios Section */}
      <div className="p-4 space-y-3 border-b border-zinc-700">
        <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1">
          <Play className="w-3 h-3" />
          Scenarios
        </h4>
        {DEMO_SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => handleScenarioSelect(scenario.id)}
            className={cn(
              'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
              activeScenario === scenario.id
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
            )}
          >
            <div className="flex items-center justify-between">
              <span>{scenario.name}</span>
              {activeScenario === scenario.id && (
                <span className="text-xs text-indigo-400">Active</span>
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-1">{scenario.description}</p>
          </button>
        ))}
      </div>

      {/* Wow Moments Section */}
      <div className="p-4 space-y-3 border-b border-zinc-700">
        <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Wow Moments
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleWowMoment('explain-plan')}
            className="px-2 py-1.5 rounded bg-indigo-500/20 text-indigo-400 text-xs hover:bg-indigo-500/30 transition-colors flex items-center gap-1"
          >
            <Brain className="w-3 h-3" />
            Explain Plan
          </button>
          <button
            onClick={() => handleWowMoment('approval-gate')}
            className="px-2 py-1.5 rounded bg-indigo-500/20 text-indigo-400 text-xs hover:bg-indigo-500/30 transition-colors flex items-center gap-1"
          >
            <Users className="w-3 h-3" />
            Approval Gate
          </button>
          <button
            onClick={() => handleWowMoment('trace-timeline')}
            className="px-2 py-1.5 rounded bg-indigo-500/20 text-indigo-400 text-xs hover:bg-indigo-500/30 transition-colors flex items-center gap-1"
          >
            <Clock className="w-3 h-3" />
            Trace Timeline
          </button>
          <button
            onClick={() => handleWowMoment('pattern-compile')}
            className="px-2 py-1.5 rounded bg-indigo-500/20 text-indigo-400 text-xs hover:bg-indigo-500/30 transition-colors flex items-center gap-1"
          >
            <Zap className="w-3 h-3" />
            Pattern Compile
          </button>
        </div>
      </div>

      {/* Reset Section */}
      <div className="p-4">
        <button
          onClick={handleResetDemo}
          className="w-full px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Demo State
        </button>
      </div>
    </div>
  );
}

export default DemoControlPanel;
