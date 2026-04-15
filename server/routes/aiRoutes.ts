import { Router } from "express";
import {
  searchEquipmentWithAI,
  summarizeReviewsWithAI
} from "../controllers/aiController.js";

const router = Router();

router.post("/ai/search", searchEquipmentWithAI);
router.post("/ai/summarize", summarizeReviewsWithAI);

export default router;
