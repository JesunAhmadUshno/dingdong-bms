"use client";

export default function SecurityPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🔐 Security Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Security Status</p>
          <p className="text-3xl font-bold mt-2 text-green-600">✓ Secure</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <p className="text-sm text-gray-500">Active Incidents</p>
          <p className="text-3xl font-bold mt-2">1</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Cameras Online</p>
          <p className="text-3xl font-bold mt-2">12/12</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Access Control</h2>
          <ul className="space-y-2">
            <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded">Main Entrance: Operational</li>
            <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded">Back Entrance: Operational</li>
            <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded">Parking Gate: Operational</li>
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Recent Events</h2>
          <ul className="space-y-2 text-sm">
            <li className="p-2">2 hours ago: Guest access granted (Unit 3B)</li>
            <li className="p-2">4 hours ago: Delivery logged (Front Entrance)</li>
            <li className="p-2">6 hours ago: Unusual activity detected - Reviewed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
