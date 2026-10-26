"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown, Loader2, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ListInput } from "@/components/admin/ui/list-input";
import { LinkPicker } from "@/components/admin/ui/link-picker";
import type { LinkOption } from "@/lib/cms/link-options";
import { SITE_TEXT_GROUPS, type SiteTexts } from "@/lib/cms/site-texts";
import { updateSiteTextsAction } from "@/lib/actions/site-texts-actions";

type Values = Record<string, Record<string, string | string[]>>;
type FieldDef = (typeof SITE_TEXT_GROUPS)[number]["fields"][number];

function fieldType(field: FieldDef) {
  return "type" in field ? field.type : "text";
}

function sameValue(a: string | string[] | readonly string[], b: string | string[] | readonly string[]) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function SiteTextsForm({ initial, linkOptions }: { initial: SiteTexts; linkOptions: LinkOption[] }) {
  const router = useRouter();
  const [values, setValues] = React.useState<Values>(() => structuredClone(initial) as unknown as Values);
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState<Record<string, boolean>>({});
  const [saving, setSaving] = React.useState(false);

  const dirty = JSON.stringify(values) !== JSON.stringify(initial);

  function set(group: string, key: string, value: string | string[]) {
    setValues((prev) => ({ ...prev, [group]: { ...prev[group], [key]: value } }));
  }

  async function save() {
    setSaving(true);
    try {
      const result = await updateSiteTextsAction(values);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Website texts saved — the site is updated.");
      router.refresh();
    } catch {
      toast.error("Something went wrong — please try again.");
    } finally {
      setSaving(false);
    }
  }

  const q = query.trim().toLowerCase();
  const matches = (group: (typeof SITE_TEXT_GROUPS)[number], field: FieldDef) => {
    if (!q) return true;
    const current = values[group.key]?.[field.key];
    const text = [group.label, field.label, Array.isArray(current) ? current.join(" ") : current].join(" ").toLowerCase();
    return text.includes(q);
  };

  return (
    <div className="pb-24">
      <div className="relative mb-6 max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find a text — e.g. “Start Project” or “budget”"
          className="h-11 pl-10"
        />
      </div>

      <div className="space-y-4">
        {SITE_TEXT_GROUPS.map((group) => {
          const fields = (group.fields as readonly FieldDef[]).filter((f) => matches(group, f));
          if (fields.length === 0) return null;
          const isOpen = Boolean(q) || open[group.key];
          const changed = (group.fields as readonly FieldDef[]).filter(
            (f) => !sameValue(values[group.key][f.key], f.default)
          ).length;

          return (
            <section key={group.key} className="rounded-2xl border border-border bg-white">
              <button
                type="button"
                onClick={() => setOpen((prev) => ({ ...prev, [group.key]: !prev[group.key] }))}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={isOpen}
              >
                <div>
                  <h2 className="font-heading text-lg font-medium text-primary">{group.label}</h2>
                  <p className="mt-0.5 text-sm text-muted">{group.description}</p>
                </div>
                <span className="flex shrink-0 items-center gap-3">
                  {changed > 0 && (
                    <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-semibold text-secondary">
                      {changed} changed
                    </span>
                  )}
                  <ChevronDown className={cn("h-5 w-5 text-muted transition-transform", isOpen && "rotate-180")} />
                </span>
              </button>

              {isOpen && (
                <div className="grid grid-cols-1 gap-5 border-t border-border px-6 py-6 lg:grid-cols-2">
                  {fields.map((field) => {
                    const id = `${group.key}-${field.key}`;
                    const value = values[group.key][field.key];
                    const type = fieldType(field);
                    const isDefault = sameValue(value, field.default);
                    return (
                      <div key={field.key} className={cn("space-y-2", (type === "textarea" || type === "list") && "lg:col-span-2")}>
                        <div className="flex items-center justify-between gap-2">
                          <Label htmlFor={id}>{field.label}</Label>
                          {!isDefault && (
                            <button
                              type="button"
                              onClick={() => set(group.key, field.key, Array.isArray(field.default) ? [...field.default] : (field.default as string))}
                              className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-primary"
                            >
                              <RotateCcw className="h-3 w-3" /> Reset to original
                            </button>
                          )}
                        </div>
                        {type === "list" ? (
                          <ListInput id={id} values={value as string[]} onChange={(v) => set(group.key, field.key, v)} />
                        ) : type === "link" ? (
                          <LinkPicker id={id} value={value as string} onChange={(v) => set(group.key, field.key, v)} options={linkOptions} />
                        ) : type === "textarea" ? (
                          <Textarea id={id} rows={3} value={value as string} onChange={(e) => set(group.key, field.key, e.target.value)} />
                        ) : (
                          <Input
                            id={id}
                            value={value as string}
                            onChange={(e) => set(group.key, field.key, e.target.value)}
                            className="h-11"
                          />
                        )}
                        {"help" in field && field.help && <p className="text-xs text-muted">{field.help}</p>}
                        {typeof field.default === "string" && /\{\w+\}/.test(field.default) && (
                          <p className="text-xs text-muted">
                            Keep {field.default.match(/\{\w+\}/g)?.join(", ")} — it&apos;s replaced automatically.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 backdrop-blur lg:left-64">
        <div className="flex items-center justify-end gap-3 px-6 py-3">
          {dirty && <span className="text-sm text-muted">You have unsaved changes</span>}
          <Button type="button" size="sm" variant="secondary" disabled={!dirty || saving} onClick={() => setValues(structuredClone(initial) as unknown as Values)}>
            Discard
          </Button>
          <Button type="button" size="sm" disabled={!dirty || saving} onClick={save}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
