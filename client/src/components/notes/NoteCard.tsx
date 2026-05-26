"use client";

import { Sparkles, Trash2, Wand2 } from "lucide-react";
import type { Note } from "@/lib/types";
import { CATEGORIES, CATEGORY_STYLES } from "@/lib/types";

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
  onAiTitle: () => void;
  aiTitleLoading?: boolean;
  index?: number;
}

function getCategoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function NoteCard({
  note,
  onEdit,
  onDelete,
  onAiTitle,
  aiTitleLoading,
  index = 0,
}: NoteCardProps) {
  const catStyle =
    CATEGORY_STYLES[note.category] || CATEGORY_STYLES.general;

  return (
    <article
      className="glass-card group flex flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <span
          className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase ${catStyle}`}
        >
          {getCategoryLabel(note.category)}
        </span>
        <button
          type="button"
          onClick={onDelete}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400/90 ring-1 ring-red-500/20 opacity-70 transition-all duration-200 hover:bg-red-500/20 hover:text-red-300 sm:opacity-0 sm:group-hover:opacity-100"
          aria-label="Delete note"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <h3 className="mb-2 text-lg font-semibold tracking-tight line-clamp-3 text-white transition-colors group-hover:text-violet-100">
        {note.title}
      </h3>
      <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-500">
        {note.content}
      </p>

      {note.summary && (
        <div className="mb-5 rounded-xl bg-black/30 p-4 ring-1 ring-violet-500/10">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500/20">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            </span>
            <span className="text-[11px] font-semibold tracking-wide text-violet-400/90 uppercase">
              AI Summary
            </span>
          </div>
          <p className="text-sm leading-relaxed text-zinc-400 line-clamp-3">{note.summary}</p>
        </div>
      )}

      <div className="mt-auto flex gap-2.5 pt-1">
        <button
          type="button"
          onClick={onEdit}
          className="btn-primary flex-1 rounded-xl py-2.5 text-sm"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onAiTitle}
          disabled={aiTitleLoading}
          className="btn-ghost-premium flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium disabled:opacity-50"
        >
          {aiTitleLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
          ) : (
            <Wand2 className="h-4 w-4 text-violet-400" />
          )}
          AI Title
        </button>
      </div>
    </article>
  );
}
