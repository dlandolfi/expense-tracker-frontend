"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";

type AuthContextType = {
  credentials: { username: string; password: string } | null;
  isInvalid: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function getStoredCredentials() {
  try {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [credentials, setCredentials] = useState<{
    username: string;
    password: string;
  } | null>(getStoredCredentials);
  const [isInvalid, setIsInvalid] = useState(false);

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("auth");
        setCredentials(null);
        setIsInvalid(true);
      }
      return Promise.reject(error);
    },
  );

  function login(username: string, password: string) {
    const creds = { username, password };
    localStorage.setItem("auth", JSON.stringify(creds));
    setIsInvalid(false);
    setCredentials(creds);
  }

  function logout() {
    localStorage.removeItem("auth");
    setCredentials(null);
  }

  return (
    <AuthContext.Provider value={{ credentials, isInvalid, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
