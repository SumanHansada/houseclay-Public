"use client";

import "react-international-phone/style.css";

import { lazy, Suspense } from "react";

// Lazy load the PhoneInput component
const LazyPhoneInputComponent = lazy(async () => {
  const phoneInputModule = await import("react-international-phone");
  return { default: phoneInputModule.PhoneInput };
});

// Fallback component while loading
const PhoneInputFallback = ({ className }: { className?: string }) => (
  <div
    className={`animate-pulse bg-gray-100 border border-gray-300 rounded-lg h-12 ${className || ""}`}
  >
    <div className="flex items-center px-3 h-full">
      <div className="w-8 h-4 bg-gray-300 rounded mr-2"></div>
      <div className="w-32 h-4 bg-gray-300 rounded"></div>
    </div>
  </div>
);

interface LazyPhoneInputProps {
  defaultCountry?: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  disabled?: boolean;
  name?: string;
  disableFormatting?: boolean;
}

export const LazyPhoneInput: React.FC<LazyPhoneInputProps> = (props) => {
  return (
    <Suspense fallback={<PhoneInputFallback className={props.className} />}>
      <LazyPhoneInputComponent {...props} />
    </Suspense>
  );
};

export default LazyPhoneInput;
