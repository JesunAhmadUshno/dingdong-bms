"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { User, Role } from "@/lib/database";
import { getRoleById } from "@/lib/database";

interface AuthContextType {
  user: (User & { role: Role }) | null;
  loading: boolean;
  authError: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  sessionId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_ID_KEY = "dingdong_session_id";
const SESSION_TOKEN_KEY = "dingdong_session_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<(User & { role: Role }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedSessionId = localStorage.getItem(SESSION_ID_KEY);
        const storedToken = localStorage.getItem(SESSION_TOKEN_KEY);
        
        if (storedSessionId && storedToken) {
          console.log("🔍 Checking stored session...");
          const response = await fetch("/api/auth/session", {
            method: "GET",
            headers: {
              "x-session-id": storedSessionId,
              "x-session-token": storedToken,
            },
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.session) {
              console.log("✅ Session restored from storage");
              const role = getRoleById(result.session.role_id);
              if (role) {
                setUser({ ...result.session, role } as any);
                setSessionId(storedSessionId);
              }
            } else {
              console.log("❌ Session expired");
              localStorage.removeItem(SESSION_ID_KEY);
              localStorage.removeItem(SESSION_TOKEN_KEY);
            }
          } else {
            console.log("❌ Session validation failed");
            localStorage.removeItem(SESSION_ID_KEY);
            localStorage.removeItem(SESSION_TOKEN_KEY);
          }
        }
      } catch (error) {
        console.error("Session restore error:", error);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const result = await response.json();
        setAuthError(result.error || "Login failed");
        return false;
      }

      const result = await response.json();
      console.log("🔐 Login successful:", result);

      if (result.success && result.sessionId && result.token) {
        // Store session ID and token in localStorage (persists across page refreshes)
        localStorage.setItem(SESSION_ID_KEY, result.sessionId);
        localStorage.setItem(SESSION_TOKEN_KEY, result.token);
        setSessionId(result.sessionId);

        // Fetch role and set user
        const role = getRoleById(result.user.role_id);
        if (role) {
          setUser({ ...result.user, role } as any);
          console.log("✅ User logged in and session stored");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("❌ Login error:", error);
      setAuthError("Login error: " + String(error));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem(SESSION_TOKEN_KEY);
      if (sessionId && storedToken) {
        // Delete session from server
        await fetch("/api/auth/session", {
          method: "DELETE",
          headers: {
            "x-session-id": sessionId,
            "x-session-token": storedToken,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state and storage
      setUser(null);
      setSessionId(null);
      setAuthError(null);
      localStorage.removeItem(SESSION_ID_KEY);
      localStorage.removeItem(SESSION_TOKEN_KEY);
    }
  }, [sessionId]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        login,
        logout,
        isAuthenticated: !!user,
        sessionId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
