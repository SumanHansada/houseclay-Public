"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export interface MobileHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: ReactNode;
  showBack?: boolean;
  className?: string;
}

export default function MobileHeader({
  title,
  onBack,
  rightAction,
  showBack = true,
  className = "",
}: MobileHeaderProps) {
  const router = useRouter();

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 h-14 border-b border-gray-200 bg-white shadow-sm md:hidden ${className}`}
      role="banner"
    >
      <div className="flex items-center h-full px-4">
        {/* Left: fixed width placeholder to keep center stable */}
        <div className="shrink-0 w-10 h-10 flex items-center justify-start">
          {showBack && (
            <button
              aria-label="Go back"
              className="flex items-center justify-center"
              onClick={onBack ?? (() => router.back())}
            >
              <ChevronLeft size={25} />
            </button>
          )}
        </div>

        {/* Center: grows and truly centers the title */}
        <div className="flex-1 px-2">
          <h1 className="text-lg text-center font-medium truncate">{title}</h1>
        </div>

        {/* Right: same fixed width as left */}
        <div className="shrink-0 w-10 h-10 flex items-center justify-end">
          {rightAction ?? null}
        </div>
      </div>
    </header>
  );
}
