"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // send the form data to the API; on success go to login
  const handleRegister = async (event) => {
    event.preventDefault();
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullname, email, password }),
    });
    const data = await response.json();

    if (response.ok) {
      router.push("/login");
    } else {
      setMessage(data.message); // e.g. "Email already registered"
    }
  };

  return (
    <div className="auth-box">
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input
          value={fullname}
          onChange={(event) => setFullname(event.target.value)}
          placeholder="Full name"
          required
        />
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
          minLength={6}
          required
        />
        <button type="submit">Register</button>
      </form>
      {message && <p className="error">{message}</p>}
      <p>
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </div>
  );
}