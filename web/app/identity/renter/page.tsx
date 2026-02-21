export default function RenterPortal() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Renter Portal</h1>
      <p className="text-gray-500 mb-8">Role: Tenant (Short-term/Standard)</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Stay Info */}
        <section className="border rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Current Stay</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Unit:</span>
              <span className="font-medium">Apt 4B</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Lease Ends:</span>
              <span className="font-medium">Aug 31, 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Next Rent Due:</span>
              <span className="font-medium text-red-500">$2,400 (Due in 5 days)</span>
            </div>
            <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Pay Rent</button>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="border rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="border p-4 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
              <span className="block text-2xl mb-1">🔧</span>
              <span className="font-medium">Request Maintenance</span>
            </button>
            <button className="border p-4 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
              <span className="block text-2xl mb-1">📦</span>
              <span className="font-medium">Package Locker</span>
            </button>
             <button className="border p-4 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
              <span className="block text-2xl mb-1">🔑</span>
              <span className="font-medium">Visitor Pass</span>
            </button>
             <button className="border p-4 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
              <span className="block text-2xl mb-1">🏊</span>
              <span className="font-medium">Book Amenities</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
