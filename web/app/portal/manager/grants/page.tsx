"use client";

export default function GrantsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">📋 Grant Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Active Grants</p>
          <p className="text-3xl font-bold mt-2">5</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Funding</p>
          <p className="text-3xl font-bold mt-2">$850K</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Utilization</p>
          <p className="text-3xl font-bold mt-2">68%</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Grant Overview</h2>
        <div className="space-y-4">
          {[
            { name: "Housing Stabilization Grant", amount: "$200K", status: "Active", progress: 75 },
            { name: "Community Development Grant", amount: "$250K", status: "Active", progress: 60 },
            { name: "Emergency Relief Grant", amount: "$150K", status: "Pending", progress: 45 },
            { name: "Renovation Grant", amount: "$250K", status: "Active", progress: 85 },
          ].map((grant, idx) => (
            <div key={idx} className="p-4 border rounded-lg">
              <div className="flex justify-between mb-2">
                <p className="font-semibold">{grant.name}</p>
                <span className={`text-xs px-2 py-1 rounded ${grant.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{grant.status}</span>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-sm text-gray-600">{grant.amount} allocated</p>
                <p className="text-sm text-gray-600">{grant.progress}% utilized</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: `${grant.progress}%`}}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
