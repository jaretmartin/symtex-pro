/**
 * ApprovalCard Component
 *
 * Individual approval item card showing:
 * - What action is requested
 * - Which Cognate is requesting
 * - Policy reason requiring approval
 * - Risk level indicator
 * - "What would change" preview
 * - Approve/Reject/Modify buttons
 */

import { useState } from 'react';
import {
  Mail,
  FileText,
  Zap,
  ShoppingCart,
  Calendar,
  Check,
  X,
  Edit3,
  AlertTriangle,
  Clock,
  Shield,
  Brain,
  ChevronDown,
  ChevronUp,
  Eye,
} from 'lucide-react';
import clsx from 'clsx';
import {
  type PendingApproval,
  type ApprovalType,
  type ApprovalPriority,
} from './collaboration-store';

interface ApprovalCardProps {
  approval: PendingApproval;
  onApprove: (id: string) => void;
  onReject: (id: string, reason?: string) => void;
  onModify: (id: string) => void;
  className?: string;
  expanded?: boolean;
}

const approvalTypeConfig: Record<
  ApprovalType,
  { icon: React.ElementType; label: string; color: string; bgColor: string }
> = {
  email: {
    icon: Mail,
    label: 'Email',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
  },
  document: {
    icon: FileText,
    label: 'Document',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
  },
  action: {
    icon: Zap,
    label: 'Action',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
  },
  purchase: {
    icon: ShoppingCart,
    label: 'Purchase',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
  },
  meeting: {
    icon: Calendar,
    label: 'Meeting',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
  },
};

const priorityConfig: Record<
  ApprovalPriority,
  {
    color: string;
    bgColor: string;
    borderColor: string;
    label: string;
    icon: React.ElementType;
  }
> = {
  low: {
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/20',
    borderColor: 'border-slate-500/30',
    label: 'Low Risk',
    icon: Shield,
  },
  medium: {
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    label: 'Medium Risk',
    icon: Shield,
  },
  high: {
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/30',
    label: 'High Risk',
    icon: AlertTriangle,
  },
  critical: {
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/30',
    label: 'Critical',
    icon: AlertTriangle,
  },
};

function getTimeUntilExpiry(expiresAt?: string): string | null {
  if (!expiresAt) return null;

  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();

  if (diff < 0) return 'Expired';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} left`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  }
  return `${minutes}m left`;
}

function formatRequestTime(isoTime: string): string {
  const date = new Date(isoTime);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ApprovalCard({
  approval,
  onApprove,
  onReject,
  onModify,
  className,
  expanded: initialExpanded = false,
}: ApprovalCardProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  const typeConfig = approvalTypeConfig[approval.type];
  const prioConfig = priorityConfig[approval.riskLevel];
  const TypeIcon = typeConfig.icon;
  const PriorityIcon = prioConfig.icon;
  const expiryText = getTimeUntilExpiry(approval.expiresAt);
  const isExpiringSoon =
    approval.expiresAt &&
    (new Date(approval.expiresAt).getTime() - new Date().getTime()) /
      (1000 * 60 * 60) <
      4;

  const handleApprove = (): void => {
    onApprove(approval.id);
  };

  const handleReject = (): void => {
    // Show confirmation for high-risk or critical approvals
    if (approval.riskLevel === 'critical' || approval.riskLevel === 'high') {
      setShowRejectConfirm(true);
    } else {
      onReject(approval.id);
    }
  };

  const confirmReject = (): void => {
    onReject(approval.id);
    setShowRejectConfirm(false);
  };

  const cancelReject = (): void => {
    setShowRejectConfirm(false);
  };

  const handleModify = (): void => {
    onModify(approval.id);
  };

  return (
    <div
      className={clsx(
        'bg-zinc-900/50 border rounded-lg overflow-hidden transition-all',
        approval.riskLevel === 'critical'
          ? 'border-red-500/50'
          : approval.riskLevel === 'high'
          ? 'border-amber-500/30'
          : 'border-zinc-800',
        className
      )}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Type Icon */}
          <div className={clsx('p-3 rounded-lg flex-shrink-0', typeConfig.bgColor)}>
            <TypeIcon className={clsx('w-5 h-5', typeConfig.color)} />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Title Row */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-white truncate">{approval.title}</h3>
              <span
                className={clsx(
                  'flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border',
                  prioConfig.bgColor,
                  prioConfig.color,
                  prioConfig.borderColor
                )}
              >
                <PriorityIcon className="w-3 h-3" />
                {prioConfig.label}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-400 mb-2">{approval.description}</p>

            {/* Cognate Attribution */}
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-2">
                {approval.cognateAvatar ? (
                  <img
                    src={approval.cognateAvatar}
                    alt={approval.cognateName}
                    className="w-5 h-5 rounded"
                  />
                ) : (
                  <div className="w-5 h-5 rounded bg-gradient-to-br from-symtex-primary to-purple-600 flex items-center justify-center">
                    <Brain className="w-3 h-3 text-white" />
                  </div>
                )}
                <span className="text-zinc-400">
                  Requested by{' '}
                  <span className="text-symtex-primary font-medium">
                    {approval.cognateName}
                  </span>
                </span>
              </div>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-500">{formatRequestTime(approval.requestedAt)}</span>
            </div>
          </div>

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Policy Reason Banner */}
      <div className="px-4 py-2 bg-zinc-800/50 border-y border-zinc-800 flex items-center gap-2">
        <Shield className="w-4 h-4 text-zinc-500" />
        <span className="text-sm text-zinc-400">
          <strong className="text-zinc-300">Policy:</strong> {approval.policyReason}
        </span>
      </div>

      {/* Expandable Preview Section */}
      {isExpanded && (
        <div className="p-4 border-b border-zinc-800 bg-zinc-800/30">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-zinc-500" />
            <h4 className="text-sm font-medium text-zinc-300">Preview</h4>
          </div>

          {/* Preview Content */}
          <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-4">
            {approval.preview.type === 'email' && (
              <div className="space-y-2">
                {approval.preview.to && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-zinc-500 w-16">To:</span>
                    <span className="text-zinc-300">{approval.preview.to}</span>
                  </div>
                )}
                {approval.preview.subject && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-zinc-500 w-16">Subject:</span>
                    <span className="text-white font-medium">
                      {approval.preview.subject}
                    </span>
                  </div>
                )}
                <div className="pt-2 mt-2 border-t border-zinc-800">
                  <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans">
                    {approval.preview.content}
                  </pre>
                </div>
              </div>
            )}

            {approval.preview.type === 'document' && (
              <div className="space-y-2">
                {approval.preview.subject && (
                  <h5 className="font-medium text-white">{approval.preview.subject}</h5>
                )}
                <div className="prose prose-invert prose-sm max-w-none">
                  <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans">
                    {approval.preview.content}
                  </pre>
                </div>
              </div>
            )}

            {approval.preview.type === 'text' && (
              <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans">
                {approval.preview.content}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Reject Confirmation Dialog */}
      {showRejectConfirm && (
        <div className="p-4 bg-red-500/10 border-t border-red-500/20">
          <p className="text-sm text-red-400 mb-3">
            Are you sure you want to reject this {approval.riskLevel}-risk approval?
            This action cannot be undone.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={confirmReject}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
                'bg-red-500/20 border border-red-500/30 text-red-400',
                'hover:bg-red-500/30 hover:border-red-500/50',
                'transition-colors'
              )}
            >
              <X className="w-4 h-4" />
              Yes, Reject
            </button>
            <button
              onClick={cancelReject}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
                'border border-zinc-600 text-zinc-300',
                'hover:bg-zinc-700 hover:border-zinc-500',
                'transition-colors'
              )}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Footer with Actions */}
      <div className="p-4 flex items-center justify-between bg-zinc-800/20">
        {/* Expiry Warning */}
        <div className="flex items-center gap-2">
          {expiryText && (
            <span
              className={clsx(
                'flex items-center gap-1 text-sm',
                isExpiringSoon ? 'text-amber-400' : 'text-zinc-500'
              )}
            >
              {isExpiringSoon ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <Clock className="w-4 h-4" />
              )}
              {expiryText}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReject}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
              'border border-red-500/30 text-red-400',
              'hover:bg-red-500/20 hover:border-red-500/50',
              'transition-colors'
            )}
            aria-label={`Reject ${approval.title}`}
          >
            <X className="w-4 h-4" />
            Reject
          </button>

          <button
            onClick={handleModify}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
              'border border-zinc-600 text-zinc-300',
              'hover:bg-zinc-700 hover:border-zinc-500',
              'transition-colors'
            )}
          >
            <Edit3 className="w-4 h-4" />
            Edit & Approve
          </button>

          <button
            onClick={handleApprove}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
              'bg-green-500/20 border border-green-500/30 text-green-400',
              'hover:bg-green-500/30 hover:border-green-500/50',
              'transition-colors'
            )}
          >
            <Check className="w-4 h-4" />
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApprovalCard;
