"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/admin/ui/form-field";
import { updateMyAccountAction } from "@/lib/actions/account-actions";

export function AccountForm({ name: initialName, email: initialEmail }: { name: string; email: string }) {
  const router = useRouter();
  const [name, setName] = React.useState(initialName);
  const [email, setEmail] = React.useState(initialEmail);
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("The two new passwords don't match.");
      return;
    }
    setSaving(true);
    try {
      const result = await updateMyAccountAction({ name, email, currentPassword, newPassword });
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(newPassword ? "Saved. Your password has been changed." : "Saved.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      router.refresh();
    } catch {
      toast.error("Something went wrong — please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="max-w-xl space-y-6">
      <section className="space-y-5 rounded-2xl border border-border bg-white p-6">
        <h2 className="font-heading text-lg font-medium text-primary">Your details</h2>
        <FormField label="Name" htmlFor="account-name">
          <Input id="account-name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </FormField>
        <FormField label="Login email" htmlFor="account-email">
          <Input id="account-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </FormField>
      </section>

      <section className="space-y-5 rounded-2xl border border-border bg-white p-6">
        <div>
          <h2 className="font-heading text-lg font-medium text-primary">Change password</h2>
          <p className="mt-1 text-sm text-muted">Leave empty to keep your current password. Changing it signs you out on other devices.</p>
        </div>
        <FormField label="New password" htmlFor="account-new-password" hint="At least 8 characters.">
          <Input id="account-new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" />
        </FormField>
        <FormField label="Repeat new password" htmlFor="account-confirm-password">
          <Input id="account-confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
        </FormField>
      </section>

      <section className="space-y-5 rounded-2xl border border-border bg-white p-6">
        <FormField label="Current password" htmlFor="account-current-password" hint="Required to save any change.">
          <Input
            id="account-current-password"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
          />
        </FormField>
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </div>
      </section>
    </form>
  );
}
