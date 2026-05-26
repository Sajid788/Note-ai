import Note from "../models/Note.js";

const callGroq = async (prompt) => {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "AI request failed");
  }

  return data.choices[0].message.content.trim();
};

export const summarizeNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const prompt = `Summarize this note in 2-3 short sentences:\n\n${note.content}`;
    const summary = await callGroq(prompt);

    note.summary = summary;
    await note.save();

    res.json({ summary, note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const summarizeContent = async (req, res) => {
  try {
    const { content, noteId } = req.body;
    let text = content?.trim();

    if (!text && noteId) {
      const note = await Note.findOne({ _id: noteId, user: req.user.id });
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      text = note.content;
    }

    if (!text) {
      return res.status(400).json({ message: "Content is required" });
    }

    const prompt = `Summarize this note in 2-3 short sentences:\n\n${text}`;
    const summary = await callGroq(prompt);

    if (noteId) {
      const note = await Note.findOne({ _id: noteId, user: req.user.id });
      note.summary = summary;
      await note.save();
      return res.json({ summary, note });
    }

    res.json({ summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateTitle = async (req, res) => {
  try {
    const { content, noteId } = req.body;
    let text = content;

    if (noteId) {
      const note = await Note.findOne({ _id: noteId, user: req.user.id });
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      text = note.content;
    }

    if (!text) {
      return res.status(400).json({ message: "Content is required" });
    }

    const prompt = `Give one short title (max 8 words) for this note. Reply with title only:\n\n${text}`;
    const title = await callGroq(prompt);

    if (noteId) {
      const note = await Note.findOne({ _id: noteId, user: req.user.id });
      note.title = title;
      await note.save();
      return res.json({ title, note });
    }

    res.json({ title });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
