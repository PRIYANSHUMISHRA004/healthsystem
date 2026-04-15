import StatusBadge from "./StatusBadge";
import { Equipment } from "../types/equipment";

type EquipmentTableProps = {
  equipment: Equipment[];
  doctorId: string;
  claimingId: string | null;
  isLoading: boolean;
  errorMessage: string | null;
  onClaim: (equipmentId: string) => void;
  onRetry: () => void;
};

export default function EquipmentTable({
  equipment,
  doctorId,
  claimingId,
  isLoading,
  errorMessage,
  onClaim,
  onRetry
}: EquipmentTableProps) {
  if (isLoading) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Loading equipment inventory...</p>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="rounded-xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
        <p className="text-sm text-rose-700">{errorMessage}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-500"
        >
          Retry
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-600">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Section</th>
              <th className="px-4 py-3 font-semibold">Assigned Doctor</th>
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {equipment.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50/80">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {item.name}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-4 py-3 text-slate-700">{item.hospitalSection}</td>
                <td className="px-4 py-3 text-slate-700">
                  {item.assignedTo?.name ?? "Unassigned"}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    disabled={
                      item.status !== "available" || !doctorId || claimingId === item._id
                    }
                    onClick={() => onClaim(item._id)}
                    className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {item.status === "in-use"
                      ? "In Use"
                      : claimingId === item._id
                        ? "Claiming..."
                        : "Claim"}
                  </button>
                </td>
              </tr>
            ))}
            {!equipment.length && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No equipment found for your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
