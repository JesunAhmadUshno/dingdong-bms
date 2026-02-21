"use client";

import { useAuth } from "@/lib/auth-context";

export default function MaintenancePage() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🔧 Maintenance Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Open Requests</p>
          <p className="text-3xl font-bold mt-2">7</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-3xl font-bold mt-2">3</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Completed This Month</p>
          <p className="text-3xl font-bold mt-2">14</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Recent Maintenance Requests</h2>
        <p className="text-gray-500">Maintenance request list will be displayed here</p>
      </div>
    </div>
  );
}
