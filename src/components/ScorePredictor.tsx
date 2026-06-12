"use client";

import Image from "next/image";
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
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.min(20, value + 1))}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white text-3xl font-black transition-transform active:scale-90"
        style={{ background: color, boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}
      >
        +
      </button>
      <span
        className="font-display text-white leading-none"
        style={{ fontSize: "clamp(52px,16vw,72px)", textShadow: "3px 3px 0 rgba(0,0,0,0.5)" }}
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

export default function ScorePredictor({ userId, matchId, teamA, teamB, onSuccess }: Props) {
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
    <div className="flex flex-col w-full px-5 pt-5 pb-6">
      <h2
        className="font-display text-white text-center mb-1"
        style={{ fontSize: "clamp(32px, 10vw, 44px)", textShadow: "2px 2px 0 rgba(0,0,0,0.5)" }}
      >
        YOUR PREDICTION
      </h2>
      <p className="text-white/50 text-xs text-center mb-6 uppercase tracking-widest">
        What will the final score be?
      </p>

      {/* Score stepper row */}
      <div className="flex items-center justify-center gap-4 mb-6">
        {/* Team A */}
        <div className="flex flex-col items-center gap-1 w-16">
          <div className="w-12 h-12 rounded-full overflow-hidden" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}>
            <Image src="/CDI.png" alt={teamA} width={48} height={48} className="w-full h-full object-cover" />
          </div>
          <span className="text-white/60 text-xs font-bold uppercase text-center leading-tight">{teamA.split(" ")[0]}</span>
        </div>

        <ScoreStepper value={scoreA} onChange={setScoreA} color="#FF8000" />

        <span
          className="font-display text-white/40 pb-6"
          style={{ fontSize: "clamp(28px,8vw,40px)" }}
        >
          –
        </span>

        <ScoreStepper value={scoreB} onChange={setScoreB} color="#034EA2" />

        {/* Team B */}
        <div className="flex flex-col items-center gap-1 w-16">
          <div className="w-12 h-12 rounded-full overflow-hidden" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}>
            <Image src="/Equador.png" alt={teamB} width={48} height={48} className="w-full h-full object-cover" />
          </div>
          <span className="text-white/60 text-xs font-bold uppercase text-center leading-tight">{teamB.split(" ")[0]}</span>
        </div>
      </div>

      {/* Live preview */}
      <div
        className="rounded-xl p-3 mb-4 text-center"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Your prediction</p>
        <p
          className="font-display text-white"
          style={{ fontSize: "clamp(24px,7vw,32px)", textShadow: "2px 2px 0 rgba(0,0,0,0.4)" }}
        >
          {teamA.split(" ")[0]} {scoreA} — {scoreB} {teamB.split(" ")[0]}
        </p>
      </div>

      {error && (
        <p className="text-red-300 text-sm text-center bg-red-900/40 rounded-lg px-4 py-2 mb-3">
          {error}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-4 rounded-xl font-display text-2xl uppercase text-white disabled:opacity-60 transition-transform active:scale-95"
        style={{ background: "linear-gradient(135deg, #FF8000, #cc6600)" }}
      >
        {loading ? "Saving..." : "Lock In My Prediction 🔒"}
      </button>
    </div>
  );
}
