"use client";

import * as React from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { RefOption } from "@/lib/cms/reference-options";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </Field>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <Field label={label}>
      <Textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </Field>
  );
}

export function SwitchField({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3.5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[3.25rem] w-full rounded-xl border border-border bg-white px-4 text-sm text-text focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

interface ButtonValue {
  label: string;
  href: string;
}

export function OptionalButtonField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: ButtonValue;
  onChange: (v: ButtonValue | undefined) => void;
}) {
  const enabled = Boolean(value);
  return (
    <div className="space-y-3 rounded-xl border border-border p-4">
      <SwitchField
        label={label}
        checked={enabled}
        onChange={(checked) => onChange(checked ? { label: "", href: "" } : undefined)}
      />
      {enabled && value && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            placeholder="Button label"
            value={value.label}
            onChange={(e) => onChange({ ...value, label: e.target.value })}
          />
          <Input
            placeholder="Link (e.g. /contact)"
            value={value.href}
            onChange={(e) => onChange({ ...value, href: e.target.value })}
          />
        </div>
      )}
    </div>
  );
}

export function StringArrayField({
  label,
  hint,
  values,
  onChange,
  placeholder,
  addLabel = "Add Item",
}: {
  label: string;
  hint?: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={v}
              placeholder={placeholder}
              onChange={(e) => {
                const next = [...values];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <button
              type="button"
              aria-label="Remove"
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              className="flex h-[3.25rem] w-11 shrink-0 items-center justify-center rounded-xl border border-border text-muted hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" onClick={() => onChange([...values, ""])}>
          <Plus className="h-4 w-4" /> {addLabel}
        </Button>
      </div>
    </Field>
  );
}

export function ObjectArrayField<T extends Record<string, string>>({
  label,
  hint,
  values,
  onChange,
  emptyItem,
  renderItem,
  addLabel = "Add Item",
}: {
  label: string;
  hint?: string;
  values: T[];
  onChange: (v: T[]) => void;
  emptyItem: T;
  renderItem: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  addLabel?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <div className="space-y-3">
        {values.map((item, i) => (
          <div key={i} className="flex gap-3 rounded-xl border border-border p-4">
            <GripVertical className="mt-2 h-4 w-4 shrink-0 text-border" />
            <div className="flex-1 space-y-3">{renderItem(item, (patch) => {
              const next = [...values];
              next[i] = { ...next[i], ...patch };
              onChange(next);
            })}</div>
            <button
              type="button"
              aria-label="Remove"
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" onClick={() => onChange([...values, emptyItem])}>
          <Plus className="h-4 w-4" /> {addLabel}
        </Button>
      </div>
    </Field>
  );
}

export function ReferencePickerField({
  label,
  hint,
  options,
  selectedIds,
  onChange,
}: {
  label: string;
  hint?: string;
  options: RefOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  return (
    <Field label={label} hint={hint ?? "Leave nothing selected to automatically show all / featured items."}>
      <div className="max-h-64 space-y-1 overflow-y-auto rounded-xl border border-border p-2">
        {options.length === 0 && <p className="p-2 text-sm text-muted">Nothing available yet.</p>}
        {options.map((opt) => {
          const checked = selectedIds.includes(opt.id);
          return (
            <label
              key={opt.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-background"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() =>
                  onChange(checked ? selectedIds.filter((id) => id !== opt.id) : [...selectedIds, opt.id])
                }
                className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary/30"
              />
              {opt.label}
            </label>
          );
        })}
      </div>
      {selectedIds.length > 0 && (
        <p className="text-xs text-muted">{selectedIds.length} selected</p>
      )}
    </Field>
  );
}
