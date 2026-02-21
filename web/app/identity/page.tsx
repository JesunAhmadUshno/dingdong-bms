import Link from "next/link";

export default function IdentityPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Identity & Access Management</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Select User Role (Demonstration)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/identity/renter" className="block border p-6 rounded-lg shadow hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">Renter</h3>
            <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">Short-term rental occupants. View payments & requests.</p>
          </Link>
          
          <Link href="/identity/leaseholder" className="block border p-6 rounded-lg shadow hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
            <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400">Leaseholder</h3>
            <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">Long-term lease agreements. Renewal options & subletting.</p>
          </Link>

          <Link href="/identity/owner" className="block border p-6 rounded-lg shadow hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
            <h3 className="text-lg font-bold text-green-600 dark:text-green-400">Property Owner</h3>
            <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">Direct ownership. Asset tracking, HOA & Renovations.</p>
          </Link>

          <Link href="/identity/admin" className="block border p-6 rounded-lg shadow hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-l-4 border-l-red-500">
            <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Management Admin</h3>
            <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">Full building oversight. User administration & security override.</p>
          </Link>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Core Identity Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Tenant Onboarding</h2>
          <p>Manage tenant profiles and digital keys.</p>
        </div>
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Visitor Management</h2>
          <p>Issue guest passes and track visits.</p>
        </div>
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Parking</h2>
          <p>Assign spots and monitor availability.</p>
        </div>
      </div>
    </div>
  );
}
