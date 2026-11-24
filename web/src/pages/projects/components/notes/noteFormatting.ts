export type NoteFormat = "bold" | "italic" | "list" | "task";

const WRAPPERS: Record<NoteFormat, { before: string; after: string; linePrefix: boolean }> = {
  bold: { before: "**", after: "**", linePrefix: false },
  italic: { before: "_", after: "_", linePrefix: false },
  list: { before: "- ", after: "", linePrefix: true },
  task: { before: "- [ ] ", after: "", linePrefix: true },
};

export function applyFormat(textarea: HTMLTextAreaElement, format: NoteFormat): { value: string; cursor: number } {
  const { before, after, linePrefix } = WRAPPERS[format];
  const { value, selectionStart, selectionEnd } = textarea;
  if (linePrefix) {
    const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    return { value: `${value.slice(0, lineStart)}${before}${value.slice(lineStart)}`, cursor: selectionEnd + before.length };
  }
  const selected = value.slice(selectionStart, selectionEnd);
  return {
    value: `${value.slice(0, selectionStart)}${before}${selected}${after}${value.slice(selectionEnd)}`,
    cursor: selectionEnd + before.length + (selected ? after.length : 0),
  };
}
