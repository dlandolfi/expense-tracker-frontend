"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AuthContextType = {
  credentials: { username: string; password: string } | null;
  login: (username: string, password: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [credentials, setCredentials] = useState<{
    username: string;
    password: string;
  } | null>(null);

  function login(username: string, password: string) {
    setCredentials({ username, password });
  }

  function logout() {
    setCredentials(null);
  }

  return (
    <AuthContext.Provider value={{ credentials, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
