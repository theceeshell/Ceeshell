"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Send, TestTube2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogTrigger } from "@/components/ui/dialog";
import { FormField } from "@/components/admin/ui/form-field";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { RichTextEditor } from "@/components/admin/blog/rich-text-editor";
import { sendNewsletterAction, sendNewsletterTestAction } from "@/lib/actions/newsletter-actions";

const DRAFT_KEY = "cs-newsletter-draft";

interface ComposerProps {
  recipientCount: number | null;
  testEmail: string;
}

const noop = () => () => {};

/** The saved draft lives in localStorage, so the editor renders in the browser only (no hydration mismatch). */
export function NewsletterComposer(props: ComposerProps) {
  const inBrowser = React.useSyncExternalStore(noop, () => true, () => false);
  if (!inBrowser) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-border bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-muted" />
      </div>
    );
  }
  return <Composer {...props} />;
}

function Composer({ recipientCount, testEmail }: ComposerProps) {
  const router = useRouter();
  // Draft survives a refresh or an accidental navigation (this browser only).
  const [draft] = React.useState<{ subject: string; html: string }>(() => {
    try {
      return JSON.parse(window.localStorage.getItem(DRAFT_KEY) ?? "") as { subject: string; html: string };
    } catch {
      return { subject: "", html: "" };
    }
  });
  const [subject, setSubject] = React.useState(draft.subject);
  const [html, setHtml] = React.useState(draft.html);
  const [editorKey, setEditorKey] = React.useState(0);
  const [busy, setBusy] = React.useState<"test" | "send" | null>(null);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ subject, html }));
    } catch {
      // Storage unavailable: the draft just isn't remembered.
    }
  }, [subject, html]);

  async function sendTest() {
    setBusy("test");
    try {
      const result = await sendNewsletterTestAction({ subject, html });
      if (result?.error) toast.error(result.error);
      else toast.success(`Test sent to ${testEmail}`);
    } catch {
      toast.error("Something went wrong — please try again.");
    } finally {
      setBusy(null);
    }
  }

  async function sendAll() {
    setBusy("send");
    try {
      const result = await sendNewsletterAction({ subject, html });
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Newsletter is on its way!");
      setSubject("");
      setHtml("");
      setEditorKey((k) => k + 1);
      window.localStorage.removeItem(DRAFT_KEY);
      router.refresh();
    } catch {
      toast.error("Something went wrong — please try again.");
    } finally {
      setBusy(null);
    }
  }

  const audience = recipientCount === null ? "all subscribers" : `${recipientCount} subscriber${recipientCount === 1 ? "" : "s"}`;
  const ready = subject.trim() !== "" && html.replace(/<[^>]+>/g, "").trim() !== "";

  return (
    <div className="space-y-6 rounded-2xl border border-border bg-white p-6">
      <FormField label="Subject" htmlFor="newsletter-subject" hint="What people see in their inbox.">
        <Input id="newsletter-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Our latest packaging work" />
      </FormField>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Message</p>
        <div className="rounded-xl border border-border">
          <RichTextEditor key={editorKey} initialHtml={draft.html} onChange={(_json, value) => setHtml(value)} />
        </div>
        <p className="text-xs text-muted">Your logo, address and an unsubscribe link are added automatically.</p>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <Button type="button" variant="secondary" size="sm" disabled={!ready || busy !== null} onClick={sendTest}>
          {busy === "test" ? <Loader2 className="h-4 w-4 animate-spin" /> : <TestTube2 className="h-4 w-4" />}
          Send me a test
        </Button>
        <ConfirmDialog
          trigger={
            <DialogTrigger asChild>
              <Button type="button" size="sm" disabled={!ready || busy !== null}>
                {busy === "send" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send to {audience}
              </Button>
            </DialogTrigger>
          }
          title={`Send to ${audience}?`}
          description="This can't be undone. Tip: send yourself a test first to check how it looks."
          confirmLabel="Send now"
          onConfirm={sendAll}
        />
      </div>
    </div>
  );
}
