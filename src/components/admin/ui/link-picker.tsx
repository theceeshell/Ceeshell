"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { LinkOption } from "@/lib/cms/link-options";

const CUSTOM = "__custom__";

interface LinkPickerProps {
  id?: string;
  value: string;
  onChange: (href: string) => void;
  options: LinkOption[];
}

/** Choose a page of the site from a list, or type any other link. */
export function LinkPicker({ id, value, onChange, options }: LinkPickerProps) {
  const known = options.some((o) => o.href === value);
  const [custom, setCustom] = React.useState(Boolean(value) && !known);
  const groups = Array.from(new Set(options.map((o) => o.group)));

  return (
    <div className="space-y-2">
      <Select
        value={custom ? CUSTOM : known ? value : undefined}
        onValueChange={(next) => {
          if (next === CUSTOM) {
            setCustom(true);
          } else {
            setCustom(false);
            onChange(next);
          }
        }}
      >
        <SelectTrigger id={id}>
          <SelectValue placeholder="Choose a page…" />
        </SelectTrigger>
        <SelectContent>
          {groups.map((group) => (
            <SelectGroup key={group}>
              <SelectLabel>{group}</SelectLabel>
              {options
                .filter((o) => o.group === group)
                .map((o) => (
                  <SelectItem key={o.href} value={o.href}>
                    {o.label}
                  </SelectItem>
                ))}
            </SelectGroup>
          ))}
          <SelectGroup>
            <SelectLabel>Other</SelectLabel>
            <SelectItem value={CUSTOM}>Another link (type it in)…</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {custom && (
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://… or /some-page" className="h-11" />
      )}
    </div>
  );
}
