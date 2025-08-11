"use client";

import { useEffect, useRef, useState } from "react";
import PlusIconSvg from "public/icons/plus-red-circle.svg";
import MinusIconSvg from "public/icons/minus-white-circle.svg";

const PlusIcon = PlusIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const MinusIcon = MinusIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;

interface AccordionProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
  testId?: string;
}

export function Accordion({
  question,
  answer,
  defaultOpen = false,
  testId,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [maxHeight, setMaxHeight] = useState<number>(0);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    // set to scrollHeight when opening for smooth expand; 0 when closing
    setMaxHeight(open ? el.scrollHeight : 0);
  }, [open, answer]);

  const panelId = `accordion-panel-${btoa(question).slice(0, 8)}`;

  return (
    <div
      className={`rounded-xl border shadow-sm text-xl py-6 px-8 ${open ? "bg-gray-50" : ""}`}
    >
      {/* Question */}
      <div className="flex justify-between items-center">
        <h2 className="font-semibold pr-4">{question}</h2>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(!open)}
          className="relative h-8 w-8 grid place-items-center focus:outline-none rounded-full"
        >
          {/* Rotating wrapper */}
          <span
            className={`transition-transform duration-200 ease-out ${open ? "rotate-180" : "rotate-0"}`}
          >
            {/* Cross-fade icons */}
            <span className="relative block h-8 w-8">
              <PlusIcon
                className={`absolute inset-0 transition-opacity duration-150 ${open ? "opacity-0" : "opacity-100"}`}
                width={32}
                height={32}
              />
              <MinusIcon
                className={`absolute inset-0 transition-opacity duration-150 ${open ? "opacity-100" : "opacity-0"}`}
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
        className={`overflow-hidden transition-[max-height] duration-300 ease-out`}
        aria-hidden={!open}
      >
        <p className="text-gray-700 tracking-wide leading-relaxed w-11/12 opacity-100 transition-opacity duration-200 mt-4">
          {answer}
        </p>
      </div>
    </div>
  );
}
