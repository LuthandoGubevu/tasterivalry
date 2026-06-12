import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";

export async function POST(req: NextRequest) {
  const { adminSecret } = await req.json();

  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Avoid duplicate active matches
  const existing = await getDocs(
    query(collection(db, "matches"), where("isActive", "==", true))
  );
  if (!existing.empty) {
    return NextResponse.json({ message: "Active match already exists", matchId: existing.docs[0].id });
  }

  const matchRef = await addDoc(collection(db, "matches"), {
    teamA: "Ivory Coast",
    teamB: "Ecuador",
    scheduledAt: "2026-07-01T19:00:00Z",
    isActive: true,
    finalScoreA: null,
    finalScoreB: null,
    settledAt: null,
    createdAt: serverTimestamp(),
  });

  return NextResponse.json({ message: "Match seeded", matchId: matchRef.id });
}
