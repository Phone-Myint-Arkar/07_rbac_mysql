import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";
import { signToken } from "@/lib/auth";

// POST /api/login — check the password, then set the token cookie
export async function POST(request) {
  let credentials;
  try {
    credentials = await request.json();
  } catch {
    return NextResponse.json(
      { status: "error", message: "Request body must be valid JSON" },
      { status: 400 }
    );
  }

  const { email, password } = credentials ?? {};

  if (!email || !password) {
    return NextResponse.json(
      { status: "error", message: "email and password are required" },
      { status: 400 }
    );
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];

  // use the same message for an unknown email and a wrong password
  // so this form cannot be used to discover which emails exist
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { status: "error", message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await signToken({
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      role: user.role,
    });

    const response = NextResponse.json({ status: "ok" });

  // httpOnly: JavaScript on the page cannot read this cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60, // 1 hour, same as the token lifetime
    });

    return response;
  } catch (error) {
    console.error("Login request failed:", error);
    return NextResponse.json(
      { status: "error", message: "Unable to log in right now. Please try again." },
      { status: 500 }
    );
  }
}
