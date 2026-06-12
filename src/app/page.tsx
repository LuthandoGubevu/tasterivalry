"use client";

import Image from "next/image";
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
    <div className="relative min-h-dvh flex flex-col overflow-hidden">
      {/* Diagonal split background — full height, no overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: "#FF8000" }} />
        <div
          className="absolute inset-0"
          style={{
            background: "#034EA2",
            clipPath: "polygon(52% 0, 100% 0, 100% 100%, 48% 100%)",
          }}
        />
      </div>

      {/* VS watermark */}
      <div
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none"
        style={{ opacity: 0.15 }}
      >
        <span
          className="font-display"
          style={{ fontSize: "clamp(160px, 45vw, 280px)", color: "white", letterSpacing: "-0.05em" }}
        >
          VS
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-dvh">
        {step !== "success" && (
          <div className="pt-8 pb-2 px-5 text-center">
            <h1
              className="font-display text-white leading-none"
              style={{
                fontSize: "clamp(56px, 18vw, 92px)",
                textShadow: "4px 4px 0 rgba(0,0,0,0.4)",
                letterSpacing: "-0.01em",
              }}
            >
              PRÉDISEZ
              <br />
              ET GAGNEZ
            </h1>
            <p
              className="font-display text-white uppercase mt-2"
              style={{
                fontSize: "clamp(11px, 3.2vw, 15px)",
                fontWeight: 700,
                textShadow: "1px 1px 0 rgba(0,0,0,0.4)",
                letterSpacing: "0.04em",
              }}
            >
              QUELLE ÉQUIPE REMPORTERA LA VICTOIRE?
              <br />
              VOS PRONOSTIC ICI ?
            </p>

            {/* Team images */}
            <div className="flex justify-center items-center gap-8 mt-5 mb-1">
              <div
                className="rounded-full overflow-hidden shadow-2xl"
                style={{
                  width: "clamp(80px, 24vw, 108px)",
                  height: "clamp(80px, 24vw, 108px)",
                  boxShadow: "0 8px 28px rgba(0,0,0,0.4)",
                }}
              >
                <Image
                  src="/CDI.png"
                  alt="Ivory Coast"
                  width={108}
                  height={108}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div
                className="rounded-full overflow-hidden shadow-2xl"
                style={{
                  width: "clamp(80px, 24vw, 108px)",
                  height: "clamp(80px, 24vw, 108px)",
                  boxShadow: "0 8px 28px rgba(0,0,0,0.4)",
                }}
              >
                <Image
                  src="/Equador.png"
                  alt="Ecuador"
                  width={108}
                  height={108}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        )}

        {/* Step indicator */}
        {step !== "success" && (
          <div className="flex justify-center gap-2 pt-3 pb-1">
            {(["register", "predict"] as const).map((s) => (
              <div
                key={s}
                className="rounded-full transition-all duration-300"
                style={{
                  width: step === s ? 24 : 8,
                  height: 8,
                  background: step === s ? "white" : "rgba(255,255,255,0.4)",
                }}
              />
            ))}
          </div>
        )}

        {/* Step content — sits directly on the split background */}
        <div className="flex-1 flex flex-col justify-end">
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
