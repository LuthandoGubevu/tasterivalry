import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateVoucherCode } from "@/lib/vouchers";

export async function POST(req: NextRequest) {
  const { matchId, finalScoreA, finalScoreB, adminSecret } = await req.json();

  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!matchId || finalScoreA == null || finalScoreB == null) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await prisma.match.update({
    where: { id: matchId },
    data: {
      finalScoreA: Number(finalScoreA),
      finalScoreB: Number(finalScoreB),
      isActive: false,
      settledAt: new Date(),
    },
  });

  const winners = await prisma.prediction.findMany({
    where: {
      matchId,
      scoreA: Number(finalScoreA),
      scoreB: Number(finalScoreB),
    },
    include: { user: true },
  });

  await prisma.prediction.updateMany({
    where: { matchId, scoreA: Number(finalScoreA), scoreB: Number(finalScoreB) },
    data: { isCorrect: true },
  });

  const vouchers: string[] = [];
  for (const winner of winners) {
    const code = generateVoucherCode();
    await prisma.voucher.create({
      data: { userId: winner.userId, code, sentAt: new Date() },
    });
    vouchers.push(code);
    console.log(
      `[VOUCHER] Winner: ${winner.user.name} <${winner.user.email}> | Code: ${code}`
    );
  }

  return NextResponse.json({ winnersCount: winners.length, codes: vouchers });
}
