import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requirePermission } from "@/lib/auth";

// GET /api/news/{id} — requires news:read
export async function GET(request, { params }) {
  const { error } = await requirePermission(request, "news:read");
  if (error) return error;

  const { id } = await params;
  const [rows] = await pool.query("SELECT * FROM news WHERE id = ?", [id]);

  if (rows.length === 0) {
    return NextResponse.json(
      { status: "error", message: "News not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(rows[0]);
}

// PUT /api/news/{id} — requires news:update
export async function PUT(request, { params }) {
  const { error } = await requirePermission(request, "news:update");
  if (error) return error;

  const { id } = await params;
  const { title, content, category } = await request.json();

  await pool.query(
    "UPDATE news SET title = ?, content = ?, category = ? WHERE id = ?",
    [title, content, category, id]
  );

  return NextResponse.json({ status: "ok" });
}

// DELETE /api/news/{id} — requires news:delete
export async function DELETE(request, { params }) {
  const { error } = await requirePermission(request, "news:delete");
  if (error) return error;

  const { id } = await params;
  await pool.query("DELETE FROM news WHERE id = ?", [id]);
  return NextResponse.json({ status: "ok" });
}