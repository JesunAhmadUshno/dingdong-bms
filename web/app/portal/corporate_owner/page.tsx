"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getPropertyById,
  ROLES,
} from "@/lib/database";
import type { User } from "@/lib/database";

export default function CorporateOwnerDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [staff, setStaff] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [properties, setProperties] = useState<any[]>([]);
  const [formData, setFormData] = useState<{
    username: string;
    password: string;
    email: string;
    full_name: string;
    phone: string;
    legal_sin_or_bn: string;
    role_id: number;
    profile_type: "Individual" | "Corporate" | "NGO" | "Government";
    status: "active" | "inactive" | "verified" | "pending";
  }>({
    username: "",
    password: "",
    email: "",
    full_name: "",
    phone: "",
    legal_sin_or_bn: "",
    role_id: 8,
    profile_type: "Individual",
    status: "verified",
  });

  // Redirect if not corporate owner
  useEffect(() => {
    if (user && user.role.role_id !== 4) {
      router.push("/");
    }
  }, [user, router]);

  // Load staff and properties
  useEffect(() => {
    const allUsers = getAllUsers();
    setAllUsers(allUsers);
    
    // Get corporate owner's staff (typically BUILDING_MANAGER and other staff roles)
    const corpStaff = allUsers.filter(
      (u) => u.role_id === 8 || u.role_id === 9 // BUILDING_MANAGER, SUPPORT_SERVICES
    );
    setStaff(corpStaff);

    // Load properties
    if (user && user.properties && user.properties.length > 0) {
      const props = user.properties.map((id) => getPropertyById(id)).filter(Boolean);
      setProperties(props);
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "role_id" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (editingStaff) {
        // Update staff
        const updated = updateUser(editingStaff.user_id, formData);
        if (updated) {
          setStaff(
            getAllUsers().filter((u) => u.role_id === 8 || u.role_id === 9)
          );
          setMessage("✅ Staff member updated successfully");
          setEditingStaff(null);
        }
      } else {
        // Create new staff member
        const newStaff = createUser({
          ...formData,
          properties: user?.properties || [],
        });
        setStaff(
          getAllUsers().filter((u) => u.role_id === 8 || u.role_id === 9)
        );
        setMessage("✅ Staff member added successfully");
      }

      resetForm();
      setTimeout(() => setShowForm(false), 1000);
    } catch (error) {
      setMessage("❌ Error: " + String(error));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s: User) => {
    setEditingStaff(s);
    setFormData({
      username: s.username,
      password: s.password,
      email: s.email,
      full_name: s.full_name,
      phone: s.phone,
      legal_sin_or_bn: s.legal_sin_or_bn || "",
      role_id: s.role_id,
      profile_type: s.profile_type,
      status: s.status,
    });
    setShowForm(true);
  };

  const handleDelete = (staff_id: number) => {
    if (confirm("Are you sure you want to remove this staff member?")) {
      deleteUser(staff_id);
      setStaff(
        getAllUsers().filter((u) => u.role_id === 8 || u.role_id === 9)
      );
      setMessage("✅ Staff member removed successfully");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      email: "",
      full_name: "",
      phone: "",
      legal_sin_or_bn: "",
      role_id: 8,
      profile_type: "Individual",
      status: "verified",
    });
    setEditingStaff(null);
  };

  const getRoleName = (role_id: number) => {
    return ROLES.find((r) => r.role_id === role_id)?.role_name || "Unknown";
  };

  if (!user || user.role.role_id !== 4) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">
            Corporate owner portal is for registered corporate owners only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Corporate Management
            </h1>
            <p className="text-gray-600 mt-1">Welcome, {user.full_name}</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/portal/profile"
              className="text-blue-600 hover:text-blue-800 px-4 py-2 rounded-lg font-semibold"
            >
              My Profile
            </Link>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Staff</p>
            <p className="text-3xl font-bold text-blue-600">{staff.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Properties Managed</p>
            <p className="text-3xl font-bold text-green-600">
              {user.properties ? user.properties.length : 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Active Staff</p>
            <p className="text-3xl font-bold text-yellow-600">
              {staff.filter((s) => s.status === "verified" || s.status === "active").length}
            </p>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="bg-white rounded-lg shadow p-4 mb-6 border-l-4 border-green-500">
            {message}
          </div>
        )}

        {/* Properties Section */}
        {properties.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Managed Properties</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {properties.map((prop) => (
                <div key={prop.property_id} className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg">{prop.address}</h3>
                  <p className="text-gray-600 text-sm mt-1">{prop.legal_description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Type: {prop.property_type_id}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Staff Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            + Add Staff Member
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                {editingStaff ? "Edit Staff Member" : "Add Staff Member"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="staff@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    placeholder="John Doe"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="416-555-0000"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SIN
                  </label>
                  <input
                    type="text"
                    name="legal_sin_or_bn"
                    placeholder="123-45-6789"
                    value={formData.legal_sin_or_bn}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value={8}>Building Manager</option>
                    <option value={9}>Support Services</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 transition"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Staff List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Staff Management</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {staff.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No staff members added yet
                    </td>
                  </tr>
                ) : (
                  staff.map((s) => (
                    <tr key={s.user_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{s.user_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{s.username}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{s.full_name}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                          {getRoleName(s.role_id)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            s.status === "verified" || s.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button
                          onClick={() => handleEdit(s)}
                          className="text-blue-600 hover:text-blue-900 font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s.user_id)}
                          className="text-red-600 hover:text-red-900 font-semibold"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
