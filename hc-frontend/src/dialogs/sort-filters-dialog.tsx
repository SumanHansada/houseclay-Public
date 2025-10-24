import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import { SortToken } from "@/interfaces/PropertySearchSortFilter";
import { Check, X } from "lucide-react";
import { useMemo } from "react";

interface SortOption {
  value: SortToken;
  label: string;
}

interface SortFiltersDialogProps {
  id: string;
  onClose: () => void;
  options: SortOption[];
  selectedToken?: SortToken | "";
  onSelect: (token: SortToken) => void;
}

const SortFiltersDialog: React.FC<SortFiltersDialogProps> = ({
  id,
  onClose,
  options,
  selectedToken,
  onSelect,
}) => {
  const selected = useMemo(() => selectedToken ?? "", [selectedToken]);

  return (
    <Dialog
      id={id}
      type="bottom-sheet"
      onClose={onClose}
      width={100}
      entryAnimation="animate-slide-in-bottom"
      exitAnimation="animate-slide-out-bottom"
    >
      <DialogHeader>
        <div className="relative flex h-full w-full items-center justify-center">
          {/* Title: Centered and only visible on mobile */}
          <h1 className="text-lg text-center truncate font-medium md:hidden">
            Sort Filters
          </h1>

          {/* Close Button: Repositions itself based on screen size */}
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute p-1 right-0 top-1/2 -translate-y-1/2 rounded-full border border-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      </DialogHeader>
      <DialogContent>
        <ul
          role="radiogroup"
          aria-label="Sort options"
          className="divide-y divide-gray-200"
        >
          {options.map((opt) => {
            const isActive = opt.value === selected;
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => {
                    onSelect(opt.value);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left
                    ${isActive ? "bg-red-50" : "bg-white"} focus:outline-none`}
                >
                  <span
                    className={`${isActive ? "text-red-700 font-medium" : "text-gray-900"}`}
                  >
                    {opt.label}
                  </span>
                  {isActive ? (
                    <Check className="shrink-0" size={18} />
                  ) : (
                    <span className="h-4 w-4 rounded-full border border-gray-300" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default SortFiltersDialog;
