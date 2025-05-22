"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface DeviceContextProps {
  isTablet: boolean;
  isMobile: boolean;
  isDesktop: boolean;
}

const DeviceContext = createContext<DeviceContextProps | undefined>(undefined);

const DeviceContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const updateDeviceType = () => {
    const width = window.innerWidth;
    setIsMobile(width < 768);
    setIsTablet(width >= 768 && width <= 1024);
    setIsDesktop(width > 1024);
  };

  useEffect(() => {
    updateDeviceType();
    window.addEventListener("resize", updateDeviceType);
    return () => window.removeEventListener("resize", updateDeviceType);
  }, []);

  return (
    <DeviceContext.Provider value={{ isTablet, isMobile, isDesktop }}>
      {children}
    </DeviceContext.Provider>
  );
};

const useDeviceContext = (): DeviceContextProps => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error(
      "useDeviceContext must be used within a DeviceContextProvider",
    );
  }
  return context;
};

export { DeviceContextProvider, useDeviceContext };
