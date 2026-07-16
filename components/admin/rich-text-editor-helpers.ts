export type RichTextEditorSyncTarget = {
  isDestroyed: boolean;
  getHTML: () => string;
  commands: {
    setContent: (content: string, options: { emitUpdate: false }) => boolean;
  };
};

export function syncExternalRichTextValue(
  editor: RichTextEditorSyncTarget | null,
  value: string
): boolean {
  if (!editor || editor.isDestroyed || editor.getHTML() === value) return false;
  editor.commands.setContent(value, { emitUpdate: false });
  return true;
}
