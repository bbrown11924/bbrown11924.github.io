"use client";
export default function Select({
  value,
  onChange,
  options,
  label
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  label?: string;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      {label && <span className="min-w-16">{label}</span>}
      <select
        className="rounded-xl border px-2 py-1 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
