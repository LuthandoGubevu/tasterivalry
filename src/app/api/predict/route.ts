import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { userId, matchId, scoreA, scoreB } = await req.json();

  if (!userId || !matchId || scoreA == null || scoreB == null) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (scoreA < 0 || scoreA > 20 || scoreB < 0 || scoreB > 20) {
    return NextResponse.json({ error: "Scores must be between 0 and 20" }, { status: 400 });
  }

  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match || !match.isActive) {
    return NextResponse.json({ error: "Match is not active" }, { status: 400 });
  }

  const prediction = await prisma.prediction.create({
    data: { userId, matchId, scoreA: Number(scoreA), scoreB: Number(scoreB) },
  });

  return NextResponse.json({ predictionId: prediction.id, message: "Prediction saved!" });
}
