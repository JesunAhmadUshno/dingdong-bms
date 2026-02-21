"use client";

import { useAuth } from "@/lib/auth-context";
import { OCCUPANTS } from "@/lib/database";

export default function TenantsPage() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">👥 Tenant Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Tenants</p>
          <p className="text-3xl font-bold mt-2">24</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Active Leases</p>
          <p className="text-3xl font-bold mt-2">22</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Lease Renewals</p>
          <p className="text-3xl font-bold mt-2">3</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Pending Approvals</p>
          <p className="text-3xl font-bold mt-2">2</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Tenant Directory</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Lease Status</th>
                <th className="p-3">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {OCCUPANTS.slice(0, 5).map((occupant) => (
                <tr key={occupant.occupant_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-3">{occupant.name}</td>
                  <td className="p-3">Unit {occupant.unit_id}</td>
                  <td className="p-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Active</span></td>
                  <td className="p-3 text-sm text-gray-600">{occupant.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
