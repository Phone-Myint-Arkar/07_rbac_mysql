import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { PERMISSIONS } from "@/lib/rbac";

// PUT /api/users/{id} — change a user's role, requires user:manage
export async function PUT(request, { params }) {
  const { user, error } = await requirePermission(request, "user:manage");
  if (error) return error;

  const { id } = await params;
  const { role } = await request.json();

  // accept only roles that exist in PERMISSIONS
  if (!Object.keys(PERMISSIONS).includes(role)) {
    return NextResponse.json(
      { status: "error", message: "Invalid role" },
      { status: 400 }
    );
  }

  // stop an admin from demoting themselves and leaving no admin in the system
  if (Number(id) === user.id) {
    return NextResponse.json(
      { status: "error", message: "You cannot change your own role" },
      { status: 400 }
    );
  }

  await pool.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
  return NextResponse.json({ status: "ok" });
}