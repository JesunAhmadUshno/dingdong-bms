export default function LeaseholderPortal() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Leaseholder Portal</h1>
      <p className="text-gray-500 mb-8">Role: Tenant (Long-term/Corporate Lease)</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lease Agreement */}
        <section className="border rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Lease Agreement</h2>
          <div className="space-y-4">
             <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-100 dark:border-purple-800">
                <h3 className="font-bold text-purple-700 dark:text-purple-300">Active Lease: 24 Months</h3>
                <p className="text-sm mt-1">Status: <span className="text-green-600 font-semibold">Good Standing</span></p>
             </div>
             
             <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-2">
                    <span>Contract ID:</span>
                    <span className="font-mono">L-2024-8821</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span>Renewal Window Opens:</span>
                    <span>Jan 15, 2027</span>
                </div>
             </div>

             <div className="flex gap-2">
                <button className="flex-1 bg-gray-800 text-white py-2 rounded hover:bg-gray-700">View Contract PDF</button>
                <button className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">Contact Leasing Office</button>
             </div>
          </div>
        </section>

        {/* Subletting & Corporate */}
        <section className="border rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Subletting & Management</h2>
          <div className="space-y-4">
             <div className="border p-4 rounded">
                <h3 className="font-semibold mb-2">Sublet Request</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Submit a request to sublet your unit or manage corporate occupant lists.</p>
                <button className="text-purple-600 font-medium hover:underline">Manage Sublets &rarr;</button>
             </div>
             
             <div className="border p-4 rounded">
                <h3 className="font-semibold mb-2">Billing History</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Download quarterly statements for expense reporting.</p>
                <button className="text-purple-600 font-medium hover:underline">View Statements &rarr;</button>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}
