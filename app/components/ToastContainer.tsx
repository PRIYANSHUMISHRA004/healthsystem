export type Toast = {
  id: string;
  message: string;
  variant?: "success" | "error" | "info";
};

type ToastContainerProps = {
  toasts: Toast[];
  onDismiss: (id: string) => void;
};

const toastStyles: Record<NonNullable<Toast["variant"]>, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  error: "border-rose-200 bg-rose-50 text-rose-700",
  info: "border-slate-200 bg-white text-slate-700"
};

export default function ToastContainer({
  toasts,
  onDismiss
}: ToastContainerProps) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => {
        const variant = toast.variant ?? "info";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 rounded-lg border px-3 py-2 text-sm shadow-lg ${toastStyles[variant]}`}
          >
            <p>{toast.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-xs font-semibold opacity-70 transition hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        );
      })}
    </div>
  );
}
