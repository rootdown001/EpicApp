"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface MetadataContextType {
  metadata: any;
  setMetadata: (metadata: any) => void;
}

const MetadataContext = createContext<MetadataContextType | undefined>(
  undefined
);

export const MetadataProvider = ({ children }: { children: ReactNode }) => {
  const [metadata, setMetadata] = useState<any>(null);

  return (
    <MetadataContext.Provider value={{ metadata, setMetadata }}>
      {children}
    </MetadataContext.Provider>
  );
};

export const useMetadata = () => {
  const context = useContext(MetadataContext);
  if (!context) {
    throw new Error("useMetadata must be used within a MetadataProvider");
  }
  return context;
};
