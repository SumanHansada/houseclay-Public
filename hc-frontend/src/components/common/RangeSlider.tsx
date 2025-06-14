import React, { useCallback, useEffect, useRef, useState } from "react";

interface RangeMark {
  value: number;
  label: string;
}

interface RangeSliderProps {
  label?: string;
  min: number;
  max: number;
  step?: number;
  marks?: RangeMark[];
  required?: boolean;
  showInputs?: boolean;
  inputClassName?: string;
  // Styling props
  containerClassName?: string;
  labelClassName?: string;
  sliderClassName?: string;
  trackClassName?: string;
  rangeClassName?: string;
  thumbClassName?: string;
  markClassName?: string;
  markLabelClassName?: string;
  valueLabelClassName?: string;
  errorClassName?: string;
  // Formik compatible props
  value: [number, number];
  onChange: (value: [number, number]) => void;
  onBlur?: () => void;
  error?: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  min,
  max,
  step = 1,
  marks = [],
  required = false,
  showInputs = true,
  inputClassName = "w-24 p-2 border border-gray-300 rounded-xl text-center",
  // Styling props with defaults
  containerClassName = "mb-4",
  labelClassName = "block text-gray-700 text-sm font-medium mb-2",
  sliderClassName = "relative w-full h-6",
  trackClassName = "absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full transform -translate-y-1/2",
  rangeClassName = "absolute h-2 bg-blue-500 rounded-full top-1/2 transform -translate-y-1/2",
  thumbClassName = "absolute w-6 h-6 bg-white border-2 border-blue-500 rounded-full shadow-md cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
  markClassName = "absolute w-0.5 h-2 bg-gray-400 transform -translate-x-1/2",
  markLabelClassName = "absolute text-xs text-gray-600 transform -translate-x-1/2 mt-1",
  valueLabelClassName = "absolute text-xs bg-gray-800 text-white px-2 py-1 rounded transform -translate-x-1/2 -translate-y-full mb-2 opacity-0 transition-opacity",
  errorClassName = "text-red-500 text-sm mt-1",
  // Formik props
  value,
  onChange,
  onBlur,
  error,
}) => {
  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);
  const [showLabels, setShowLabels] = useState<{ min: boolean; max: boolean }>({
    min: false,
    max: false,
  });
  const sliderRef = useRef<HTMLDivElement>(null);

  const [minValue, maxValue] = value;

  // Calculate percentage position
  const getPercentage = useCallback(
    (val: number) => {
      return ((val - min) / (max - min)) * 100;
    },
    [min, max],
  );

  // Calculate value from mouse position
  const getValue = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return min;

      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = (clientX - rect.left) / rect.width;
      const rawValue = min + percentage * (max - min);

      // Snap to step
      const steppedValue = Math.round(rawValue / step) * step;
      return Math.max(min, Math.min(max, steppedValue));
    },
    [min, max, step],
  );

  // Handle mouse down on thumbs
  const handleMouseDown = useCallback(
    (thumb: "min" | "max") => (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(thumb);
      setShowLabels((prev) => ({ ...prev, [thumb]: true }));
    },
    [],
  );

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newValue = getValue(e.clientX);

      if (isDragging === "min") {
        const newMinValue = Math.min(newValue, maxValue - step);
        onChange([newMinValue, maxValue]);
      } else {
        const newMaxValue = Math.max(newValue, minValue + step);
        onChange([minValue, newMaxValue]);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setShowLabels({ min: false, max: false });
        setIsDragging(null);
        onBlur?.();
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, getValue, minValue, maxValue, step, onChange, onBlur]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (thumb: "min" | "max") => (e: React.KeyboardEvent) => {
      let newValue: number;
      const currentValue = thumb === "min" ? minValue : maxValue;

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          newValue = Math.max(min, currentValue - step);
          break;
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          newValue = Math.min(max, currentValue + step);
          break;
        case "Home":
          e.preventDefault();
          newValue = min;
          break;
        case "End":
          e.preventDefault();
          newValue = max;
          break;
        default:
          return;
      }

      if (thumb === "min") {
        const adjustedValue = Math.min(newValue, maxValue - step);
        onChange([adjustedValue, maxValue]);
      } else {
        const adjustedValue = Math.max(newValue, minValue + step);
        onChange([minValue, adjustedValue]);
      }
    },
    [minValue, maxValue, min, max, step, onChange],
  );

  // Handlers for input boxes
  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMin = Number(e.target.value);
    if (isNaN(newMin)) newMin = min;
    newMin = Math.max(min, Math.min(newMin, maxValue - step));
    onChange([newMin, maxValue]);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMax = Number(e.target.value);
    if (isNaN(newMax)) newMax = max;
    newMax = Math.min(max, Math.max(newMax, minValue + step));
    onChange([minValue, newMax]);
  };

  const minPercentage = getPercentage(minValue);
  const maxPercentage = getPercentage(maxValue);

  return (
    <div className={containerClassName}>
      {label && (
        <label className={labelClassName}>
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex items-center w-full">
        {/* Min Input */}
        {showInputs && (
          <input
            type="number"
            min={min}
            max={maxValue - step}
            step={step}
            value={minValue}
            onChange={handleMinInputChange}
            className={`${inputClassName} mr-4`}
            aria-label="Minimum value input"
          />
        )}
        <div className={sliderClassName} ref={sliderRef} style={{ flex: 1 }}>
          {/* Track */}
          <div className={trackClassName} />
          {/* Range */}
          <div
            className={rangeClassName}
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`,
            }}
          />
          {/* Marks */}
          {marks.map((mark) => {
            const markPercentage = getPercentage(mark.value);
            return (
              <div key={mark.value}>
                <div
                  className={markClassName}
                  style={{ left: `${markPercentage}%`, top: "75%" }}
                />
                <div
                  className={markLabelClassName}
                  style={{ left: `${markPercentage}%`, top: "100%" }}
                >
                  {mark.label}
                </div>
              </div>
            );
          })}
          {/* Min Thumb */}
          <div
            className={thumbClassName}
            style={{ left: `${minPercentage}%`, top: "50%" }}
            onMouseDown={handleMouseDown("min")}
            onKeyDown={handleKeyDown("min")}
            tabIndex={0}
            role="slider"
            aria-label={`Minimum value: ${minValue}`}
            aria-valuemin={min}
            aria-valuemax={maxValue - step}
            aria-valuenow={minValue}
          >
            {/* Min Value Label */}
            <div className="border-2 border-white-500 rounded-full w-2 h-2 bg-red-500">
              <div
                className={`${valueLabelClassName} ${showLabels.min ? "opacity-100" : ""}`}
              >
                {minValue}
              </div>
            </div>
          </div>
          {/* Max Thumb */}
          <div
            className={thumbClassName}
            style={{ left: `${maxPercentage}%`, top: "50%" }}
            onMouseDown={handleMouseDown("max")}
            onKeyDown={handleKeyDown("max")}
            tabIndex={0}
            role="slider"
            aria-label={`Maximum value: ${maxValue}`}
            aria-valuemin={minValue + step}
            aria-valuemax={max}
            aria-valuenow={maxValue}
          >
            {/* Max Value Label */}
            <div className="rounded-full w-2 h-2 bg-red-500">
              <div
                className={`${valueLabelClassName} ${showLabels.max ? "opacity-100" : ""}`}
              >
                {maxValue}
              </div>
            </div>
          </div>
        </div>
        {/* Max Input */}
        {showInputs && (
          <input
            type="number"
            min={minValue + step}
            max={max}
            step={step}
            value={maxValue}
            onChange={handleMaxInputChange}
            className={`${inputClassName} ml-4`}
            aria-label="Maximum value input"
          />
        )}
      </div>
      {error && <div className={errorClassName}>{error}</div>}
    </div>
  );
};

export default RangeSlider;
