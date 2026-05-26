"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { addNote } from "@/redux/notesSlice";
import { createNote } from "@/redux/notesApi";

export default function CreateNotePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = user?.token ?? "";

  const handleSave = async (data: {
    title: string;
    content: string;
    category: string;
    summary?: string;
  }) => {
    const created = await createNote(token, data);
    dispatch(addNote(created));
    router.push("/dashboard");
  };

  return (
    <div className="w-full animate-fade-in-up">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-gradient text-3xl font-bold tracking-tight sm:text-5xl">
          Create Note
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
          Write your note and use AI to generate a title or summary before
          saving.
        </p>
      </div>

      <div className="glass-card overflow-hidden rounded-[30px] border border-white/[0.08] shadow-[0_20px_80px_-40px_rgba(0,0,0,0.75)]">
        <NoteEditor
          note={null}
          isNew
          token={token}
          fullPage
          onSave={handleSave}
          onDelete={async () => {}}
          onCancel={() => router.push("/dashboard")}
        />
      </div>
    </div>
  );
}
