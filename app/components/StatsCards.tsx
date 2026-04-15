type StatsCardsProps = {
  total: number;
  available: number;
  inUse: number;
  maintenance: number;
};

const statCardStyle =
  "rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow";

export default function StatsCards({
  total,
  available,
  inUse,
  maintenance
}: StatsCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <article className={statCardStyle}>
        <p className="text-sm text-slate-500">Total Equipment</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">{total}</p>
      </article>
      <article className={statCardStyle}>
        <p className="text-sm text-slate-500">Available</p>
        <p className="mt-2 text-2xl font-semibold text-emerald-600">
          {available}
        </p>
      </article>
      <article className={statCardStyle}>
        <p className="text-sm text-slate-500">In Use</p>
        <p className="mt-2 text-2xl font-semibold text-blue-600">{inUse}</p>
      </article>
      <article className={statCardStyle}>
        <p className="text-sm text-slate-500">Maintenance</p>
        <p className="mt-2 text-2xl font-semibold text-amber-600">
          {maintenance}
        </p>
      </article>
    </section>
  );
}
