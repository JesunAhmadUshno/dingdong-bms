"use client";

export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">📈 Analytics & Reporting</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Units</p>
          <p className="text-3xl font-bold mt-2">48</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Occupancy Rate</p>
          <p className="text-3xl font-bold mt-2">94%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Avg. Rent Value</p>
          <p className="text-3xl font-bold mt-2">$2,850</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Revenue (YTD)</p>
          <p className="text-3xl font-bold mt-2">$1.3M</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Occupancy Trend</h2>
          <p className="text-gray-500 h-48 flex items-center justify-center">Chart will be displayed here</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Revenue Forecast</h2>
          <p className="text-gray-500 h-48 flex items-center justify-center">Chart will be displayed here</p>
        </div>
      </div>
    </div>
  );
}
