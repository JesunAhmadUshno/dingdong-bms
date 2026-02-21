"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PROPERTIES, OCCUPANTS } from "@/lib/database";

interface DashboardMetrics {
  totalProperties: number;
  totalTenants: number;
  activeMaintenanceRequests: number;
  occupancyRate: number;
  pendingApprovals: number;
  monthlyRevenue: number;
  alertCount: number;
  complianceScore: number;
}

interface RoleConfig {
  title: string;
  subtitle: string;
  color: string;
  icon: string;
  features: string[];
  displayMetrics: (keyof DashboardMetrics)[];
}

const ROLE_CONFIGS: Record<string, RoleConfig> = {
  BUILDING_MANAGER: {
    title: "Building Manager Dashboard",
    subtitle: "Manage daily building operations",
    color: "blue",
    icon: "🏢",
    features: [
      "Daily Operations",
      "Maintenance Coordination",
      "Security Management",
      "Emergency Response",
      "Tenant Communications",
    ],
    displayMetrics: [
      "totalProperties",
      "activeMaintenanceRequests",
      "occupancyRate",
      "alertCount",
      "pendingApprovals",
    ],
  },
  SOCIAL_HOUSING_MANAGER: {
    title: "Social Housing Manager Dashboard",
    subtitle: "Manage affordable housing programs",
    color: "green",
    icon: "🏘️",
    features: [
      "Subsidy Management",
      "Income Verification",
      "GTI Calculations",
      "Tenant Support Integration",
      "Social Impact Reporting",
      "Grant Management",
    ],
    displayMetrics: [
      "totalTenants",
      "complianceScore",
      "monthlyRevenue",
      "activeMaintenanceRequests",
      "pendingApprovals",
    ],
  },
  CORPORATE_OWNER: {
    title: "Corporate Property Manager Dashboard",
    subtitle: "Manage portfolio of properties",
    color: "purple",
    icon: "🏗️",
    features: [
      "Multi-Property Management",
      "Investment Tracking",
      "Staff Management",
      "Advanced Analytics",
      "Compliance Dashboard",
      "Bulk Tenant Management",
    ],
    displayMetrics: [
      "totalProperties",
      "totalTenants",
      "monthlyRevenue",
      "occupancyRate",
      "activeMaintenanceRequests",
      "complianceScore",
    ],
  },
  ADMIN: {
    title: "System Administrator Dashboard",
    subtitle: "Manage platform and all systems",
    color: "red",
    icon: "⚙️",
    features: [
      "User Management",
      "System Configuration",
      "Audit Logs",
      "Role Management",
      "API Management",
      "System Health",
    ],
    displayMetrics: [
      "totalProperties",
      "totalTenants",
      "activeMaintenanceRequests",
      "alertCount",
      "pendingApprovals",
      "complianceScore",
    ],
  },
};

const METRIC_LABELS: Record<string, string> = {
  totalProperties: "Properties",
  totalTenants: "Total Tenants",
  activeMaintenanceRequests: "Active Requests",
  occupancyRate: "Occupancy Rate",
  pendingApprovals: "Pending Approvals",
  monthlyRevenue: "Monthly Revenue",
  alertCount: "Active Alerts",
  complianceScore: "Compliance Score",
};

const METRIC_ICONS: Record<string, string> = {
  totalProperties: "🏢",
  totalTenants: "👥",
  activeMaintenanceRequests: "🔧",
  occupancyRate: "📊",
  pendingApprovals: "⏳",
  monthlyRevenue: "💰",
  alertCount: "⚠️",
  complianceScore: "✅",
};

const METRIC_COLORS: Record<string, string> = {
  totalProperties: "border-blue-500",
  totalTenants: "border-green-500",
  activeMaintenanceRequests: "border-orange-500",
  occupancyRate: "border-cyan-500",
  pendingApprovals: "border-red-500",
  monthlyRevenue: "border-emerald-500",
  alertCount: "border-yellow-500",
  complianceScore: "border-indigo-500",
};

export default function ManagerDashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalProperties: 0,
    totalTenants: 0,
    activeMaintenanceRequests: 0,
    occupancyRate: 0,
    pendingApprovals: 0,
    monthlyRevenue: 0,
    alertCount: 0,
    complianceScore: 0,
  });

  useEffect(() => {
    // Check authorization
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
      return;
    }

    // Calculate metrics based on user's properties
    const userProperties =
      user.properties && user.properties.length > 0
        ? PROPERTIES.filter((p) => user.properties!.includes(p.property_id))
        : PROPERTIES;

    const totalTenants = userProperties.reduce((sum, p) => sum + p.total_units, 0);
    const occupiedUnits = Math.round(totalTenants * 0.9); // Assuming 90% occupancy by default
    const activeRequests = 0; // TODO: Calculate from actual maintenance requests once available

    setMetrics({
      totalProperties: userProperties.length,
      totalTenants: totalTenants,
      activeMaintenanceRequests: activeRequests,
      occupancyRate: totalTenants > 0 ? Math.round((occupiedUnits / totalTenants) * 100) : 0,
      pendingApprovals: 3,
      monthlyRevenue: 145000,
      alertCount: 2,
      complianceScore: 92,
    });
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const roleConfig = ROLE_CONFIGS[user.role.role_name] || ROLE_CONFIGS.BUILDING_MANAGER;
  const colorClasses: Record<string, string> = {
    blue: "from-blue-500 to-blue-700",
    green: "from-green-500 to-green-700",
    purple: "from-purple-500 to-purple-700",
    red: "from-red-500 to-red-700",
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <nav className={`bg-gradient-to-r ${colorClasses[roleConfig.color]} text-white px-6 py-4 flex justify-between items-center shadow-lg`}>
        <div>
          <h1 className="text-2xl font-bold">{roleConfig.icon} {roleConfig.title}</h1>
          <p className="text-sm opacity-90">{roleConfig.subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-semibold">
            {user.full_name}
          </span>
          <Link
            href="/portal/profile"
            className="text-white hover:bg-white/20 px-3 py-1 rounded text-sm font-semibold"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="text-white hover:bg-white/20 px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r hidden md:block overflow-y-auto shadow-sm">
          <div className="p-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Role Features
            </p>
            <ul className="space-y-2">
              {roleConfig.features.map((feature, idx) => (
                <li
                  key={idx}
                  className={`p-2 rounded cursor-pointer transition ${
                    idx === 0
                      ? "font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {feature}
                </li>
              ))}
            </ul>

            {user.properties && user.properties.length > 0 && (
              <>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 mt-8">
                  Assigned Properties
                </p>
                <ul className="space-y-2 text-sm">
                  {PROPERTIES.filter((p) => user.properties!.includes(p.property_id)).map(
                    (prop) => (
                      <li
                        key={prop.property_id}
                        className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer text-gray-700 dark:text-gray-300"
                      >
                        {prop.address}
                      </li>
                    )
                  )}
                </ul>
              </>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {roleConfig.displayMetrics.map((metricKey) => {
              const value = metrics[metricKey];
              const label = METRIC_LABELS[metricKey];
              const icon = METRIC_ICONS[metricKey];
              const borderColor = METRIC_COLORS[metricKey];

              return (
                <div
                  key={metricKey}
                  className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 ${borderColor} hover:shadow-lg transition`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                      <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                        {typeof value === "number" && metricKey === "occupancyRate"
                          ? `${value}%`
                          : typeof value === "number" && metricKey === "monthlyRevenue"
                          ? `$${value.toLocaleString()}`
                          : value}
                      </p>
                    </div>
                    <span className="text-4xl opacity-20">{icon}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pending Approvals */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
                📋 Pending Approvals
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700 border-b">
                    <tr>
                      <th className="p-3 font-semibold">Request</th>
                      <th className="p-3 font-semibold">From</th>
                      <th className="p-3 font-semibold">Status</th>
                      <th className="p-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-700">
                    {[
                      {
                        request: "Guest Pass Override",
                        from: "John Wick (Unit 1A)",
                        status: "Urgent",
                      },
                      {
                        request: "New Lease: Unit 402",
                        from: "Alice Chen",
                        status: "Pending",
                      },
                      {
                        request: "Maintenance Approval",
                        from: "Elevator Service",
                        status: "Pending",
                      },
                    ].map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        <td className="p-3">{item.request}</td>
                        <td className="p-3 text-gray-600 dark:text-gray-300">{item.from}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              item.status === "Urgent"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <button className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
                ⚡ Quick Actions
              </h3>
              <div className="space-y-3">
                {[
                  { icon: "📝", label: "Create Work Order", href: "#" },
                  { icon: "👤", label: "Manage Tenants", href: "#" },
                  { icon: "🔐", label: "Security Controls", href: "#" },
                  { icon: "📊", label: "View Reports", href: "#" },
                  { icon: "💬", label: "Send Message", href: "#" },
                  { icon: "⚙️", label: "Settings", href: "/portal/profile" },
                ].map((action, idx) => (
                  <Link key={idx} href={action.href}>
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition border border-gray-200 dark:border-gray-600">
                      <p className="font-semibold text-gray-700 dark:text-gray-200">
                        {action.icon} {action.label}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              📅 Recent Activity
            </h3>
            <div className="space-y-3">
              {[
                { time: "2 hours ago", event: "Maintenance request submitted for HVAC", type: "info" },
                { time: "5 hours ago", event: "New tenant onboarding completed", type: "success" },
                { time: "1 day ago", event: "Security audit completed", type: "success" },
                {
                  time: "2 days ago",
                  event: "Compliance score updated to 92%",
                  type: "info",
                },
              ].map((activity, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 items-start p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      activity.type === "success"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30"
                    }`}
                  >
                    {activity.type.toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-200">{activity.event}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
