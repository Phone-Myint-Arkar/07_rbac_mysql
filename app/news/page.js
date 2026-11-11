"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NewsCard from "@/app/components/NewsCard";
import { can } from "@/lib/rbac";

// news categories, must match the ENUM of the category column
const CATEGORIES = ["general", "exam", "event"];

export default function NewsPage() {
  const [user, setUser] = useState(null);
  const [news, setNews] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("general");
  const [content, setContent] = useState("");

  // load the news list from the API
  const loadNews = () => {
    fetch("/api/news")
      .then((response) => response.json())
      .then((data) => setNews(data));
  };

  // load the user (to know the role) and the news list when the page opens
  useEffect(() => {
    fetch("/api/me")
      .then((response) => response.json())
      .then((data) => setUser(data));
    loadNews();
  }, []);

  // send POST to add a post, then reload the list
  const handleCreate = async (event) => {
    event.preventDefault();
    await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, content }),
    });
    setTitle("");
    setCategory("general");
    setContent("");
    loadNews();
  };

  // send DELETE, then reload the list
  const handleDelete = async (id) => {
    if (!confirm("Delete this news?")) return;
    await fetch(`/api/news/${id}`, { method: "DELETE" });
    loadNews();
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="page">
      <Link href="/dashboard">← Dashboard</Link>
      <h1>Faculty News</h1>
      <p>
        Logged in as {user.fullname} <span className="role">{user.role}</span>
      </p>

      {/* add-news form, shown only to roles with news:create */}
      {can(user.role, "news:create") && (
        <form onSubmit={handleCreate} className="news-form">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Title"
            required
          />
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {CATEGORIES.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Content"
            rows={3}
            required
          />
          <button type="submit">Post</button>
        </form>
      )}

      <div className="news-list">
        {news.map((item) => (
          <NewsCard
            key={item.id}
            item={item}
            canEdit={can(user.role, "news:update")}
            canDelete={can(user.role, "news:delete")}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}