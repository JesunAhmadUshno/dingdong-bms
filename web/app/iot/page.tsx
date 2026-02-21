export default function IoTPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Operations & IoT Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border p-4 rounded shadow bg-red-50">
          <h2 className="text-xl font-semibold text-red-700">Safety & Emergency</h2>
          <p>Status: All Systems Normal</p>
        </div>
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Elevators</h2>
          <p>Predictive Maintenance: Good</p>
        </div>
         <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Gardens</h2>
          <p>Soil Moisture: Optimized</p>
        </div>
      </div>
    </div>
  );
}
