import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req.headers.get("cookie"));

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  // SECURITY.md: استجابات الـ API لا تحوي حقولاً حساسة (لا passwordHash، لا معرّفات داخلية).
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatarLetter: user.avatarLetter,
      role: user.role,
    },
  });
}
