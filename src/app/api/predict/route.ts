import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const { userId, matchId, scoreA, scoreB } = await req.json();

    if (!userId || !matchId || scoreA == null || scoreB == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (scoreA < 0 || scoreA > 20 || scoreB < 0 || scoreB > 20) {
      return NextResponse.json({ error: "Scores must be between 0 and 20" }, { status: 400 });
    }

    const matchDoc = await getDb().collection("matches").doc(matchId).get();
    if (!matchDoc.exists || !matchDoc.data()?.isActive) {
      return NextResponse.json({ error: "Match is not active" }, { status: 400 });
    }

    const userDoc = await getDb().collection("users").doc(userId).get();
    const email = userDoc.exists ? userDoc.data()?.email : "";

    const predRef = await getDb().collection("predictions").add({
      userId,
      matchId,
      email,
      scoreA: Number(scoreA),
      scoreB: Number(scoreB),
      isCorrect: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ predictionId: predRef.id, message: "Prediction saved!" });
  } catch (err: any) {
    console.error("[predict]", err);
    return NextResponse.json({ error: err.message ?? "Server error" }, { status: 500 });
  }
}
