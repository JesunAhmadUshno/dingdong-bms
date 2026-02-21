"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { updateUserProfile, getUserById } from "@/lib/database";
import type { User } from "@/lib/database";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    // Load user data
    setFormData({
      email: user.email || "",
      phone: user.phone || "",
      password: "",
      confirmPassword: "",
    });
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Validate
      if (formData.password && formData.password !== formData.confirmPassword) {
        setMessage("❌ Passwords do not match");
        setLoading(false);
        return;
      }

      if (!user?.user_id) {
        setMessage("❌ User not found");
        setLoading(false);
        return;
      }

      // Update profile
      const updates: { email?: string; phone?: string; password?: string } = {
        email: formData.email,
        phone: formData.phone,
      };

      if (formData.password) {
        updates.password = formData.password;
      }

      const updated = updateUserProfile(user.user_id, updates);

      if (updated) {
        setMessage("✅ Profile updated successfully");
        setEditMode(false);
        setFormData({
          email: updated.email,
          phone: updated.phone,
          password: "",
          confirmPassword: "",
        });
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to update profile");
      }
    } catch (error) {
      setMessage("❌ Error: " + String(error));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      email: user?.email || "",
      phone: user?.phone || "",
      password: "",
      confirmPassword: "",
    });
    setMessage("");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.back()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              Back
            </button>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Messages */}
        {message && (
          <div
            className={`rounded-lg shadow p-4 mb-6 border-l-4 ${
              message.includes("✅")
                ? "bg-green-50 border-green-500"
                : "bg-red-50 border-red-500"
            }`}
          >
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Immutable Info Section */}
          <div className="p-8 border-b bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Account Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* User ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User ID
                </label>
                <div className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-gray-900">
                  {user.user_id}
                </div>
                <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-gray-900">
                  {user.username}
                </div>
                <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-gray-900">
                  {user.full_name}
                </div>
                <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
              </div>

              {/* SIN/BN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SIN/BN
                </label>
                <div className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-gray-900">
                  {user.legal_sin_or_bn || "Not provided"}
                </div>
                <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <div className="px-4 py-2 bg-blue-50 border-2 border-blue-300 rounded-lg text-gray-900">
                  {user.role.role_name}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {user.role.description}
                </p>
              </div>

              {/* Account Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Status
                </label>
                <div
                  className={`px-4 py-2 rounded-lg text-gray-900 border-2 ${
                    user.status === "verified"
                      ? "bg-green-50 border-green-300"
                      : "bg-yellow-50 border-yellow-300"
                  }`}
                >
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </div>
              </div>
            </div>
          </div>

          {/* Editable Info Section */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-6 pb-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                Editable Information
              </h2>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Edit
                </button>
              )}
            </div>

            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password (leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter new password or leave blank"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>

                {/* Confirm Password */}
                {formData.password && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      placeholder="Confirm your new password"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    />
                  </div>
                )}

                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 transition"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Display Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="px-4 py-2 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900">
                    {user.email}
                  </div>
                </div>

                {/* Display Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="px-4 py-2 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900">
                    {user.phone}
                  </div>
                </div>

                {/* Profile Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Type
                  </label>
                  <div className="px-4 py-2 bg-purple-50 border-2 border-purple-300 rounded-lg text-gray-900">
                    {user.profile_type}
                  </div>
                </div>

                {/* Creation Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <div className="px-4 py-2 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900">
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
