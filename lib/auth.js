import { NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { can } from "@/lib/rbac";

// jose needs the secret as bytes, not a plain string
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// create a signed token that expires in 1 hour
export function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
}

// return the payload if the token is valid, otherwise null
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null; // no token, tampered token, or expired
  }
}

export async function requirePermission(request, permission) {
  const user = await verifyToken(request.cookies.get("token")?.value);

  if (!user) {
    return {
      error: NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!can(user.role, permission)) {
    return {
      error: NextResponse.json({ status: "error", message: "Forbidden" }, { status: 403 }),
    };
  }

  return { user };
}