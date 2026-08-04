"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
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
import { Input, Textarea } from "@/components/ui/input";
import { FormField } from "@/components/admin/ui/form-field";
import { faqSchema, type FaqFormValues } from "@/lib/validators/faq";
import { createFaqAction, updateFaqAction } from "@/lib/actions/faq-actions";
import type { FaqRow } from "@/components/admin/faqs/faq-manager";

interface FaqFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: FaqRow | null;
  onSaved: () => void;
}

export function FaqFormDialog({ open, onOpenChange, initialValues, onSaved }: FaqFormDialogProps) {
  const isEditing = Boolean(initialValues);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FaqFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: { question: "", answer: "", category: "General" },
  });

  React.useEffect(() => {
    if (open) {
      reset(initialValues ? { question: initialValues.question, answer: initialValues.answer, category: initialValues.category } : { question: "", answer: "", category: "General" });
    }
  }, [open, initialValues, reset]);

  async function onSubmit(values: FaqFormValues) {
    try {
      if (isEditing && initialValues) {
        await updateFaqAction(initialValues.id, values);
        toast.success("FAQ updated");
      } else {
        await createFaqAction(values);
        toast.success("FAQ created");
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
          <DialogTitle>{isEditing ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
          <DialogDescription>This appears in the FAQ page and anywhere else FAQs are shown.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormField label="Question" htmlFor="question" error={errors.question?.message}>
            <Input id="question" {...register("question")} placeholder="What's the typical project timeline?" />
          </FormField>

          <FormField label="Answer" htmlFor="answer" error={errors.answer?.message}>
            <Textarea id="answer" rows={4} {...register("answer")} placeholder="Write a clear, direct answer…" />
          </FormField>

          <FormField label="Category" htmlFor="category" error={errors.category?.message} hint="Used to group FAQs, e.g. General, Pricing, Production.">
            <Input id="category" {...register("category")} placeholder="General" />
          </FormField>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Create FAQ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
