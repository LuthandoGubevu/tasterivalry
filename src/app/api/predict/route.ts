import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function POST(req: NextRequest) {
  const { userId, matchId, scoreA, scoreB } = await req.json();

  if (!userId || !matchId || scoreA == null || scoreB == null) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (scoreA < 0 || scoreA > 20 || scoreB < 0 || scoreB > 20) {
    return NextResponse.json({ error: "Scores must be between 0 and 20" }, { status: 400 });
  }

  const matchDoc = await getDoc(doc(db, "matches", matchId));
  if (!matchDoc.exists() || !matchDoc.data()?.isActive) {
    return NextResponse.json({ error: "Match is not active" }, { status: 400 });
  }

  // Retrieve user email for denormalized storage
  const userDoc = await getDoc(doc(db, "users", userId));
  const email = userDoc.exists() ? userDoc.data()?.email : "";

  const predRef = await addDoc(collection(db, "predictions"), {
    userId,
    matchId,
    email,
    scoreA: Number(scoreA),
    scoreB: Number(scoreB),
    isCorrect: false,
    createdAt: serverTimestamp(),
  });

  return NextResponse.json({ predictionId: predRef.id, message: "Prediction saved!" });
}
