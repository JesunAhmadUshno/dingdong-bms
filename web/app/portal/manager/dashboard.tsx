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
  { icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
  ), label: "Dashboard", href: "/portal/manager", active: true },
  { icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
  ), label: "Tenants", href: "/portal/manager/tenants" },
  { icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
  ), label: "Properties", href: "/portal/manager/properties" },
  { icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  ), label: "Maintenance", href: "/portal/manager/maintenance" },
  { icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
  ), label: "Work Orders", href: "/portal/manager/work-orders" },
  { icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ), label: "Finance", href: "/portal/manager/finance" },
];

const accountItems = [
  { icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
  ), label: "Profile", href: "/portal/profile" },
  { icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
  ), label: "Messages", href: "/portal/manager/messages" },
  { icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
  ), label: "Notifications", href: "/portal/manager/notifications" },
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
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans overflow-hidden flex relative">
      {/* Animated Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none"></div>

      {/* Sidebar - Glassmorphism */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-0"
        } bg-slate-900/40 backdrop-blur-2xl border-r border-white/10 transition-all duration-500 ease-in-out overflow-hidden flex flex-col fixed left-0 top-0 bottom-0 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.2)]`}
      >
        {/* Logo */}
        <div className="p-6 flex-shrink-0 flex items-center gap-3 border-b border-white/5">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            D
          </div>
          <h2 className="font-bold text-white text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">DingDong</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
          <p className="px-2 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Main Menu
          </p>
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  item.active
                    ? "text-white shadow-[0_4px_20px_rgba(59,130,246,0.3)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80 opacity-100"></div>
                )}
                <span className={`relative z-10 transition-transform duration-300 group-hover:scale-110 ${item.active ? "text-white" : "text-slate-400 group-hover:text-blue-400"}`}>
                  {item.icon}
                </span>
                <span className="relative z-10 font-medium text-sm tracking-wide">{item.label}</span>
              </button>
            </Link>
          ))}
        </nav>

        {/* Account Section */}
        <div className="p-4 space-y-2 flex-shrink-0 mb-4 border-t border-white/5">
          <p className="px-2 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Settings
          </p>
          {accountItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 text-sm hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 group">
                <span className="transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-400">{item.icon}</span>
                <span className="font-medium tracking-wide">{item.label}</span>
              </button>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 text-sm hover:text-white hover:bg-rose-500/20 rounded-xl transition-all duration-300 group mt-2"
          >
            <span className="transition-transform duration-300 group-hover:scale-110">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </span>
            <span className="font-medium tracking-wide">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-500 ease-in-out relative z-10 ${sidebarOpen ? "ml-72" : "ml-0"}`}>
        
        {/* Header - Glassmorphism */}
        <header className="bg-slate-900/30 backdrop-blur-xl border-b border-white/5 px-8 py-4 sticky top-0 z-30 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-6 flex-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-300 text-slate-300 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Search - 3D Neumorphic */}
            <div className="max-w-md w-full">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative flex items-center bg-slate-800/80 border border-white/10 rounded-full px-4 py-2.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
                  <svg className="w-4 h-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search anything..."
                    className="w-full bg-transparent border-none text-sm text-white placeholder-slate-500 focus:outline-none ml-3"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-5">
            <button className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.905.567l-1.22 2.846a2 2 0 01-1.81 1.121H10.525a2 2 0 01-1.81-1.121l-1.22-2.846A1 1 0 006.586 13H4" /></svg>
            </button>
            <button className="relative p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-900 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-5 border-l border-white/10 cursor-pointer group">
              <div className="w-10 h-10 rounded-xl p-[2px] bg-gradient-to-br from-blue-500 to-purple-600 shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all duration-300">
                <div className="w-full h-full bg-slate-900 rounded-[10px] overflow-hidden">
                  <img src={`https://ui-avatars.com/api/?name=${user.full_name}&background=0f172a&color=fff`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-white leading-tight group-hover:text-blue-400 transition-colors">{user.full_name}</p>
                <p className="text-xs text-slate-400">Property Manager</p>
              </div>
              <svg className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Welcome Section */}
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Overview Dashboard</h1>
                <p className="text-slate-400">Here's what's happening with your properties today.</p>
              </div>
              <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-all duration-300 backdrop-blur-md flex items-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Export Report
              </button>
            </div>

            {/* Top Row: 3D Glass Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: Properties */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 text-blue-400 shadow-[inset_0_0_12px_rgba(59,130,246,0.2)]">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/20">+12%</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-1">{metrics.totalProperties}</h3>
                    <p className="text-sm text-slate-400 font-medium">Total Properties</p>
                  </div>
                </div>
              </div>

              {/* Card 2: Tenants */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 text-purple-400 shadow-[inset_0_0_12px_rgba(168,85,247,0.2)]">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/20">+5.4%</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-1">{metrics.totalTenants}</h3>
                    <p className="text-sm text-slate-400 font-medium">Active Tenants</p>
                  </div>
                </div>
              </div>

              {/* Card 3: Occupancy */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-cyan-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 text-cyan-400 shadow-[inset_0_0_12px_rgba(6,182,212,0.2)]">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/20">-1.2%</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-1">{metrics.occupancyRate}%</h3>
                    <p className="text-sm text-slate-400 font-medium">Occupancy Rate</p>
                  </div>
                  {/* Mini Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-700 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${metrics.occupancyRate}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Card 4: Revenue */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-400 shadow-[inset_0_0_12px_rgba(16,185,129,0.2)]">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/20">+8.1%</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-1">${(metrics.revenue / 1000).toFixed(1)}k</h3>
                    <p className="text-sm text-slate-400 font-medium">Monthly Revenue</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Row: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Main Chart: Revenue Overview */}
              <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-white">Revenue Overview</h3>
                    <p className="text-sm text-slate-400 mt-1">Income vs Expenses for 2026</p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-white/5">
                    <button className="px-4 py-1.5 rounded-md bg-blue-500 text-white text-sm font-medium shadow-[0_2px_8px_rgba(59,130,246,0.4)]">Monthly</button>
                    <button className="px-4 py-1.5 rounded-md text-slate-400 hover:text-white text-sm font-medium transition-colors">Yearly</button>
                  </div>
                </div>

                {/* Modern 3D Bar Chart Representation */}
                <div className="h-64 flex items-end justify-between gap-2 relative">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-full border-t border-white/5"></div>
                    ))}
                  </div>
                  
                  {/* Bars */}
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((month, i) => {
                    const height1 = Math.floor(Math.random() * 40) + 40; // 40-80%
                    const height2 = Math.floor(Math.random() * 30) + 20; // 20-50%
                    return (
                      <div key={month} className="flex-1 flex flex-col items-center gap-2 z-10 group">
                        <div className="w-full max-w-[40px] flex items-end gap-1 h-full pb-2">
                          {/* Income Bar */}
                          <div className="w-1/2 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-md relative group-hover:brightness-125 transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]" style={{ height: `${height1}%` }}>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-t-md"></div>
                          </div>
                          {/* Expense Bar */}
                          <div className="w-1/2 bg-gradient-to-t from-purple-600 to-pink-400 rounded-t-md relative group-hover:brightness-125 transition-all duration-300 shadow-[0_0_10px_rgba(236,72,153,0.3)]" style={{ height: `${height2}%` }}>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-t-md"></div>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">{month}</span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                    <span className="text-sm text-slate-300">Income</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-pink-400 shadow-[0_0_8px_rgba(236,72,153,0.6)]"></div>
                    <span className="text-sm text-slate-300">Expenses</span>
                  </div>
                </div>
              </div>

              {/* Side Chart: Maintenance Status */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex flex-col">
                <h3 className="text-xl font-bold text-white mb-1">Maintenance</h3>
                <p className="text-sm text-slate-400 mb-8">Current ticket status</p>

                {/* 3D Donut Chart */}
                <div className="flex-1 flex flex-col items-center justify-center relative">
                  <div className="relative w-48 h-48">
                    {/* Outer Glow */}
                    <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl"></div>
                    
                    {/* SVG Donut */}
                    <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl relative z-10" viewBox="0 0 100 100">
                      {/* Background Track */}
                      <circle cx="50" cy="50" r="40" fill="none" className="stroke-slate-700/50" strokeWidth="12" />
                      
                      {/* Segments */}
                      <circle cx="50" cy="50" r="40" fill="none" className="stroke-emerald-400" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="60" strokeLinecap="round" />
                      <circle cx="50" cy="50" r="40" fill="none" className="stroke-blue-500" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="180" strokeLinecap="round" />
                      <circle cx="50" cy="50" r="40" fill="none" className="stroke-rose-400" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="220" strokeLinecap="round" />
                    </svg>
                    
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                      <span className="text-3xl font-bold text-white">42</span>
                      <span className="text-xs text-slate-400 font-medium">Total Tickets</span>
                    </div>
                  </div>
                </div>

                {/* Stats List */}
                <div className="space-y-3 mt-8">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                      <span className="text-sm text-slate-300">Completed</span>
                    </div>
                    <span className="text-sm font-bold text-white">24</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                      <span className="text-sm text-slate-300">In Progress</span>
                    </div>
                    <span className="text-sm font-bold text-white">12</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]"></div>
                      <span className="text-sm text-slate-300">Pending</span>
                    </div>
                    <span className="text-sm font-bold text-white">6</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Data Table */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
                  <p className="text-sm text-slate-400 mt-1">Latest payments and expenses</p>
                </div>
                <button className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                  View All <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="pb-4 pt-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/5">Transaction</th>
                      <th className="pb-4 pt-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/5">Property</th>
                      <th className="pb-4 pt-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/5">Date</th>
                      <th className="pb-4 pt-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/5">Status</th>
                      <th className="pb-4 pt-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      { id: 'TRX-8472', name: 'Rent Payment', property: 'Downtown Tower, Apt 4B', date: 'Feb 21, 2026', status: 'Completed', amount: '+$2,400.00', type: 'income' },
                      { id: 'TRX-8471', name: 'Plumbing Repair', property: 'Riverside Complex', date: 'Feb 20, 2026', status: 'Processing', amount: '-$350.00', type: 'expense' },
                      { id: 'TRX-8470', name: 'Rent Payment', property: 'Westside Heights, Apt 12A', date: 'Feb 19, 2026', status: 'Completed', amount: '+$1,850.00', type: 'income' },
                      { id: 'TRX-8469', name: 'Security Deposit', property: 'Downtown Tower, Apt 8C', date: 'Feb 18, 2026', status: 'Completed', amount: '+$3,000.00', type: 'income' },
                    ].map((trx, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors group">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${trx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                              {trx.type === 'income' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{trx.name}</p>
                              <p className="text-xs text-slate-500">{trx.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-300 font-medium">{trx.property}</td>
                        <td className="py-4 px-4 text-sm text-slate-400">{trx.date}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                            trx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          }`}>
                            {trx.status}
                          </span>
                        </td>
                        <td className={`py-4 px-4 text-right font-bold ${trx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                          {trx.amount}
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
