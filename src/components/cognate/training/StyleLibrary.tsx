/**
 * StyleLibrary Component
 *
 * Browsable library of communication styles that can be applied to Cognates.
 */

import {
  BookOpen,
  Search,
  Check,
  Plus,
  MessageSquare,
  Code,
  Lightbulb,
  Briefcase,
  HeartHandshake,
  Crown,
} from 'lucide-react';
import clsx from 'clsx';
import { useTrainingStore } from './trainingStore';
import type { StyleCategoryId, CommunicationStyle } from './types';

// Category icons
const CATEGORY_ICONS: Record<StyleCategoryId, typeof MessageSquare> = {
  communication: MessageSquare,
  technical: Code,
  creative: Lightbulb,
  business: Briefcase,
  support: HeartHandshake,
  leadership: Crown,
};

// Category labels
const CATEGORY_LABELS: Record<StyleCategoryId | 'all', string> = {
  all: 'All Styles',
  communication: 'Communication',
  technical: 'Technical',
  creative: 'Creative',
  business: 'Business',
  support: 'Support',
  leadership: 'Leadership',
};

interface StyleCardProps {
  style: CommunicationStyle;
  onApply: () => void;
  onRemove: () => void;
}

function StyleCard({ style, onApply, onRemove }: StyleCardProps) {
  const CategoryIcon = CATEGORY_ICONS[style.category];

  return (
    <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 hover:border-zinc-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <CategoryIcon className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h4 className="font-medium text-zinc-100">{style.name}</h4>
            <span className="text-xs text-zinc-500">{CATEGORY_LABELS[style.category]}</span>
          </div>
        </div>
        {style.isActive ? (
          <button
            onClick={onRemove}
            className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs font-medium flex items-center gap-1"
          >
            <Check className="w-3 h-3" />
            Active
          </button>
        ) : (
          <button
            onClick={onApply}
            className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-xs font-medium flex items-center gap-1 hover:bg-purple-500/30 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Apply
          </button>
        )}
      </div>

      <p className="text-sm text-zinc-400 mb-3">{style.description}</p>

      {/* Example */}
      <div className="bg-zinc-900 rounded-lg p-3 mb-3">
        <p className="text-xs text-zinc-500 mb-1">Example:</p>
        <p className="text-sm text-zinc-300 italic">"{style.examples}"</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {style.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-zinc-700 text-zinc-400 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="text-xs text-zinc-500">{style.adoptionRate}% adoption</div>
      </div>
    </div>
  );
}

export function StyleLibrary() {
  const { styleFilters, setStyleFilters, getFilteredStyles, applyStyle, removeStyle } =
    useTrainingStore();

  const filteredStyles = getFilteredStyles();
  const categories: (StyleCategoryId | 'all')[] = [
    'all',
    'communication',
    'technical',
    'creative',
    'business',
    'support',
    'leadership',
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            Style Library
          </h3>
          <span className="text-sm text-zinc-500">{filteredStyles.length} styles</span>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search styles..."
            value={styleFilters.search}
            onChange={(e) => setStyleFilters({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setStyleFilters({ category: cat })}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                styleFilters.category === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-zinc-700 text-zinc-400 hover:text-zinc-200'
              )}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Style grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStyles.map((style) => (
          <StyleCard
            key={style.id}
            style={style}
            onApply={() => applyStyle(style.id)}
            onRemove={() => removeStyle(style.id)}
          />
        ))}
      </div>

      {filteredStyles.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400">No styles match your filters</p>
          <button
            onClick={() => setStyleFilters({ search: '', category: 'all', tags: [] })}
            className="mt-2 text-sm text-purple-400 hover:text-purple-300"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

export default StyleLibrary;
