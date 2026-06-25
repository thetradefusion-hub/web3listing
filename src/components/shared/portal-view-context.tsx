"use client";

import { createContext, useContext } from "react";

const PortalBasePathContext = createContext("/partner");
const ShowCommissionContext = createContext(true);

export function PortalViewProvider({
  basePath,
  showCommission = true,
  children,
}: {
  basePath: string;
  showCommission?: boolean;
  children: React.ReactNode;
}) {
  return (
    <PortalBasePathContext.Provider value={basePath}>
      <ShowCommissionContext.Provider value={showCommission}>{children}</ShowCommissionContext.Provider>
    </PortalBasePathContext.Provider>
  );
}

export function usePortalBasePath() {
  return useContext(PortalBasePathContext);
}

export function useShowCommission() {
  return useContext(ShowCommissionContext);
}
