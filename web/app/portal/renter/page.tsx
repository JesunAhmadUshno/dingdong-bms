"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RenterDashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role.role_name !== "RENTER") {
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
        <h1 className="text-xl font-bold text-blue-600">TriMatrixLab | Renter Portal</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Welcome, <strong>{user.full_name}</strong></span>
          <Link href="/portal/profile" className="text-blue-600 hover:underline text-sm font-semibold">
            My Profile
          </Link>
          <button onClick={handleLogout} className="text-red-500 text-sm hover:underline">Sign Out</button>
        </div>
      </nav>

      <div className="p-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Feed Section */}
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">🏠 My Apartment (Unit 4B)</h2>
            <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-4 rounded mb-4">
              <div>
                <p className="text-sm text-gray-500">Next Rent Due</p>
                <p className="text-2xl font-bold text-blue-700">$2,400</p>
                <p className="text-xs text-red-500">Due in 5 days</p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Pay Now</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
                <span className="text-2xl">🔧</span>
                <p className="font-semibold mt-2">Report Issue</p>
              </button>
              <button className="p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
                <span className="text-2xl">📦</span>
                <p className="font-semibold mt-2">My Packages</p>
              </button>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">Community Feed</h2>
            <div className="border-l-4 border-green-500 pl-4 py-2 bg-gray-50 dark:bg-gray-700">
              <p className="font-semibold">Yoga Class</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Tonight at 6 PM near the pool.</p>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-3">User Info</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-mono text-xs">{user.email}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">User ID:</span>
                <span className="font-mono text-xs">{user.user_id}</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-3">Quick Access</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                <span>🔑 Digital Key</span>
                <span className="text-green-500">Active</span>
              </li>
              <li className="flex justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                 <span>🚗 Parking Spot</span>
                 <span className="text-gray-500">B-42</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
