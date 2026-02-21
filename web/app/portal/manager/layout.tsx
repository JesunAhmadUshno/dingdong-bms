"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const MANAGER_SECTIONS = {
  BUILDING_MANAGER: [
    { href: "/portal/manager", label: "Dashboard", icon: "📊" },
    { href: "/portal/manager/maintenance", label: "Maintenance", icon: "🔧" },
    { href: "/portal/manager/tenants", label: "Tenants", icon: "👥" },
    { href: "/portal/manager/security", label: "Security", icon: "🔐" },
    { href: "/portal/manager/communications", label: "Communications", icon: "💬" },
  ],
  SOCIAL_HOUSING_MANAGER: [
    { href: "/portal/manager", label: "Dashboard", icon: "📊" },
    { href: "/portal/manager/tenants", label: "Tenants", icon: "👥" },
    { href: "/portal/manager/subsidies", label: "Subsidies", icon: "💳" },
    { href: "/portal/manager/grants", label: "Grants", icon: "📋" },
    { href: "/portal/manager/reporting", label: "Reports", icon: "📈" },
  ],
  CORPORATE_OWNER: [
    { href: "/portal/manager", label: "Dashboard", icon: "📊" },
    { href: "/portal/manager/portfolio", label: "Portfolio", icon: "🏢" },
    { href: "/portal/manager/analytics", label: "Analytics", icon: "📈" },
    { href: "/portal/manager/staff", label: "Staff", icon: "👨‍💼" },
    { href: "/portal/manager/compliance", label: "Compliance", icon: "✅" },
  ],
  ADMIN: [
    { href: "/portal/manager", label: "Dashboard", icon: "⚙️" },
    { href: "/portal/manager/users", label: "Users", icon: "👤" },
    { href: "/portal/manager/audit", label: "Audit Logs", icon: "📝" },
    { href: "/portal/manager/system", label: "System", icon: "⚙️" },
    { href: "/portal/manager/api", label: "API", icon: "🔌" },
  ],
};

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/");
      return;
    }

    const managerRoles = ["BUILDING_MANAGER", "SOCIAL_HOUSING_MANAGER", "CORPORATE_OWNER", "ADMIN"];
    if (!managerRoles.includes(user.role.role_name)) {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const sections = MANAGER_SECTIONS[user.role.role_name as keyof typeof MANAGER_SECTIONS] || 
                   MANAGER_SECTIONS.BUILDING_MANAGER;

  return (
    <div className="flex h-full">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-200 dark:bg-gray-700 rounded"
      >
        ☰
      </button>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:relative w-48 bg-gray-900 text-white h-screen transition-transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold">Manager Portal</h2>
          <p className="text-xs text-gray-400 mt-1">{user.role.role_name}</p>
        </div>

        <nav className="mt-6">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 transition ${
                pathname === section.href
                  ? "bg-blue-600 border-l-4 border-blue-400"
                  : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              <span className="text-xl">{section.icon}</span>
              <span className="font-medium">{section.label}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <Link href="/portal/profile" className="block text-sm text-gray-400 hover:text-white">
            Settings
          </Link>
          <button
            onClick={() => {
              router.push("/");
            }}
            className="block w-full mt-2 text-sm text-gray-400 hover:text-white text-left"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
