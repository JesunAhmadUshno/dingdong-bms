/**
 * Root provider component combining all context providers
 */

"use client";

import React from "react";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider, ToastContainer } from "@/lib/toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default RootProvider;
