'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { Message } from '@/types';
import { formatDate, getPlatformIcon, generateInitials } from '@/lib/utils';
import {
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

type MessageWithPopulated = Message & {
  leadId: { name: string; company: string; title: string } | string;
  campaignId: { name: string } | string;
};

const STATUS_FILTERS = [
  { value: '', label: 'All Messages' },
  { value: 'pending_approval', label: 'Pending Approval' },
  { value: 'sent', label: 'Sent' },
  { value: 'opened', label: 'Opened' },
  { value: 'replied', label: 'Replied' },
  { value: 'rejected', label: 'Rejected' },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageWithPopulated[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isApproving, setIsApproving] = useState(false);
  const [previewMessage, setPreviewMessage] = useState<MessageWithPopulated | null>(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/messages?${params}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.data || []);
      }
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const handleApprove = async (action: 'approve' | 'reject', ids?: string[]) => {
    const messageIds = ids || selectedIds;
    if (messageIds.length === 0) {
      toast.error('No messages selected');
      return;
    }
    setIsApproving(true);
    try {
      const res = await fetch('/api/messages/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageIds, action }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(data.message);
        setSelectedIds([]);
        fetchMessages();
      }
    } catch {
      toast.error('Failed to process messages');
    } finally {
      setIsApproving(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAllPending = () => {
    const pendingIds = messages.filter((m) => m.status === 'pending_approval').map((m) => m._id);
    setSelectedIds(pendingIds);
  };

  const pendingCount = messages.filter((m) => m.status === 'pending_approval').length;

  const getLeadName = (lead: MessageWithPopulated['leadId']) => {
    if (typeof lead === 'string') return 'Lead';
    return lead.name;
  };

  const getCampaignName = (campaign: MessageWithPopulated['campaignId']) => {
    if (typeof campaign === 'string') return 'Campaign';
    return campaign.name;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and approve outreach messages before they&apos;re sent
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={selectAllPending}
            >
              Select All Pending ({pendingCount})
            </Button>
            {selectedIds.length > 0 && (
              <>
                <Button
                  variant="accent"
                  size="sm"
                  loading={isApproving}
                  onClick={() => handleApprove('approve')}
                  icon={<CheckCircleIcon className="h-4 w-4" />}
                >
                  Approve ({selectedIds.length})
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  loading={isApproving}
                  onClick={() => handleApprove('reject')}
                  icon={<XCircleIcon className="h-4 w-4" />}
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Pending Approval Alert */}
      {pendingCount > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
            <span className="text-accent-orange font-bold">{pendingCount}</span>
          </div>
          <div>
            <p className="font-medium text-orange-900">Messages Awaiting Approval</p>
            <p className="text-sm text-orange-700">
              Review the messages below and approve them before they&apos;re sent to leads
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-2 items-center">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === f.value
                ? 'bg-primary-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Messages List */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3">ð¬</div>
          <h3 className="font-semibold text-gray-900 mb-1">No messages found</h3>
          <p className="text-sm text-gray-500">
            {statusFilter ? 'No messages with this status' : 'Create campaigns and discover leads to generate messages'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => {
            const isPending = message.status === 'pending_approval';
            const isSelected = selectedIds.includes(message._id);
            return (
              <div
                key={message._id}
                className={`bg-white rounded-xl border shadow-sm p-5 transition-all ${
                  isSelected ? 'border-primary-blue ring-1 ring-primary-blue' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {isPending && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(message._id)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-blue"
                    />
                  )}
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-blue to-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {generateInitials(getLeadName(message.leadId))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">
                        {getLeadName(message.leadId)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {getPlatformIcon(message.platform)} {message.platform}
                      </span>
                      <span className="text-xs text-gray-400">â¢</span>
                      <span className="text-xs text-gray-500">
                        {getCampaignName(message.campaignId)}
                      </span>
                      <Badge status={message.status} />
                    </div>
                    {message.subject && (
                      <p className="text-sm font-medium text-gray-800 mb-1">{message.subject}</p>
                    )}
                    <p className="text-sm text-gray-600 line-clamp-2">{message.body}</p>
                    <p className="text-xs text-gray-400 mt-2">{formatDate(message.createdAt)}</p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => setPreviewMessage(message)}
                      className="text-gray-400 hover:text-primary-blue transition-colors p-1"
                      title="Preview message"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleApprove('approve', [message._id])}
                          className="text-accent-green hover:text-green-700 transition-colors p-1"
                          title="Approve"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleApprove('reject', [message._id])}
                          className="text-red-400 hover:text-red-600 transition-colors p-1"
                          title="Reject"
                        >
                          <XCircleIcon className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Message Preview Modal */}
      {previewMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setPreviewMessage(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 z-10 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Message Preview</h3>
              <button onClick={() => setPreviewMessage(null)} className="text-gray-400 hover:text-gray-600">â</button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">To:</span>
                <span className="font-medium">{getLeadName(previewMessage.leadId)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Platform:</span>
                <span>{getPlatformIcon(previewMessage.platform)} {previewMessage.platform}</span>
              </div>
              {previewMessage.subject && (
                <div className="flex items-start justify-between text-sm">
                  <span className="text-gray-500">Subject:</span>
                  <span className="font-medium text-right max-w-xs">{previewMessage.subject}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3">
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{previewMessage.body}</p>
              </div>
            </div>
            {previewMessage.status === 'pending_approval' && (
              <div className="mt-4 flex gap-2 justify-end">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => { handleApprove('reject', [previewMessage._id]); setPreviewMessage(null); }}
                >
                  Reject
                </Button>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => { handleApprove('approve', [previewMessage._id]); setPreviewMessage(null); }}
                >
                  Approve & Send
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
