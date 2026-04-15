export type EquipmentStatus = "available" | "in-use" | "maintenance";

export type Doctor = {
  _id: string;
  name: string;
};

export type Equipment = {
  _id: string;
  name: string;
  status: EquipmentStatus;
  hospitalSection: string;
  assignedTo: Doctor | null;
};
