"use client";

export default function CompliancePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">✅ Compliance Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Compliance Score</p>
          <p className="text-3xl font-bold mt-2 text-green-600">92%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Open Issues</p>
          <p className="text-3xl font-bold mt-2">3</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Last Audit</p>
          <p className="text-3xl font-bold mt-2">Jan 2026</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Certifications</p>
          <p className="text-3xl font-bold mt-2">8/8 ✓</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Compliance Items</h2>
          <div className="space-y-3">
            {[
              { item: "Fair Housing Compliance", status: "Compliant", icon: "✓" },
              { item: "Safety Inspections", status: "Compliant", icon: "✓" },
              { item: "Environmental Standards", status: "Pending", icon: "⏳" },
              { item: "Accessibility Standards", status: "Compliant", icon: "✓" },
            ].map((comp, idx) => (
              <div key={idx} className="p-3 border rounded flex justify-between items-center">
                <span className="font-semibold">{comp.item}</span>
                <span className={`text-lg ${comp.status === "Compliant" ? "text-green-600" : "text-yellow-600"}`}>{comp.icon}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Upcoming Requirements</h2>
          <ul className="space-y-2">
            <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm">Annual Safety Audit - Due Mar 15</li>
            <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm">Tax Reporting - Due Apr 30</li>
            <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm">Employee Training - Due May 1</li>
            <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm">Legal Review - Due Jun 30</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
