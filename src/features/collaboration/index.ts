/**
 * Collaboration Feature Module
 *
 * Exports all collaboration-related components and utilities:
 * - FlowDashboard: Daily overview with 3-widget layout
 * - Widgets: Upcoming, PendingReviews, CognateStatus
 * - Approval System: Queue, Card
 * - CollabInbox: Unified message center
 * - Store: Zustand store for state management
 */

// Main Dashboard
export { FlowDashboard, default as FlowDashboardDefault } from './FlowDashboard';

// Dashboard Widgets
export { UpcomingWidget, default as UpcomingWidgetDefault } from './UpcomingWidget';
export {
  PendingReviewsWidget,
  default as PendingReviewsWidgetDefault,
} from './PendingReviewsWidget';
export {
  CognateStatusWidget,
  default as CognateStatusWidgetDefault,
} from './CognateStatusWidget';

// Approval System
export { ApprovalQueue, default as ApprovalQueueDefault } from './ApprovalQueue';
export { ApprovalCard, default as ApprovalCardDefault } from './ApprovalCard';

// Inbox
export { CollabInbox, default as CollabInboxDefault } from './CollabInbox';

// Store
export {
  useCollaborationStore,
  // Types
  type ApprovalType,
  type ApprovalPriority,
  type ApprovalStatus,
  type ApprovalPreview,
  type PendingApproval,
  type CalendarEvent,
  type CognateStatus,
  type CognateHealth,
  type CognateStatusItem,
  type InboxItemType,
  type InboxPriority,
  type InboxItem,
  // Mock data (for testing/development)
  mockPendingApprovals,
  mockUpcomingEvents,
  mockCognateStatuses,
  mockInboxItems,
} from './collaboration-store';
