"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // send email and password; on success the API sets the token cookie
  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const responseText = await response.text();
      let data;

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error("The login service returned an invalid response. Check the server logs.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // full page load so proxy.js checks the cookie just received
      window.location.href = "/dashboard";
    } catch (loginError) {
      setMessage(loginError.message || "Unable to log in. Please try again.");
    }
  };

  return (
    <div className="auth-box">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p className="error">{message}</p>}
      <p>
        No account yet? <Link href="/register">Register</Link>
      </p>
    </div>
  );
}
