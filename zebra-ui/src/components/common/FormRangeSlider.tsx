import React, { useRef } from "react";

interface FormRangeSliderProps {
  label: string;
  name: string;
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  minLabel?: string;
  maxLabel?: string;
  required?: boolean;
  className?: string;
}

// INR formatting utility
const formatINR = (value: number | string): string => {
  if (value === null || value === undefined || value === "") return "";
  const numericValue = String(value).replace(/[^0-9]/g, "");
  if (!numericValue) return "";
  const number = parseInt(numericValue, 10);
  return number.toLocaleString("en-IN");
};

const parseINR = (formattedValue: string): number => {
  const numericValue = formattedValue.replace(/[^0-9]/g, "");
  return numericValue ? parseInt(numericValue, 10) : 0;
};

const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));

const FormRangeSlider: React.FC<FormRangeSliderProps> = ({
  label,
  name,
  min,
  max,
  step = 1,
  value,
  onChange,
  minLabel = "0",
  maxLabel = "20Cr",
  required = false,
  className = "",
}) => {
  console.log("name", name);
  const minInputRef = useRef<HTMLInputElement>(null);
  const maxInputRef = useRef<HTMLInputElement>(null);

  // Calculate percent for slider fill
  const percent = (val: number) => ((val - min) / (max - min)) * 100;

  // Handlers for input fields
  const handleMinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseINR(e.target.value);
    val = clamp(val, min, value[1]);
    onChange([val, value[1]]);
  };
  const handleMaxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseINR(e.target.value);
    val = clamp(val, value[0], max);
    onChange([value[0], val]);
  };

  // Handlers for slider thumbs
  const handleMinSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMin = parseInt(e.target.value);
    newMin = clamp(newMin, min, value[1] - step);
    onChange([newMin, value[1]]);
  };
  const handleMaxSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMax = parseInt(e.target.value);
    newMax = clamp(newMax, value[0] + step, max);
    onChange([value[0], newMax]);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Label with icon */}
      <label className="flex items-center gap-2 text-lg font-medium text-gray-800 mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center justify-between mb-2">
        {/* Min input */}
        <input
          type="text"
          className="w-40 p-3 border border-gray-300 rounded-xl text-lg text-center"
          value={formatINR(value[0])}
          onChange={handleMinInput}
          onBlur={handleMinInput}
          ref={minInputRef}
        />
        {/* Max input */}
        <input
          type="text"
          className="w-40 p-3 border border-gray-300 rounded-xl text-lg text-center"
          value={formatINR(value[1])}
          onChange={handleMaxInput}
          onBlur={handleMaxInput}
          ref={maxInputRef}
        />
      </div>
      {/* Slider */}
      <div className="relative w-full h-10 flex items-center">
        {/* Track */}
        <div className="absolute left-0 right-0 h-2 bg-gray-200 rounded-full" />
        {/* Range fill */}
        <div
          className="absolute h-2 bg-red-500 rounded-full"
          style={{
            left: `${percent(value[0])}%`,
            width: `${percent(value[1]) - percent(value[0])}%`,
          }}
        />
        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={handleMinSlider}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto slider-thumb"
          style={{ zIndex: value[0] < value[1] ? 2 : 3 }}
        />
        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={handleMaxSlider}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto slider-thumb"
          style={{ zIndex: value[1] > value[0] ? 2 : 3 }}
        />
        {/* Value label above thumbs */}
        <div
          className="absolute flex justify-between w-full top-[-2.5rem] pointer-events-none"
          style={{ left: 0, right: 0 }}
        >
          <span
            className="absolute"
            style={{ left: `calc(${percent(value[0])}% - 30px)` }}
          >
            <div className="bg-white px-3 py-1 rounded-xl shadow text-base font-semibold text-gray-800 border border-gray-200">
              {formatINR(value[0])}
            </div>
          </span>
          <span
            className="absolute"
            style={{ left: `calc(${percent(value[1])}% - 30px)` }}
          >
            <div className="bg-white px-3 py-1 rounded-xl shadow text-base font-semibold text-gray-800 border border-gray-200">
              {formatINR(value[1])}
            </div>
          </span>
        </div>
      </div>
      {/* Min/Max labels below slider */}
      <div className="flex justify-between text-gray-500 text-sm mt-2">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
};

export default FormRangeSlider;
