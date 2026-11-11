"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { can } from "@/lib/rbac";

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  // load the logged-in user from the API
  useEffect(() => {
    fetch("/api/me")
      .then((response) => response.json())
      .then((data) => setUser(data));
  }, []);

  // let the server delete the cookie, then go to login
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login"; // full reload clears the cached Dashboard
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="auth-box">
      <h1>Dashboard</h1>
      <p>Welcome, {user.fullname}</p>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
            <p>
        Role: <span className="role">{user.role}</span>
      </p>
      <ul>
        <li><Link href="/news">News</Link></li>
        {/* show the Admin link only to roles with user:manage */}
        {can(user.role, "user:manage") && (
          <li><Link href="/admin/users">Manage users</Link></li>
        )}
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
