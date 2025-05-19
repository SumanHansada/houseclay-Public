"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import Toast, { ToastProps } from "../components/common/Toast";

interface ToastContextType {
  showToast: (props: Omit<ToastProps, "id">) => string;
  removeToast: (id: string) => void;
}

interface ToastWithId extends ToastProps {
  id: string;
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
  const [toasts, setToasts] = useState<ToastWithId[]>([]);

  const showToast = useCallback(
    ({ type, message, duration, onClose, onOpen }: Omit<ToastProps, "id">) => {
      const id = uuidv4();
      setToasts((prev) => [
        ...prev,
        { id, type, message, duration, onClose, onOpen },
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
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={() => {
              toast.onClose?.();
              removeToast(toast.id);
            }}
            onOpen={toast.onOpen}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
