"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getFromLocalStorage } from "@/app/utils/utility";

type AuthContextType = {
  isLoggedIn: boolean;
  isAuthChecked: boolean;
  refreshAuth: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isAuthChecked: false,
  refreshAuth: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const refreshAuth = () => {
    const token = getFromLocalStorage("lendora_ac_tk");
    setIsLoggedIn(!!token);
    setIsAuthChecked(true);
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAuthChecked, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
