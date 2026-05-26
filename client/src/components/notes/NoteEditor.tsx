"use client";

import { useState } from "react";
import { Sparkles, Wand2, Trash2, Save, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { CATEGORIES, type Note } from "@/lib/types";
import { useDispatch } from "react-redux";
import { updateNote } from "@/redux/notesSlice";
import { summarizeContent, generateTitle } from "@/redux/notesApi";
import { toast } from "@/lib/toast";

interface NoteEditorProps {
  note: Note | null;
  isNew: boolean;
  token: string;
  fullPage?: boolean;
  onSave: (data: {
    title: string;
    content: string;
    category: string;
    summary?: string;
  }) => Promise<void>;
  onDelete: () => Promise<void>;
  onCancel: () => void;
}

function bumpAiStat(key: "titles" | "summaries") {
  try {
    const raw = localStorage.getItem("ai-stats");
    const stats = raw ? JSON.parse(raw) : { titles: 0, summaries: 0 };
    stats[key] = (stats[key] || 0) + 1;
    localStorage.setItem("ai-stats", JSON.stringify(stats));
  } catch {
    /* ignore */
  }
}

export function NoteEditor({
  note,
  isNew,
  token,
  fullPage,
  onSave,
  onDelete,
  onCancel,
}: NoteEditorProps) {
  const dispatch = useDispatch();

  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [category, setCategory] = useState(note?.category ?? "general");
  const [summary, setSummary] = useState(note?.summary ?? "");
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState<"title" | "summary" | null>(null);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        content: content.trim(),
        category,
        summary: summary.trim() || undefined,
      });
      toast.success(isNew ? "Note created successfully!" : "Note updated successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateTitle = async () => {
    if (!content.trim()) {
      toast.error("Write some content first");
      return;
    }
    setAiLoading("title");
    try {
      const data = await generateTitle(token, content.trim(), note?._id);
      setTitle(data.title);
      if (data.note) {
        dispatch(updateNote(data.note));
        setSummary(data.note.summary);
      }
      bumpAiStat("titles");
      toast.success("AI title generated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI title failed");
    } finally {
      setAiLoading(null);
    }
  };

  const handleSummarize = async () => {
    if (!content.trim()) {
      toast.error("Write some content first");
      return;
    }
    setAiLoading("summary");
    try {
      const data = await summarizeContent(
        token,
        content.trim(),
        note?._id
      );
      setSummary(data.summary);
      if (data.note) dispatch(updateNote(data.note));
      bumpAiStat("summaries");
      toast.success("AI summary generated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI summarize failed");
    } finally {
      setAiLoading(null);
    }
  };

  return (
    <div className={`flex flex-col ${fullPage ? "min-h-[480px]" : "max-h-[85vh]"}`}>
      <div
        className={`border-b border-white/[0.06] ${
          fullPage ? "px-5 py-5 sm:px-7 sm:py-6" : "px-6 py-5"
        }`}
      >
        <div
          className={`flex ${
            fullPage
              ? "flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
              : "items-center justify-between"
          }`}
        >
          {!fullPage && (
            <div>
              <p className="text-[11px] font-medium tracking-wide text-violet-400/80 uppercase">
                {isNew ? "New" : "Editing"}
              </p>
              <h2 className="text-lg font-semibold text-white">
                {isNew ? "Create Note" : "Edit Note"}
              </h2>
            </div>
          )}
          <div
            className={`flex gap-2 ${
              fullPage ? "w-full flex-col sm:flex-row sm:justify-end" : ""
            }`}
          >
            {isNew && (
              <button
                type="button"
                onClick={onCancel}
                className={`btn-ghost-premium inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium ${
                  fullPage ? "sm:min-w-[140px]" : ""
                }`}
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            )}
            {!isNew && (
              <button
                type="button"
                onClick={onDelete}
                className={`inline-flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 ring-1 ring-red-500/20 hover:bg-red-500/15 ${
                  fullPage ? "sm:min-w-[140px]" : ""
                }`}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={`btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2 text-sm disabled:opacity-50 ${
                fullPage ? "sm:min-w-[160px]" : ""
              }`}
            >
              {saving ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-black" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isNew ? "Create" : "Save"}
            </button>
          </div>
        </div>
      </div>

      {fullPage ? (
        <div className="space-y-6 overflow-y-auto p-5 sm:p-7">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <div className="min-w-0 flex-1">
              <Input
                id="title"
                label="Title"
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={handleGenerateTitle}
              disabled={aiLoading === "title"}
              className="btn-ghost-premium inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium disabled:opacity-50 lg:min-w-[140px]"
            >
              {aiLoading === "title" ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
              ) : (
                <Wand2 className="h-4 w-4 text-violet-400" />
              )}
              AI Title
            </button>
          </div>

          <Select
            id="category"
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={CATEGORIES}
          />

          <Textarea
            id="content"
            label="Content"
            placeholder="Start writing your thoughts..."
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            
          />

          <button
            type="button"
            onClick={handleSummarize}
            disabled={aiLoading === "summary"}
            className="inline-flex items-center gap-2 rounded-xl border border-violet-500/25 bg-violet-500/10 px-4 py-2.5 text-sm font-medium text-violet-300 transition-colors hover:bg-violet-500/15 disabled:opacity-50"
          >
            {aiLoading === "summary" ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500/30 border-t-violet-300" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Summarize with AI
          </button>

          {summary && (
            <div className="rounded-xl bg-black/30 p-4 ring-1 ring-violet-500/15">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-violet-400 uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                AI Summary
              </div>
              <p className="text-sm leading-relaxed text-zinc-400">{summary}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-5 overflow-y-auto p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Input
                id="title"
                label="Title"
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={handleGenerateTitle}
              disabled={aiLoading === "title"}
              className="btn-ghost-premium inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium disabled:opacity-50"
            >
              {aiLoading === "title" ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
              ) : (
                <Wand2 className="h-4 w-4 text-violet-400" />
              )}
              AI Title
            </button>
          </div>

          <Select
            id="category"
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={CATEGORIES}
          />

          <Textarea
            id="content"
            label="Content"
            placeholder="Start writing your thoughts..."
            rows={fullPage ? 4 : 3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button
            type="button"
            onClick={handleSummarize}
            disabled={aiLoading === "summary"}
            className="inline-flex items-center gap-2 rounded-xl border border-violet-500/25 bg-violet-500/10 px-4 py-2.5 text-sm font-medium text-violet-300 transition-colors hover:bg-violet-500/15 disabled:opacity-50"
          >
            {aiLoading === "summary" ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500/30 border-t-violet-300" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Summarize with AI
          </button>

          {summary && (
            <div className="rounded-xl bg-black/30 p-4 ring-1 ring-violet-500/15">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-violet-400 uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                AI Summary
              </div>
              <p className="text-sm leading-relaxed text-zinc-400">{summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
