"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PROPERTIES } from "@/lib/database";

interface Metrics {
  totalProperties: number;
  totalTenants: number;
  occupancyRate: number;
  maintenance: number;
  revenue: number;
  compliance: number;
}

const navigationItems = [
  { icon: "📊", label: "Dashboard", href: "/portal/manager", active: true },
  { icon: "👥", label: "Tenants", href: "/portal/manager/tenants" },
  { icon: "🏢", label: "Properties", href: "/portal/manager/properties" },
  { icon: "🔧", label: "Maintenance", href: "/portal/manager/maintenance" },
  { icon: "📋", label: "Work Orders", href: "/portal/manager/work-orders" },
  { icon: "💰", label: "Finance", href: "/portal/manager/finance" },
  { icon: "📅", label: "Events", href: "/portal/manager/events" },
  { icon: "📊", label: "Reports", href: "/portal/manager/reports" },
];

const accountItems = [
  { icon: "👤", label: "Profile", href: "/portal/profile" },
  { icon: "💬", label: "Messages", href: "/portal/manager/messages" },
  { icon: "🔔", label: "Notifications", href: "/portal/manager/notifications" },
];

export default function ManagerDashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [metrics, setMetrics] = useState<Metrics>({
    totalProperties: 0,
    totalTenants: 0,
    occupancyRate: 0,
    maintenance: 0,
    revenue: 0,
    compliance: 0,
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/");
      return;
    }

    const userProperties =
      user.properties && user.properties.length > 0
        ? PROPERTIES.filter((p) => user.properties!.includes(p.property_id))
        : PROPERTIES;

    const totalTenants = userProperties.reduce((sum, p) => sum + p.total_units, 0);

    setMetrics({
      totalProperties: userProperties.length,
      totalTenants: totalTenants,
      occupancyRate: 90,
      maintenance: 12,
      revenue: 145000,
      compliance: 92,
    });
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-0"
        } bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 overflow-hidden flex flex-col fixed left-0 top-0 bottom-0 z-40`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              DB
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">DingDong</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            Menu
          </p>
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  item.active
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </Link>
          ))}
        </nav>

        {/* Account Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-2 flex-shrink-0">
          <p className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            Account
          </p>
          {accountItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all ${sidebarOpen ? "ml-72" : "ml-0"}`}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-800">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.full_name.substring(0, 1)}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.full_name.split(" ")[0]}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Manager</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Page Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, {user.full_name}!</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Properties */}
              <div className="bg-white dark:bg-gray-900 border-l-4 border-blue-500 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Properties</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{metrics.totalProperties}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 10% increase</p>
                  </div>
                  <span className="text-4xl">🏢</span>
                </div>
              </div>

              {/* Total Employees */}
              <div className="bg-white dark:bg-gray-900 border-l-4 border-green-500 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Tenants</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{metrics.totalTenants}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 20% increase</p>
                  </div>
                  <span className="text-4xl">👥</span>
                </div>
              </div>

              {/* Occupancy Rate */}
              <div className="bg-white dark:bg-gray-900 border-l-4 border-cyan-500 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Occupancy Rate</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{metrics.occupancyRate}%</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                      <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${metrics.occupancyRate}%` }}></div>
                    </div>
                  </div>
                  <span className="text-4xl">📊</span>
                </div>
              </div>

              {/* Average Salary */}
              <div className="bg-white dark:bg-gray-900 border-l-4 border-orange-500 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Monthly Revenue</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">${(metrics.revenue / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 15% increase</p>
                  </div>
                  <span className="text-4xl">💰</span>
                </div>
              </div>
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Salary Statistics Chart */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Salary Statistics</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last month</p>
                  </div>
                  <select className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                    <option>Last month</option>
                    <option>Last 3 months</option>
                    <option>Last year</option>
                  </select>
                </div>
                
                {/* Simple Bar Chart Visualization */}
                <div className="space-y-4">
                  <div className="flex items-end gap-3 justify-between">
                    <div className="flex-1 text-center">
                      <div className="flex items-end justify-center gap-1 mb-2">
                        <div className="w-3 bg-blue-500 rounded-t" style={{ height: "60px" }}></div>
                        <div className="w-3 bg-blue-300 rounded-t" style={{ height: "40px" }}></div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Dev</p>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="flex items-end justify-center gap-1 mb-2">
                        <div className="w-3 bg-blue-500 rounded-t" style={{ height: "50px" }}></div>
                        <div className="w-3 bg-blue-300 rounded-t" style={{ height: "35px" }}></div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Marketing</p>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="flex items-end justify-center gap-1 mb-2">
                        <div className="w-3 bg-blue-500 rounded-t" style={{ height: "70px" }}></div>
                        <div className="w-3 bg-blue-300 rounded-t" style={{ height: "45px" }}></div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Sales</p>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="flex items-end justify-center gap-1 mb-2">
                        <div className="w-3 bg-blue-500 rounded-t" style={{ height: "55px" }}></div>
                        <div className="w-3 bg-blue-300 rounded-t" style={{ height: "38px" }}></div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">HR</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sales</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-300 rounded-full"></span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Marketing</span>
                  </div>
                </div>
              </div>

              {/* Income Analysis */}
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Income Analysis</h3>
                </div>

                {/* Pie Chart Container */}
                <div className="flex justify-center mb-8">
                  <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray="78 314" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#06b6d4" strokeWidth="12" strokeDasharray="63 314" style={{ strokeDashoffset: "-78" }} />
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="63 314" style={{ strokeDashoffset: "-141" }} />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center" style={{ marginTop: "30px" }}>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">55</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Design</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Design</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">55</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-cyan-500 rounded-full"></span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Development</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">25</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">SFO</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">20</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Employee Performance Table */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Property Performance</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current month</p>
                </div>
                <select className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                  <option>Last month</option>
                  <option>Last 3 months</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">PROPERTY</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">UNITS</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">OCCUPANCY</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">REVENUE</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">STATUS</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400">
                            #1
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">Downtown Tower</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">45</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: "95%" }}></div>
                          </div>
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">95%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-gray-900 dark:text-white">$28.5K</td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">GOOD</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                          ⋮
                        </button>
                      </td>
                    </tr>

                    <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center text-sm font-bold text-cyan-600 dark:text-cyan-400">
                            #2
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">Riverside Complex</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">32</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "82%" }}></div>
                          </div>
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">82%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-gray-900 dark:text-white">$19.2K</td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">AVERAGE</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                          ⋮
                        </button>
                      </td>
                    </tr>

                    <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-sm font-bold text-green-600 dark:text-green-400">
                            #3
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">Westside Heights</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">38</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: "88%" }}></div>
                          </div>
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">88%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-gray-900 dark:text-white">$22.8K</td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">GOOD</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                          ⋮
                        </button>
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-sm font-bold text-purple-600 dark:text-purple-400">
                            #4
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">Norwood Avenue</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">28</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                          </div>
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">65%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-gray-900 dark:text-white">$15.6K</td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-semibold rounded-full">NEEDS WORK</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                          ⋮
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
