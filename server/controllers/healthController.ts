import { Request, Response } from "express";
import { getHealthMessage } from "../services/healthService.js";

export const getHealthStatus = (_req: Request, res: Response): void => {
  res.status(200).json({ message: getHealthMessage() });
};
