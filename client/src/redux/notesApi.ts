const API_URL = "http://localhost:8080";

// GET - All notes
export const getNotes = async (
  token: string,
  search?: string,
  category?: string
) => {
  try {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    const query = params.toString() ? `?${params}` : "";

    const response = await fetch(`${API_URL}/api/notes${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch notes");
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// POST - Create note
export const createNote = async (
  token: string,
  body: {
    title: string;
    content: string;
    category: string;
    summary?: string;
  }
) => {
  try {
    const response = await fetch(`${API_URL}/api/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create note");
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// PUT - Update note
export const updateNote = async (
  token: string,
  id: string,
  body: {
    title: string;
    content: string;
    category: string;
    summary?: string;
  }
) => {
  try {
    const response = await fetch(`${API_URL}/api/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update note");
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// DELETE - Delete note
export const deleteNote = async (token: string, id: string) => {
  try {
    const response = await fetch(`${API_URL}/api/notes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to delete note");
    }

    return id;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// POST - AI Summarize (works with content before save)
export const summarizeContent = async (
  token: string,
  content: string,
  noteId?: string
) => {
  try {
    const response = await fetch(`${API_URL}/api/ai/summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, noteId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "AI summarize failed");
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// POST - AI Generate Title
export const generateTitle = async (
  token: string,
  content: string,
  noteId?: string
) => {
  try {
    const response = await fetch(`${API_URL}/api/ai/title`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, noteId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "AI title failed");
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
