/**
 * Ledger Entity Types
 *
 * The Ledger is Symtex's immutable audit trail that records all significant
 * events using the 6 W's framework (Who, What, When, Where, Why, How).
 *
 * Every action taken by a Cognate or user is recorded in the Ledger for
 * full transparency and accountability.
 */

// ============================================================================
// LEDGER ENTRY TYPES
// ============================================================================

/**
 * Category of ledger entry
 */
export type LedgerCategory =
  | 'action' // Cognate performed an action
  | 'decision' // A decision was made
  | 'approval' // An approval was granted/denied
  | 'escalation' // Something was escalated
  | 'error' // An error occurred
  | 'access' // Resource was accessed
  | 'change' // Configuration was changed
  | 'creation' // Entity was created
  | 'deletion' // Entity was deleted
  | 'communication' // Message was sent
  | 'integration' // External system interaction
  | 'system'; // System event

/**
 * Severity level of the ledger entry
 */
export type LedgerSeverity = 'debug' | 'info' | 'notice' | 'warning' | 'error' | 'critical';

/**
 * Type of actor that performed the action
 */
export type ActorType = 'user' | 'cognate' | 'system' | 'automation' | 'integration';

/**
 * The actor who performed the action (WHO)
 */
export interface LedgerActor {
  /** Actor type */
  type: ActorType;
  /** Actor ID */
  id: string;
  /** Actor display name */
  name: string;
  /** Additional actor metadata */
  metadata?: {
    /** For Cognates: tier level */
    tier?: number;
    /** For Cognates: autonomy level */
    autonomyLevel?: string;
    /** For users: role */
    role?: string;
    /** IP address (for security) */
    ipAddress?: string;
    /** User agent (for web actions) */
    userAgent?: string;
  };
}

/**
 * What was done (WHAT)
 */
export interface LedgerAction {
  /** Action type/verb */
  type: string;
  /** Human-readable description */
  description: string;
  /** Category of action */
  category: LedgerCategory;
  /** Severity level */
  severity: LedgerSeverity;
  /** Status of the action */
  status: 'initiated' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  /** Result or output */
  result?: string;
  /** Duration in milliseconds (if applicable) */
  duration?: number;
}

/**
 * Where the action occurred (WHERE)
 */
export interface LedgerLocation {
  /** Space ID */
  spaceId?: string;
  /** Space name */
  spaceName?: string;
  /** Project ID */
  projectId?: string;
  /** Project name */
  projectName?: string;
  /** Initiative ID */
  initiativeId?: string;
  /** Automation ID */
  automationId?: string;
  /** Conversation ID (for Symbios interactions) */
  conversationId?: string;
  /** External system identifier */
  externalSystem?: string;
  /** URL or path */
  path?: string;
}

/**
 * Why the action was taken (WHY)
 */
export interface LedgerReason {
  /** Primary reason/trigger */
  trigger: 'user_request' | 'automation' | 'schedule' | 'event' | 'condition' | 'system' | 'error';
  /** Detailed reasoning */
  reasoning?: string;
  /** Reference to triggering entity */
  triggerRef?: {
    /** Entity type */
    type: 'message' | 'automation' | 'event' | 'rule' | 'sop';
    /** Entity ID */
    id: string;
    /** Entity name */
    name?: string;
  };
  /** Goal or objective being pursued */
  goal?: string;
  /** Confidence level (for AI decisions) */
  confidence?: number;
}

/**
 * How the action was performed (HOW)
 */
export interface LedgerMethod {
  /** Method or approach used */
  approach: string;
  /** Tools or integrations used */
  tools?: string[];
  /** Model used (for AI actions) */
  model?: string;
  /** Parameters or configuration */
  parameters?: Record<string, unknown>;
  /** Steps taken */
  steps?: string[];
  /** Resources consumed */
  resources?: {
    /** Token usage */
    tokens?: number;
    /** API calls made */
    apiCalls?: number;
    /** Time taken (ms) */
    duration?: number;
    /** Cost incurred */
    cost?: number;
  };
}

// ============================================================================
// EVIDENCE & ATTACHMENTS
// ============================================================================

/**
 * Type of evidence attachment
 */
export type EvidenceType =
  | 'screenshot'
  | 'document'
  | 'log'
  | 'code'
  | 'data'
  | 'audio'
  | 'video'
  | 'other';

/**
 * Evidence attached to a ledger entry
 */
export interface LedgerEvidence {
  /** Evidence ID */
  id: string;
  /** Evidence type */
  type: EvidenceType;
  /** Display name */
  name: string;
  /** Description */
  description?: string;
  /** MIME type */
  mimeType: string;
  /** File size in bytes */
  size: number;
  /** Storage URL or reference */
  url: string;
  /** Hash for integrity verification */
  hash: string;
  /** When the evidence was captured */
  capturedAt: Date;
  /** Who captured the evidence */
  capturedBy: string;
}

// ============================================================================
// CRYPTOGRAPHIC VERIFICATION
// ============================================================================

/**
 * Cryptographic verification data for immutability
 */
export interface LedgerCrypto {
  /** Hash of this entry's content */
  contentHash: string;
  /** Hash of the previous entry (blockchain-style) */
  previousHash: string;
  /** Digital signature */
  signature?: string;
  /** Signing key identifier */
  keyId?: string;
  /** Hash algorithm used */
  algorithm: 'sha256' | 'sha384' | 'sha512';
  /** Timestamp of when hash was computed */
  hashedAt: Date;
  /** Merkle tree root (for batched entries) */
  merkleRoot?: string;
}

// ============================================================================
// MAIN LEDGER ENTRY INTERFACE
// ============================================================================

/**
 * Ledger Entry using the 6 W's Framework
 *
 * Every significant action in Symtex is recorded as a Ledger Entry,
 * providing complete transparency and an immutable audit trail.
 */
export interface LedgerEntry {
  /** Unique identifier */
  id: string;

  /** Sequence number (for ordering) */
  sequence: number;

  // =========================================================================
  // THE 6 W'S
  // =========================================================================

  /**
   * WHO performed the action
   * The actor responsible for this entry
   */
  who: LedgerActor;

  /**
   * WHAT was done
   * The action that was performed
   */
  what: LedgerAction;

  /**
   * WHEN it happened
   * ISO timestamp of when the action occurred
   */
  when: Date;

  /**
   * WHERE it happened
   * The location/context of the action
   */
  where: LedgerLocation;

  /**
   * WHY it was done
   * The reason or trigger for the action
   */
  why: LedgerReason;

  /**
   * HOW it was done
   * The method or approach used
   */
  how: LedgerMethod;

  // =========================================================================
  // ADDITIONAL DATA
  // =========================================================================

  /** Related entity references */
  relatedEntities?: Array<{
    type: 'cognate' | 'space' | 'project' | 'initiative' | 'automation' | 'user';
    id: string;
    name?: string;
    relationship: 'subject' | 'target' | 'participant' | 'observer';
  }>;

  /** Evidence attachments */
  evidence?: LedgerEvidence[];

  /** Tags for categorization */
  tags: string[];

  /** Cryptographic verification data */
  crypto: LedgerCrypto;

  /** Parent entry ID (for related entries) */
  parentId?: string;

  /** Child entry IDs */
  childIds?: string[];

  /** Whether this entry has been flagged for review */
  isFlagged: boolean;

  /** Review status */
  reviewStatus?: 'pending' | 'reviewed' | 'approved' | 'rejected';

  /** Notes or comments on this entry */
  notes?: string;

  /** Metadata */
  createdAt: Date;
  updatedAt?: Date;
}

// ============================================================================
// LEDGER QUERY TYPES
// ============================================================================

/**
 * Filter options for querying the ledger
 */
export interface LedgerFilter {
  /** Filter by actor type */
  actorType?: ActorType[];
  /** Filter by actor ID */
  actorId?: string[];
  /** Filter by category */
  category?: LedgerCategory[];
  /** Filter by severity */
  severity?: LedgerSeverity[];
  /** Filter by status */
  status?: LedgerAction['status'][];
  /** Filter by Space */
  spaceId?: string[];
  /** Filter by Project */
  projectId?: string[];
  /** Filter by date range */
  dateRange?: {
    from: Date;
    to: Date;
  };
  /** Filter by tags */
  tags?: string[];
  /** Full-text search */
  search?: string;
  /** Filter flagged entries only */
  flaggedOnly?: boolean;
}

/**
 * Sort options for ledger queries
 */
export interface LedgerSort {
  /** Field to sort by */
  field: 'when' | 'sequence' | 'severity' | 'category';
  /** Sort direction */
  direction: 'asc' | 'desc';
}

/**
 * Pagination options for ledger queries
 */
export interface LedgerPagination {
  /** Page number (1-indexed) */
  page: number;
  /** Items per page */
  pageSize: number;
  /** Cursor for cursor-based pagination */
  cursor?: string;
}

/**
 * Ledger query result
 */
export interface LedgerQueryResult {
  /** Entries matching the query */
  entries: LedgerEntry[];
  /** Total count of matching entries */
  totalCount: number;
  /** Current page */
  page: number;
  /** Total pages */
  totalPages: number;
  /** Next page cursor */
  nextCursor?: string;
  /** Whether there are more results */
  hasMore: boolean;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a content hash for a ledger entry
 */
export function generateContentHash(entry: Omit<LedgerEntry, 'id' | 'crypto'>): string {
  // In production, this would use a proper hashing library
  const content = JSON.stringify({
    who: entry.who,
    what: entry.what,
    when: entry.when,
    where: entry.where,
    why: entry.why,
    how: entry.how,
  });

  // Placeholder - in production use crypto.subtle or similar
  return `sha256:${btoa(content).slice(0, 64)}`;
}

/**
 * Verify the integrity of a ledger entry chain
 */
export function verifyChain(entries: LedgerEntry[]): boolean {
  for (let i = 1; i < entries.length; i++) {
    const current = entries[i];
    const previous = entries[i - 1];

    if (current.crypto.previousHash !== previous.crypto.contentHash) {
      return false;
    }
  }
  return true;
}

/**
 * Create a new ledger entry with defaults
 */
export function createLedgerEntry(
  partial: Omit<LedgerEntry, 'id' | 'sequence' | 'crypto' | 'createdAt' | 'isFlagged' | 'tags'> &
    Partial<Pick<LedgerEntry, 'tags' | 'isFlagged'>>
): Omit<LedgerEntry, 'id' | 'sequence' | 'crypto'> & { crypto: Partial<LedgerCrypto> } {
  const now = new Date();

  return {
    ...partial,
    tags: partial.tags ?? [],
    isFlagged: partial.isFlagged ?? false,
    createdAt: now,
    crypto: {
      algorithm: 'sha256',
      hashedAt: now,
      contentHash: '', // Will be computed
      previousHash: '', // Will be set from previous entry
    },
  };
}

/**
 * Format a ledger entry for display
 */
export function formatLedgerEntry(entry: LedgerEntry): string {
  const actor = entry.who.name;
  const action = entry.what.description;
  const location = entry.where.spaceName || entry.where.projectName || 'Unknown location';
  const time = entry.when.toISOString();

  return `[${time}] ${actor} ${action} in ${location}`;
}
