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
import { Input, Textarea, Label } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FormField } from "@/components/admin/ui/form-field";
import { teamMemberSchema, type TeamMemberFormValues } from "@/lib/validators/team";
import { createTeamMemberAction, updateTeamMemberAction } from "@/lib/actions/team-actions";
import type { TeamRow } from "@/components/admin/team/team-manager";

interface TeamFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: TeamRow | null;
  onSaved: () => void;
}

const emptyValues: TeamMemberFormValues = {
  name: "",
  position: "",
  bio: "",
  photoUrl: "",
  linkedin: "",
  instagram: "",
  behance: "",
  active: true,
};

export function TeamFormDialog({ open, onOpenChange, initialValues, onSaved }: TeamFormDialogProps) {
  const isEditing = Boolean(initialValues);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TeamMemberFormValues>({ resolver: zodResolver(teamMemberSchema), defaultValues: emptyValues });

  React.useEffect(() => {
    if (open) {
      reset(
        initialValues
          ? {
              name: initialValues.name,
              position: initialValues.position,
              bio: initialValues.bio,
              photoUrl: initialValues.photoUrl ?? "",
              linkedin: initialValues.linkedin ?? "",
              instagram: initialValues.instagram ?? "",
              behance: initialValues.behance ?? "",
              active: initialValues.active,
            }
          : emptyValues
      );
    }
  }, [open, initialValues, reset]);

  async function onSubmit(values: TeamMemberFormValues) {
    try {
      if (isEditing && initialValues) {
        await updateTeamMemberAction(initialValues.id, values);
        toast.success("Team member updated");
      } else {
        await createTeamMemberAction(values);
        toast.success("Team member added");
      }
      onOpenChange(false);
      onSaved();
    } catch {
      toast.error("Something went wrong — please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
          <DialogDescription>Shown on the About page&apos;s team grid.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Name" htmlFor="name" error={errors.name?.message}>
              <Input id="name" {...register("name")} placeholder="Ayesha Raza" />
            </FormField>
            <FormField label="Position" htmlFor="position" error={errors.position?.message}>
              <Input id="position" {...register("position")} placeholder="Founder & Creative Director" />
            </FormField>
          </div>

          <FormField label="Bio" htmlFor="bio" error={errors.bio?.message}>
            <Textarea id="bio" rows={3} {...register("bio")} placeholder="A short one or two sentence bio." />
          </FormField>

          <FormField label="Photo URL" htmlFor="photoUrl" error={errors.photoUrl?.message} hint="Paste an image URL, or upload it in Media Library and paste the URL here.">
            <Input id="photoUrl" {...register("photoUrl")} placeholder="https://…" />
          </FormField>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <FormField label="LinkedIn" htmlFor="linkedin" error={errors.linkedin?.message}>
              <Input id="linkedin" {...register("linkedin")} placeholder="https://linkedin.com/in/…" />
            </FormField>
            <FormField label="Instagram" htmlFor="instagram" error={errors.instagram?.message}>
              <Input id="instagram" {...register("instagram")} placeholder="https://instagram.com/…" />
            </FormField>
            <FormField label="Behance" htmlFor="behance" error={errors.behance?.message}>
              <Input id="behance" {...register("behance")} placeholder="https://behance.net/…" />
            </FormField>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3.5">
            <div>
              <Label htmlFor="active">Active</Label>
              <p className="mt-0.5 text-xs text-muted">Inactive members are hidden from the website without deleting them.</p>
            </div>
            <Controller
              control={control}
              name="active"
              render={({ field }) => <Switch id="active" checked={field.value} onCheckedChange={field.onChange} />}
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
              {isEditing ? "Save Changes" : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
