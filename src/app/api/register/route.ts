import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function POST(req: NextRequest) {
  const { name, email, phone } = await req.json();

  if (!name || !email || !phone) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  // Find active match
  const matchSnap = await getDocs(
    query(collection(db, "matches"), where("isActive", "==", true))
  );
  if (matchSnap.empty) {
    return NextResponse.json({ error: "No active match found" }, { status: 404 });
  }
  const matchDoc = matchSnap.docs[0];
  const match = matchDoc.data();

  // Check for existing prediction by this email for this match
  const existingPred = await getDocs(
    query(
      collection(db, "predictions"),
      where("matchId", "==", matchDoc.id),
      where("email", "==", email)
    )
  );
  if (!existingPred.empty) {
    return NextResponse.json(
      { error: "You have already submitted a prediction for this match" },
      { status: 409 }
    );
  }

  // Upsert user
  const userSnap = await getDocs(
    query(collection(db, "users"), where("email", "==", email))
  );

  let userId: string;
  if (userSnap.empty) {
    const newUser = await addDoc(collection(db, "users"), {
      name,
      email,
      phone,
      createdAt: serverTimestamp(),
    });
    userId = newUser.id;
  } else {
    const userDoc = userSnap.docs[0];
    await updateDoc(userDoc.ref, { name, phone });
    userId = userDoc.id;
  }

  return NextResponse.json({
    userId,
    matchId: matchDoc.id,
    teamA: match.teamA,
    teamB: match.teamB,
    scheduledAt: match.scheduledAt,
  });
}
