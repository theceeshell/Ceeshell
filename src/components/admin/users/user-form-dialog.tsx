"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { FormField } from "@/components/admin/ui/form-field";
import { createUserAction, updateUserAction } from "@/lib/actions/user-actions";
import type { UserRow } from "@/components/admin/users/user-manager";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: UserRow | null;
  onSaved: () => void;
}

// Local form-level schema: password is always a plain string here (never
// undefined) — "" is the sentinel for "leave unchanged" on edit. The real
// create/update rules (password required on create, optional on edit) live
// server-side in src/lib/validators/user.ts and are enforced again there;
// this schema just keeps client-side field errors friendly.
const userFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  password: z.string(),
  role: z.enum(["ADMIN", "EDITOR"]),
  active: z.boolean(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const emptyValues: UserFormValues = {
  name: "",
  email: "",
  password: "",
  role: "EDITOR",
  active: true,
};

export function UserFormDialog({ open, onOpenChange, initialValues, onSaved }: UserFormDialogProps) {
  const isEditing = Boolean(initialValues);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({ resolver: zodResolver(userFormSchema), defaultValues: emptyValues });

  React.useEffect(() => {
    if (open) {
      reset(
        initialValues
          ? {
              name: initialValues.name,
              email: initialValues.email,
              password: "",
              role: initialValues.role === "ADMIN" ? "ADMIN" : "EDITOR",
              active: initialValues.active,
            }
          : emptyValues
      );
    }
  }, [open, initialValues, reset]);

  async function onSubmit(values: UserFormValues) {
    if (!isEditing && values.password.length === 0) {
      setError("password", { type: "manual", message: "Password is required" });
      return;
    }
    if (values.password.length > 0 && values.password.length < 8) {
      setError("password", { type: "manual", message: "Password must be at least 8 characters" });
      return;
    }

    try {
      if (isEditing && initialValues) {
        const result = await updateUserAction(initialValues.id, {
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
          active: values.active,
        });
        if (result?.error) {
          toast.error(result.error);
          return;
        }
        toast.success("User updated");
      } else {
        const result = await createUserAction({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
          active: values.active,
        });
        if (result?.error) {
          toast.error(result.error);
          return;
        }
        toast.success("User created");
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
          <DialogTitle>{isEditing ? "Edit User" : "Add User"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update this user's details, role, or access." : "Create a new admin panel account."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormField label="Name" htmlFor="name" error={errors.name?.message}>
            <Input id="name" {...register("name")} placeholder="Jordan Smith" />
          </FormField>

          <FormField label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" {...register("email")} placeholder="jordan@example.com" />
          </FormField>

          <FormField
            label={isEditing ? "New Password (leave blank to keep current)" : "Password"}
            htmlFor="password"
            error={errors.password?.message}
          >
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
              placeholder={isEditing ? "••••••••" : "At least 8 characters"}
            />
          </FormField>

          <FormField label="Role" htmlFor="role" error={errors.role?.message}>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="EDITOR">Editor</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3.5">
            <div>
              <Label htmlFor="active">Active</Label>
              <p className="mt-0.5 text-xs text-muted">Inactive users can&apos;t sign in to the admin panel.</p>
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
              {isEditing ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
