"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ListInputProps {
  id?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}

/** An editable list of short texts: one box per item, with add/remove. */
export function ListInput({ id, values, onChange, placeholder, addLabel = "Add" }: ListInputProps) {
  return (
    <div className="space-y-2">
      {values.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input
            id={index === 0 ? id : undefined}
            value={item}
            placeholder={placeholder}
            onChange={(e) => onChange(values.map((v, i) => (i === index ? e.target.value : v)))}
            className="h-11"
          />
          <button
            type="button"
            aria-label="Remove"
            onClick={() => onChange(values.filter((_, i) => i !== index))}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Button type="button" size="sm" variant="secondary" onClick={() => onChange([...values, ""])}>
        <Plus className="h-4 w-4" /> {addLabel}
      </Button>
    </div>
  );
}
