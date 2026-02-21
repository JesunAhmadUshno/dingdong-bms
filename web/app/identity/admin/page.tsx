export default function AdminPortal() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold">Management Dashboard</h1>
            <p className="text-gray-500">Role: Building Manager / Admin</p>
        </div>
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-bold text-sm">
            ADMIN ACCESS
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         <div className="bg-white dark:bg-gray-800 p-4 rounded shadow border-l-4 border-blue-500">
            <h3 className="text-sm text-gray-500">Total Occupancy</h3>
            <p className="text-2xl font-bold">94%</p>
         </div>
         <div className="bg-white dark:bg-gray-800 p-4 rounded shadow border-l-4 border-green-500">
            <h3 className="text-sm text-gray-500">Rent Collected (Feb)</h3>
            <p className="text-2xl font-bold">$1.2M</p>
         </div>
         <div className="bg-white dark:bg-gray-800 p-4 rounded shadow border-l-4 border-yellow-500">
            <h3 className="text-sm text-gray-500">Open Tickets</h3>
            <p className="text-2xl font-bold">12</p>
         </div>
         <div className="bg-white dark:bg-gray-800 p-4 rounded shadow border-l-4 border-red-500">
            <h3 className="text-sm text-gray-500">Critical Alerts</h3>
            <p className="text-2xl font-bold">0</p>
         </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Operations & Approvals</h2>
      <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow">
        <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                    <th className="p-4 font-semibold uppercase text-xs text-gray-500">Request ID</th>
                    <th className="p-4 font-semibold uppercase text-xs text-gray-500">User</th>
                    <th className="p-4 font-semibold uppercase text-xs text-gray-500">Type</th>
                    <th className="p-4 font-semibold uppercase text-xs text-gray-500">Status</th>
                    <th className="p-4 font-semibold uppercase text-xs text-gray-500">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                    <td className="p-4">REQ-9921</td>
                    <td className="p-4 font-medium">Sarah Connor (Apt 302)</td>
                    <td className="p-4">Plumbing Repair</td>
                    <td className="p-4"><span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Pending</span></td>
                    <td className="p-4"><button className="text-blue-600 hover:underline">Approve</button></td>
                </tr>
                <tr>
                    <td className="p-4">ACC-1102</td>
                    <td className="p-4 font-medium">John Wick (Unit 1A)</td>
                    <td className="p-4">Guest Pass Limit Override</td>
                    <td className="p-4"><span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Urgent</span></td>
                    <td className="p-4"><button className="text-blue-600 hover:underline">Review</button></td>
                </tr>
                 <tr>
                    <td className="p-4">ONB-2210</td>
                    <td className="p-4 font-medium">New Tenant: Alice Chen</td>
                    <td className="p-4">Move-in Logistics</td>
                    <td className="p-4"><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Ready</span></td>
                    <td className="p-4"><button className="text-blue-600 hover:underline">Finalize</button></td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  );
}
