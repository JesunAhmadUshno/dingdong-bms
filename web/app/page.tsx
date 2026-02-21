"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { USERS } from "@/lib/database";

export default function Home() {
  const router = useRouter();
  const { user, login, logout, isAuthenticated, authError } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(username, password);
      if (!success) {
        if (authError) {
          setError(authError);
        } else {
          const foundUser = USERS.find(u => u.username === username);
          if (!foundUser) {
            setError("User not found. Check the username.");
          } else if (foundUser.password !== password) {
            setError("Invalid password. Try again.");
          } else if (foundUser.status !== "verified") {
            setError("User account not verified.");
          } else {
            setError("Invalid username or password");
          }
        }
        setLoading(false);
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role.role_name) {
      const managerRoles = [
        "BUILDING_MANAGER",
        "SOCIAL_HOUSING_MANAGER",
        "CORPORATE_OWNER",
        "ADMIN",
      ];
      
      if (managerRoles.includes(user.role.role_name)) {
        router.push("/portal/manager");
      } else {
        const rolePath = user.role.role_name.toLowerCase();
        router.push(`/portal/${rolePath}`);
      }
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    setUsername("");
    setPassword("");
    setError("");
  };

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        {/* Header */}
        <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center font-bold text-white">
                DB
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  DingDong
                </h1>
                <p className="text-xs text-gray-400">Building Management</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                  {user.full_name?.[0]}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-white">{user.full_name}</p>
                  <p className="text-xs text-gray-400">{user.role.role_name.replace(/_/g, " ")}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Welcome Card */}
            <div className="md:col-span-2 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-lg">
              <div className="space-y-6">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">Welcome back, {user.full_name.split(" ")[0]}! 👋</h2>
                  <p className="text-gray-400">Access your building management dashboard and stay connected with your community.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-xl p-4 hover:border-cyan-500/40 transition-all">
                    <p className="text-sm text-gray-400 mb-1">Your Role</p>
                    <p className="text-lg font-bold text-cyan-400">{user.role.role_name.replace(/_/g, " ")}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-xl p-4 hover:border-blue-500/40 transition-all">
                    <p className="text-sm text-gray-400 mb-1">Account Status</p>
                    <p className="text-lg font-bold text-blue-400">Verified ✓</p>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/portal/manager")}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/20"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-lg">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-6">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mt-1"></div>
                  <div>
                    <p className="text-xs text-gray-500">Last Login</p>
                    <p className="text-sm font-semibold text-white">Today at 2:30 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mt-1"></div>
                  <div>
                    <p className="text-xs text-gray-500">Notifications</p>
                    <p className="text-sm font-semibold text-white">3 New Updates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mt-1"></div>
                  <div>
                    <p className="text-xs text-gray-500">Access Level</p>
                    <p className="text-sm font-semibold text-white">Full Permissions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              { icon: "📊", title: "Analytics", desc: "View detailed building metrics and occupancy rates" },
              { icon: "🔧", title: "Maintenance", desc: "Manage work orders and maintenance requests" },
              { icon: "👥", title: "Tenants", desc: "Manage tenant information and communications" },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-lg hover:border-gray-600/50 transition-all hover:shadow-lg hover:shadow-cyan-500/5"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{feature.desc}</p>
                <a href="#" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-2">
                  Explore → 
                </a>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-2xl">
          {/* Logo & Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg font-bold text-white mb-3">
              DB
            </div>
            <h1 className="text-2xl font-bold text-white">DingDong</h1>
            <p className="text-slate-400 text-sm">Building Management System</p>
          </div>

          {/* Welcome Text */}
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-white mb-1">Welcome Back</h2>
            <p className="text-slate-400 text-sm">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your_username"
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all text-sm"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold rounded-lg transition-all text-sm mt-2"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 border-t border-slate-700"></div>
            <span className="text-xs text-slate-500 font-medium">Demo Accounts</span>
            <div className="flex-1 border-t border-slate-700"></div>
          </div>

          {/* Demo Accounts */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {[
              { name: "🏠 Building Manager", user: "admin_manager", pass: "asade123" },
              { name: "🏘️ Social Housing Manager", user: "social_housing_mgr", pass: "social123" },
              { name: "🔐 System Admin", user: "system_admin", pass: "admin123" },
              { name: "🏢 Corporate Manager", user: "corporate_mgr", pass: "corporate456" },
              { name: "👤 Renter Account", user: "john_renter", pass: "password123" },
            ].map((account, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setUsername(account.user);
                  setPassword(account.pass);
                }}
                className="w-full p-2.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg transition-all text-left text-xs"
              >
                <p className="font-semibold text-slate-300">{account.name}</p>
                <p className="text-slate-500 font-mono text-xs mt-0.5">{account.user} / {account.pass}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">© 2024 DingDong. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
