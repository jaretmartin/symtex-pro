/**
 * SessionLog Component
 *
 * Displays the current training session and session history.
 */

import { Play, Pause, Clock, Zap, Target, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import { useTrainingStore } from './trainingStore';

export function SessionLog() {
  const { currentSession, isSessionActive, toggleSession, sessions } = useTrainingStore();

  // Format duration
  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${minutes}m`;
  };

  return (
    <div className="space-y-4">
      {/* Current Session */}
      {currentSession && (
        <div className="bg-zinc-800 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  'w-3 h-3 rounded-full',
                  isSessionActive ? 'bg-green-500 animate-pulse' : 'bg-amber-500'
                )}
              />
              <h3 className="font-semibold text-zinc-100">Current Session</h3>
              <span
                className={clsx(
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  isSessionActive
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-amber-500/20 text-amber-400'
                )}
              >
                {isSessionActive ? 'In Progress' : 'Paused'}
              </span>
            </div>
            <button
              onClick={toggleSession}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                isSessionActive
                  ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                  : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
              )}
            >
              {isSessionActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
          </div>

          <p className="text-lg font-medium text-zinc-100 mb-4">{currentSession.title}</p>

          {/* Session stats */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-zinc-900 rounded-lg p-3 text-center">
              <Clock className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-zinc-100">
                {formatDuration(currentSession.durationMs)}
              </p>
              <p className="text-xs text-zinc-500">Duration</p>
            </div>
            <div className="bg-zinc-900 rounded-lg p-3 text-center">
              <Zap className="w-4 h-4 text-green-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-zinc-100">{currentSession.interactions}</p>
              <p className="text-xs text-zinc-500">Interactions</p>
            </div>
            <div className="bg-zinc-900 rounded-lg p-3 text-center">
              <Target className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-zinc-100">{currentSession.corrections}</p>
              <p className="text-xs text-zinc-500">Corrections</p>
            </div>
            <div className="bg-zinc-900 rounded-lg p-3 text-center">
              <CheckCircle className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-zinc-100">{currentSession.accuracy}%</p>
              <p className="text-xs text-zinc-500">Accuracy</p>
            </div>
          </div>

          {/* Skills progress */}
          {currentSession.skills.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-zinc-400">Skills Progress</h4>
              {currentSession.skills.map((skill, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-300">{skill.name}</span>
                    <span className="text-zinc-500">
                      {skill.progress}% / {skill.target}%
                    </span>
                  </div>
                  <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                    <div className="h-full flex">
                      <div
                        className="bg-purple-500 rounded-l-full"
                        style={{ width: `${skill.progress}%` }}
                      />
                      <div
                        className="bg-purple-500/30"
                        style={{ width: `${skill.target - skill.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Session History */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
        <h3 className="font-semibold text-zinc-100 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" />
          Recent Sessions
        </h3>

        {sessions.length === 0 && !currentSession ? (
          <div className="text-center py-8">
            <Clock className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
            <p className="text-zinc-400">No training sessions yet</p>
            <p className="text-sm text-zinc-500 mt-1">
              Start a session to begin tracking progress
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.slice(0, 5).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg"
              >
                <div>
                  <p className="font-medium text-zinc-100">{session.title}</p>
                  <p className="text-xs text-zinc-500">
                    {session.startedAt.toLocaleDateString()} •{' '}
                    {formatDuration(session.durationMs)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-zinc-400">
                    {session.interactions} interactions
                  </span>
                  <span
                    className={clsx(
                      'px-2 py-0.5 rounded-full text-xs',
                      session.status === 'completed'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-zinc-700 text-zinc-400'
                    )}
                  >
                    {session.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SessionLog;
