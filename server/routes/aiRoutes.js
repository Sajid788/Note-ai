import express from "express";
import {
  summarizeNote,
  summarizeContent,
  generateTitle,
} from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/summary", summarizeContent);
router.post("/summarize/:id", summarizeNote);
router.post("/title", generateTitle);

export default router;
