"use client";

export default function PortfolioPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🏢 Property Portfolio</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Properties</p>
          <p className="text-3xl font-bold mt-2">8</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Units</p>
          <p className="text-3xl font-bold mt-2">156</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Portfolio Value</p>
          <p className="text-3xl font-bold mt-2">$42M</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Avg. ROI</p>
          <p className="text-3xl font-bold mt-2">6.2%</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Property List</h2>
        <div className="space-y-3">
          {[
            { name: "Downtown Tower", units: 48, occupancy: "96%", value: "$18M" },
            { name: "Park View Apartments", units: 32, occupancy: "92%", value: "$12M" },
            { name: "Riverside Complex", units: 24, occupancy: "88%", value: "$8M" },
            { name: "Commercial Hub", units: 52, occupancy: "94%", value: "$20M" },
          ].map((property, idx) => (
            <div key={idx} className="p-4 border rounded-lg hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{property.name}</p>
                  <p className="text-sm text-gray-500">{property.units} units • Occupancy: {property.occupancy}</p>
                </div>
                <p className="font-bold text-green-600">{property.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
