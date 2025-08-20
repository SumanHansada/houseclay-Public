"use client";

import { useEffect, useId, useRef, useState } from "react";
import PlusIconSvg from "public/icons/plus-red-circle.svg";
import MinusIconSvg from "public/icons/minus-white-circle.svg";

const PlusIcon = PlusIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const MinusIcon = MinusIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;

interface AccordionProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  testId?: string;
}

export function Accordion({
  question,
  answer,
  defaultOpen = false,
  isOpen,
  onToggle,
  testId,
}: AccordionProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = typeof isOpen === "boolean" ? isOpen : internalOpen;
  const toggle = () =>
    typeof isOpen === "boolean" ? onToggle?.() : setInternalOpen((v) => !v);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const [maxHeight, setMaxHeight] = useState<number>(0);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    setMaxHeight(open ? el.scrollHeight : 0);
  }, [open, answer]);

  const panelId = useId();

  return (
    <div
      className={`rounded-xl border shadow-sm md:text-xl py-3 md:py-6 px-4 md:px-8 cursor-pointer ${open ? "bg-gray-50" : ""}`}
      onClick={toggle}
    >
      {/* Question */}
      <div className="flex justify-between items-center">
        <h2 className="font-semibold pr-4">{question}</h2>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          // onClick={toggle}
          className="relative h-8 w-8 grid place-items-center focus:outline-none rounded-full"
          data-testid={testId ? `${testId}-toggle` : undefined}
        >
          <span
            className={`transition-transform duration-200 ease-out ${open ? "rotate-180" : "rotate-0"}`}
          >
            <span className="relative block h-8 w-8">
              <PlusIcon
                className={`absolute inset-0 transition-opacity duration-150 ${open ? "opacity-0" : "opacity-100"} text-red-500`}
                width={32}
                height={32}
              />
              <MinusIcon
                className={`absolute inset-0 transition-opacity duration-150 ${open ? "opacity-100" : "opacity-0"} text-red-500`}
                width={32}
                height={32}
              />
            </span>
          </span>
        </button>
      </div>

      {/* Answer */}
      <div
        id={panelId}
        ref={contentRef}
        style={{ maxHeight }}
        className="overflow-hidden transition-[max-height] duration-300 ease-out"
        aria-hidden={!open}
      >
        <p className="text-gray-700 tracking-wide leading-relaxed w-11/12 transition-opacity duration-200 mt-2 md:mt-4">
          {answer}
        </p>
      </div>
    </div>
  );
}
