"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FormField } from "@/components/admin/ui/form-field";
import { navigationItemSchema, type NavigationItemFormValues } from "@/lib/validators/navigation";
import { createNavigationItemAction, updateNavigationItemAction } from "@/lib/actions/navigation-actions";
import type { NavigationItemRow } from "@/components/admin/navigation/navigation-manager";

interface NavigationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: NavigationItemRow | null;
  onSaved: () => void;
}

const emptyValues: NavigationItemFormValues = {
  label: "",
  href: "",
  openNewTab: false,
  visible: true,
};

export function NavigationFormDialog({ open, onOpenChange, initialValues, onSaved }: NavigationFormDialogProps) {
  const isEditing = Boolean(initialValues);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<NavigationItemFormValues>({ resolver: zodResolver(navigationItemSchema), defaultValues: emptyValues });

  React.useEffect(() => {
    if (open) {
      reset(
        initialValues
          ? {
              label: initialValues.label,
              href: initialValues.href,
              openNewTab: initialValues.openNewTab,
              visible: initialValues.visible,
            }
          : emptyValues
      );
    }
  }, [open, initialValues, reset]);

  async function onSubmit(values: NavigationItemFormValues) {
    try {
      if (isEditing && initialValues) {
        await updateNavigationItemAction(initialValues.id, values);
        toast.success("Nav item updated");
      } else {
        await createNavigationItemAction(values);
        toast.success("Nav item created");
      }
      onOpenChange(false);
      onSaved();
    } catch {
      toast.error("Something went wrong — please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Nav Item" : "Add Nav Item"}</DialogTitle>
          <DialogDescription>This appears in the main site menu.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormField label="Label" htmlFor="label" error={errors.label?.message}>
            <Input id="label" {...register("label")} placeholder="About" />
          </FormField>

          <FormField label="Link" htmlFor="href" error={errors.href?.message} hint="e.g. /about or https://example.com">
            <Input id="href" {...register("href")} placeholder="/about" />
          </FormField>

          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3.5">
            <div>
              <Label htmlFor="openNewTab">Open in New Tab</Label>
              <p className="mt-0.5 text-xs text-muted">Opens the link in a separate browser tab.</p>
            </div>
            <Controller
              control={control}
              name="openNewTab"
              render={({ field }) => <Switch id="openNewTab" checked={field.value} onCheckedChange={field.onChange} />}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3.5">
            <div>
              <Label htmlFor="visible">Visible</Label>
              <p className="mt-0.5 text-xs text-muted">Hidden items are removed from the menu without deleting them.</p>
            </div>
            <Controller
              control={control}
              name="visible"
              render={({ field }) => <Switch id="visible" checked={field.value} onCheckedChange={field.onChange} />}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Add Nav Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
