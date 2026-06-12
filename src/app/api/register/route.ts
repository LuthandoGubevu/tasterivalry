import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone } = await req.json();

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Find active match
    const matchSnap = await getDb().collection("matches").where("isActive", "==", true).limit(1).get();
    if (matchSnap.empty) {
      return NextResponse.json({ error: "No active match found" }, { status: 404 });
    }
    const matchDoc = matchSnap.docs[0];
    const match = matchDoc.data();

    // Check for existing prediction by this email for this match
    const existingPred = await getDb().collection("predictions")
      .where("matchId", "==", matchDoc.id)
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existingPred.empty) {
      return NextResponse.json(
        { error: "You have already submitted a prediction for this match" },
        { status: 409 }
      );
    }

    // Upsert user
    const userSnap = await getDb().collection("users").where("email", "==", email).limit(1).get();
    let userId: string;

    if (userSnap.empty) {
      const newUser = await getDb().collection("users").add({
        name,
        email,
        phone,
        createdAt: FieldValue.serverTimestamp(),
      });
      userId = newUser.id;
    } else {
      const userDoc = userSnap.docs[0];
      await userDoc.ref.update({ name, phone });
      userId = userDoc.id;
    }

    return NextResponse.json({
      userId,
      matchId: matchDoc.id,
      teamA: match.teamA,
      teamB: match.teamB,
      scheduledAt: match.scheduledAt,
    });
  } catch (err: any) {
    console.error("[register]", err);
    return NextResponse.json({ error: err.message ?? "Server error" }, { status: 500 });
  }
}
