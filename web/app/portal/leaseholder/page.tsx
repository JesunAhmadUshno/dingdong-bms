"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/lib/toast";
import { LoadingState, EmptyState } from "@/components/UIComponents";

interface Occupant {
  occupant_id: number;
  lease_id: number;
  property_id: number;
  unit_id: number;
  name: string;
  email: string;
  phone: string;
  relationshipToLeaseholder: string;
  registrationDate: string;
  status: "active" | "inactive";
  created_at: string;
}

interface MaintenanceRequest {
  id: number;
  unitNumber: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  submittedDate: string;
  completedDate?: string;
}

interface FinancialData {
  month: string;
  rentPayment: number;
  utilities: number;
  maintenance: number;
  other: number;
  total: number;
}

export default function LeaseholderDashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const toast = useToast();

  // State Management
  const [activeTab, setActiveTab] = useState<
    "overview" | "leases" | "occupants" | "financials" | "maintenance" | "documents"
  >("overview");
  const [occupants, setOccupants] = useState<Occupant[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([
    {
      id: 1,
      unitNumber: "12A",
      description: "Water leak in bathroom",
      status: "in_progress",
      priority: "high",
      submittedDate: "2026-02-10",
    },
    {
      id: 2,
      unitNumber: "12A",
      description: "Broken window blinds",
      status: "pending",
      priority: "low",
      submittedDate: "2026-02-14",
    },
    {
      id: 3,
      unitNumber: "12A",
      description: "HVAC maintenance",
      status: "completed",
      priority: "medium",
      submittedDate: "2026-01-20",
      completedDate: "2026-02-05",
    },
  ]);
  const [financialData, setFinancialData] = useState<FinancialData[]>([
    { month: "January", rentPayment: 2400, utilities: 150, maintenance: 50, other: 30, total: 2630 },
    { month: "February", rentPayment: 2400, utilities: 180, maintenance: 0, other: 25, total: 2605 },
  ]);

  const [showAddOccupant, setShowAddOccupant] = useState(false);
  const [showAddMaintenance, setShowAddMaintenance] = useState(false);
  const [message, setMessage] = useState("");

  const [newOccupant, setNewOccupant] = useState({
    name: "",
    email: "",
    phone: "",
    relationshipToLeaseholder: "Co-occupant",
  });

  const [newMaintenance, setNewMaintenance] = useState({
    unitNumber: "12A",
    description: "",
    priority: "medium" as const,
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role.role_name !== "LEASEHOLDER") {
      router.push("/");
    } else {
      // Load occupants from API
      loadOccupants();
    }
  }, [isAuthenticated, user, router]);

  const loadOccupants = async () => {
    try {
      const response = await fetch("/api/occupants?property_id=2");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setOccupants(result.occupants);
        }
      } else {
        toast.error("Failed to load occupants");
      }
    } catch (error) {
      console.error("Failed to load occupants:", error);
      toast.error("Error loading occupants");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Occupant Management
  const handleAddOccupant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOccupant.name || !newOccupant.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch("/api/occupants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lease_id: 2,
          property_id: 2,
          unit_id: 3,
          name: newOccupant.name,
          email: newOccupant.email,
          phone: newOccupant.phone,
          relationshipToLeaseholder: newOccupant.relationshipToLeaseholder,
          registrationDate: new Date().toISOString().split("T")[0],
          status: "active",
        }),
      });

      if (response.ok) {
        toast.success("Occupant registered successfully");
        setNewOccupant({ name: "", email: "", phone: "", relationshipToLeaseholder: "Co-occupant" });
        setShowAddOccupant(false);
        await loadOccupants(); // Reload from API
      } else {
        const error = await response.json();
        toast.error(error.error?.message || "Failed to register occupant");
      }
    } catch (error) {
      console.error("Error adding occupant:", error);
      toast.error("Error registering occupant");
    }
  };

  const handleRemoveOccupant = async (occupant_id: number) => {
    if (confirm("Are you sure you want to remove this occupant?")) {
      try {
        const response = await fetch(`/api/occupants?occupant_id=${occupant_id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast.success("Occupant removed successfully");
          await loadOccupants(); // Reload from API
        } else {
          const error = await response.json();
          toast.error(error.error?.message || "Failed to remove occupant");
        }
      } catch (error) {
        console.error("Error removing occupant:", error);
        toast.error("Error removing occupant");
      }
    }
  };

  // Maintenance Management
  const handleAddMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaintenance.description) {
      toast.error("Please describe the maintenance issue");
      return;
    }

    const maintenance: MaintenanceRequest = {
      id: Math.max(...maintenanceRequests.map((m) => m.id), 0) + 1,
      ...newMaintenance,
      status: "pending",
      submittedDate: new Date().toISOString().split("T")[0],
    };

    setMaintenanceRequests([...maintenanceRequests, maintenance]);
    toast.success("Maintenance request submitted successfully");
    setNewMaintenance({ unitNumber: "12A", description: "", priority: "medium" });
    setShowAddMaintenance(false);
  };

  const handleUpdateMaintenanceStatus = (id: number, status: MaintenanceRequest["status"]) => {
    setMaintenanceRequests(
      maintenanceRequests.map((m) =>
        m.id === id
          ? {
              ...m,
              status,
              completedDate: status === "completed" ? new Date().toISOString().split("T")[0] : undefined,
            }
          : m
      )
    );
    toast.success("Maintenance status updated");
  };

  // Calculate Statistics
  const stats = {
    totalOccupants: occupants.length,
    activeRequests: maintenanceRequests.filter((m) => m.status === "pending" || m.status === "in_progress").length,
    monthlyRent: 2400,
    leasePropertyCount: 1,
  };

  if (!isAuthenticated || !user) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-indigo-600">Leaseholder Portal</h1>
              <p className="text-gray-600 mt-1">Welcome, {user.full_name}</p>
            </div>
            <div className="flex gap-4">
              <Link href="/portal/profile" className="text-blue-600 hover:underline text-sm font-semibold">
                My Profile
              </Link>
              <button onClick={handleLogout} className="text-red-500 text-sm hover:underline">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Statistics Cards */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Total Occupants</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalOccupants}</p>
              <p className="text-xs text-gray-500 mt-1">Registered inhabitants</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Active Maintenance</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats.activeRequests}</p>
              <p className="text-xs text-gray-500 mt-1">Pending or in progress</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Monthly Rent</p>
              <p className="text-3xl font-bold text-green-600 mt-2">${stats.monthlyRent}</p>
              <p className="text-xs text-gray-500 mt-1">Due on 1st of month</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Leased Properties</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.leasePropertyCount}</p>
              <p className="text-xs text-gray-500 mt-1">Unit 12A</p>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="flex border-b overflow-x-auto">
            {(["overview", "leases", "occupants", "financials", "maintenance", "documents"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-semibold text-sm whitespace-nowrap ${
                    activeTab === tab
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              )
            )}
          </div>

          <div className="p-6">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold mb-4">🏠 Lease Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 bg-gray-50 rounded">
                        <span className="text-gray-600">Property:</span>
                        <span className="font-semibold">456 King Ave, Toronto</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded">
                        <span className="text-gray-600">Unit:</span>
                        <span className="font-semibold">12A</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded">
                        <span className="text-gray-600">Lease Type:</span>
                        <span className="font-semibold">Protected Lease</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded">
                        <span className="text-gray-600">Lease Start:</span>
                        <span className="font-semibold">2024-06-01</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-4">💰 Financial Summary (YTD)</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 bg-gray-50 rounded">
                        <span className="text-gray-600">Total Rent Paid:</span>
                        <span className="font-semibold text-green-600">$4,800</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded">
                        <span className="text-gray-600">Total Utilities:</span>
                        <span className="font-semibold">$330</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded">
                        <span className="text-gray-600">Maintenance Costs:</span>
                        <span className="font-semibold">$50</span>
                      </div>
                      <div className="flex justify-between p-3 bg-indigo-50 rounded font-bold">
                        <span>Total Expenses:</span>
                        <span className="text-indigo-600">$5,180</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4">📋 Recent Activity</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {[
                      { date: "2026-02-14", action: "Maintenance request submitted" },
                      { date: "2026-02-10", action: "Maintenance request submitted" },
                      { date: "2026-02-05", action: "Maintenance completed: HVAC" },
                      { date: "2026-02-01", action: "Rent payment processed" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between p-2 border-b text-sm">
                        <span className="text-gray-600">{item.action}</span>
                        <span className="font-semibold text-gray-800">{item.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LEASES TAB */}
            {activeTab === "leases" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold">📑 Lease Agreements</h3>
                <div className="space-y-4">
                  <div className="border-2 border-indigo-200 rounded-lg p-6 bg-indigo-50">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-600 text-sm">Lease ID</p>
                        <p className="font-semibold">LEASE-456-12A</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Status</p>
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                          Active
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Start Date</p>
                        <p className="font-semibold">June 1, 2024</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">End Date</p>
                        <p className="font-semibold">May 31, 2027</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                        📥 Download PDF
                      </button>
                      <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                        👁️ View Details
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="font-semibold text-yellow-800">⚠️ Lease Renewal Notice</p>
                  <p className="text-yellow-700 text-sm mt-1">Your lease will expire on May 31, 2027. Contact the landlord 90 days before expiration to discuss renewal.</p>
                </div>
              </div>
            )}

            {/* OCCUPANTS TAB */}
            {activeTab === "occupants" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">👥 Occupants & Registered Inhabitants</h3>
                  <button
                    onClick={() => setShowAddOccupant(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm"
                  >
                    ➕ Add Occupant
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Relationship</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Registered</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {occupants.map((occ) => (
                        <tr key={occ.occupant_id} className="hover:bg-gray-50">
                          <td className="px-6 py-3 text-sm text-gray-900">{occ.name}</td>
                          <td className="px-6 py-3 text-sm text-gray-600">{occ.email}</td>
                          <td className="px-6 py-3 text-sm text-gray-600">{occ.phone}</td>
                          <td className="px-6 py-3 text-sm text-gray-600">{occ.relationshipToLeaseholder}</td>
                          <td className="px-6 py-3 text-sm">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                              {occ.status}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-600">{occ.registrationDate}</td>
                          <td className="px-6 py-3 text-sm flex gap-2">
                            <button className="text-blue-600 hover:text-blue-900 font-semibold text-xs">
                              Edit
                            </button>
                            <button
                              onClick={() => handleRemoveOccupant(occ.occupant_id)}
                              className="text-red-600 hover:text-red-900 font-semibold text-xs"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FINANCIALS TAB */}
            {activeTab === "financials" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold">💰 Financial Reports & Billing</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                    <p className="text-gray-700 text-sm">Current Balance</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">$0.00</p>
                    <p className="text-xs text-gray-600 mt-1">✅ All payments up to date</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                    <p className="text-gray-700 text-sm">Next Payment Due</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">March 1</p>
                    <p className="text-xs text-gray-600 mt-1">Amount: $2,400.00</p>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-bold mb-4">Monthly Expense Breakdown</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left">Month</th>
                          <th className="px-4 py-2 text-right">Rent</th>
                          <th className="px-4 py-2 text-right">Utilities</th>
                          <th className="px-4 py-2 text-right">Maintenance</th>
                          <th className="px-4 py-2 text-right">Other</th>
                          <th className="px-4 py-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {financialData.map((data, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-2">{data.month}</td>
                            <td className="px-4 py-2 text-right font-semibold">${data.rentPayment}</td>
                            <td className="px-4 py-2 text-right">${data.utilities}</td>
                            <td className="px-4 py-2 text-right">${data.maintenance}</td>
                            <td className="px-4 py-2 text-right">${data.other}</td>
                            <td className="px-4 py-2 text-right font-bold text-indigo-600">${data.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold">
                  📥 Download Financial Statement (PDF)
                </button>
              </div>
            )}

            {/* MAINTENANCE TAB */}
            {activeTab === "maintenance" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">🔧 Maintenance Requests</h3>
                  <button
                    onClick={() => setShowAddMaintenance(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm"
                  >
                    ➕ Submit Request
                  </button>
                </div>

                <div className="space-y-4">
                  {maintenanceRequests.map((request) => (
                    <div
                      key={request.id}
                      className={`border-l-4 rounded-lg p-4 ${
                        request.status === "pending"
                          ? "border-yellow-400 bg-yellow-50"
                          : request.status === "in_progress"
                          ? "border-blue-400 bg-blue-50"
                          : "border-green-400 bg-green-50"
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-600 text-sm">Unit</p>
                          <p className="font-semibold">{request.unitNumber}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Issue</p>
                          <p className="font-semibold">{request.description}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Priority</p>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              request.priority === "high"
                                ? "bg-red-100 text-red-800"
                                : request.priority === "medium"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {request.priority}
                          </span>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Status</p>
                          <select
                            value={request.status}
                            onChange={(e) => handleUpdateMaintenanceStatus(request.id, e.target.value as MaintenanceRequest["status"])}
                            className="px-2 py-1 border rounded text-sm font-semibold cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t text-xs text-gray-600">
                        Submitted: {request.submittedDate}
                        {request.completedDate && ` | Completed: ${request.completedDate}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DOCUMENTS TAB */}
            {activeTab === "documents" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold">📄 Documents & Agreements</h3>

                <div className="space-y-3">
                  {[
                    { name: "Lease Agreement", date: "2024-06-01", type: "PDF" },
                    { name: "Move-in Inspection Report", date: "2024-06-01", type: "PDF" },
                    { name: "Rent Payment Schedule", date: "2024-06-01", type: "PDF" },
                    { name: "Building Rules & Regulations", date: "2024-06-01", type: "PDF" },
                    { name: "Emergency Contact Procedures", date: "2024-06-01", type: "PDF" },
                  ].map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📄</span>
                        <div>
                          <p className="font-semibold">{doc.name}</p>
                          <p className="text-xs text-gray-600">{doc.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">{doc.type}</span>
                        <button className="text-indigo-600 hover:text-indigo-900 font-semibold">📥</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Occupant Modal */}
        {showAddOccupant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6">Register Occupant</h2>
              <form onSubmit={handleAddOccupant} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newOccupant.name}
                    onChange={(e) => setNewOccupant({ ...newOccupant, name: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newOccupant.email}
                    onChange={(e) => setNewOccupant({ ...newOccupant, email: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newOccupant.phone}
                    onChange={(e) => setNewOccupant({ ...newOccupant, phone: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship
                  </label>
                  <select
                    value={newOccupant.relationshipToLeaseholder}
                    onChange={(e) => setNewOccupant({ ...newOccupant, relationshipToLeaseholder: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Co-occupant">Co-occupant</option>
                    <option value="Family Member">Family Member</option>
                    <option value="Employee">Employee</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-6 border-t">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Register
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddOccupant(false)}
                    className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Maintenance Modal */}
        {showAddMaintenance && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6">Submit Maintenance Request</h2>
              <form onSubmit={handleAddMaintenance} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Number
                  </label>
                  <input
                    type="text"
                    value={newMaintenance.unitNumber}
                    disabled
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description of Issue *
                  </label>
                  <textarea
                    value={newMaintenance.description}
                    onChange={(e) => setNewMaintenance({ ...newMaintenance, description: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Describe the maintenance issue..."
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newMaintenance.priority}
                    onChange={(e) => setNewMaintenance({ ...newMaintenance, priority: e.target.value as any })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-6 border-t">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddMaintenance(false)}
                    className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
