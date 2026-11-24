import type { DocumentCategory, ProjectDocument } from "../../../../types/project/documents";
import type { Tone } from "../ui/palette";

export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  mandat: "Mandats",
  diagnostic: "Diagnostics",
  plan: "Plans",
  photo: "Photos",
  autre: "Autres",
};

export const CATEGORY_ORDER: DocumentCategory[] = ["mandat", "diagnostic", "plan", "photo", "autre"];

const EXTENSION_TONES: Record<string, Tone> = { PDF: "red", DOCX: "blue", DWG: "blue", JPG: "emerald", JPEG: "emerald", PNG: "emerald", XLSX: "emerald" };

const NEW_DOCUMENT_MS = 7 * 86_400_000;

export const extensionOf = (name: string): string => name.split(".").pop()?.toUpperCase().slice(0, 4) ?? "DOC";

export const extensionTone = (name: string): Tone => EXTENSION_TONES[extensionOf(name)] ?? "zinc";

export const categoryOf = (document: ProjectDocument): DocumentCategory => document.category ?? (document.documentType === "image" ? "photo" : "autre");

export const isNewDocument = (document: ProjectDocument, now: number = Date.now()): boolean =>
  now - new Date(document.createdAt).getTime() < NEW_DOCUMENT_MS;

export function guessCategory(file: File): DocumentCategory {
  const name = file.name.toLowerCase();
  if (file.type.startsWith("image/")) return "photo";
  if (/mandat|compromis|offre/.test(name)) return "mandat";
  if (/dpe|diagnostic|amiante|plomb|termite|erp|pv_ag|copro/.test(name)) return "diagnostic";
  if (/plan|cadastr/.test(name)) return "plan";
  return "autre";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1000) return `${bytes} o`;
  if (bytes < 1_000_000) return `${Math.round(bytes / 1000)} Ko`;
  return `${(bytes / 1_000_000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} Mo`;
}
