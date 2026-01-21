/**
 * WeekCard Component
 *
 * Displays a single boot camp week with status, progress, and tasks.
 */

import { CheckCircle, Lock, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import type { BootCampWeek, WeekStatus } from './types';

interface WeekCardProps {
  week: BootCampWeek;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function WeekCard({ week, isExpanded = false, onToggle }: WeekCardProps) {
  const [localExpanded, setLocalExpanded] = useState(isExpanded);
  const expanded = onToggle ? isExpanded : localExpanded;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setLocalExpanded(!localExpanded);
    }
  };

  const statusConfig: Record<WeekStatus, { icon: typeof CheckCircle; color: string; bg: string }> = {
    completed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' },
    current: { icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    locked: { icon: Lock, color: 'text-zinc-500', bg: 'bg-zinc-700/50' },
  };

  const config = statusConfig[week.status];
  const StatusIcon = config.icon;

  return (
    <div
      className={clsx(
        'border rounded-xl overflow-hidden transition-all',
        week.status === 'current'
          ? 'border-purple-500/50 bg-zinc-800/50'
          : week.status === 'completed'
            ? 'border-green-500/30 bg-zinc-800/30'
            : 'border-zinc-700 bg-zinc-800/20'
      )}
    >
      {/* Header */}
      <button
        onClick={handleToggle}
        disabled={week.status === 'locked'}
        className={clsx(
          'w-full p-4 flex items-center gap-4 text-left transition-colors',
          week.status !== 'locked' && 'hover:bg-zinc-700/30'
        )}
      >
        {/* Week number badge */}
        <div
          className={clsx(
            'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold',
            config.bg,
            config.color
          )}
        >
          {week.week}
        </div>

        {/* Week info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-100">{week.name}</span>
            <span
              className={clsx(
                'px-2 py-0.5 text-xs rounded-full font-medium',
                week.status === 'completed' && 'bg-green-500/20 text-green-400',
                week.status === 'current' && 'bg-purple-500/20 text-purple-400',
                week.status === 'locked' && 'bg-zinc-700 text-zinc-500'
              )}
            >
              {week.phase}
            </span>
          </div>
          <p className="text-sm text-zinc-400 truncate">{week.description}</p>
        </div>

        {/* Progress & Status */}
        <div className="flex items-center gap-3">
          {week.status !== 'locked' && (
            <div className="text-right">
              <span className="text-sm font-medium text-zinc-100">{week.progress}%</span>
              <div className="w-20 h-1.5 bg-zinc-700 rounded-full mt-1 overflow-hidden">
                <div
                  className={clsx(
                    'h-full rounded-full transition-all',
                    week.status === 'completed' ? 'bg-green-500' : 'bg-purple-500'
                  )}
                  style={{ width: `${week.progress}%` }}
                />
              </div>
            </div>
          )}

          <StatusIcon className={clsx('w-5 h-5', config.color)} />

          {week.status !== 'locked' && (
            expanded ? (
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            )
          )}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && week.status !== 'locked' && (
        <div className="px-4 pb-4 pt-0 border-t border-zinc-700/50">
          <div className="mt-4 space-y-3">
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
              Week {week.week} Tasks
            </h4>
            <ul className="space-y-2">
              {week.tasks.map((task, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div
                    className={clsx(
                      'w-5 h-5 rounded-full flex items-center justify-center text-xs',
                      week.status === 'completed'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-zinc-700 text-zinc-400'
                    )}
                  >
                    {week.status === 'completed' ? '✓' : idx + 1}
                  </div>
                  <span
                    className={clsx(
                      'text-sm',
                      week.status === 'completed' ? 'text-zinc-400 line-through' : 'text-zinc-300'
                    )}
                  >
                    {task}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeekCard;
