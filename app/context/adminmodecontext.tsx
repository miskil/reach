import React, { createContext, useState, useContext, ReactNode } from "react";

interface AdminModeContextProps {
  adminMode: boolean;
  setAdminMode: (mode: boolean) => void;
}

const AdminModeContext = createContext<AdminModeContextProps | undefined>(
  undefined
);

export const AdminModeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [adminMode, setAdminMode] = useState<boolean>(false);

  return (
    <AdminModeContext.Provider value={{ adminMode, setAdminMode }}>
      {children}
    </AdminModeContext.Provider>
  );
};

export const useAdminMode = (): AdminModeContextProps => {
  const context = useContext(AdminModeContext);
  if (context === undefined) {
    throw new Error("useAdminMode must be used within an AdminModeProvider");
  }
  return context;
};
