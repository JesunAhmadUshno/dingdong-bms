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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      {/* Animated gradient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Branding & Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 w-fit">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-cyan-400">AI-Powered Management</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">
                  Smart Building
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Management
                </span>
              </h1>

              <p className="text-lg text-gray-400 max-w-md">
                Streamline operations, enhance communication, and maximize efficiency with DingDong's intelligent building management platform.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              {[
                { icon: "✓", text: "Real-time occupancy tracking" },
                { icon: "✓", text: "Automated maintenance requests" },
                { icon: "✓", text: "Community engagement tools" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-cyan-400 font-bold text-lg">{item.icon}</span>
                  <span className="text-gray-300">{item.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 pt-4">
              <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/20">
                Explore Now
              </button>
              <button className="px-8 py-3 border border-gray-700 hover:border-cyan-500/50 text-gray-300 hover:text-cyan-400 font-semibold rounded-lg transition-all">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Column: Login Card */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl"></div>

            {/* Card */}
            <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-3xl p-8 backdrop-blur-2xl">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

              <div className="relative space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                  <p className="text-gray-400 text-sm">Sign in to your account to access the dashboard</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="your_username"
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                      />
                      <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                      />
                      <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-red-400 text-sm font-medium">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/20"
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
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gradient-to-br from-gray-800/80 to-gray-900/80 text-gray-500">Demo Accounts</span>
                  </div>
                </div>

                {/* Demo Accounts */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {[
                    { name: "John Doe (Renter)", user: "john_renter", pass: "password123" },
                    { name: "Building Manager", user: "admin_manager", pass: "asade123" },
                    { name: "Social Housing Manager", user: "social_housing_mgr", pass: "social123" },
                    { name: "System Admin", user: "system_admin", pass: "admin123" },
                    { name: "Corporate Manager", user: "corporate_mgr", pass: "corporate456" },
                  ].map((account, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setUsername(account.user);
                        setPassword(account.pass);
                      }}
                      className="w-full p-3 rounded-lg bg-gray-900/50 border border-gray-700/50 hover:border-cyan-500/30 hover:bg-gray-900/70 transition-all text-left group"
                    >
                      <p className="text-xs font-semibold text-gray-400 group-hover:text-cyan-400 transition-colors">
                        {account.name}
                      </p>
                      <p className="text-xs text-gray-600 group-hover:text-gray-500 font-mono">
                        {account.user} / {account.pass}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 py-6 text-center text-sm text-gray-600">
        <p>© 2024 DingDong Building Management System. All rights reserved.</p>
      </div>
    </div>
  );
}
