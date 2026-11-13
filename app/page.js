import Link from "next/link";

// home page: links to every page in the project
export default function Home() {
  return (
    <div className="auth-box">
      <h1>RBAC Demo</h1>
      <p> Created By PHONE-MYINT-ARKAR </p>
      <ul>
        <li><Link href="/register">Register</Link></li>
        <li><Link href="/login">Login</Link></li>
        <li><Link href="/dashboard">Dashboard (members only)</Link></li>
      </ul>
    </div>
  );
}