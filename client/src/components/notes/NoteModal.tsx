"use client";

import { X } from "lucide-react";
import { NoteEditor } from "./NoteEditor";
import type { Note } from "@/lib/types";

interface NoteModalProps {
  open: boolean;
  note: Note | null;
  isNew: boolean;
  token: string;
  onClose: () => void;
  onSave: (data: {
    title: string;
    content: string;
    category: string;
  }) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function NoteModal({
  open,
  note,
  isNew,
  token,
  onClose,
  onSave,
  onDelete,
}: NoteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md "
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl animate-fade-in-up">
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/10 to-transparent opacity-50" />
        <div className="glass-card relative flex max-h-[90vh] flex-col overflow-hidden rounded-2xl shadow-2xl shadow-black/50">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-6 z-20 flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-800/80 text-zinc-400 ring-1 ring-white/10 transition-colors hover:bg-zinc-700 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
          <NoteEditor
            key={isNew ? "new" : note?._id}
            note={note}
            isNew={isNew}
            token={token}
            onSave={async (data) => {
              await onSave(data);
              onClose();
            }}
            onDelete={async () => {
              await onDelete();
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
