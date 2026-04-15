import { Request, Response } from "express";
import { Types } from "mongoose";
import { DoctorModel, EquipmentModel } from "../models/index.js";
import { emitEquipmentUpdated } from "../sockets/index.js";

const isValidObjectId = (value: string): boolean =>
  Types.ObjectId.isValid(value);

export const listEquipment = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const equipment = await EquipmentModel.find()
      .populate("assignedTo")
      .sort({ createdAt: -1 });

    res.status(200).json(equipment);
  } catch (error) {
    console.error("Failed to list equipment", error);
    res.status(500).json({ message: "Failed to list equipment" });
  }
};

export const createEquipment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const created = await EquipmentModel.create(req.body);
    const equipment = await EquipmentModel.findById(created._id).populate(
      "assignedTo"
    );

    res.status(201).json(equipment);
  } catch (error) {
    console.error("Failed to create equipment", error);
    res.status(400).json({ message: "Invalid equipment payload" });
  }
};

export const updateEquipment = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid equipment id" });
      return;
    }

    const updated = await EquipmentModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    }).populate("assignedTo");

    if (!updated) {
      res.status(404).json({ message: "Equipment not found" });
      return;
    }

    emitEquipmentUpdated(updated);
    res.status(200).json(updated);
  } catch (error) {
    console.error("Failed to update equipment", error);
    res.status(400).json({ message: "Failed to update equipment" });
  }
};

export const deleteEquipment = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid equipment id" });
      return;
    }

    const deleted = await EquipmentModel.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ message: "Equipment not found" });
      return;
    }

    res.status(200).json({ message: "Equipment deleted successfully" });
  } catch (error) {
    console.error("Failed to delete equipment", error);
    res.status(500).json({ message: "Failed to delete equipment" });
  }
};

type ClaimRequestBody = {
  doctorId?: string;
};

export const claimEquipment = async (
  req: Request<{ id: string }, unknown, ClaimRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { doctorId } = req.body;

    if (!isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid equipment id" });
      return;
    }

    if (!doctorId || !isValidObjectId(doctorId)) {
      res.status(400).json({ message: "Valid doctorId is required" });
      return;
    }

    const doctorExists = await DoctorModel.exists({ _id: doctorId });

    if (!doctorExists) {
      res.status(404).json({ message: "Doctor not found" });
      return;
    }

    const claimed = await EquipmentModel.findOneAndUpdate(
      { _id: id, status: "available" },
      {
        $set: {
          status: "in-use",
          assignedTo: doctorId,
          lastUsedBy: doctorId
        }
      },
      {
        new: true,
        runValidators: true
      }
    ).populate("assignedTo");

    if (!claimed) {
      const existing = await EquipmentModel.findById(id).select("status");

      if (!existing) {
        res.status(404).json({ message: "Equipment not found" });
        return;
      }

      if (existing.status === "in-use") {
        res.status(409).json({ message: "Equipment is already in-use" });
        return;
      }

      res.status(409).json({ message: "Equipment cannot be claimed" });
      return;
    }

    emitEquipmentUpdated(claimed);
    res.status(200).json(claimed);
  } catch (error) {
    console.error("Failed to claim equipment", error);
    res.status(500).json({ message: "Failed to claim equipment" });
  }
};
