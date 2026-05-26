export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export type NoteCategory =
  | "general"
  | "work"
  | "personal"
  | "ideas"
  | "study";

export const CATEGORIES: { value: NoteCategory; label: string }[] = [
  { value: "general", label: "General" },
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
  { value: "ideas", label: "Ideas" },
  { value: "study", label: "Study" },
];

export const CATEGORY_STYLES: Record<string, string> = {
  general:
    "bg-zinc-500/15 text-zinc-300 ring-1 ring-zinc-500/25",
  work: "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/25",
  personal:
    "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25",
  ideas: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/25",
  study: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/25",
};
