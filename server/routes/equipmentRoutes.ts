import { Router } from "express";
import {
  claimEquipment,
  createEquipment,
  deleteEquipment,
  listEquipment,
  updateEquipment
} from "../controllers/equipmentController.js";

const router = Router();

router.get("/equipment", listEquipment);
router.post("/equipment", createEquipment);
router.patch("/equipment/:id", updateEquipment);
router.delete("/equipment/:id", deleteEquipment);
router.post("/equipment/:id/claim", claimEquipment);

export default router;
