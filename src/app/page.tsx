"use client";

import { useState } from "react";
import RegistrationForm from "@/components/RegistrationForm";
import ScorePredictor from "@/components/ScorePredictor";
import SuccessScreen from "@/components/SuccessScreen";

type Step = "register" | "predict" | "success";

interface MatchData {
  userId: string;
  matchId: string;
  teamA: string;
  teamB: string;
}

export default function Home() {
  const [step, setStep] = useState<Step>("register");
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [finalScores, setFinalScores] = useState({ a: 0, b: 0 });

  return (
    <div
      className="relative min-h-dvh flex flex-col overflow-hidden"
      style={{ background: "#111" }}
    >
      {/* Diagonal split background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, #F47C20 50%, #1A4FA0 50%)`,
            clipPath: "polygon(0 0, 55% 0, 45% 100%, 0 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "#1A4FA0",
            clipPath: "polygon(55% 0, 100% 0, 100% 100%, 45% 100%)",
          }}
        />
        {/* Dark overlay to keep text readable */}
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.35)" }} />
      </div>

      {/* VS watermark */}
      <div
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none"
        style={{ opacity: 0.12 }}
      >
        <span
          className="font-display"
          style={{
            fontSize: "clamp(140px, 40vw, 260px)",
            color: "white",
            letterSpacing: "-0.05em",
          }}
        >
          VS
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-dvh">
        {/* Hero header — shown on step 1 only */}
        {step !== "success" && (
          <div className="pt-10 pb-4 px-6 text-center">
            <h1
              className="font-display text-white uppercase leading-none"
              style={{
                fontSize: "clamp(52px, 17vw, 88px)",
                textShadow: "4px 4px 0 rgba(0,0,0,0.5)",
                letterSpacing: "-0.01em",
              }}
            >
              PRÉDISEZ
              <br />
              ET GAGNEZ
            </h1>
            <p
              className="font-display text-white uppercase mt-3"
              style={{
                fontSize: "clamp(11px, 3.5vw, 16px)",
                fontWeight: 700,
                textShadow: "1px 1px 0 rgba(0,0,0,0.5)",
                letterSpacing: "0.04em",
              }}
            >
              QUELLE ÉQUIPE REMPORTERA LA VICTOIRE?
              <br />
              VOS PRONOSTIC ICI ?
            </p>

            {/* Team balls */}
            <div className="flex justify-center items-end gap-6 mt-6 mb-2">
              <div className="flex flex-col items-center gap-2">
                <div
                  className="rounded-full flex items-center justify-center text-4xl shadow-xl"
                  style={{
                    width: "clamp(72px, 22vw, 100px)",
                    height: "clamp(72px, 22vw, 100px)",
                    background: "radial-gradient(circle at 35% 35%, #fff8f0, #F47C20 60%, #b85a10)",
                    boxShadow: "inset -4px -4px 8px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.4)",
                  }}
                >
                  🇨🇮
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div
                  className="rounded-full flex items-center justify-center text-4xl shadow-xl"
                  style={{
                    width: "clamp(72px, 22vw, 100px)",
                    height: "clamp(72px, 22vw, 100px)",
                    background: "radial-gradient(circle at 35% 35%, #f0f4ff, #1A4FA0 60%, #0d2d6b)",
                    boxShadow: "inset -4px -4px 8px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.4)",
                  }}
                >
                  🇪🇨
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step indicator */}
        {step !== "success" && (
          <div className="flex justify-center gap-2 py-3">
            {(["register", "predict"] as const).map((s, i) => (
              <div
                key={s}
                className="rounded-full transition-all"
                style={{
                  width: step === s ? 24 : 8,
                  height: 8,
                  background: step === s ? "#F47C20" : "rgba(255,255,255,0.3)",
                }}
              />
            ))}
          </div>
        )}

        {/* Step content */}
        <div
          className="flex-1 flex flex-col justify-end"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 60%, transparent)",
          }}
        >
          {step === "register" && (
            <RegistrationForm
              onSuccess={(data) => {
                setMatchData(data);
                setStep("predict");
              }}
            />
          )}

          {step === "predict" && matchData && (
            <ScorePredictor
              userId={matchData.userId}
              matchId={matchData.matchId}
              teamA={matchData.teamA}
              teamB={matchData.teamB}
              onSuccess={(a, b) => {
                setFinalScores({ a, b });
                setStep("success");
              }}
            />
          )}

          {step === "success" && matchData && (
            <div className="flex-1 flex flex-col justify-center">
              <SuccessScreen
                scoreA={finalScores.a}
                scoreB={finalScores.b}
                teamA={matchData.teamA}
                teamB={matchData.teamB}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
