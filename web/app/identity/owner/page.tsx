export default function OwnerPortal() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Owner Dashboard</h1>
      <p className="text-gray-500 mb-8">Role: Property Owner / Investor</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Asset Overview */}
        <section className="col-span-1 lg:col-span-2 border rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Asset Perfomance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
             <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Value</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">$850,000</p>
                <p className="text-xs text-green-600">▲ 4.2% YTD</p>
             </div>
             <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Equity</p>
                <p className="text-2xl font-bold">$320,000</p>
             </div>
             <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">HOA Dues</p>
                <p className="text-2xl font-bold">$450<span className="text-sm font-normal text-gray-500">/mo</span></p>
             </div>
          </div>
          
          <h3 className="font-semibold mb-3">Renovation Approvals</h3>
          <div className="border rounded p-4 flex justify-between items-center">
             <div>
                <p className="font-medium">Kitchen Remodel Request #402</p>
                <p className="text-sm text-gray-500">Submitted: Feb 10, 2026 • Status: <span className="text-yellow-600 font-semibold">Under Review</span></p>
             </div>
             <button className="text-sm border px-3 py-1 rounded hover:bg-gray-100">View Details</button>
          </div>
        </section>

        {/* Community Governance */}
        <section className="border rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Community Governance</h2>
          <div className="space-y-4">
            <div className="p-4 border border-blue-200 bg-blue-50 dark:bg-blue-900/10 rounded">
                <h3 className="font-bold text-blue-800 dark:text-blue-300">Active Vote Required</h3>
                <p className="text-sm mt-1 mb-3">Proposal to upgrade lobby security implementation.</p>
                <div className="flex gap-2">
                    <button className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700">Vote Now</button>
                    <button className="text-blue-600 text-sm hover:underline">Read Proposal</button>
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-2">Recent Board Updates</h3>
                <ul className="list-disc list-inside text-sm space-y-2 text-gray-600 dark:text-gray-400">
                    <li>Q4 2025 Financial Report released</li>
                    <li>Roof maintenance scheduled for March</li>
                    <li>New guest policy effective immediately</li>
                </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
