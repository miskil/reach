"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { use } from "react";
import { User } from "@/lib/db/schema";

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  adminMode: boolean;
  setAdminMode: (mode: boolean) => void;
  modifyMode: boolean;
  setModifyMode: (mode: boolean) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function useUser(): UserContextType {
  let context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function UserProvider({
  children,
  userPromise,
}: {
  children: ReactNode;
  userPromise: Promise<User | null>;
}) {
  let initialUser = use(userPromise);
  let [user, setUser] = useState<User | null>(initialUser);
  const [adminMode, setAdminMode] = useState<boolean>(false);
  const [modifyMode, setModifyMode] = useState<boolean>(false);
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);
  // Ensure modifyMode can only be true if adminMode is true
  const handleSetModifyMode = (mode: boolean) => {
    if (adminMode) {
      setModifyMode(mode);
    } else {
      setModifyMode(false); // Reset if adminMode is false
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        adminMode,
        setAdminMode,
        modifyMode,
        setModifyMode: handleSetModifyMode,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
