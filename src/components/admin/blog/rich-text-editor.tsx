"use client";

import * as React from "react";
import { useEditor, EditorContent, type Editor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { toast } from "sonner";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Link2,
  ImagePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { MediaPickerDialog } from "@/components/admin/media/image-field";

interface RichTextEditorProps {
  initialContentJson?: object | null;
  /** Initial content as an HTML string; used when no JSON is given. */
  initialHtml?: string;
  onChange: (json: object, html: string) => void;
}

const EDITOR_CLASS = cn(
  "prose max-w-none min-h-[300px] px-4 py-3 focus:outline-none",
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
  "[&_blockquote]:border-l-2 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted",
  "[&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-primary [&_h2]:mt-2",
  "[&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-primary [&_h3]:mt-2",
  "[&_p]:leading-relaxed",
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4",
  "[&_img]:my-4 [&_img]:block [&_img]:h-auto [&_img]:w-full [&_img]:rounded-2xl",
  "[&_img.ProseMirror-selectednode]:ring-2 [&_img.ProseMirror-selectednode]:ring-secondary [&_img.ProseMirror-selectednode]:ring-offset-2"
);

/** Only these link types are allowed (matches the public-site sanitizer). */
const ALLOWED_LINK = /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i;

/**
 * Light, forgiving URL check for non-technical editors: "example.com" becomes
 * "https://example.com", "/blog" stays a site link, mailto:/tel: are kept.
 */
function normalizeHref(raw: string): { href: string } | { error: string } {
  const value = raw.trim();
  if (!value) return { error: "Please enter a web address." };
  if (/\s/.test(value)) return { error: "A web address can't contain spaces." };
  if (/^https?:\/\//i.test(value)) {
    return /^https?:\/\/[^/?#]+\.[^/?#]+/i.test(value) ? { href: value } : { error: "That web address looks incomplete." };
  }
  if (ALLOWED_LINK.test(value)) return { href: value };
  // A bare email address becomes a mailto: link.
  if (/^[^@/:]+@[^@/:]+\.[^@/:]+$/.test(value)) return { href: `mailto:${value}` };
  // "example.com", "www.example.com/page" (optionally with a port) get https:// in front.
  if (/^[^/?#:]+\.[a-z]{2,}(:\d+)?([/?#].*)?$/i.test(value)) return { href: `https://${value}` };
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) {
    return { error: "Only web (https://), email (mailto:) and phone (tel:) links are allowed." };
  }
  return { error: "That doesn't look like a web address. Try something like https://example.com or /blog." };
}

type ToolbarButton = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export function RichTextEditor({ initialContentJson, initialHtml, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
          protocols: ["http", "https", "mailto", "tel"],
          // Links open in the same tab unless the editor ticks "Open in new tab".
          HTMLAttributes: { target: null, rel: null },
          isAllowedUri: (url, ctx) => ctx.defaultValidate(url) && ALLOWED_LINK.test(url),
        },
      }),
      Image.configure({ inline: false, allowBase64: false }),
    ],
    content: (initialContentJson as JSONContent) ?? initialHtml ?? "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: EDITOR_CLASS,
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChange(instance.getJSON(), instance.getHTML());
    },
  });

  // Tiptap doesn't re-render React on selection/formatting changes by itself,
  // so the toolbar's active states need a manual re-render tick.
  const [, forceUpdate] = React.useState({});
  React.useEffect(() => {
    if (!editor) return;
    const update = () => forceUpdate({});
    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  const [linkOpen, setLinkOpen] = React.useState(false);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  /** Image waiting for its description: a new src to insert, or null when editing the selected image. */
  const [altDialog, setAltDialog] = React.useState<{ src: string | null; alt: string } | null>(null);

  if (!editor) return null;

  function openImage(instance: Editor) {
    if (instance.isActive("image")) {
      const alt = (instance.getAttributes("image").alt as string | undefined) ?? "";
      setAltDialog({ src: null, alt });
    } else {
      setPickerOpen(true);
    }
  }

  const groups: ToolbarButton[][] = [
    [
      {
        label: "Undo",
        icon: Undo2,
        disabled: !editor.can().undo(),
        onClick: () => editor.chain().focus().undo().run(),
      },
      {
        label: "Redo",
        icon: Redo2,
        disabled: !editor.can().redo(),
        onClick: () => editor.chain().focus().redo().run(),
      },
    ],
    [
      {
        label: "Bold",
        icon: Bold,
        isActive: editor.isActive("bold"),
        onClick: () => editor.chain().focus().toggleBold().run(),
      },
      {
        label: "Italic",
        icon: Italic,
        isActive: editor.isActive("italic"),
        onClick: () => editor.chain().focus().toggleItalic().run(),
      },
    ],
    [
      {
        label: "Heading 2",
        icon: Heading2,
        isActive: editor.isActive("heading", { level: 2 }),
        onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      },
      {
        label: "Heading 3",
        icon: Heading3,
        isActive: editor.isActive("heading", { level: 3 }),
        onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      },
    ],
    [
      {
        label: "Bullet List",
        icon: List,
        isActive: editor.isActive("bulletList"),
        onClick: () => editor.chain().focus().toggleBulletList().run(),
      },
      {
        label: "Ordered List",
        icon: ListOrdered,
        isActive: editor.isActive("orderedList"),
        onClick: () => editor.chain().focus().toggleOrderedList().run(),
      },
      {
        label: "Blockquote",
        icon: Quote,
        isActive: editor.isActive("blockquote"),
        onClick: () => editor.chain().focus().toggleBlockquote().run(),
      },
    ],
    [
      {
        label: editor.isActive("link") ? "Edit link" : "Add link",
        icon: Link2,
        isActive: editor.isActive("link"),
        onClick: () => setLinkOpen(true),
      },
      {
        label: editor.isActive("image") ? "Edit image description" : "Insert image",
        icon: ImagePlus,
        isActive: editor.isActive("image"),
        onClick: () => openImage(editor),
      },
    ],
  ];

  return (
    <div className="rounded-xl border border-border bg-white">
      <div role="toolbar" aria-label="Formatting" className="flex flex-wrap items-center gap-1 border-b border-border p-2">
        {groups.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {groupIndex > 0 && <span aria-hidden className="mx-1 h-5 w-px bg-border" />}
            {group.map(({ label, icon: Icon, isActive, disabled, onClick }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                title={label}
                aria-pressed={isActive === undefined ? undefined : isActive}
                disabled={disabled}
                onClick={onClick}
                className={cn(
                  "flex h-8 items-center justify-center rounded-md px-2.5 text-sm text-muted hover:bg-background disabled:pointer-events-none disabled:opacity-40",
                  isActive && "bg-primary/10 text-primary"
                )}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
      <EditorContent editor={editor} />

      <LinkDialog editor={editor} open={linkOpen} onOpenChange={setLinkOpen} />

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={([url]) => {
          if (!url) return;
          if (!/^https:\/\//i.test(url)) {
            toast.error("Only images with an https:// address can be shown in an article.");
            return;
          }
          setAltDialog({ src: url, alt: "" });
        }}
      />

      <ImageAltDialog
        state={altDialog}
        onClose={() => setAltDialog(null)}
        onApply={(alt) => {
          if (!altDialog) return;
          if (altDialog.src) {
            editor.chain().focus().setImage({ src: altDialog.src, alt }).run();
          } else {
            editor.chain().focus().updateAttributes("image", { alt }).run();
          }
          setAltDialog(null);
        }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Link dialog                                                                 */
/* -------------------------------------------------------------------------- */

function LinkDialog({ editor, open, onOpenChange }: { editor: Editor; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [href, setHref] = React.useState("");
  const [newTab, setNewTab] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [hasLink, setHasLink] = React.useState(false);
  const inputId = React.useId();
  const checkboxId = React.useId();

  // Prefill from the link under the cursor each time the dialog opens.
  const [wasOpen, setWasOpen] = React.useState(false);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      const attrs = editor.getAttributes("link") as { href?: string; target?: string | null };
      setHref(attrs.href ?? "");
      setNewTab(attrs.target === "_blank");
      setHasLink(editor.isActive("link"));
      setError(null);
    }
  }

  function apply(event: React.FormEvent) {
    event.preventDefault();
    // The dialog renders in a portal, but React still bubbles submit to the page's form.
    event.stopPropagation();
    const result = normalizeHref(href);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    const attrs = newTab
      ? { href: result.href, target: "_blank", rel: "noopener noreferrer" }
      : { href: result.href, target: null, rel: null };

    const chain = editor.chain().focus();
    if (editor.isActive("link")) {
      chain.extendMarkRange("link").setLink(attrs).run();
    } else if (editor.state.selection.empty) {
      // Nothing selected: insert the address itself as the link text.
      const text = result.href.replace(/^mailto:|^tel:/i, "");
      chain
        .insertContent({ type: "text", text, marks: [{ type: "link", attrs }] })
        .unsetMark("link")
        .run();
    } else {
      chain.setLink(attrs).run();
    }
    // Put the cursor right after the link, so typing (or Enter) doesn't replace the linked text.
    editor.chain().focus().setTextSelection(editor.state.selection.to).unsetMark("link").run();
    onOpenChange(false);
  }

  function remove() {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <form onSubmit={apply} noValidate>
          <DialogHeader>
            <DialogTitle>{hasLink ? "Edit link" : "Add link"}</DialogTitle>
            <DialogDescription>
              Paste a web address (example.com), a page on this site (/blog), an email (mailto:) or phone number (tel:).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor={inputId}>Link address</Label>
            <Input
              id={inputId}
              value={href}
              autoFocus
              autoComplete="off"
              inputMode="url"
              placeholder="https://example.com"
              aria-invalid={error ? true : undefined}
              onChange={(e) => {
                setHref(e.target.value);
                setError(null);
              }}
            />
            {error && <p className="text-xs font-medium text-red-600">{error}</p>}
          </div>
          <label htmlFor={checkboxId} className="mt-4 flex cursor-pointer items-center gap-2.5 text-sm text-text">
            <input
              id={checkboxId}
              type="checkbox"
              checked={newTab}
              onChange={(e) => setNewTab(e.target.checked)}
              className="h-4 w-4 accent-[var(--color-primary)]"
            />
            Open in new tab
          </label>
          <DialogFooter className="mt-6">
            {hasLink && (
              <Button type="button" variant="ghost" size="sm" onClick={remove} className="sm:mr-auto">
                Remove link
              </Button>
            )}
            <Button type="button" variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Apply
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* Image description (alt text) dialog                                         */
/* -------------------------------------------------------------------------- */

function ImageAltDialog({
  state,
  onClose,
  onApply,
}: {
  state: { src: string | null; alt: string } | null;
  onClose: () => void;
  onApply: (alt: string) => void;
}) {
  const [alt, setAlt] = React.useState("");
  const inputId = React.useId();

  const [prevState, setPrevState] = React.useState(state);
  if (state !== prevState) {
    setPrevState(state);
    if (state) setAlt(state.alt);
  }

  return (
    <Dialog open={state !== null} onOpenChange={(next) => !next && onClose()}>
      <DialogContent size="sm">
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onApply(alt.trim());
          }}
        >
          <DialogHeader>
            <DialogTitle>{state?.src ? "Describe the image" : "Edit image description"}</DialogTitle>
            <DialogDescription>
              A few words about what the image shows. Optional, but it helps Google and people using screen readers.
            </DialogDescription>
          </DialogHeader>
          {state?.src && (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of the chosen image
            <img src={state.src} alt="" className="mb-4 max-h-40 w-full rounded-xl object-cover" />
          )}
          <div className="space-y-2">
            <Label htmlFor={inputId}>Image description (for Google and screen readers)</Label>
            <Input
              id={inputId}
              value={alt}
              autoFocus
              maxLength={250}
              placeholder="e.g. Handmade candle on a wooden table"
              onChange={(e) => setAlt(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {state?.src ? "Insert image" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
