"use client";

import { useState } from "react";

interface Props {
  userId: string;
  matchId: string;
  teamA: string;
  teamB: string;
  onSuccess: (scoreA: number, scoreB: number) => void;
}

function ScoreStepper({
  value,
  onChange,
  color,
}: {
  value: number;
  onChange: (v: number) => void;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.min(20, value + 1))}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white text-3xl font-black transition-transform active:scale-90"
        style={{ background: color, boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}
      >
        +
      </button>
      <span
        className="text-white font-black text-6xl leading-none"
        style={{ textShadow: "3px 3px 0 rgba(0,0,0,0.5)" }}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white text-3xl font-black transition-transform active:scale-90"
        style={{ background: color, boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}
      >
        −
      </button>
    </div>
  );
}

export default function ScorePredictor({
  userId,
  matchId,
  teamA,
  teamB,
  onSuccess,
}: Props) {
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, matchId, scoreA, scoreB }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      onSuccess(scoreA, scoreB);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col w-full max-w-sm mx-auto px-6 py-8">
      <h2
        className="text-white text-2xl font-black uppercase italic text-center mb-1"
        style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.4)" }}
      >
        Your Prediction
      </h2>
      <p className="text-white/70 text-sm text-center mb-8 uppercase tracking-wide">
        What will the final score be?
      </p>

      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex flex-col items-center gap-2 flex-1">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white border-2 border-white/30"
            style={{ background: "#F47C20" }}
          >
            🇨🇮
          </div>
          <span className="text-white text-xs font-bold uppercase text-center leading-tight">
            {teamA}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <ScoreStepper value={scoreA} onChange={setScoreA} color="#F47C20" />
          <span
            className="text-white/50 text-4xl font-black"
            style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.5)" }}
          >
            –
          </span>
          <ScoreStepper value={scoreB} onChange={setScoreB} color="#1A4FA0" />
        </div>

        <div className="flex flex-col items-center gap-2 flex-1">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white border-2 border-white/30"
            style={{ background: "#1A4FA0" }}
          >
            🇪🇨
          </div>
          <span className="text-white text-xs font-bold uppercase text-center leading-tight">
            {teamB}
          </span>
        </div>
      </div>

      <div
        className="rounded-xl p-4 mb-6 text-center"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <p className="text-white/60 text-xs uppercase tracking-widest mb-1">
          Your prediction
        </p>
        <p
          className="text-white text-3xl font-black"
          style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.4)" }}
        >
          {teamA.split(" ")[0]} {scoreA} — {scoreB} {teamB.split(" ")[0]}
        </p>
      </div>

      {error && (
        <p className="text-red-300 text-sm text-center bg-red-900/30 rounded-lg px-4 py-2 mb-4">
          {error}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-4 rounded-xl font-black text-lg uppercase italic tracking-wide text-white disabled:opacity-50 transition-transform active:scale-95"
        style={{ background: "linear-gradient(135deg, #F47C20, #e06010)" }}
      >
        {loading ? "Submitting..." : "Lock In My Prediction 🔒"}
      </button>
    </div>
  );
}
