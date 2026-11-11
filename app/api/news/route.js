import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requirePermission } from "@/lib/auth";

// GET /api/news — requires news:read
export async function GET(request) {
  const { error } = await requirePermission(request, "news:read");
  if (error) return error;

  const [rows] = await pool.query("SELECT * FROM news ORDER BY id DESC");
  return NextResponse.json(rows);
}

// POST /api/news — requires news:create
export async function POST(request) {
  const { error } = await requirePermission(request, "news:create");
  if (error) return error;

  const { title, content, category } = await request.json();

  if (!title || !content) {
    return NextResponse.json(
      { status: "error", message: "title and content are required" },
      { status: 400 }
    );
  }

  const [result] = await pool.query(
    "INSERT INTO news (title, content, category) VALUES (?, ?, ?)",
    [title, content, category ?? "general"]
  );

  return NextResponse.json({ status: "ok", id: result.insertId }, { status: 201 });
}