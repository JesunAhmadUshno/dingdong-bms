"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PROPERTIES } from "@/lib/database";

interface Metrics {
  totalProperties: number;
  totalTenants: number;
  occupancyRate: number;
  maintenance: number;
  revenue: number;
  compliance: number;
}

export default function ManagerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
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
    return null; // Handled by layout
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Overview Dashboard</h1>
          <p className="text-sm sm:text-base text-slate-400">Here's what's happening with your properties today.</p>
        </div>
        <button className="w-full sm:w-auto px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export Report
        </button>
      </div>

      {/* Top Row: 3D Glass Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Properties */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 text-blue-400 shadow-[inset_0_0_12px_rgba(59,130,246,0.2)]">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/20">+12%</span>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">{metrics.totalProperties}</h3>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Total Properties</p>
            </div>
          </div>
        </div>

        {/* Card 2: Tenants */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 text-purple-400 shadow-[inset_0_0_12px_rgba(168,85,247,0.2)]">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/20">+5.4%</span>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">{metrics.totalTenants}</h3>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Active Tenants</p>
            </div>
          </div>
        </div>

        {/* Card 3: Occupancy */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-cyan-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 text-cyan-400 shadow-[inset_0_0_12px_rgba(6,182,212,0.2)]">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/20">-1.2%</span>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">{metrics.occupancyRate}%</h3>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Occupancy Rate</p>
            </div>
            {/* Mini Progress Bar */}
            <div className="w-full h-1.5 bg-slate-700 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${metrics.occupancyRate}%` }}></div>
            </div>
          </div>
        </div>

        {/* Card 4: Revenue */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-400 shadow-[inset_0_0_12px_rgba(16,185,129,0.2)]">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/20">+8.1%</span>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">${(metrics.revenue / 1000).toFixed(1)}k</h3>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Monthly Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Main Chart: Revenue Overview */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)] overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Revenue Overview</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Income vs Expenses for 2026</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-white/5 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none px-4 py-1.5 rounded-md bg-blue-500 text-white text-sm font-medium shadow-[0_2px_8px_rgba(59,130,246,0.4)]">Monthly</button>
              <button className="flex-1 sm:flex-none px-4 py-1.5 rounded-md text-slate-400 hover:text-white text-sm font-medium transition-colors">Yearly</button>
            </div>
          </div>

          {/* Modern 3D Bar Chart Representation */}
          <div className="h-48 sm:h-64 flex items-end justify-between gap-1 sm:gap-2 relative overflow-x-auto pb-2">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none min-w-[400px]">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full border-t border-white/5"></div>
              ))}
            </div>
            
            {/* Bars */}
            <div className="flex items-end justify-between w-full min-w-[400px] h-full">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((month, i) => {
                const height1 = Math.floor(Math.random() * 40) + 40; // 40-80%
                const height2 = Math.floor(Math.random() * 30) + 20; // 20-50%
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-2 z-10 group">
                    <div className="w-full max-w-[20px] sm:max-w-[40px] flex items-end gap-0.5 sm:gap-1 h-full pb-2">
                      {/* Income Bar */}
                      <div className="w-1/2 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-md relative group-hover:brightness-125 transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]" style={{ height: `${height1}%` }}>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-t-md"></div>
                      </div>
                      {/* Expense Bar */}
                      <div className="w-1/2 bg-gradient-to-t from-purple-600 to-pink-400 rounded-t-md relative group-hover:brightness-125 transition-all duration-300 shadow-[0_0_10px_rgba(236,72,153,0.3)]" style={{ height: `${height2}%` }}>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-t-md"></div>
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-xs font-medium text-slate-400 group-hover:text-white transition-colors">{month}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
              <span className="text-xs sm:text-sm text-slate-300">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-400 shadow-[0_0_8px_rgba(236,72,153,0.6)]"></div>
              <span className="text-xs sm:text-sm text-slate-300">Expenses</span>
            </div>
          </div>
        </div>

        {/* Side Chart: Maintenance Status */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex flex-col">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Maintenance</h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 sm:mb-8">Current ticket status</p>

          {/* 3D Donut Chart */}
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[150px]">
            <div className="relative w-32 h-32 sm:w-48 sm:h-48">
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
                <span className="text-2xl sm:text-3xl font-bold text-white">42</span>
                <span className="text-[10px] sm:text-xs text-slate-400 font-medium">Total Tickets</span>
              </div>
            </div>
          </div>

          {/* Stats List */}
          <div className="space-y-2 sm:space-y-3 mt-6 sm:mt-8">
            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                <span className="text-xs sm:text-sm text-slate-300">Completed</span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-white">24</span>
            </div>
            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                <span className="text-xs sm:text-sm text-slate-300">In Progress</span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-white">12</span>
            </div>
            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]"></div>
                <span className="text-xs sm:text-sm text-slate-300">Pending</span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-white">6</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Data Table */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)] overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Recent Transactions</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Latest payments and expenses</p>
          </div>
          <button className="text-xs sm:text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
            View All <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr>
                <th className="pb-4 pt-2 px-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/5">Transaction</th>
                <th className="pb-4 pt-2 px-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/5">Property</th>
                <th className="pb-4 pt-2 px-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/5">Date</th>
                <th className="pb-4 pt-2 px-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/5">Status</th>
                <th className="pb-4 pt-2 px-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/5 text-right">Amount</th>
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
                  <td className="py-3 sm:py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${trx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {trx.type === 'income' ? (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
                        ) : (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors whitespace-nowrap">{trx.name}</p>
                        <p className="text-[10px] sm:text-xs text-slate-500">{trx.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-4 text-xs sm:text-sm text-slate-300 font-medium whitespace-nowrap">{trx.property}</td>
                  <td className="py-3 sm:py-4 px-4 text-xs sm:text-sm text-slate-400 whitespace-nowrap">{trx.date}</td>
                  <td className="py-3 sm:py-4 px-4">
                    <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold border whitespace-nowrap ${
                      trx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {trx.status}
                    </span>
                  </td>
                  <td className={`py-3 sm:py-4 px-4 text-right text-sm font-bold whitespace-nowrap ${trx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                    {trx.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}



