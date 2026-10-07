"use client";

type Option = string | { value: string; label: string };

export default function Select({
  value,
  onChange,
  options,
  label
}: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  label?: string;
}) {
  return (
    // min-w-0 + flex-1 keep the dropdown inside its grid cell: a <select> is
    // otherwise as wide as its longest option (e.g. a long journal name) and
    // overflows into the neighboring control.
    <label className="flex min-w-0 items-center gap-2 text-sm">
      {label && <span className="min-w-16 shrink-0">{label}</span>}
      <select
        className="min-w-0 flex-1 truncate rounded-xl border px-2 py-1 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => {
          const { value: v, label: l } = typeof o === "string" ? { value: o, label: o } : o;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </label>
  );
}
