"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";

// Define the shape of the context
interface DialogContextType {
  isDialogOpen: (id: string) => boolean;
  isDialogClosing: (id: string) => boolean;
  openDialog: (id: string) => void;
  closeDialog: (id: string) => void;
  closeAllDialogs: () => void;
  currentOpenDialogId: string;
}

// Create contexts for Dialog state
const DialogContext = createContext<DialogContextType | undefined>(undefined);

interface DialogContextProviderProps {
  children: ReactNode;
}

// Dialog Root Component
export const DialogContextProvider: React.FC<DialogContextProviderProps> = ({
  children,
}) => {
  const [openDialogs, setOpenDialogs] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [closingDialogs, setClosingDialogs] = useState<{
    [key: string]: boolean;
  }>({});
  const [currentOpenDialogId, setCurrentOpenDialogId] = useState<string>("");

  const isDialogOpen = (id: string) => !!openDialogs[id];
  const isDialogClosing = (id: string) => !!closingDialogs[id];

  const openDialog = (id: string) => {
    setOpenDialogs((prev) => ({ ...prev, [id]: true }));
    setClosingDialogs((prev) => ({ ...prev, [id]: false }));
    setCurrentOpenDialogId(id);
  };

  const closeDialog = (id: string) => {
    setClosingDialogs((prev) => ({ ...prev, [id]: true }));
    // Delay the actual closing to allow animation
    setTimeout(() => {
      setOpenDialogs((prev) => ({ ...prev, [id]: false }));
      setClosingDialogs((prev) => ({ ...prev, [id]: false }));
      if (currentOpenDialogId === id) {
        setCurrentOpenDialogId("");
      }
    }, 300); // Match animation duration
  };

  const closeAllDialogs = () => {
    setOpenDialogs({});
    setClosingDialogs({});
    setCurrentOpenDialogId("");
  };

  return (
    <DialogContext.Provider
      value={{
        isDialogOpen,
        isDialogClosing,
        openDialog,
        closeDialog,
        closeAllDialogs,
        currentOpenDialogId,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};

// Hook to use Dialog context
export const useDialog = (): DialogContextType => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogContextProvider");
  }
  return context;
};
