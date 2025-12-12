import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/base-components";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/Dialog";
import { SORT_OPTIONS, SortToken } from "@/interfaces/PropertySearchSortFilter";
import { MobileHeader } from "@/layout-components";

interface SortOption {
  value: SortToken;
  label: string;
}

interface SortFiltersDialogProps {
  id: string;
  onClose: () => void;
  options: SortOption[];
  selectedToken?: SortToken;
  onSelect: (token: SortToken) => void;
}

const SortFiltersDialog: React.FC<SortFiltersDialogProps> = ({
  id,
  onClose,
  options,
  selectedToken,
  onSelect,
}) => {
  const [selectedOption, setSelectedOption] = useState(
    selectedToken || SORT_OPTIONS[0].value,
  ); // Default to first option if none selected (i.e., "NONE")

  const selectedRef = useRef<HTMLLIElement>(null);

  // If present auto scroll to selected option
  useEffect(() => {
    if (selectedRef.current && selectedToken) {
      // Only if selected
      selectedRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog
      id={id}
      type="bottom-sheet"
      onClose={onClose}
      height={50}
      entryAnimation="animate-slide-in-bottom"
      exitAnimation="animate-slide-out-bottom"
    >
      <DialogHeader className="-mx-4">
        <MobileHeader className="relative">
          <MobileHeader.Title>Sort Filters</MobileHeader.Title>
          <MobileHeader.RightAction>
            <Button
              variant="secondary"
              size="custom"
              className="rounded-full p-1"
              onClick={onClose}
            >
              <X size={24} />
            </Button>
          </MobileHeader.RightAction>
        </MobileHeader>
      </DialogHeader>
      <DialogContent>
        <ul role="radiogroup" aria-label="Sort options" className="px-4 py-4">
          {options.map((opt) => {
            const isActive = opt.value === selectedOption;
            const radioId = `${id}-${opt.value}`;
            return (
              <li key={opt.value} ref={isActive ? selectedRef : undefined}>
                <div className="focus-within:ring-1 focus-within:rounded-lg focus-within:ring-red-500">
                  <label
                    htmlFor={radioId}
                    className={`w-full flex items-center  rounded-lg justify-between px-4 py-3 text-left cursor-pointer
                      ${isActive ? "border bg-red-50 border-red-500" : "border-none"} focus:outline-none`}
                  >
                    <span
                      className={`${isActive ? "text-red-600 font-medium" : "text-gray-900"}`}
                    >
                      {opt.label}
                    </span>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isActive ? "border-red-500 bg-white" : "border-gray-300"
                      }`}
                    >
                      {isActive && (
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      )}
                    </div>
                  </label>
                  <input
                    type="radio"
                    id={radioId}
                    name={`${id}-sort-option`}
                    checked={isActive}
                    onChange={() => setSelectedOption(opt.value)}
                    className="sr-only"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </DialogContent>
      <DialogFooter className="border-t">
        <div className="flex border-gray-200 w-full justify-between gap-4">
          <Button
            variant="outline"
            size="md"
            className="flex items-center w-full gap-2 px-4 py-3 rounded-xl border border-gray-300 text-gray-500 bg-white hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            className="px-4 py-3 rounded-xl w-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            onClick={() => {
              onSelect(selectedOption as SortToken);
              onClose();
            }}
          >
            Apply
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
};

export default SortFiltersDialog;
