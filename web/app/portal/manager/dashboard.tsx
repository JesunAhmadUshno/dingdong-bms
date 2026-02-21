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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-0"
        } bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 transition-all duration-300 overflow-hidden flex flex-col fixed left-0 top-0 bottom-0 z-40`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-blue-500/50 transition-all group-hover:scale-110">
              DB
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">DingDong</h2>
              <p className="text-xs text-slate-400">Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-hide">
          <p className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            Menu
          </p>
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  item.active
                    ? "bg-gradient-to-r from-blue-500/30 to-blue-400/20 text-blue-300 font-semibold border-l-2 border-blue-400 shadow-lg shadow-blue-500/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                }`}
              >
                <span className={`text-xl transition-transform group-hover:scale-125 ${item.active ? "animate-pulse" : ""}`}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </Link>
          ))}
        </nav>

        {/* Account Section */}
        <div className="border-t border-slate-700 p-4 space-y-1 flex-shrink-0">
          <p className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            Account
          </p>
          {accountItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 text-sm hover:text-slate-100 hover:bg-slate-700/50 rounded-lg transition-all duration-200 group">
                <span className="group-hover:scale-125 transition-transform">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-400 text-sm hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-all duration-200 group mt-2"
          >
            <span className="group-hover:scale-125 transition-transform">🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-0"}`}>
        {/* Header */}
        <header className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 px-6 py-4 sticky top-0 z-30 backdrop-blur-xl bg-opacity-80">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-200 group"
            >
              <svg className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative group">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-slate-700/70"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2.5 hover:bg-slate-700 rounded-lg transition-all duration-200 group">
                <svg className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-700 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg group-hover:shadow-blue-500/50 transition-all group-hover:scale-110">
                  {user.full_name.substring(0, 1)}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-bold text-slate-100">{user.full_name.split(" ")[0]}</p>
                  <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">Manager</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="p-6 space-y-6">
            {/* Page Title */}
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">Dashboard</h1>
              <p className="text-slate-400 mt-2">Welcome back, <span className="text-blue-400 font-semibold">{user.full_name}</span>!</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Properties */}
              <div className="group relative bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-xl p-6 shadow-lg hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 hover:translate-y-[-4px] animate-fadeInUp" style={{animationDelay: '0.1s'}}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10 rounded-xl transition-all duration-300"></div>
                <div className="relative flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Properties</p>
                    <p className="text-4xl font-bold text-white mt-2 group-hover:text-blue-300 transition-colors">{metrics.totalProperties}</p>
                    <p className="text-xs text-green-400 mt-3 font-semibold">↑ 10% increase</p>
                  </div>
                  <span className="text-5xl group-hover:scale-125 transition-transform duration-300">🏢</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-b-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>

              {/* Total Tenants */}
              <div className="group relative bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-xl p-6 shadow-lg hover:shadow-2xl hover:border-green-500/50 transition-all duration-300 hover:translate-y-[-4px] animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:to-green-500/10 rounded-xl transition-all duration-300"></div>
                <div className="relative flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Tenants</p>
                    <p className="text-4xl font-bold text-white mt-2 group-hover:text-green-300 transition-colors">{metrics.totalTenants}</p>
                    <p className="text-xs text-green-400 mt-3 font-semibold">↑ 20% increase</p>
                  </div>
                  <span className="text-5xl group-hover:scale-125 transition-transform duration-300">👥</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-b-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>

              {/* Occupancy Rate */}
              <div className="group relative bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-xl p-6 shadow-lg hover:shadow-2xl hover:border-cyan-500/50 transition-all duration-300 hover:translate-y-[-4px] animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 group-hover:to-cyan-500/10 rounded-xl transition-all duration-300"></div>
                <div className="relative">
                  <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Occupancy</p>
                  <p className="text-4xl font-bold text-white mt-2 group-hover:text-cyan-300 transition-colors">{metrics.occupancyRate}%</p>
                  <div className="w-full bg-slate-600/50 rounded-full h-2.5 mt-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-cyan-600 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${metrics.occupancyRate}%` }}
                    ></div>
                  </div>
                </div>
                <span className="absolute top-6 right-6 text-5xl group-hover:scale-125 transition-transform duration-300">📊</span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-b-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>

              {/* Monthly Revenue */}
              <div className="group relative bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-xl p-6 shadow-lg hover:shadow-2xl hover:border-orange-500/50 transition-all duration-300 hover:translate-y-[-4px] animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-orange-500/10 rounded-xl transition-all duration-300"></div>
                <div className="relative flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Revenue</p>
                    <p className="text-4xl font-bold text-white mt-2 group-hover:text-orange-300 transition-colors">${(metrics.revenue / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-green-400 mt-3 font-semibold">↑ 15% increase</p>
                  </div>
                  <span className="text-5xl group-hover:scale-125 transition-transform duration-300">💰</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-b-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Salary Statistics Chart */}
              <div className="lg:col-span-2 bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">Salary Statistics</h3>
                    <p className="text-sm text-slate-400 mt-1">Last month</p>
                  </div>
                  <select className="px-4 py-2 bg-slate-600/50 border border-slate-600 rounded-lg text-sm text-slate-200 hover:border-blue-500 transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Last month</option>
                    <option>Last 3 months</option>
                    <option>Last year</option>
                  </select>
                </div>
                
                {/* Chart Bars */}
                <div className="flex items-end justify-around h-64 px-4 py-8 bg-slate-800/50 rounded-lg">
                  {['Dev', 'Marketing', 'Sales', 'HR'].map((label, idx) => (
                    <div key={idx} className="flex flex-col items-center group">
                      <div className="flex items-end gap-1.5 mb-4">
                        <div 
                          className="w-4 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg shadow-lg shadow-blue-500/50 group-hover:shadow-blue-400/70 transition-all duration-300 hover:scale-y-110 origin-bottom"
                          style={{ height: `${[60, 50, 70, 55][idx]}px` }}
                        ></div>
                        <div 
                          className="w-4 bg-gradient-to-t from-blue-400 to-blue-300 rounded-t-lg shadow-lg shadow-blue-500/30 group-hover:shadow-blue-300/50 transition-all duration-300 hover:scale-y-110 origin-bottom"
                          style={{ height: `${[40, 35, 45, 38][idx]}px` }}
                        ></div>
                      </div>
                      <p className="text-xs font-semibold text-slate-300 group-hover:text-blue-300 transition-colors">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-6 mt-6 pt-6 border-t border-slate-600">
                  <div className="flex items-center gap-2 group">
                    <span className="w-3 h-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg shadow-blue-500/50 group-hover:scale-150 transition-transform"></span>
                    <span className="text-sm text-slate-300">Sales</span>
                  </div>
                  <div className="flex items-center gap-2 group">
                    <span className="w-3 h-3 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full shadow-lg shadow-blue-400/30 group-hover:scale-150 transition-transform"></span>
                    <span className="text-sm text-slate-300">Marketing</span>
                  </div>
                </div>
              </div>

              {/* Income Analysis */}
              <div className="bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Income Analysis</h3>
                </div>

                {/* Pie Chart */}
                <div className="flex justify-center mb-8 h-40">
                  <div className="relative w-40 h-40">
                    <svg width="100%" height="100%" viewBox="0 0 120 120" className="transform -rotate-90 drop-shadow-lg">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#3b82f6" strokeWidth="14" strokeDasharray="78 314" className="transition-all duration-500 hover:stroke-blue-300" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#06b6d4" strokeWidth="14" strokeDasharray="63 314" style={{ strokeDashoffset: "-78" }} className="transition-all duration-500 hover:stroke-cyan-300" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#10b981" strokeWidth="14" strokeDasharray="63 314" style={{ strokeDashoffset: "-141" }} className="transition-all duration-500 hover:stroke-green-300" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-2xl font-bold text-white">55</p>
                      <p className="text-xs text-slate-400">Design</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Design', value: 55, color: 'from-blue-400 to-blue-600' },
                    { label: 'Development', value: 25, color: 'from-cyan-400 to-cyan-600' },
                    { label: 'SFO', value: 20, color: 'from-green-400 to-green-600' },
                  ].map((item, idx) => (
                    <div key={idx} className="group">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 bg-gradient-to-br ${item.color} rounded-full shadow-lg group-hover:scale-150 transition-transform`}></span>
                          <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{item.value}</span>
                      </div>
                      <div className="w-full bg-slate-600/50 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 bg-gradient-to-r ${item.color} rounded-full transition-all duration-500 group-hover:shadow-lg`}
                          style={{ width: `${item.value * 2}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Employee Performance Table */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Property Performance</h3>
                  <p className="text-sm text-slate-400 mt-1">Current month</p>
                </div>
                <select className="px-4 py-2 bg-slate-600/50 border border-slate-600 rounded-lg text-sm text-slate-200 hover:border-blue-500 transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Last month</option>
                  <option>Last 3 months</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left py-4 px-4 font-bold text-slate-300 uppercase tracking-wider">PROPERTY</th>
                      <th className="text-left py-4 px-4 font-bold text-slate-300 uppercase tracking-wider">UNITS</th>
                      <th className="text-left py-4 px-4 font-bold text-slate-300 uppercase tracking-wider">OCCUPANCY</th>
                      <th className="text-left py-4 px-4 font-bold text-slate-300 uppercase tracking-wider">REVENUE</th>
                      <th className="text-left py-4 px-4 font-bold text-slate-300 uppercase tracking-wider">STATUS</th>
                      <th className="text-right py-4 px-4 font-bold text-slate-300 uppercase tracking-wider">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Downtown Tower', units: 45, occupancy: 95, revenue: 28.5, status: 'GOOD', color: 'from-green-400 to-green-600' },
                      { name: 'Riverside Complex', units: 32, occupancy: 82, revenue: 19.2, status: 'AVERAGE', color: 'from-blue-400 to-blue-600' },
                      { name: 'Westside Heights', units: 38, occupancy: 88, revenue: 22.8, status: 'GOOD', color: 'from-green-400 to-green-600' },
                      { name: 'Norwood Avenue', units: 28, occupancy: 65, revenue: 15.6, status: 'NEEDS WORK', color: 'from-yellow-400 to-yellow-600' },
                    ].map((property, idx) => (
                      <tr 
                        key={idx} 
                        className="border-b border-slate-600/50 hover:bg-slate-600/30 transition-all duration-200 group cursor-pointer"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 bg-gradient-to-br ${property.color} rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg group-hover:shadow-xl transition-all group-hover:scale-125`}>
                              #{idx + 1}
                            </div>
                            <span className="font-semibold text-white group-hover:text-blue-300 transition-colors">{property.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-400 group-hover:text-slate-200 font-semibold">{property.units}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-600/50 rounded-full h-2.5 overflow-hidden">
                              <div 
                                className={`h-2.5 bg-gradient-to-r ${property.color} rounded-full transition-all duration-300 group-hover:shadow-lg`}
                                style={{ width: `${property.occupancy}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors w-8">{property.occupancy}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-bold text-white group-hover:text-green-300 transition-colors">${property.revenue}K</td>
                        <td className="py-4 px-4">
                          <span className={`inline-block px-3 py-1 bg-gradient-to-r ${property.color} text-white text-xs font-bold rounded-full shadow-lg transition-all group-hover:shadow-xl group-hover:scale-110`}>
                            {property.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button className="p-2 hover:bg-slate-500/50 rounded-lg transition-all duration-200 text-slate-400 hover:text-white group-hover:text-slate-200">
                            ⋮
                          </button>
                        </td>
                      </tr>
                    ))}
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
