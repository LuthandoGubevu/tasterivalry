import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";
import { generateVoucherCode } from "@/lib/vouchers";

export async function POST(req: NextRequest) {
  try {
    const { matchId, finalScoreA, finalScoreB, adminSecret } = await req.json();

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!matchId || finalScoreA == null || finalScoreB == null) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await getDb().collection("matches").doc(matchId).update({
      finalScoreA: Number(finalScoreA),
      finalScoreB: Number(finalScoreB),
      isActive: false,
      settledAt: FieldValue.serverTimestamp(),
    });

    const winnersSnap = await getDb().collection("predictions")
      .where("matchId", "==", matchId)
      .where("scoreA", "==", Number(finalScoreA))
      .where("scoreB", "==", Number(finalScoreB))
      .get();

    const codes: string[] = [];
    for (const predDoc of winnersSnap.docs) {
      await predDoc.ref.update({ isCorrect: true });

      const pred = predDoc.data();
      const userDoc = await getDb().collection("users").doc(pred.userId).get();
      const user = userDoc.exists ? userDoc.data() : { name: "Unknown", email: pred.email };

      const code = generateVoucherCode();
      await getDb().collection("vouchers").add({
        userId: pred.userId,
        predictionId: predDoc.id,
        code,
        sentAt: FieldValue.serverTimestamp(),
        claimedAt: null,
      });

      codes.push(code);
      console.log(`[VOUCHER] Winner: ${user?.name} <${user?.email}> | Code: ${code}`);
    }

    return NextResponse.json({ winnersCount: winnersSnap.size, codes });
  } catch (err: any) {
    console.error("[settle]", err);
    return NextResponse.json({ error: err.message ?? "Server error" }, { status: 500 });
  }
}
