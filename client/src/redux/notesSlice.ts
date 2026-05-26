import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Note } from "@/lib/types";

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
}

const initialState: NotesState = {
  notes: [],
  loading: false,
  error: null,
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setNotes: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addNote: (state, action: PayloadAction<Note>) => {
      state.notes.unshift(action.payload);
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      const i = state.notes.findIndex((n) => n._id === action.payload._id);
      if (i !== -1) state.notes[i] = action.payload;
    },
    removeNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((n) => n._id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setNotes,
  setLoading,
  setError,
  addNote,
  updateNote,
  removeNote,
  clearError,
} = notesSlice.actions;
export default notesSlice.reducer;
