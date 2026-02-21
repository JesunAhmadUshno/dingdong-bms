"use client";

export default function ApiPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🔌 API Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Active API Keys</p>
          <p className="text-3xl font-bold mt-2">7</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">API Calls (24h)</p>
          <p className="text-3xl font-bold mt-2">24,500</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Rate Limit Usage</p>
          <p className="text-3xl font-bold mt-2">62%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">API Keys</h2>
          <div className="space-y-3">
            {[
              { name: "Production API Key", status: "Active", created: "Jan 2025" },
              { name: "Development API Key", status: "Active", created: "Feb 2025" },
              { name: "Testing API Key", status: "Inactive", created: "Dec 2024" },
            ].map((key, idx) => (
              <div key={idx} className="p-3 border rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{key.name}</p>
                  <span className={`text-xs px-2 py-1 rounded ${key.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                    {key.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Created: {key.created}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Available Endpoints</h2>
          <ul className="space-y-2 text-sm">
            <li className="p-2 bg-gray-50 dark:bg-gray-700 rounded">/api/auth/session</li>
            <li className="p-2 bg-gray-50 dark:bg-gray-700 rounded">/api/occupants</li>
            <li className="p-2 bg-gray-50 dark:bg-gray-700 rounded">/api/properties</li>
            <li className="p-2 bg-gray-50 dark:bg-gray-700 rounded">/api/maintenance</li>
            <li className="p-2 bg-gray-50 dark:bg-gray-700 rounded">/api/reports</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
