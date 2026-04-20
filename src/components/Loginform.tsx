"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isInvalid } = useAuth();

  function handleSubmit() {
    if (!username || !password) return;
    login(username, password);
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm space-y-4 p-6 rounded-xl border border-border bg-card">
        <h1 className="text-2xl font-bold text-center">💰 Expense Tracker</h1>
        <p className="text-sm text-muted-foreground text-center">
          Sign in to continue
        </p>
        {isInvalid && (
          <p className="text-sm text-[#fb4934] text-center">
            Invalid credentials. Please try again.
          </p>
        )}
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="h-12 text-base"
          autoCapitalize="none"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 text-base"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <Button onClick={handleSubmit} className="w-full h-12 text-base">
          Sign In
        </Button>
      </div>
    </div>
  );
}
