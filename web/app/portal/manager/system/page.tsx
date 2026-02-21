"use client";

export default function SystemPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">⚙️ System Configuration</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-500">System Status</p>
          <p className="text-3xl font-bold mt-2 text-green-600">✓ Healthy</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Uptime</p>
          <p className="text-3xl font-bold mt-2">99.8%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Database Size</p>
          <p className="text-3xl font-bold mt-2">2.3 GB</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Active Connections</p>
          <p className="text-3xl font-bold mt-2">1,247</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Services Status</h2>
          <ul className="space-y-2">
            {[
              { service: "Authentication API", status: "Online" },
              { service: "Database Server", status: "Online" },
              { service: "Email Service", status: "Online" },
              { service: "File Storage", status: "Online" },
            ].map((svc, idx) => (
              <li key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded flex justify-between">
                <span>{svc.service}</span>
                <span className="text-green-600 font-semibold">{svc.status}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">System Maintenance</h2>
          <button className="w-full mb-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Restart Services</button>
          <button className="w-full mb-2 bg-orange-600 text-white p-2 rounded hover:bg-orange-700">Run System Check</button>
          <button className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700">Clear Cache</button>
        </div>
      </div>
    </div>
  );
}
