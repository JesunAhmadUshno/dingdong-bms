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
                TM
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  TriMatrixLab
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated gradient background - Multiple for depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Branding & Info */}
          <div className="space-y-12 lg:pr-8">
            {/* Logo & Badge */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-cyan-500/20">
                TM
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  TriMatrixLab
                </h1>
                <p className="text-sm text-gray-400 font-medium">Smart Building Management</p>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 w-fit backdrop-blur-sm">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-cyan-300">AI-Powered Intelligence</span>
              </div>

              <div className="space-y-3">
                <h2 className="text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white via-cyan-100 to-blue-300 bg-clip-text text-transparent">
                    Smart
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Building
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Solutions
                  </span>
                </h2>
              </div>

              <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
                Streamline operations, enhance communication, and maximize efficiency with TriMatrixLab's intelligent platform for modern building management.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4 pt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Why Choose TriMatrixLab</p>
              <div className="space-y-3">
                {[
                  { icon: "⚡", text: "Real-time occupancy tracking & analytics" },
                  { icon: "🔧", text: "Automated maintenance & work order management" },
                  { icon: "👥", text: "Seamless tenant & community engagement" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 group">
                    <span className="text-2xl mt-1 group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="text-gray-300 font-medium pt-1">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 pt-4">
              <button className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/30 inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Get Started Now
              </button>
              <button className="px-8 py-3.5 border-2 border-cyan-500/40 hover:border-cyan-500/70 text-cyan-300 hover:text-cyan-200 font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm hover:bg-cyan-500/10">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Column: Login Card */}
          <div className="relative lg:h-full flex items-stretch">
            {/* Animated Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-3xl blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-3xl blur-2xl opacity-40" style={{ animationDelay: "1s" }}></div>

            {/* Card Container */}
            <div className="relative w-full bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60 border border-slate-700/50 rounded-3xl p-10 sm:p-16 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-500/25 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-blue-500/15 to-transparent rounded-full blur-3xl"></div>

              {/* Card Content */}
              <div className="relative space-y-10">
                {/* Header */}
                <div className="space-y-3 pb-4">
                  <h2 className="text-4xl font-bold text-white">Welcome</h2>
                  <p className="text-gray-400 text-base leading-relaxed">Sign in to access your building management dashboard</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-7">
                  {/* Username Field */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-300">Username</label>
                    <div className="relative group">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="your_username"
                        className="w-full px-6 py-4.5 bg-slate-900/50 border border-slate-700/60 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 backdrop-blur-sm text-base"
                      />
                      <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-300">Password</label>
                    <div className="relative group">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-6 py-4.5 bg-slate-900/50 border border-slate-700/60 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 backdrop-blur-sm text-base"
                      />
                      <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-500/15 border border-red-500/30 rounded-xl backdrop-blur-sm">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-red-300 text-sm font-medium">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4.5 bg-gradient-to-r from-cyan-500 via-cyan-500 to-blue-600 hover:from-cyan-600 hover:via-cyan-600 hover:to-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/40 shadow-lg shadow-cyan-500/20 mt-2"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700/50"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-4 bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60 text-slate-500 font-medium">Quick Access</span>
                  </div>
                </div>

                {/* Demo Accounts */}
                <div className="space-y-2.5 max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-2">Demo Credentials</p>
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
                      className="w-full p-4 rounded-2xl bg-slate-900/40 border border-slate-700/40 hover:border-cyan-500/50 hover:bg-slate-900/60 transition-all duration-300 text-left group backdrop-blur-sm"
                    >
                      <p className="text-sm font-semibold text-slate-300 group-hover:text-cyan-300 transition-colors">{account.name}</p>
                      <p className="text-xs text-slate-600 group-hover:text-slate-500 font-mono mt-1.5">{account.user} / {account.pass}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 py-8 text-center border-t border-slate-700/30 bg-gradient-to-t from-slate-950/80 to-transparent">
        <p className="text-sm text-slate-500 font-medium">© 2024 TriMatrixLab Building Management System. All rights reserved.</p>
      </div>
    </div>
  );
}
