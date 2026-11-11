"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PERMISSIONS } from "@/lib/rbac";

// all role names, taken from PERMISSIONS so they are not repeated
const ROLES = Object.keys(PERMISSIONS);

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  // load the user list from the API
  const loadUsers = () => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // send PUT to change the role, then reload the list
  const handleRoleChange = async (id, role) => {
    const response = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await response.json();
    setMessage(response.ok ? "Role updated" : data.message);
    loadUsers();
  };

  return (
    <div className="page">
      <Link href="/dashboard">← Dashboard</Link>
      <h1>Manage Users</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.fullname}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(event) => handleRoleChange(user.id, event.target.value)}
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {message && <p>{message}</p>}
    </div>
  );
}