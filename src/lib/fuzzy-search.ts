/**
 * Fuzzy Search Utility
 *
 * Provides fuzzy matching for command palette search across multiple fields.
 * Returns items sorted by relevance score (higher = better match).
 */

// ============================================================================
// Types
// ============================================================================

export interface SearchableItem {
  id: string;
  title: string;
  description?: string;
  [key: string]: unknown;
}

export interface ScoredItem<T> extends SearchableItem {
  score: number;
  matchedFields: string[];
  originalItem: T;
}

export interface FuzzySearchOptions {
  /** Fields to search in (default: ['title', 'description']) */
  keys?: string[];
  /** Minimum score threshold to include in results (default: 0) */
  threshold?: number;
  /** Maximum number of results to return (default: unlimited) */
  limit?: number;
  /** Whether to boost title matches (default: true) */
  boostTitleMatches?: boolean;
  /** Custom scoring weights */
  weights?: {
    exactMatch?: number;
    startsWith?: number;
    contains?: number;
    wordMatch?: number;
    titleBoost?: number;
  };
}

const DEFAULT_WEIGHTS = {
  exactMatch: 100,
  startsWith: 75,
  contains: 50,
  wordMatch: 25,
  titleBoost: 1.5,
};

// ============================================================================
// Core Fuzzy Search Function
// ============================================================================

export function fuzzySearch<T extends SearchableItem>(
  query: string,
  items: T[],
  options: FuzzySearchOptions = {}
): ScoredItem<T>[] {
  const {
    keys = ['title', 'description'],
    threshold = 0,
    limit,
    boostTitleMatches = true,
    weights = DEFAULT_WEIGHTS,
  } = options;

  if (!query || query.trim() === '') {
    return items.map((item) => ({
      ...item,
      score: 0,
      matchedFields: [],
      originalItem: item,
    }));
  }

  const normalizedQuery = query.toLowerCase().trim();
  const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length > 0);

  const scored = items.map((item) => {
    let score = 0;
    const matchedFields: string[] = [];

    keys.forEach((key) => {
      const value = String(item[key] ?? '').toLowerCase();
      if (!value) return;

      if (value === normalizedQuery) {
        score += weights.exactMatch ?? DEFAULT_WEIGHTS.exactMatch;
        matchedFields.push(key);
        return;
      }

      if (value.startsWith(normalizedQuery)) {
        score += weights.startsWith ?? DEFAULT_WEIGHTS.startsWith;
        matchedFields.push(key);
        return;
      }

      if (value.includes(normalizedQuery)) {
        score += weights.contains ?? DEFAULT_WEIGHTS.contains;
        matchedFields.push(key);
        return;
      }

      let wordMatchCount = 0;
      queryWords.forEach((word) => {
        if (value.includes(word)) {
          wordMatchCount++;
        }
      });

      if (wordMatchCount > 0) {
        const wordScore =
          (wordMatchCount / queryWords.length) *
          (weights.wordMatch ?? DEFAULT_WEIGHTS.wordMatch);
        score += wordScore;
        if (!matchedFields.includes(key)) {
          matchedFields.push(key);
        }
      }
    });

    if (boostTitleMatches && matchedFields.includes('title')) {
      score *= weights.titleBoost ?? DEFAULT_WEIGHTS.titleBoost;
    }

    return {
      ...item,
      score,
      matchedFields,
      originalItem: item,
    };
  });

  let results = scored
    .filter((item) => item.score > threshold)
    .sort((a, b) => b.score - a.score);

  if (limit && limit > 0) {
    results = results.slice(0, limit);
  }

  return results;
}

// ============================================================================
// Highlight Matching Text
// ============================================================================

export interface HighlightSegment {
  text: string;
  isMatch: boolean;
}

export function highlightMatches(text: string, query: string): HighlightSegment[] {
  if (!query || !text) {
    return [{ text, isMatch: false }];
  }

  const segments: HighlightSegment[] = [];
  const normalizedQuery = query.toLowerCase().trim();
  const normalizedText = text.toLowerCase();

  let currentIndex = 0;
  let searchIndex = normalizedText.indexOf(normalizedQuery);

  if (searchIndex === -1) {
    const words = normalizedQuery.split(/\s+/).filter((w) => w.length > 1);
    if (words.length === 0) {
      return [{ text, isMatch: false }];
    }

    let remaining = text;
    words.forEach((word) => {
      const wordIndex = remaining.toLowerCase().indexOf(word);
      if (wordIndex !== -1) {
        if (wordIndex > 0) {
          segments.push({ text: remaining.slice(0, wordIndex), isMatch: false });
        }
        segments.push({ text: remaining.slice(wordIndex, wordIndex + word.length), isMatch: true });
        remaining = remaining.slice(wordIndex + word.length);
      }
    });

    if (remaining) {
      segments.push({ text: remaining, isMatch: false });
    }

    return segments.length > 0 ? segments : [{ text, isMatch: false }];
  }

  while (searchIndex !== -1 && currentIndex < text.length) {
    if (searchIndex > currentIndex) {
      segments.push({
        text: text.slice(currentIndex, searchIndex),
        isMatch: false,
      });
    }

    segments.push({
      text: text.slice(searchIndex, searchIndex + query.length),
      isMatch: true,
    });

    currentIndex = searchIndex + query.length;
    searchIndex = normalizedText.indexOf(normalizedQuery, currentIndex);
  }

  if (currentIndex < text.length) {
    segments.push({
      text: text.slice(currentIndex),
      isMatch: false,
    });
  }

  return segments;
}
