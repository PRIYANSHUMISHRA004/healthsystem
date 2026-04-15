type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <label
        htmlFor="equipment-search"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Search equipment
      </label>
      <div className="relative">
        <input
          id="equipment-search"
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search by name, status, section, or doctor..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 pl-10 text-sm outline-none ring-blue-500 transition focus:ring-2"
        />
        <span className="pointer-events-none absolute left-3 top-2.5 text-slate-400">
          /
        </span>
      </div>
    </div>
  );
}
