"use client";

export default function SubsidiesPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">💳 Subsidy Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Active Subsidies</p>
          <p className="text-3xl font-bold mt-2">18</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Monthly Disbursement</p>
          <p className="text-3xl font-bold mt-2">$24,500</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Verifications Due</p>
          <p className="text-3xl font-bold mt-2 text-orange-600">3</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Program Compliance</p>
          <p className="text-3xl font-bold mt-2 text-green-600">100%</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Active Subsidy Programs</h2>
        <table className="w-full text-left">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3">Tenant</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Monthly Subsidy</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[1, 2, 3, 4, 5].map((item) => (
              <tr key={item} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3">Tenant Name</td>
                <td className="p-3">Unit 202</td>
                <td className="p-3">$1,250</td>
                <td className="p-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Active</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
