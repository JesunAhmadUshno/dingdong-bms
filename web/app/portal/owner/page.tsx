"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OwnerDashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role.role_name !== "OWNER") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-700">TriMatrixLab | Owner Portal</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Welcome, <strong>{user.full_name}</strong></span>
          <Link href="/portal/profile" className="text-blue-600 hover:underline text-sm font-semibold">
            My Profile
          </Link>
          <button onClick={handleLogout} className="text-red-500 text-sm hover:underline">Sign Out</button>
        </div>
      </nav>

      <div className="p-8 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Financial Overview */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
               <h2 className="font-bold text-xl mb-4">Investment Overview</h2>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded">
                     <p className="text-sm text-gray-600">Current Valuation</p>
                     <p className="text-2xl font-bold text-green-800 dark:text-green-400">$850,000</p>
                  </div>
                   <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                     <p className="text-sm text-gray-600">Total Equity</p>
                     <p className="text-2xl font-bold">$320,000</p>
                  </div>
               </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
               <div className="flex justify-between items-center mb-4">
                 <h2 className="font-bold text-xl">Renovation Requests</h2>
                 <button className="text-sm text-blue-600 hover:underline">New Request</button>
               </div>
               <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                     <tr>
                        <th className="p-3">Project</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Date</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr className="border-b">
                        <td className="p-3">Kitchen Remodel</td>
                        <td className="p-3"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Review</span></td>
                        <td className="p-3">Feb 10</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>

         {/* Governance Side Panel */}
         <div className="bg-white dark:bg-gray-800 p-6 rounded shadow h-fit">
            <h3 className="font-bold text-lg mb-4">HOA & Governance</h3>
            <div className="space-y-4">
               <div className="p-4 border border-blue-200 bg-blue-50 dark:bg-blue-900/10 rounded">
                  <h4 className="font-bold text-blue-800 text-sm">🗳️ Vote Required</h4>
                  <p className="text-sm mt-1 mb-2">Lobby security upgrade proposal.</p>
                  <button className="w-full bg-blue-600 text-white py-1 rounded text-sm hover:bg-blue-700">Vote Now</button>
               </div>
               <div className="text-sm">
                  <p className="font-semibold">HOA Dues</p>
                  <p className="flex justify-between mt-1"><span>Feb 2026</span> <span className="text-green-600">Paid</span></p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
