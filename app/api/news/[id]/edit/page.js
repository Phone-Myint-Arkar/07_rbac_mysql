"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// news categories, must match the ENUM of the category column
const CATEGORIES = ["general", "exam", "event"];

export default function EditNewsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("general");
  const [content, setContent] = useState("");

  // load the current post into the form
  useEffect(() => {
    fetch(`/api/news/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setTitle(data.title);
        setCategory(data.category);
        setContent(data.content);
      });
  }, [id]);

  // send PUT to save, then go back to the list
  const handleUpdate = async (event) => {
    event.preventDefault();
    await fetch(`/api/news/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, content }),
    });
    router.push("/news");
  };

  return (
    <div className="auth-box">
      <h1>Edit News</h1>
      <form onSubmit={handleUpdate}>
        <input value={title} onChange={(event) => setTitle(event.target.value)} />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          {CATEGORIES.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={5}
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}