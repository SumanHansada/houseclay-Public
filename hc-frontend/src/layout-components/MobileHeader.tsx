"use client";

import type { ReactNode } from "react";

export interface MobileHeaderProps {
  children: ReactNode;
  className?: string;
}

export interface MobileHeaderSubComponentProps {
  children: ReactNode;
}

function MobileHeader({ children, className = "" }: MobileHeaderProps) {
  return (
    <header
      className={`fixed flex w-full items-center top-0 inset-x-0 z-50 h-14 px-4 border-b border-gray-200 bg-white shadow-sm md:hidden ${className}`}
    >
      <div className="relative h-full w-full flex items-center">{children}</div>
    </header>
  );
}

function LeftAction({ children }: MobileHeaderSubComponentProps) {
  return (
    <div className="absolute left-0 flex items-center justify-start">
      {children}
    </div>
  );
}

function Title({ children }: MobileHeaderSubComponentProps) {
  return (
    <div className="absolute flex-1 inset-x-12">
      <h1 className="text-lg text-center truncate">{children}</h1>
    </div>
  );
}

function RightAction({ children }: MobileHeaderSubComponentProps) {
  return (
    <div className="absolute right-0 flex items-center justify-end">
      {children}
    </div>
  );
}

MobileHeader.LeftAction = LeftAction;
MobileHeader.Title = Title;
MobileHeader.RightAction = RightAction;

export default MobileHeader;
