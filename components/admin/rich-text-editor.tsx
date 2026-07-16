"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";
import { useCallback, useEffect, useRef, useState } from "react";

import { syncExternalRichTextValue } from "@/components/admin/rich-text-editor-helpers";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  category?: string;
};

export function RichTextEditor({ value, onChange, placeholder, category = "content" }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base focus:outline-none min-h-[200px] max-w-none p-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    syncExternalRichTextValue(editor, value);
  }, [editor, value]);

  const uploadImage = useCallback(async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);

      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok || !result.url) {
        throw new Error(result.error || "上傳失敗");
      }

      editor?.chain().focus().setImage({ src: result.url }).run();
    } catch (e) {
      console.error(e);
      alert("圖片上傳失敗");
    } finally {
      setUploading(false);
    }
  }, [editor, category]);

  if (!editor) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-[1.4rem] border border-ink/10 bg-[#fcfaf7]">
      <div className="flex flex-wrap items-center gap-2 border-b border-ink/10 bg-white/60 p-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded-[0.8rem] px-3 py-1.5 text-sm font-medium transition ${
            editor.isActive("bold") ? "bg-ink text-paper" : "text-ink hover:bg-ink/5"
          }`}
          type="button"
        >
          粗體
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded-[0.8rem] px-3 py-1.5 text-sm font-medium transition ${
            editor.isActive("italic") ? "bg-ink text-paper" : "text-ink hover:bg-ink/5"
          }`}
          type="button"
        >
          斜體
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`rounded-[0.8rem] px-3 py-1.5 text-sm font-medium transition ${
            editor.isActive("heading", { level: 2 }) ? "bg-ink text-paper" : "text-ink hover:bg-ink/5"
          }`}
          type="button"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`rounded-[0.8rem] px-3 py-1.5 text-sm font-medium transition ${
            editor.isActive("heading", { level: 3 }) ? "bg-ink text-paper" : "text-ink hover:bg-ink/5"
          }`}
          type="button"
        >
          H3
        </button>
        
        <div className="h-4 w-px bg-ink/10" />
        
        <input
          type="color"
          onInput={(e) => editor.chain().focus().setColor(e.currentTarget.value).run()}
          value={editor.getAttributes("textStyle").color || "#000000"}
          className="h-8 w-8 cursor-pointer rounded-[0.8rem] border-0 bg-transparent p-0"
        />

        <div className="h-4 w-px bg-ink/10" />

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="rounded-[0.8rem] px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-ink/5 disabled:opacity-50"
          type="button"
        >
          {uploading ? "上傳中..." : "插入圖片"}
        </button>
        <span className="text-[12px] text-slate/60 px-2">建議圖片寬度最多 800px 以確保效能與排版</span>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
