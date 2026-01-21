/**
 * PatternCompilationWidget Component
 *
 * Shows pattern compilation statistics including:
 * - Total patterns compiled count
 * - Recent compilations with timestamps
 * - Neural to Symbolic conversion indicator
 */

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Clock, Zap, FileCode } from 'lucide-react';
import type { PatternCompilation } from './insights-store';

interface PatternCompilationWidgetProps {
  patterns: PatternCompilation[];
  totalCompiled: number;
  className?: string;
  maxVisible?: number;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function formatTimeSaved(seconds: number): string {
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const mins = seconds / 60;
  if (mins < 60) return `${mins.toFixed(1)}m`;
  const hours = mins / 60;
  return `${hours.toFixed(1)}h`;
}

export function PatternCompilationWidget({
  patterns,
  totalCompiled,
  className,
  maxVisible = 5,
}: PatternCompilationWidgetProps) {
  const visiblePatterns = useMemo(() => {
    return [...patterns]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, maxVisible);
  }, [patterns, maxVisible]);

  const totalTimeSaved = useMemo(() => {
    return patterns.reduce(
      (total, p) => total + p.executionCount * p.timeSaved,
      0
    );
  }, [patterns]);

  const neuralConverted = useMemo(() => {
    return patterns.filter((p) => p.convertedFrom === 'neural').length;
  }, [patterns]);

  return (
    <Card className={cn('bg-slate-800/50 border-slate-700/50', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Pattern Compilation
            </CardTitle>
            <CardDescription className="text-slate-400">
              Patterns converted to deterministic S1
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{totalCompiled}</p>
            <p className="text-xs text-slate-400">Patterns Compiled</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Stats Row */}
        <div className="flex items-center gap-4 mb-4 p-3 rounded-lg bg-slate-900/50">
          <div className="flex-1 text-center border-r border-slate-700">
            <p className="text-lg font-semibold text-indigo-400">
              {formatTimeSaved(totalTimeSaved)}
            </p>
            <p className="text-xs text-slate-500">Time Saved</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-lg font-semibold text-purple-400">
              {neuralConverted}
            </p>
            <p className="text-xs text-slate-500">Neural to Symbolic</p>
          </div>
        </div>

        {/* Conversion Indicator */}
        <div className="flex items-center justify-center gap-2 mb-4 p-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded bg-purple-500/20">
              <Zap className="w-3 h-3 text-purple-400" />
            </div>
            <span className="text-xs font-medium text-purple-300">Neural</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500" />
          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded bg-indigo-500/20">
              <FileCode className="w-3 h-3 text-indigo-400" />
            </div>
            <span className="text-xs font-medium text-indigo-300">Symbolic</span>
          </div>
          <span className="ml-2 text-xs text-emerald-400 font-medium">Now Deterministic</span>
        </div>

        {/* Recent Compilations */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Recent Compilations
          </p>
          {visiblePatterns.map((pattern) => (
            <div
              key={pattern.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-700/30 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-1.5 rounded bg-slate-700/50">
                  <FileCode className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {pattern.patternName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{pattern.sourcePath}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs',
                    pattern.convertedFrom === 'neural'
                      ? 'border-purple-500/30 text-purple-400 bg-purple-500/10'
                      : 'border-slate-600 text-slate-400 bg-slate-700/50'
                  )}
                >
                  {pattern.convertedFrom === 'neural' ? 'Neural' : 'Manual'}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(pattern.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {patterns.length > maxVisible && (
          <div className="mt-3 pt-3 border-t border-slate-700 text-center">
            <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              View all {patterns.length} recent compilations
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PatternCompilationWidget;
