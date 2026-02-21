"use client";

export default function ReportingPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">📊 Social Impact Reporting</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Lives Supported</p>
          <p className="text-3xl font-bold mt-2">240</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Community Programs</p>
          <p className="text-3xl font-bold mt-2">8</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Reports Due</p>
          <p className="text-3xl font-bold mt-2">2</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Recent Reports</h2>
          <ul className="space-y-2">
            <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded">Q4 2025 Impact Report - Submitted</li>
            <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded">Annual Social Equity Report - In Progress</li>
            <li className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">Tenant Services Report - Due Feb 28</li>
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Impact Metrics</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between"><span>Housing Stability:</span><strong>94%</strong></li>
            <li className="flex justify-between"><span>Tenant Satisfaction:</span><strong>4.2/5</strong></li>
            <li className="flex justify-between"><span>Employment Support:</span><strong>68%</strong></li>
            <li className="flex justify-between"><span>Community Engagement:</span><strong>87%</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
