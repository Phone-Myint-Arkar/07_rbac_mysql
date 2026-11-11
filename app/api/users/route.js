import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requirePermission } from "@/lib/auth";

// GET /api/users — list all users, requires user:manage
export async function GET(request) {
  const { error } = await requirePermission(request, "user:manage");
  if (error) return error;

  // select only the needed columns; never send the password hash out
  const [rows] = await pool.query("SELECT id, email, fullname, role FROM users ORDER BY id");
  return NextResponse.json(rows);
}