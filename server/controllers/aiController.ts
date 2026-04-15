import { Request, Response } from "express";
import { EquipmentModel } from "../models/index.js";
import {
  findBestMatchingEquipment,
  summarizeReviews
} from "../services/ai.service.js";

type SearchBody = {
  query?: string;
  equipmentNames?: string[];
};

type SummarizeBody = {
  reviews?: string[];
};

export const searchEquipmentWithAI = async (
  req: Request<unknown, unknown, SearchBody>,
  res: Response
): Promise<void> => {
  try {
    const query = req.body.query?.trim() ?? "";
    const providedList = (req.body.equipmentNames ?? []).filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0
    );

    const equipmentNames =
      providedList.length > 0
        ? providedList
        : await EquipmentModel.find().distinct("name");

    if (!query) {
      res.status(400).json({ message: "query is required" });
      return;
    }

    if (!equipmentNames.length) {
      res.status(400).json({ message: "No equipment names available for search" });
      return;
    }

    const match = await findBestMatchingEquipment(query, equipmentNames);
    res.status(200).json({ match });
  } catch (error) {
    console.error("AI search failed", error);
    res.status(500).json({ message: "Failed to process AI search" });
  }
};

export const summarizeReviewsWithAI = async (
  req: Request<unknown, unknown, SummarizeBody>,
  res: Response
): Promise<void> => {
  try {
    const reviews = (req.body.reviews ?? []).filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0
    );

    if (!reviews.length) {
      res.status(400).json({ message: "reviews is required" });
      return;
    }

    const summary = await summarizeReviews(reviews);
    res.status(200).json({ summary });
  } catch (error) {
    console.error("AI summarize failed", error);
    res.status(500).json({ message: "Failed to summarize reviews" });
  }
};
