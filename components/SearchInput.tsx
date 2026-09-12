"use client";
export default function SearchInput({
  value,
  onChange,
  placeholder = "Search title, authors, venue..."
}: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
    />
  );
}
