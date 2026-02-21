"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PROPERTIES, OCCUPANTS } from "@/lib/database";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Badge,
  Progress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableDataCell,
  Alert,
  Breadcrumbs,
  Avatar,
  LoadingSpinner,
  Divider,
  Dropdown,
} from "@/lib/components";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col">
      {/* Header with role-specific styling */}
      <header
        className={`bg-gradient-to-r ${colorClasses[roleConfig.color]} text-white px-6 py-4 shadow-lg border-b-4 border-opacity-20`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-2xl">
              {roleConfig.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{roleConfig.title}</h1>
              <p className="text-sm text-white text-opacity-90">{roleConfig.subtitle}</p>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 bg-white bg-opacity-10 px-4 py-2 rounded-lg">
              <Avatar initials={user.full_name.substring(0, 2).toUpperCase()} size="sm" />
              <div className="text-sm">
                <p className="font-semibold">{user.full_name}</p>
                <p className="text-xs text-white text-opacity-80">{user.role.role_name.replace(/_/g, " ")}</p>
              </div>
            </div>

            <Dropdown
              trigger={
                <button className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v .01M12 6a1 1 0 110-2 1 1 0 010 2m0 7a1 1 0 110-2 1 1 0 010 2m0 7a1 1 0 110-2 1 1 0 010 2" />
                  </svg>
                </button>
              }
              items={[
                { label: "Profile", onClick: () => router.push("/portal/profile") },
                { label: "Settings", onClick: () => router.push("/portal/profile") },
                { divider: true },
                { label: "Sign Out", onClick: handleLogout, variant: "danger" },
              ]}
              align="right"
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/portal/manager" },
              { label: roleConfig.title.split(" ")[0] },
            ]}
          />

          {/* Quick Alert for Active Alerts */}
          {metrics.alertCount > 0 && (
            <Alert variant="warning" title="Active Alerts" onClose={() => {}}>
              You have {metrics.alertCount} active alert{metrics.alertCount > 1 ? "s" : ""} requiring attention.
              <div className="mt-2 flex gap-2">
                <Button variant="outline" size="sm">Review Alerts</Button>
              </div>
            </Alert>
          )}

          {/* Key Metrics Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Key Metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {roleConfig.displayMetrics.map((metricKey) => {
                const value = metrics[metricKey];
                const label = METRIC_LABELS[metricKey];
                const icon = METRIC_ICONS[metricKey];

                const progressValue = metricKey === "occupancyRate" || metricKey === "complianceScore" ? value : null;

                return (
                  <Card key={metricKey} variant="elevated">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          {label}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                          {typeof value === "number" && metricKey === "monthlyRevenue"
                            ? `$${value.toLocaleString()}`
                            : metricKey === "occupancyRate" || metricKey === "complianceScore"
                            ? `${value}%`
                            : value}
                        </p>
                      </div>
                      <span className="text-4xl opacity-30">{icon}</span>
                    </div>

                    {progressValue !== null && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Progress value={progressValue} max={100} variant="primary" />
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pending Approvals */}
            <div className="lg:col-span-2">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>📋 Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table variant="striped">
                      <TableHead>
                        <TableRow>
                          <TableHeaderCell>Request</TableHeaderCell>
                          <TableHeaderCell>From</TableHeaderCell>
                          <TableHeaderCell>Status</TableHeaderCell>
                          <TableHeaderCell className="text-right">Action</TableHeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
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
                          <TableRow key={idx}>
                            <TableDataCell className="font-medium">{item.request}</TableDataCell>
                            <TableDataCell className="text-gray-600 dark:text-gray-400">
                              {item.from}
                            </TableDataCell>
                            <TableDataCell>
                              <Badge
                                label={item.status}
                                variant={item.status === "Urgent" ? "error" : "warning"}
                                size="sm"
                              />
                            </TableDataCell>
                            <TableDataCell className="text-right">
                              <Button variant="ghost" size="sm">
                                Review
                              </Button>
                            </TableDataCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>⚡ Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { icon: "📝", label: "Create Work Order", href: "#" },
                    { icon: "👤", label: "Manage Tenants", href: "#" },
                    { icon: "🔐", label: "Security Controls", href: "#" },
                    { icon: "📊", label: "View Reports", href: "#" },
                    { icon: "💬", label: "Send Message", href: "#" },
                    { icon: "⚙️", label: "Settings", href: "/portal/profile" },
                  ].map((action, idx) => (
                    <Link key={idx} href={action.href}>
                      <button className="w-full p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all flex items-center gap-3 border border-gray-200 dark:border-gray-600 group">
                        <span className="text-lg group-hover:scale-110 transition-transform">
                          {action.icon}
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-200 text-left flex-1">
                          {action.label}
                        </span>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>📅 Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "2 hours ago", event: "Maintenance request submitted for HVAC", type: "info" },
                  { time: "5 hours ago", event: "New tenant onboarding completed", type: "success" },
                  { time: "1 day ago", event: "Security audit completed", type: "success" },
                  { time: "2 days ago", event: "Compliance score updated to 92%", type: "info" },
                ].map((activity, idx) => (
                  <div key={idx} className="flex gap-4 items-start pb-4 last:pb-0 last:border-0 border-b border-gray-200 dark:border-gray-700">
                    <Badge
                      label={activity.type.toUpperCase()}
                      variant={activity.type === "success" ? "success" : "info"}
                      size="sm"
                    />
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-gray-100">{activity.event}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Properties View */}
          {user.properties && user.properties.length > 0 && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>🏢 Assigned Properties ({user.properties.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PROPERTIES.filter((p) => user.properties!.includes(p.property_id)).map(
                    (prop) => (
                      <Link key={prop.property_id} href={`/portal/manager/properties/${prop.property_id}`}>
                        <div className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:shadow-md transition-all group">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                                Property #{prop.property_id}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {prop.address}
                              </p>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all group-hover:translate-x-1">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                          <Badge
                            label={`${prop.total_units} Units`}
                            variant="primary"
                            size="sm"
                          />
                        </div>
                      </Link>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-8 px-6 mt-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2024 DingDong Building Management System. All rights reserved.</p>
          <div className="mt-4 flex gap-4 justify-center text-xs">
            <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition">Privacy Policy</a>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition">Terms of Service</a>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
