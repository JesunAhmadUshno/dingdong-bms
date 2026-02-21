"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DynamicManagerDashboard from "./dashboard";

export default function ManagerPortal() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Protect manager routes
    if (!isAuthenticated || !user) {
      router.push("/");
      return;
    }

    const managerRoles = [
      "BUILDING_MANAGER",
      "SOCIAL_HOUSING_MANAGER",
      "CORPORATE_OWNER",
      "ADMIN",
    ];

    if (!managerRoles.includes(user.role.role_name)) {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return <div className="p-8 text-center">Authenticating...</div>;
  }

  return <DynamicManagerDashboard />;
}
