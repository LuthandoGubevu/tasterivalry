import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { generateVoucherCode } from "@/lib/vouchers";

export async function POST(req: NextRequest) {
  const { matchId, finalScoreA, finalScoreB, adminSecret } = await req.json();

  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!matchId || finalScoreA == null || finalScoreB == null) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Settle the match
  await updateDoc(doc(db, "matches", matchId), {
    finalScoreA: Number(finalScoreA),
    finalScoreB: Number(finalScoreB),
    isActive: false,
    settledAt: serverTimestamp(),
  });

  // Find winning predictions
  const winnersSnap = await getDocs(
    query(
      collection(db, "predictions"),
      where("matchId", "==", matchId),
      where("scoreA", "==", Number(finalScoreA)),
      where("scoreB", "==", Number(finalScoreB))
    )
  );

  // Mark them correct
  const codes: string[] = [];
  for (const predDoc of winnersSnap.docs) {
    await updateDoc(predDoc.ref, { isCorrect: true });

    const pred = predDoc.data();

    // Fetch user details
    const userSnap = await getDocs(
      query(collection(db, "users"), where("__name__", "==", pred.userId))
    );
    const user = userSnap.empty ? { name: "Unknown", email: pred.email } : userSnap.docs[0].data();

    const code = generateVoucherCode();
    await addDoc(collection(db, "vouchers"), {
      userId: pred.userId,
      predictionId: predDoc.id,
      code,
      sentAt: serverTimestamp(),
      claimedAt: null,
    });

    codes.push(code);
    console.log(`[VOUCHER] Winner: ${user.name} <${user.email}> | Code: ${code}`);
  }

  return NextResponse.json({ winnersCount: winnersSnap.size, codes });
}
