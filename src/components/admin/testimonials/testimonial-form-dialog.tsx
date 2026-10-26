"use client";

import * as React from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { testimonialSchema, type TestimonialFormValues } from "@/lib/validators/testimonial";
import { createTestimonialAction, updateTestimonialAction } from "@/lib/actions/testimonial-actions";
import type { TestimonialRow } from "@/components/admin/testimonials/testimonial-manager";

interface TestimonialFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: TestimonialRow | null;
  onSaved: () => void;
}

const emptyValues: TestimonialFormValues = {
  clientName: "",
  company: "",
  position: "",
  review: "",
  rating: 5,
  photoUrl: "",
  featured: false,
};

export function TestimonialFormDialog({ open, onOpenChange, initialValues, onSaved }: TestimonialFormDialogProps) {
  const isEditing = Boolean(initialValues);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormValues>({ resolver: zodResolver(testimonialSchema), defaultValues: emptyValues });

  const rating = useWatch({ control, name: "rating" });

  React.useEffect(() => {
    if (open) {
      reset(
        initialValues
          ? {
              clientName: initialValues.clientName,
              company: initialValues.company,
              position: initialValues.position,
              review: initialValues.review,
              rating: initialValues.rating,
              photoUrl: initialValues.photoUrl ?? "",
              featured: initialValues.featured,
            }
          : emptyValues
      );
    }
  }, [open, initialValues, reset]);

  async function onSubmit(values: TestimonialFormValues) {
    try {
      if (isEditing && initialValues) {
        await updateTestimonialAction(initialValues.id, values);
        toast.success("Testimonial updated");
      } else {
        await createTestimonialAction(values);
        toast.success("Testimonial created");
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
          <DialogTitle>{isEditing ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
          <DialogDescription>Shown in testimonial sliders and case studies across the site.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <FormField label="Client Name" htmlFor="clientName" error={errors.clientName?.message}>
              <Input id="clientName" {...register("clientName")} placeholder="Priya Shah" />
            </FormField>
            <FormField label="Company" htmlFor="company" error={errors.company?.message}>
              <Input id="company" {...register("company")} placeholder="Aurelia Cosmetics" />
            </FormField>
            <FormField label="Position" htmlFor="position" error={errors.position?.message}>
              <Input id="position" {...register("position")} placeholder="Founder" />
            </FormField>
          </div>

          <FormField label="Review" htmlFor="review" error={errors.review?.message}>
            <Textarea id="review" rows={4} {...register("review")} placeholder="What the client said…" />
          </FormField>

          <FormField label="Photo URL" htmlFor="photoUrl" error={errors.photoUrl?.message}>
            <Input id="photoUrl" {...register("photoUrl")} placeholder="https://…" />
          </FormField>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Rating" htmlFor="rating" error={errors.rating?.message}>
              <Controller
                control={control}
                name="rating"
                render={({ field }) => (
                  <div className="flex items-center gap-1 pt-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        aria-label={`${value} star${value > 1 ? "s" : ""}`}
                        onClick={() => field.onChange(value)}
                        className="p-0.5"
                      >
                        <Star
                          className={cn("h-6 w-6", value <= (rating ?? 0) ? "fill-accent text-accent" : "text-border")}
                        />
                      </button>
                    ))}
                  </div>
                )}
              />
            </FormField>

            <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3.5">
              <div>
                <Label htmlFor="featured">Featured</Label>
                <p className="mt-0.5 text-xs text-muted">Featured testimonials appear in the Home page slider.</p>
              </div>
              <Controller
                control={control}
                name="featured"
                render={({ field }) => <Switch id="featured" checked={field.value} onCheckedChange={field.onChange} />}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Create Testimonial"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
