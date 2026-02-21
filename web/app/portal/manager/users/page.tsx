"use client";

export default function UsersPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">👤 User Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-3xl font-bold mt-2">487</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Active Today</p>
          <p className="text-3xl font-bold mt-2">156</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Pending Approval</p>
          <p className="text-3xl font-bold mt-2">8</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Suspended</p>
          <p className="text-3xl font-bold mt-2">3</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">User Directory</h2>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Last Login</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[1, 2, 3, 4, 5].map((item) => (
              <tr key={item} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3">User Name</td>
                <td className="p-3">Tenant</td>
                <td className="p-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Active</span></td>
                <td className="p-3 text-gray-500">2 hours ago</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
