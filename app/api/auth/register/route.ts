import { sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    // Generate verification code
    const verifyToken = crypto.randomInt(100000, 999999).toString();
    const verifyTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verifyToken,
        verifyTokenExpiry,
        emailVerified: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // Send verification email
    await sendVerificationEmail(email, verifyToken);

    return NextResponse.json(
      {
        user,
        message: "Verification code sent to your email",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
