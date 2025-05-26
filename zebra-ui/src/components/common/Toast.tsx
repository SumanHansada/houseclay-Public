"use client";

import { motion } from "framer-motion";
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  type: ToastType;
  message: string | React.ReactNode;
  duration?: number;
  onClose?: () => void;
  onOpen?: () => void;
}

const Toast: React.FC<ToastProps> = ({
  type,
  message,
  duration = 5000,
  onClose,
  onOpen,
}) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef(Date.now());

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-yellow-50 border-yellow-200",
    info: "bg-blue-50 border-blue-200",
  };

  const progressColors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  useEffect(() => {
    onOpen?.();
    return () => onClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isPaused) {
      progressInterval.current = setInterval(() => {
        const elapsed = Date.now() - startTime.current;
        const newProgress = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(newProgress);

        if (newProgress <= 0) {
          clearInterval(progressInterval.current!);
          onClose?.();
        }
      }, 10);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPaused, duration, onClose]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    startTime.current = Date.now() - (duration * (100 - progress)) / 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`relative min-w-[300px] max-w-md p-4 rounded-lg border ${bgColors[type]} shadow-lg`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="flex-1">
          {typeof message === "string" ? (
            <p className="text-gray-700">{message}</p>
          ) : (
            message
          )}
        </div>
        <button
          onClick={() => onClose?.()}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
        <motion.div
          className={`h-full ${progressColors[type]}`}
          initial={{ width: "100%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
};

export default Toast;
