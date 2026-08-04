"use client";

import * as React from "react";
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  initialContentJson?: object | null;
  onChange: (json: object, html: string) => void;
}

const EDITOR_CLASS = cn(
  "prose max-w-none min-h-[300px] px-4 py-3 focus:outline-none",
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
  "[&_blockquote]:border-l-2 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted",
  "[&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-primary [&_h2]:mt-2",
  "[&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-primary [&_h3]:mt-2",
  "[&_p]:leading-relaxed"
);

export function RichTextEditor({ initialContentJson, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: (initialContentJson as JSONContent) ?? "",
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

  if (!editor) return null;

  const buttons: Array<{
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isActive: boolean;
    onClick: () => void;
  }> = [
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
  ];

  return (
    <div className="rounded-xl border border-border bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-border p-2">
        {buttons.map(({ label, icon: Icon, isActive, onClick }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            aria-pressed={isActive}
            onClick={onClick}
            className={cn(
              "flex h-8 items-center justify-center rounded-md px-2.5 text-sm text-muted hover:bg-background",
              isActive && "bg-primary/10 text-primary"
            )}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
