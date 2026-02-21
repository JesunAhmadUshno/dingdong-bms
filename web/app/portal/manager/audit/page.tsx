"use client";

export default function AuditPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">📝 Audit Logs</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Events (24h)</p>
          <p className="text-3xl font-bold mt-2">1,247</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Failed Logins</p>
          <p className="text-3xl font-bold mt-2">12</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Security Events</p>
          <p className="text-3xl font-bold mt-2 text-orange-600">2</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Recent Activity Log</h2>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3">Timestamp</th>
              <th className="p-3">User</th>
              <th className="p-3">Action</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[1, 2, 3, 4, 5].map((item) => (
              <tr key={item} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3">Feb 21, 2:30 PM</td>
                <td className="p-3">user@example.com</td>
                <td className="p-3">Login</td>
                <td className="p-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Success</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
