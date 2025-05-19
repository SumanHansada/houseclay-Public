"use client";

import { AnimatePresence } from "framer-motion";
import React, { createContext, useCallback, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import Toast, { ToastProps } from "../components/common/Toast";

interface ToastContextType {
  showToast: (props: Omit<ToastProps, "id">) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = useCallback(
    ({
      type,
      message,
      duration,
      onClose,
      onOpen,
      props,
    }: Omit<ToastProps, "id">) => {
      const id = uuidv4();
      setToasts((prev) => [
        ...prev,
        { id, type, message, duration, onClose, onOpen, props },
      ]);
      return id;
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              {...toast}
              onClose={(props) => {
                toast.onClose?.(props);
                removeToast(toast.id);
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
