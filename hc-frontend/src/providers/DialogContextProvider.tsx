"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";

// Define the shape of the context
interface DialogContextType {
  isDialogOpen: (id: string) => boolean;
  openDialog: (id: string) => void;
  closeDialog: (id: string) => void;
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
  const [currentOpenDialogId, setCurrentOpenDialogId] = useState<string>("");

  const isDialogOpen = (id: string) => !!openDialogs[id];

  const openDialog = (id: string) => {
    setOpenDialogs((prev) => ({ ...prev, [id]: true }));
    setCurrentOpenDialogId(id);
  };

  const closeDialog = (id: string) => {
    setOpenDialogs((prev) => ({ ...prev, [id]: false }));
    if (currentOpenDialogId === id) {
      setCurrentOpenDialogId("");
    }
  };

  return (
    <DialogContext.Provider
      value={{ isDialogOpen, openDialog, closeDialog, currentOpenDialogId }}
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
