"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  FileText,
  Wand2,
  Sparkles,
  StickyNote,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { NoteCard } from "@/components/notes/NoteCard";
import { NoteModal } from "@/components/notes/NoteModal";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  setNotes,
  setLoading,
  setError,
  updateNote,
  removeNote,
} from "@/redux/notesSlice";
import {
  getNotes,
  updateNote as updateNoteApi,
  deleteNote,
  generateTitle,
} from "@/redux/notesApi";
import { CATEGORIES } from "@/lib/types";
import { toast } from "@/lib/toast";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { notes, loading, error } = useSelector((state: RootState) => state.notes);
  const user = useSelector((state: RootState) => state.auth.user);
  const token = user?.token ?? "";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [aiTitleId, setAiTitleId] = useState<string | null>(null);
  const [aiStats, setAiStats] = useState(() => {
    if (typeof window === "undefined") {
      return { titles: 0, summaries: 0 };
    }

    const saved = window.localStorage.getItem("ai-stats");
    if (!saved) {
      return { titles: 0, summaries: 0 };
    }

    try {
      return JSON.parse(saved) as { titles: number; summaries: number };
    } catch {
      return { titles: 0, summaries: 0 };
    }
  });

  useEffect(() => {
    if (!token) return;

    const timer = setTimeout(async () => {
      dispatch(setLoading(true));
      try {
        const data = await getNotes(token, search, category);
        dispatch(setNotes(data));
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load notes";
        dispatch(setError(msg));
        toast.error(msg);
      } finally {
        dispatch(setLoading(false));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, token, search, category]);

  const selectedNote = notes.find((n) => n._id === selectedId) ?? null;
  const summaryCount = notes.filter((n) => n.summary?.trim()).length;

  const openEdit = (id: string) => {
    setSelectedId(id);
    setModalOpen(true);
  };

  const handleSave = async (data: {
    title: string;
    content: string;
    category: string;
    summary?: string;
  }) => {
    if (!selectedId) return;
    const updated = await updateNoteApi(token, selectedId, data);
    dispatch(updateNote(updated));
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(token, id);
      dispatch(removeNote(id));
      toast.success("Note deleted");
      if (selectedId === id) {
        setModalOpen(false);
        setSelectedId(null);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
      throw err;
    }
  };

  const handleAiTitle = async (noteId: string, content: string) => {
    setAiTitleId(noteId);
    try {
      const data = await generateTitle(token, content, noteId);
      if (data.note) dispatch(updateNote(data.note));
      const next = { ...aiStats, titles: aiStats.titles};
      setAiStats(next);
      localStorage.setItem("ai-stats", JSON.stringify(next));
      toast.success("AI title generated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI title failed");
    } finally {
      setAiTitleId(null);
    }
  };

  return (
    <>
      <div className="glass-card relative mb-8 animate-fade-in-up overflow-hidden rounded-2xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-violet-600/5 via-transparent to-indigo-600/5" />
        <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-[13px] font-medium tracking-wide text-violet-400/90 uppercase">
              Overview
            </p>
            <h1 className="text-gradient mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              Notes Dashboard
            </h1>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-zinc-500">
              Simple and clean AI powered notes manager — write, organize, and
              summarize effortlessly.
            </p>
          </div>
          <Link
            href="/dashboard/create"
            className="btn-primary inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm"
          >
            <Plus className="h-4 w-4" />
            Create Note
          </Link>
        </div>
      </div>

      <div className="animate-fade-in-up animate-delay-1 mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/[0.06] bg-zinc-900/60 py-3.5 pl-11 pr-4 text-sm text-white shadow-inner placeholder:text-zinc-600 transition-all focus:border-violet-500/30 focus:bg-zinc-900/80 focus:outline-none focus:ring-2 focus:ring-violet-500/15"
          />
        </div>
        <div className="relative sm:w-52">
          <Filter className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full appearance-none rounded-xl border border-white/[0.06] bg-zinc-900/60 py-3.5 pl-11 pr-4 text-sm text-white transition-all focus:border-violet-500/30 focus:outline-none focus:ring-2 focus:ring-violet-500/15"
          >
            <option value="" className="bg-zinc-900">
              All categories
            </option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value} className="bg-zinc-900">
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300 ring-1 ring-red-500/20">
          {error}
        </div>
      )}

      <div className="animate-fade-in-up animate-delay-2 mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Notes" value={notes.length} icon={FileText} accent="violet" />
        <StatCard
          label="AI Titles"
          value={aiStats.titles || notes.length}
          icon={Wand2}
          accent="indigo"
        />
        <StatCard
          label="AI Summaries"
          value={summaryCount || aiStats.summaries}
          icon={Sparkles}
          accent="fuchsia"
        />
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="skeleton-shimmer h-80 rounded-2xl ring-1 ring-white/[0.04]"
            />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center rounded-2xl py-24 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20">
            <StickyNote className="h-8 w-8 text-violet-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">No notes yet</h3>
          <p className="mt-2 max-w-sm text-sm text-zinc-500">
            Create your first note and let AI help you title and summarize your
            ideas.
          </p>
          <Link
            href="/dashboard/create"
            className="btn-primary mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm"
          >
            <Plus className="h-4 w-4" />
            Create your first note
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {notes.map((note, i) => (
            <NoteCard
              key={note._id}
              note={note}
              index={i}
              onEdit={() => openEdit(note._id)}
              onDelete={() => handleDelete(note._id)}
              onAiTitle={() => handleAiTitle(note._id, note.content)}
              aiTitleLoading={aiTitleId === note._id}
            />
          ))}
        </div>
      )}

      <NoteModal
        open={modalOpen}
        note={selectedNote}
        isNew={false}
        token={token}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={async () => {
          if (selectedId) {
            await handleDelete(selectedId);
          }
        }}
      />
    </>
  );
}
