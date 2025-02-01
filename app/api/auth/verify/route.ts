import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
        verifyToken: code,
        verifyTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 },
      );
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verifyToken: null,
        verifyTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
