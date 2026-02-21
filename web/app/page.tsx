"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { USERS } from "@/lib/database";

// Mock Social Feed Data
const FEED_POSTS = [
  {
    id: 1,
    author: "Building Management",
    role: "Admin",
    time: "2h ago",
    content: "📢 Elevator B maintenance is complete. Both elevators are now fully operational. Thank you for your patience!",
    likes: 12,
    comments: 0,
  },
  {
    id: 2,
    author: "Sarah Jenkins",
    role: "Resident",
    time: "4h ago",
    content: "🧘‍♀️ Yoga by the pool tonight at 6 PM! Everyone is welcome. Bring your own mat.",
    likes: 24,
    comments: 5,
  },
  {
    id: 3,
    author: "System Alert",
    role: "Bot",
    time: "6h ago",
    content: "⚡ Energy Saving Mode active. Hallway lights dimmed to 50% due to high natural light levels.",
    likes: 8,
    comments: 0,
  },
];

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
        // Use the error from auth context first, then fall back to debugging
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
      } else {
        // Wait for redirect via useEffect
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  // Redirect when logged in
  useEffect(() => {
    if (isAuthenticated && user?.role.role_name) {
      const managerRoles = [
        "BUILDING_MANAGER",
        "SOCIAL_HOUSING_MANAGER",
        "CORPORATE_OWNER",
        "ADMIN",
      ];
      
      // Managers go to /portal/manager (role-based dashboard)
      if (managerRoles.includes(user.role.role_name)) {
        router.push("/portal/manager");
      } else {
        // Other roles go to /portal/{role}
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-[family-name:var(--font-geist-sans)]">
      
      {/* Header / Navbar */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">DingDong 🔔</h1>
          {isAuthenticated && user && (
             <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">Welcome, <strong>{user.full_name}</strong></span>
                <span className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded-full font-semibold">{user.role.role_name}</span>
                <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700">Sign Out</button>
             </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Social Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
             <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl">👤</div>
                <input 
                  type="text" 
                  placeholder={isAuthenticated ? "Share an update with your neighbors..." : "Log in to share updates..."} 
                  className="flex-1 bg-gray-50 dark:bg-gray-900 border-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  disabled={!isAuthenticated}
                />
             </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Community Pulse</h2>
          
          {FEED_POSTS.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                    ${post.role === 'Admin' ? 'bg-red-500' : post.role === 'Bot' ? 'bg-blue-500' : 'bg-green-500'}`}>
                    {post.author[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{post.author}</h3>
                    <p className="text-xs text-gray-500">{post.role} • {post.time}</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {post.content}
              </p>
              <div className="flex gap-6 text-gray-500 text-sm border-t pt-4 dark:border-gray-700">
                <button className="flex items-center gap-2 hover:text-blue-500">
                  <span>❤️</span> {post.likes} Likes
                </button>
                <button className="flex items-center gap-2 hover:text-blue-500">
                  <span>💬</span> {post.comments} Comments
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Login / Dashboard */}
        <div className="lg:col-span-1">
          {!isAuthenticated ? (
            /* Login Panel */
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 sticky top-24">
              <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Resident Portal</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400 text-sm">Log in with your credentials to manage your home and building.</p>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                   <label className="block text-sm font-medium mb-1">Username</label>
                   <input
                     type="text"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     placeholder="Enter username"
                     className="w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                   />
                </div>

                <div>
                   <label className="block text-sm font-medium mb-1">Password</label>
                   <input
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="Enter password"
                     className="w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                   />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 font-medium"
                >
                  {loading ? "Logging in..." : "Sign In"}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t dark:border-gray-700">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Demo Accounts</p>
                 <div className="space-y-2 text-xs">
                    {USERS.map((u) => (
                      <div key={u.user_id} className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <p><strong>{u.full_name}</strong> ({u.role_id === 1 ? 'Renter' : u.role_id === 2 ? 'Leaseholder' : u.role_id === 3 ? 'Owner' : 'Manager'})</p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {u.username} / {u.password}
                        </p>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          ) : (
            /* Authenticated Panel */
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-t-4 border-blue-500 sticky top-24">
               <h2 className="text-xl font-bold mb-4">Dashboard</h2>
               <div className="space-y-3">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                    <p className="font-bold text-lg">{user?.role.role_name}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Apartment</p>
                    <p className="font-bold">Unit {user?.full_name ? '4B' : 'N/A'}</p>
                  </div>
                  <button
                    onClick={() => router.push(`/portal/${user?.role.role_name.toLowerCase()}`)}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-4"
                  >
                    Go to Dashboard
                  </button>
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
