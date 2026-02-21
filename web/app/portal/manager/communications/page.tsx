"use client";

export default function CommunicationsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">💬 Communications</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Unread Messages</p>
          <p className="text-3xl font-bold mt-2">5</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Sent This Week</p>
          <p className="text-3xl font-bold mt-2">12</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Broadcast Notices</p>
          <p className="text-3xl font-bold mt-2">3</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Recent Messages</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((msg) => (
              <div key={msg} className="p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                <p className="font-semibold">Message from Tenant</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Maintenance request regarding water pressure</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Send Message</h2>
          <form className="space-y-3">
            <input type="email" placeholder="Recipient" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
            <textarea placeholder="Message..." rows={4} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"></textarea>
            <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}
