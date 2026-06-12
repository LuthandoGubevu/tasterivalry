import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { name, email, phone } = await req.json();

  if (!name || !email || !phone) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const match = await prisma.match.findFirst({ where: { isActive: true } });
  if (!match) {
    return NextResponse.json({ error: "No active match found" }, { status: 404 });
  }

  const existingPrediction = await prisma.prediction.findFirst({
    where: { matchId: match.id, user: { email } },
  });
  if (existingPrediction) {
    return NextResponse.json(
      { error: "You have already submitted a prediction for this match" },
      { status: 409 }
    );
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: { name, phone },
    create: { name, email, phone },
  });

  return NextResponse.json({
    userId: user.id,
    matchId: match.id,
    teamA: match.teamA,
    teamB: match.teamB,
    scheduledAt: match.scheduledAt,
  });
}
