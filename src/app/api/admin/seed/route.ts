import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const { adminSecret } = await req.json();

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await getDb().collection("matches").where("isActive", "==", true).limit(1).get();
    if (!existing.empty) {
      return NextResponse.json({ message: "Active match already exists", matchId: existing.docs[0].id });
    }

    const matchRef = await getDb().collection("matches").add({
      teamA: "Ivory Coast",
      teamB: "Ecuador",
      scheduledAt: "2026-07-01T19:00:00Z",
      isActive: true,
      finalScoreA: null,
      finalScoreB: null,
      settledAt: null,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ message: "Match seeded", matchId: matchRef.id });
  } catch (err: any) {
    console.error("[seed]", err);
    return NextResponse.json({ error: err.message ?? "Server error" }, { status: 500 });
  }
}
