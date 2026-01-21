/**
 * Ledger Store - State Management for Audit Trail
 *
 * Manages ledger entries that record all significant events
 * using the 6 W's framework (Who, What, When, Where, Why, How).
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  LedgerEntry,
  LedgerFilter,
  LedgerCategory,
  LedgerSeverity,
  ActorType,
} from '@/types';

// ============================================================================
// EXTENDED TYPES FOR UI
// ============================================================================

export interface LedgerPaginationState {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface LedgerSortState {
  field: 'when' | 'sequence' | 'severity' | 'category';
  direction: 'asc' | 'desc';
}

// ============================================================================
// STATE INTERFACE
// ============================================================================

interface LedgerState {
  // Data
  entries: LedgerEntry[];
  selectedEntry: LedgerEntry | null;

  // Filters
  filters: LedgerFilter;
  sort: LedgerSortState;
  pagination: LedgerPaginationState;

  // UI State
  isLoading: boolean;
  error: string | null;
  isEvidencePanelOpen: boolean;

  // Actions - Data
  setEntries: (entries: LedgerEntry[]) => void;
  selectEntry: (entry: LedgerEntry | null) => void;

  // Actions - Filters
  setFilters: (filters: Partial<LedgerFilter>) => void;
  resetFilters: () => void;
  setSort: (sort: LedgerSortState) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;

  // Actions - UI
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleEvidencePanel: () => void;
  openEvidencePanel: () => void;
  closeEvidencePanel: () => void;

  // Actions - Data Loading
  loadMockData: () => void;

  // Computed
  getFilteredEntries: () => LedgerEntry[];
  getPaginatedEntries: () => LedgerEntry[];
  getCategoryCount: (category: LedgerCategory) => number;
  getActorTypeCount: (actorType: ActorType) => number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const now = new Date();

function createDate(hoursAgo: number): Date {
  return new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
}

function generateHash(): string {
  const chars = 'abcdef0123456789';
  return Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

const mockEntries: LedgerEntry[] = [
  // Entry 1: Cognate action
  {
    id: 'led-001',
    sequence: 1001,
    who: {
      type: 'cognate',
      id: 'cog-support',
      name: 'Support Cognate',
      metadata: { tier: 2, autonomyLevel: 'supervised' },
    },
    what: {
      type: 'respond_to_ticket',
      description: 'Responded to customer support ticket #4582',
      category: 'action',
      severity: 'info',
      status: 'completed',
      result: 'Ticket resolved with satisfaction rating 5/5',
      duration: 45000,
    },
    when: createDate(0.5),
    where: {
      spaceId: 'space-support',
      spaceName: 'Customer Support',
      projectId: 'proj-tickets',
      projectName: 'Ticket Management',
    },
    why: {
      trigger: 'user_request',
      reasoning: 'Customer submitted inquiry about billing',
      triggerRef: { type: 'message', id: 'msg-9284', name: 'Billing Question' },
      goal: 'Resolve customer inquiry efficiently',
      confidence: 0.94,
    },
    how: {
      approach: 'symbolic',
      tools: ['knowledge-base', 'billing-api'],
      model: 'gpt-4-turbo',
      parameters: { temperature: 0.3 },
      steps: ['Parse inquiry', 'Search knowledge base', 'Retrieve billing data', 'Generate response'],
      resources: { tokens: 1247, apiCalls: 3, duration: 45000, cost: 0.024 },
    },
    tags: ['support', 'billing', 'resolved'],
    crypto: {
      contentHash: `sha256:${generateHash()}`,
      previousHash: `sha256:${generateHash()}`,
      algorithm: 'sha256',
      hashedAt: createDate(0.5),
    },
    isFlagged: false,
    createdAt: createDate(0.5),
  },
  // Entry 2: User approval
  {
    id: 'led-002',
    sequence: 1002,
    who: {
      type: 'user',
      id: 'user-jsmith',
      name: 'John Smith',
      metadata: { role: 'Admin' },
    },
    what: {
      type: 'approve_deployment',
      description: 'Approved production deployment for Marketing Automation',
      category: 'approval',
      severity: 'notice',
      status: 'completed',
      result: 'Deployment queued for execution',
    },
    when: createDate(1.2),
    where: {
      spaceId: 'space-marketing',
      spaceName: 'Marketing',
      projectId: 'proj-automation',
      projectName: 'Marketing Automation',
    },
    why: {
      trigger: 'automation',
      reasoning: 'Automation requested approval for production changes',
      triggerRef: { type: 'automation', id: 'auto-deploy-123', name: 'Deploy Pipeline' },
      goal: 'Release new marketing features',
    },
    how: {
      approach: 'manual',
      steps: ['Review changes', 'Verify tests passed', 'Click approve'],
    },
    tags: ['deployment', 'approval', 'marketing'],
    crypto: {
      contentHash: `sha256:${generateHash()}`,
      previousHash: `sha256:${generateHash()}`,
      algorithm: 'sha256',
      hashedAt: createDate(1.2),
    },
    isFlagged: false,
    createdAt: createDate(1.2),
  },
  // Entry 3: System warning
  {
    id: 'led-003',
    sequence: 1003,
    who: {
      type: 'system',
      id: 'sys-monitor',
      name: 'System Monitor',
    },
    what: {
      type: 'rate_limit_warning',
      description: 'API rate limit approaching threshold (85%)',
      category: 'system',
      severity: 'warning',
      status: 'completed',
    },
    when: createDate(2.5),
    where: {
      externalSystem: 'OpenAI API',
      path: '/v1/chat/completions',
    },
    why: {
      trigger: 'condition',
      reasoning: 'Usage exceeded 80% of rate limit',
      triggerRef: { type: 'rule', id: 'rule-rate-limit', name: 'Rate Limit Monitor' },
    },
    how: {
      approach: 'symbolic',
      steps: ['Check current usage', 'Compare to threshold', 'Generate alert'],
    },
    tags: ['system', 'rate-limit', 'warning'],
    crypto: {
      contentHash: `sha256:${generateHash()}`,
      previousHash: `sha256:${generateHash()}`,
      algorithm: 'sha256',
      hashedAt: createDate(2.5),
    },
    isFlagged: true,
    createdAt: createDate(2.5),
  },
  // Entry 4: Cognate decision
  {
    id: 'led-004',
    sequence: 1004,
    who: {
      type: 'cognate',
      id: 'cog-analyst',
      name: 'Data Analyst Cognate',
      metadata: { tier: 3, autonomyLevel: 'autonomous' },
    },
    what: {
      type: 'classify_data',
      description: 'Classified 1,247 incoming leads by quality score',
      category: 'decision',
      severity: 'info',
      status: 'completed',
      result: 'High: 312, Medium: 589, Low: 346',
      duration: 180000,
    },
    when: createDate(4),
    where: {
      spaceId: 'space-sales',
      spaceName: 'Sales',
      projectId: 'proj-leads',
      projectName: 'Lead Management',
    },
    why: {
      trigger: 'schedule',
      reasoning: 'Scheduled daily lead classification task',
      goal: 'Prioritize sales team efforts',
      confidence: 0.91,
    },
    how: {
      approach: 'hybrid',
      tools: ['crm-api', 'scoring-model'],
      model: 'gpt-4-turbo',
      parameters: { temperature: 0.1 },
      steps: ['Fetch new leads', 'Extract features', 'Run scoring model', 'Update CRM'],
      resources: { tokens: 45000, apiCalls: 1250, duration: 180000, cost: 0.89 },
    },
    tags: ['sales', 'leads', 'classification', 'automated'],
    crypto: {
      contentHash: `sha256:${generateHash()}`,
      previousHash: `sha256:${generateHash()}`,
      algorithm: 'sha256',
      hashedAt: createDate(4),
    },
    isFlagged: false,
    createdAt: createDate(4),
  },
  // Entry 5: Escalation
  {
    id: 'led-005',
    sequence: 1005,
    who: {
      type: 'cognate',
      id: 'cog-support',
      name: 'Support Cognate',
      metadata: { tier: 2, autonomyLevel: 'supervised' },
    },
    what: {
      type: 'escalate_ticket',
      description: 'Escalated ticket #4601 to human review',
      category: 'escalation',
      severity: 'notice',
      status: 'completed',
      result: 'Assigned to senior support engineer',
    },
    when: createDate(6),
    where: {
      spaceId: 'space-support',
      spaceName: 'Customer Support',
      projectId: 'proj-tickets',
      projectName: 'Ticket Management',
    },
    why: {
      trigger: 'condition',
      reasoning: 'Customer sentiment negative, confidence below threshold',
      triggerRef: { type: 'sop', id: 'sop-escalation', name: 'Escalation SOP' },
      confidence: 0.42,
    },
    how: {
      approach: 'symbolic',
      tools: ['sentiment-analysis', 'routing-engine'],
      steps: ['Analyze sentiment', 'Check confidence', 'Apply escalation rule', 'Notify team'],
    },
    tags: ['support', 'escalation', 'human-review'],
    crypto: {
      contentHash: `sha256:${generateHash()}`,
      previousHash: `sha256:${generateHash()}`,
      algorithm: 'sha256',
      hashedAt: createDate(6),
    },
    isFlagged: false,
    createdAt: createDate(6),
  },
  // Entry 6: Integration event
  {
    id: 'led-006',
    sequence: 1006,
    who: {
      type: 'integration',
      id: 'int-slack',
      name: 'Slack Integration',
    },
    what: {
      type: 'sync_messages',
      description: 'Synced 89 messages from #general channel',
      category: 'integration',
      severity: 'info',
      status: 'completed',
      duration: 12000,
    },
    when: createDate(8),
    where: {
      externalSystem: 'Slack',
      path: '/channels/general',
    },
    why: {
      trigger: 'schedule',
      reasoning: 'Scheduled sync every 15 minutes',
    },
    how: {
      approach: 'symbolic',
      tools: ['slack-api'],
      steps: ['Fetch new messages', 'Process mentions', 'Update context'],
      resources: { apiCalls: 3, duration: 12000 },
    },
    tags: ['integration', 'slack', 'sync'],
    crypto: {
      contentHash: `sha256:${generateHash()}`,
      previousHash: `sha256:${generateHash()}`,
      algorithm: 'sha256',
      hashedAt: createDate(8),
    },
    isFlagged: false,
    createdAt: createDate(8),
  },
  // Entry 7: Error event
  {
    id: 'led-007',
    sequence: 1007,
    who: {
      type: 'cognate',
      id: 'cog-writer',
      name: 'Content Writer Cognate',
      metadata: { tier: 2, autonomyLevel: 'supervised' },
    },
    what: {
      type: 'generate_content',
      description: 'Failed to generate blog post - context window exceeded',
      category: 'error',
      severity: 'error',
      status: 'failed',
      result: 'Error: Maximum context length exceeded (128k tokens)',
    },
    when: createDate(10),
    where: {
      spaceId: 'space-content',
      spaceName: 'Content',
      projectId: 'proj-blog',
      projectName: 'Blog Management',
    },
    why: {
      trigger: 'user_request',
      reasoning: 'User requested comprehensive industry report',
      triggerRef: { type: 'message', id: 'msg-8821', name: 'Generate Report' },
    },
    how: {
      approach: 'neural',
      model: 'gpt-4-turbo',
      steps: ['Gather research', 'Build context', 'FAILED: Context overflow'],
      resources: { tokens: 128000, cost: 0.42 },
    },
    tags: ['content', 'error', 'context-overflow'],
    crypto: {
      contentHash: `sha256:${generateHash()}`,
      previousHash: `sha256:${generateHash()}`,
      algorithm: 'sha256',
      hashedAt: createDate(10),
    },
    isFlagged: true,
    createdAt: createDate(10),
  },
  // Entry 8: Configuration change
  {
    id: 'led-008',
    sequence: 1008,
    who: {
      type: 'user',
      id: 'user-mjones',
      name: 'Mary Jones',
      metadata: { role: 'Manager' },
    },
    what: {
      type: 'update_config',
      description: 'Updated Cognate autonomy level from supervised to autonomous',
      category: 'change',
      severity: 'notice',
      status: 'completed',
    },
    when: createDate(12),
    where: {
      spaceId: 'space-admin',
      spaceName: 'Administration',
      path: '/settings/cognates/cog-analyst',
    },
    why: {
      trigger: 'user_request',
      reasoning: 'Cognate demonstrated consistent high performance',
    },
    how: {
      approach: 'manual',
      steps: ['Navigate to settings', 'Select Cognate', 'Update autonomy level', 'Save changes'],
    },
    tags: ['config', 'cognate', 'autonomy'],
    crypto: {
      contentHash: `sha256:${generateHash()}`,
      previousHash: `sha256:${generateHash()}`,
      algorithm: 'sha256',
      hashedAt: createDate(12),
    },
    isFlagged: false,
    createdAt: createDate(12),
  },
  // Entry 9: Creation event
  {
    id: 'led-009',
    sequence: 1009,
    who: {
      type: 'user',
      id: 'user-jsmith',
      name: 'John Smith',
      metadata: { role: 'Admin' },
    },
    what: {
      type: 'create_narrative',
      description: 'Created new Narrative: Customer Onboarding Flow',
      category: 'creation',
      severity: 'info',
      status: 'completed',
    },
    when: createDate(18),
    where: {
      spaceId: 'space-product',
      spaceName: 'Product',
      projectId: 'proj-onboarding',
      projectName: 'User Onboarding',
    },
    why: {
      trigger: 'user_request',
      reasoning: 'Team requested automated onboarding sequence',
    },
    how: {
      approach: 'manual',
      tools: ['narrative-builder'],
      steps: ['Define triggers', 'Add steps', 'Configure Cognates', 'Activate'],
    },
    tags: ['narrative', 'onboarding', 'creation'],
    crypto: {
      contentHash: `sha256:${generateHash()}`,
      previousHash: `sha256:${generateHash()}`,
      algorithm: 'sha256',
      hashedAt: createDate(18),
    },
    isFlagged: false,
    createdAt: createDate(18),
  },
  // Entry 10: Communication event
  {
    id: 'led-010',
    sequence: 1010,
    who: {
      type: 'cognate',
      id: 'cog-comms',
      name: 'Communications Cognate',
      metadata: { tier: 2, autonomyLevel: 'supervised' },
    },
    what: {
      type: 'send_notification',
      description: 'Sent weekly digest email to 1,247 subscribers',
      category: 'communication',
      severity: 'info',
      status: 'completed',
      duration: 85000,
    },
    when: createDate(24),
    where: {
      spaceId: 'space-marketing',
      spaceName: 'Marketing',
      projectId: 'proj-email',
      projectName: 'Email Campaigns',
    },
    why: {
      trigger: 'schedule',
      reasoning: 'Weekly digest scheduled for Monday 9am',
      goal: 'Keep subscribers engaged',
    },
    how: {
      approach: 'hybrid',
      tools: ['email-service', 'personalization-engine'],
      model: 'gpt-4-turbo',
      steps: ['Generate content', 'Personalize per segment', 'Send via email service'],
      resources: { tokens: 89000, apiCalls: 1250, duration: 85000, cost: 1.78 },
    },
    tags: ['email', 'marketing', 'digest'],
    crypto: {
      contentHash: `sha256:${generateHash()}`,
      previousHash: `sha256:${generateHash()}`,
      algorithm: 'sha256',
      hashedAt: createDate(24),
    },
    isFlagged: false,
    createdAt: createDate(24),
  },
  // Entry 11: Access event
  {
    id: 'led-011',
    sequence: 1011,
    who: {
      type: 'user',
      id: 'user-alee',
      name: 'Alice Lee',
      metadata: { role: 'Viewer', ipAddress: '192.168.1.45' },
    },
    what: {
      type: 'access_report',
      description: 'Accessed Q4 Financial Report',
      category: 'access',
      severity: 'info',
      status: 'completed',
    },
    when: createDate(28),
    where: {
      spaceId: 'space-finance',
      spaceName: 'Finance',
      projectId: 'proj-reports',
      projectName: 'Financial Reports',
      path: '/reports/q4-2025',
    },
    why: {
      trigger: 'user_request',
      reasoning: 'User navigated to report page',
    },
    how: {
      approach: 'direct',
      steps: ['Authenticate', 'Verify permissions', 'Load report'],
    },
    tags: ['access', 'finance', 'report'],
    crypto: {
      contentHash: `sha256:${generateHash()}`,
      previousHash: `sha256:${generateHash()}`,
      algorithm: 'sha256',
      hashedAt: createDate(28),
    },
    isFlagged: false,
    createdAt: createDate(28),
  },
  // Entry 12: Automation trigger
  {
    id: 'led-012',
    sequence: 1012,
    who: {
      type: 'automation',
      id: 'auto-backup',
      name: 'Daily Backup Automation',
    },
    what: {
      type: 'execute_backup',
      description: 'Completed daily backup of all Spaces',
      category: 'action',
      severity: 'info',
      status: 'completed',
      duration: 420000,
    },
    when: createDate(36),
    where: {
      externalSystem: 'AWS S3',
      path: 's3://symtex-backups/daily/',
    },
    why: {
      trigger: 'schedule',
      reasoning: 'Daily backup scheduled for 3am UTC',
    },
    how: {
      approach: 'symbolic',
      tools: ['backup-service', 's3-api'],
      steps: ['Identify changed data', 'Compress', 'Upload to S3', 'Verify integrity'],
      resources: { apiCalls: 47, duration: 420000 },
    },
    tags: ['backup', 'system', 'automated'],
    crypto: {
      contentHash: `sha256:${generateHash()}`,
      previousHash: `sha256:${generateHash()}`,
      algorithm: 'sha256',
      hashedAt: createDate(36),
    },
    isFlagged: false,
    createdAt: createDate(36),
  },
  // Entry 13: Cognate learning
  {
    id: 'led-013',
    sequence: 1013,
    who: {
      type: 'cognate',
      id: 'cog-support',
      name: 'Support Cognate',
      metadata: { tier: 2, autonomyLevel: 'supervised' },
    },
    what: {
      type: 'pattern_learned',
      description: 'Learned new response pattern for shipping inquiries',
      category: 'change',
      severity: 'info',
      status: 'completed',
    },
    when: createDate(42),
    where: {
      spaceId: 'space-support',
      spaceName: 'Customer Support',
    },
    why: {
      trigger: 'event',
      reasoning: 'Pattern compiled from 50+ similar successful responses',
      triggerRef: { type: 'rule', id: 'rule-pattern-learn', name: 'Pattern Learning' },
    },
    how: {
      approach: 'hybrid',
      steps: ['Identify pattern', 'Validate accuracy', 'Compile to S1', 'Deploy'],
    },
    tags: ['learning', 'pattern', 'support'],
    crypto: {
      contentHash: `sha256:${generateHash()}`,
      previousHash: `sha256:${generateHash()}`,
      algorithm: 'sha256',
      hashedAt: createDate(42),
    },
    isFlagged: false,
    createdAt: createDate(42),
  },
  // Entry 14: Deletion event
  {
    id: 'led-014',
    sequence: 1014,
    who: {
      type: 'user',
      id: 'user-jsmith',
      name: 'John Smith',
      metadata: { role: 'Admin' },
    },
    what: {
      type: 'delete_draft',
      description: 'Deleted draft Narrative: Abandoned Cart Recovery (v2)',
      category: 'deletion',
      severity: 'notice',
      status: 'completed',
    },
    when: createDate(48),
    where: {
      spaceId: 'space-marketing',
      spaceName: 'Marketing',
      projectId: 'proj-automation',
      projectName: 'Marketing Automation',
    },
    why: {
      trigger: 'user_request',
      reasoning: 'Draft superseded by improved version',
    },
    how: {
      approach: 'manual',
      steps: ['Select draft', 'Confirm deletion', 'Archive to trash'],
    },
    tags: ['deletion', 'narrative', 'cleanup'],
    crypto: {
      contentHash: `sha256:${generateHash()}`,
      previousHash: `sha256:${generateHash()}`,
      algorithm: 'sha256',
      hashedAt: createDate(48),
    },
    isFlagged: false,
    createdAt: createDate(48),
  },
  // Entry 15: Critical system event
  {
    id: 'led-015',
    sequence: 1015,
    who: {
      type: 'system',
      id: 'sys-security',
      name: 'Security Monitor',
    },
    what: {
      type: 'security_alert',
      description: 'Detected unusual login pattern - 5 failed attempts from new IP',
      category: 'system',
      severity: 'critical',
      status: 'completed',
      result: 'Account temporarily locked, admin notified',
    },
    when: createDate(52),
    where: {
      path: '/auth/login',
    },
    why: {
      trigger: 'condition',
      reasoning: 'Failed login threshold exceeded',
      triggerRef: { type: 'rule', id: 'rule-security', name: 'Brute Force Detection' },
    },
    how: {
      approach: 'symbolic',
      steps: ['Detect failed logins', 'Check IP reputation', 'Lock account', 'Send alert'],
    },
    tags: ['security', 'critical', 'login'],
    crypto: {
      contentHash: `sha256:${generateHash()}`,
      previousHash: `sha256:${generateHash()}`,
      algorithm: 'sha256',
      hashedAt: createDate(52),
    },
    isFlagged: true,
    reviewStatus: 'pending',
    createdAt: createDate(52),
  },
  // Entry 16-25: Additional varied entries
  {
    id: 'led-016',
    sequence: 1016,
    who: { type: 'cognate', id: 'cog-research', name: 'Research Cognate', metadata: { tier: 3 } },
    what: { type: 'compile_report', description: 'Compiled competitor analysis report', category: 'action', severity: 'info', status: 'completed', duration: 300000 },
    when: createDate(60),
    where: { spaceId: 'space-strategy', spaceName: 'Strategy', projectId: 'proj-competitive', projectName: 'Competitive Intelligence' },
    why: { trigger: 'user_request', reasoning: 'Quarterly competitive review requested', confidence: 0.88 },
    how: { approach: 'hybrid', tools: ['web-scraper', 'analysis-engine'], resources: { tokens: 67000, cost: 1.34 } },
    tags: ['research', 'competitive', 'report'],
    crypto: { contentHash: `sha256:${generateHash()}`, previousHash: `sha256:${generateHash()}`, algorithm: 'sha256', hashedAt: createDate(60) },
    isFlagged: false,
    createdAt: createDate(60),
  },
  {
    id: 'led-017',
    sequence: 1017,
    who: { type: 'user', id: 'user-bwilson', name: 'Bob Wilson', metadata: { role: 'Developer' } },
    what: { type: 'deploy_update', description: 'Deployed hotfix for checkout flow', category: 'change', severity: 'notice', status: 'completed' },
    when: createDate(66),
    where: { spaceId: 'space-engineering', spaceName: 'Engineering', projectId: 'proj-ecommerce', projectName: 'E-commerce Platform' },
    why: { trigger: 'user_request', reasoning: 'Critical bug fix for payment processing' },
    how: { approach: 'manual', tools: ['ci-cd-pipeline'], steps: ['Commit code', 'Run tests', 'Deploy to staging', 'Deploy to production'] },
    tags: ['deployment', 'hotfix', 'engineering'],
    crypto: { contentHash: `sha256:${generateHash()}`, previousHash: `sha256:${generateHash()}`, algorithm: 'sha256', hashedAt: createDate(66) },
    isFlagged: false,
    createdAt: createDate(66),
  },
  {
    id: 'led-018',
    sequence: 1018,
    who: { type: 'cognate', id: 'cog-hr', name: 'HR Cognate', metadata: { tier: 2, autonomyLevel: 'supervised' } },
    what: { type: 'screen_resume', description: 'Screened 47 resumes for Senior Engineer position', category: 'action', severity: 'info', status: 'completed', result: '12 candidates shortlisted' },
    when: createDate(72),
    where: { spaceId: 'space-hr', spaceName: 'Human Resources', projectId: 'proj-hiring', projectName: 'Talent Acquisition' },
    why: { trigger: 'automation', reasoning: 'New applications received threshold met', confidence: 0.86 },
    how: { approach: 'hybrid', tools: ['resume-parser', 'skills-matcher'], resources: { tokens: 23000, cost: 0.46 } },
    tags: ['hr', 'hiring', 'screening'],
    crypto: { contentHash: `sha256:${generateHash()}`, previousHash: `sha256:${generateHash()}`, algorithm: 'sha256', hashedAt: createDate(72) },
    isFlagged: false,
    createdAt: createDate(72),
  },
  {
    id: 'led-019',
    sequence: 1019,
    who: { type: 'integration', id: 'int-salesforce', name: 'Salesforce Integration' },
    what: { type: 'sync_contacts', description: 'Synced 234 new contacts from Salesforce', category: 'integration', severity: 'info', status: 'completed', duration: 45000 },
    when: createDate(78),
    where: { externalSystem: 'Salesforce', path: '/api/contacts' },
    why: { trigger: 'schedule', reasoning: 'Hourly sync schedule' },
    how: { approach: 'symbolic', tools: ['salesforce-api'], resources: { apiCalls: 12, duration: 45000 } },
    tags: ['integration', 'salesforce', 'contacts'],
    crypto: { contentHash: `sha256:${generateHash()}`, previousHash: `sha256:${generateHash()}`, algorithm: 'sha256', hashedAt: createDate(78) },
    isFlagged: false,
    createdAt: createDate(78),
  },
  {
    id: 'led-020',
    sequence: 1020,
    who: { type: 'cognate', id: 'cog-finance', name: 'Finance Cognate', metadata: { tier: 3, autonomyLevel: 'autonomous' } },
    what: { type: 'generate_invoice', description: 'Generated 156 monthly invoices', category: 'action', severity: 'info', status: 'completed', duration: 120000 },
    when: createDate(84),
    where: { spaceId: 'space-finance', spaceName: 'Finance', projectId: 'proj-billing', projectName: 'Billing Operations' },
    why: { trigger: 'schedule', reasoning: 'Monthly billing cycle - 1st of month', confidence: 0.99 },
    how: { approach: 'symbolic', tools: ['billing-engine', 'pdf-generator', 'email-service'], steps: ['Calculate charges', 'Generate PDFs', 'Send emails'], resources: { apiCalls: 468, duration: 120000 } },
    tags: ['finance', 'invoicing', 'automated'],
    crypto: { contentHash: `sha256:${generateHash()}`, previousHash: `sha256:${generateHash()}`, algorithm: 'sha256', hashedAt: createDate(84) },
    isFlagged: false,
    createdAt: createDate(84),
  },
];

const defaultFilters: LedgerFilter = {
  actorType: [],
  actorId: [],
  category: [],
  severity: [],
  status: [],
  spaceId: [],
  projectId: [],
  tags: [],
  flaggedOnly: false,
};

// ============================================================================
// STORE
// ============================================================================

export const useLedgerStore = create<LedgerState>()(
  devtools(
    (set, get) => ({
      // Initial state
      entries: [],
      selectedEntry: null,
      filters: defaultFilters,
      sort: { field: 'when', direction: 'desc' },
      pagination: { page: 1, pageSize: 10, totalCount: 0, totalPages: 0 },
      isLoading: false,
      error: null,
      isEvidencePanelOpen: false,

      // Data actions
      setEntries: (entries) => {
        const { pagination } = get();
        set({
          entries,
          pagination: {
            ...pagination,
            totalCount: entries.length,
            totalPages: Math.ceil(entries.length / pagination.pageSize),
          },
        });
      },

      selectEntry: (entry) => {
        set({ selectedEntry: entry, isEvidencePanelOpen: entry !== null });
      },

      // Filter actions
      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
          pagination: { ...state.pagination, page: 1 },
        }));
      },

      resetFilters: () => {
        set({ filters: defaultFilters, pagination: { ...get().pagination, page: 1 } });
      },

      setSort: (sort) => {
        set({ sort });
      },

      setPage: (page) => {
        set((state) => ({ pagination: { ...state.pagination, page } }));
      },

      setPageSize: (pageSize) => {
        const { pagination } = get();
        set({
          pagination: {
            ...pagination,
            pageSize,
            page: 1,
            totalPages: Math.ceil(pagination.totalCount / pageSize),
          },
        });
      },

      // UI actions
      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      toggleEvidencePanel: () => {
        set((state) => ({ isEvidencePanelOpen: !state.isEvidencePanelOpen }));
      },

      openEvidencePanel: () => {
        set({ isEvidencePanelOpen: true });
      },

      closeEvidencePanel: () => {
        set({ isEvidencePanelOpen: false });
      },

      loadMockData: () => {
        set({
          entries: mockEntries,
          pagination: {
            page: 1,
            pageSize: 10,
            totalCount: mockEntries.length,
            totalPages: Math.ceil(mockEntries.length / 10),
          },
          isLoading: false,
          error: null,
        });
      },

      // Computed
      getFilteredEntries: () => {
        const { entries, filters, sort } = get();

        let filtered = [...entries];

        // Apply filters
        if (filters.actorType && filters.actorType.length > 0) {
          filtered = filtered.filter((e) => filters.actorType!.includes(e.who.type));
        }
        if (filters.category && filters.category.length > 0) {
          filtered = filtered.filter((e) => filters.category!.includes(e.what.category));
        }
        if (filters.severity && filters.severity.length > 0) {
          filtered = filtered.filter((e) => filters.severity!.includes(e.what.severity));
        }
        if (filters.spaceId && filters.spaceId.length > 0) {
          filtered = filtered.filter((e) => e.where.spaceId && filters.spaceId!.includes(e.where.spaceId));
        }
        if (filters.flaggedOnly) {
          filtered = filtered.filter((e) => e.isFlagged);
        }
        if (filters.search) {
          const search = filters.search.toLowerCase();
          filtered = filtered.filter(
            (e) =>
              e.what.description.toLowerCase().includes(search) ||
              e.who.name.toLowerCase().includes(search) ||
              e.tags.some((t) => t.toLowerCase().includes(search))
          );
        }
        if (filters.dateRange) {
          filtered = filtered.filter(
            (e) => e.when >= filters.dateRange!.from && e.when <= filters.dateRange!.to
          );
        }

        // Apply sorting
        filtered.sort((a, b) => {
          let comparison = 0;
          switch (sort.field) {
            case 'when':
              comparison = a.when.getTime() - b.when.getTime();
              break;
            case 'sequence':
              comparison = a.sequence - b.sequence;
              break;
            case 'severity': {
              const severityOrder: Record<LedgerSeverity, number> = {
                debug: 0,
                info: 1,
                notice: 2,
                warning: 3,
                error: 4,
                critical: 5,
              };
              comparison = severityOrder[a.what.severity] - severityOrder[b.what.severity];
              break;
            }
            case 'category':
              comparison = a.what.category.localeCompare(b.what.category);
              break;
          }
          return sort.direction === 'asc' ? comparison : -comparison;
        });

        return filtered;
      },

      getPaginatedEntries: () => {
        const filtered = get().getFilteredEntries();
        const { page, pageSize } = get().pagination;
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
      },

      getCategoryCount: (category) => {
        return get().entries.filter((e) => e.what.category === category).length;
      },

      getActorTypeCount: (actorType) => {
        return get().entries.filter((e) => e.who.type === actorType).length;
      },
    }),
    { name: 'LedgerStore' }
  )
);
