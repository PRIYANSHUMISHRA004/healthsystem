"use client";

import { useEffect, useMemo, useState } from "react";
import EquipmentTable from "../components/EquipmentTable";
import SearchBar from "../components/SearchBar";
import StatsCards from "../components/StatsCards";
import ToastContainer, { Toast } from "../components/ToastContainer";
import { getSocket } from "../lib/socket";
import { Equipment, EquipmentStatus } from "../types/equipment";

export default function HomePage() {
  const [apiStatus, setApiStatus] = useState("Checking server...");
  const [apiError, setApiError] = useState(false);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoadingEquipment, setIsLoadingEquipment] = useState(true);
  const [equipmentError, setEquipmentError] = useState<string | null>(null);
  const [socketState, setSocketState] = useState("Connecting...");
  const [searchText, setSearchText] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = (
    message: string,
    variant: Toast["variant"] = "info"
  ): void => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current, { id, message, variant }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string): void => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch("/api/health");

        if (!response.ok) {
          throw new Error("Health check failed");
        }

        const data = (await response.json()) as { message: string };
        setApiStatus(data.message);
        setApiError(false);
      } catch (error) {
        setApiStatus("Unable to connect to backend server.");
        setApiError(true);
        pushToast("Backend health check failed.", "error");
      }
    };

    void fetchHealth();
  }, []);

  const fetchEquipment = async (): Promise<void> => {
    setIsLoadingEquipment(true);
    setEquipmentError(null);

    try {
      const response = await fetch("/api/equipment");

      if (!response.ok) {
        throw new Error("Equipment fetch failed");
      }

      const data = (await response.json()) as Equipment[];
      setEquipment(data);
    } catch (error) {
      console.error("Failed to fetch equipment", error);
      setEquipmentError("Failed to load equipment. Please retry.");
      pushToast("Could not load equipment inventory.", "error");
    } finally {
      setIsLoadingEquipment(false);
    }
  };

  useEffect(() => {
    void fetchEquipment();
  }, []);

  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => {
      setSocketState("Connected");
    };

    const handleDisconnect = () => {
      setSocketState("Disconnected");
    };

    const handleEquipmentUpdate = (updatedEquipment: Equipment) => {
      setEquipment((previous) => {
        const alreadyExists = previous.some(
          (item) => item._id === updatedEquipment._id
        );

        if (!alreadyExists) {
          return [updatedEquipment, ...previous];
        }

        return previous.map((item) =>
          item._id === updatedEquipment._id ? updatedEquipment : item
        );
      });
      pushToast(`Real-time update: ${updatedEquipment.name}`, "info");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("equipmentUpdated", handleEquipmentUpdate);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("equipmentUpdated", handleEquipmentUpdate);
    };
  }, []);

  const handleClaim = async (equipmentId: string) => {
    if (!doctorId.trim()) {
      pushToast("Enter a doctor ID before claiming.", "error");
      return;
    }

    const previousEquipment = equipment;
    const targetEquipment = equipment.find((item) => item._id === equipmentId);

    if (!targetEquipment) {
      pushToast("Equipment record not found in UI.", "error");
      return;
    }

    const optimisticDoctor = {
      _id: doctorId.trim(),
      name: targetEquipment.assignedTo?.name ?? "Pending assignment"
    };

    setClaimingId(equipmentId);

    // Optimistic update for immediate UX feedback.
    setEquipment((current) =>
      current.map((item) =>
        item._id === equipmentId
          ? {
              ...item,
              status: "in-use" as EquipmentStatus,
              assignedTo: optimisticDoctor
            }
          : item
      )
    );

    try {
      const response = await fetch(`/api/equipment/${equipmentId}/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ doctorId: doctorId.trim() })
      });

      const payload = (await response.json()) as Equipment | { message: string };

      if (!response.ok) {
        const message =
          "message" in payload ? payload.message : "Unable to claim equipment";
        setEquipment(previousEquipment);
        pushToast(message, "error");
        return;
      }

      const updatedEquipment = payload as Equipment;
      setEquipment((previous) =>
        previous.map((item) =>
          item._id === updatedEquipment._id ? updatedEquipment : item
        )
      );
      pushToast(`Successfully claimed ${updatedEquipment.name}.`, "success");
    } catch (error) {
      console.error("Failed to claim equipment", error);
      setEquipment(previousEquipment);
      pushToast("Failed to claim equipment.", "error");
    } finally {
      setClaimingId(null);
    }
  };

  const filteredEquipment = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return equipment;
    }

    return equipment.filter((item) => {
      const doctorName = item.assignedTo?.name ?? "";
      const searchable = `${item.name} ${item.status} ${item.hospitalSection} ${doctorName}`;
      return searchable.toLowerCase().includes(query);
    });
  }, [equipment, searchText]);

  const stats = useMemo(
    () => ({
      total: filteredEquipment.length,
      available: filteredEquipment.filter((item) => item.status === "available")
        .length,
      inUse: filteredEquipment.filter((item) => item.status === "in-use").length,
      maintenance: filteredEquipment.filter(
        (item) => item.status === "maintenance"
      ).length
    }),
    [filteredEquipment]
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Equipment Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Monitor inventory, claim devices, and track updates in real time.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
          <p className={apiError ? "text-rose-600" : "text-emerald-600"}>
            API: {apiStatus}
          </p>
          <p
            className={
              socketState === "Connected" ? "text-emerald-600" : "text-amber-600"
            }
          >
            Socket: {socketState}
          </p>
        </div>
      </header>

      <div className="space-y-4">
        <StatsCards
          total={stats.total}
          available={stats.available}
          inUse={stats.inUse}
          maintenance={stats.maintenance}
        />

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SearchBar value={searchText} onChange={setSearchText} />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label
              htmlFor="doctor-id"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Doctor ID for claim
            </label>
            <input
              id="doctor-id"
              type="text"
              value={doctorId}
              onChange={(event) => setDoctorId(event.target.value)}
              placeholder="Enter doctor ObjectId"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 transition focus:ring-2"
            />
          </div>
        </section>

        <EquipmentTable
          equipment={filteredEquipment}
          doctorId={doctorId.trim()}
          claimingId={claimingId}
          isLoading={isLoadingEquipment}
          errorMessage={equipmentError}
          onClaim={handleClaim}
          onRetry={() => {
            void fetchEquipment();
          }}
        />
      </div>
    </main>
  );
}
