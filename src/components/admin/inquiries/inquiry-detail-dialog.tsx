"use client";

import * as React from "react";
import { Paperclip } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/admin/ui/status-badge";
import { STATUS_LABELS, STATUS_TONES, type InquiryRow } from "@/components/admin/inquiries/inquiry-manager";
import type { InquiryStatus } from "@/lib/actions/inquiry-management-actions";

interface InquiryDetailDialogProps {
  inquiry: InquiryRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (status: InquiryStatus) => void;
}

export function InquiryDetailDialog({ inquiry, open, onOpenChange, onStatusChange }: InquiryDetailDialogProps) {
  if (!inquiry) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-3">
            <DialogTitle>{inquiry.name}</DialogTitle>
            <StatusBadge label={STATUS_LABELS[inquiry.status] ?? inquiry.status} tone={STATUS_TONES[inquiry.status] ?? "neutral"} />
          </div>
          <DialogDescription>{inquiry.company}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">Status</span>
            <Select value={inquiry.status} onValueChange={(value) => onStatusChange(value as InquiryStatus)}>
              <SelectTrigger className="h-9 w-44 px-3 py-0 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-background p-4 sm:grid-cols-2">
            <DetailField label="Email">
              <a href={`mailto:${inquiry.email}`} className="text-sm font-medium text-primary hover:underline">
                {inquiry.email}
              </a>
            </DetailField>
            {inquiry.phone && (
              <DetailField label="Phone">
                <a href={`tel:${inquiry.phone}`} className="text-sm font-medium text-primary hover:underline">
                  {inquiry.phone}
                </a>
              </DetailField>
            )}
            {inquiry.industry && <DetailField label="Industry">{inquiry.industry}</DetailField>}
            {inquiry.service && <DetailField label="Service">{inquiry.service}</DetailField>}
            {inquiry.budget && <DetailField label="Budget">{inquiry.budget}</DetailField>}
            {inquiry.timeline && <DetailField label="Timeline">{inquiry.timeline}</DetailField>}
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Message</p>
            <p className="whitespace-pre-wrap rounded-xl border border-border bg-white p-4 text-sm text-text">
              {inquiry.message}
            </p>
          </div>

          {inquiry.attachmentUrl && (
            <a
              href={inquiry.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <Paperclip className="h-4 w-4" /> View Attachment
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <div className="mt-0.5 text-sm text-text">{children}</div>
    </div>
  );
}
