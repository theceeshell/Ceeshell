"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { iconMap, iconNames } from "@/components/shared/icon-map";
import { cn } from "@/lib/utils";

interface IconPickerProps {
  value: string | undefined;
  onChange: (icon: string) => void;
  /** Allow clearing the icon (e.g. optional card icons). */
  optional?: boolean;
  id?: string;
}

/** Visual icon chooser: editors click an icon instead of typing its name. */
export function IconPicker({ value, onChange, optional = false, id }: IconPickerProps) {
  const [open, setOpen] = React.useState(false);
  const Current = value ? iconMap[value] : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            className="flex h-11 items-center gap-2.5 rounded-lg border border-border bg-white px-3 text-sm text-text hover:border-secondary"
          >
            {Current ? <Current className="h-5 w-5 text-secondary" /> : <span className="h-5 w-5 rounded border border-dashed border-border" />}
            {value ? value.replace(/-/g, " ") : "Choose an icon"}
          </button>
        </PopoverTrigger>
        {optional && value && (
          <button type="button" aria-label="Remove icon" onClick={() => onChange("")} className="rounded-full p-1.5 text-muted hover:text-primary">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="z-[100] grid w-72 grid-cols-6 gap-1 rounded-xl border border-border bg-white p-2 shadow-lg"
      >
        {iconNames.map((name) => {
          const Icon = iconMap[name];
          return (
            <button
              key={name}
              type="button"
              title={name.replace(/-/g, " ")}
              aria-label={name.replace(/-/g, " ")}
              onClick={() => {
                onChange(name);
                setOpen(false);
              }}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg text-primary hover:bg-background",
                value === name && "bg-secondary/10 text-secondary ring-1 ring-secondary"
              )}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
