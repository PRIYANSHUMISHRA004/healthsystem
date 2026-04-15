import { EquipmentStatus } from "../types/equipment";

type StatusBadgeProps = {
  status: EquipmentStatus;
};

const statusStyles: Record<EquipmentStatus, string> = {
  available: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  "in-use": "bg-blue-100 text-blue-700 ring-blue-200",
  maintenance: "bg-amber-100 text-amber-700 ring-amber-200"
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${statusStyles[status]}`}
    >
      {status.replace("-", " ")}
    </span>
  );
}
