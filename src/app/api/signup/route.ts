import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

const ALLOWED_ROLES = ["customer", "artisan"] as const;

export async function POST(req: Request) {
  const { email, password, role } = await req.json();

  if (!email || !password || !ALLOWED_ROLES.includes(role)) {
    return NextResponse.json(
      { error: "Invalid signup data" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await hash(password, 10);

  await prisma.user.create({
    data: { email, password: hashedPassword, role },
  });

  return NextResponse.json({ success: true });
}
