import { ShieldCheck } from "lucide-react";

interface SectionProps<T extends Record<string, boolean>> {
  title: string;
  checklist: T;
  setChecklist: React.Dispatch<React.SetStateAction<T>>;
  items: { key: keyof T; label: string }[];
  complete: boolean;
}

export function PanelSection<T extends Record<string, boolean>>({
  title,
  checklist,
  setChecklist,
  items,
  complete,
}: SectionProps<T>) {
  return (
    <div className="my-1">
      <div className="flex w-full justify-between items-center py-1">
        <h2 className="text-xl font-semibold">{title}</h2>
        {complete && (
          <p className="flex items-center gap-2 text-green-600">
            <ShieldCheck size={18} /> <span>Marked as verified</span>
          </p>
        )}
      </div>
      <ul className="space-y-2">
        {items.map(({ key, label }) => (
          <li key={String(key)} className="flex items-center gap-3">
            <input
              id={`${title}-${String(key)}`}
              type="checkbox"
              checked={checklist[key]}
              onChange={() =>
                setChecklist((prev) => ({ ...prev, [key]: !prev[key] }))
              }
              className="h-4 w-4 accent-red-600 cursor-pointer"
            />
            <label htmlFor={`${title}-${String(key)}`} className="select-none">
              {label}
            </label>
          </li>
        ))}
      </ul>
      <hr className="my-2" />
    </div>
  );
}
