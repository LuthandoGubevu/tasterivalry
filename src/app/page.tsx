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
      {/* Diagonal split background */}
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

      {/* VS watermark — anchored to hero top half only */}
      <div
        className="absolute z-0 left-0 right-0 pointer-events-none select-none flex items-center justify-center"
        style={{ top: "8%", height: "42%", opacity: 0.15 }}
      >
        <span
          className="font-display"
          style={{ fontSize: "clamp(120px, 38vw, 220px)", color: "white", letterSpacing: "-0.05em" }}
        >
          VS
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-dvh">

        {/* ── HERO (register + predict steps) ── */}
        {step !== "success" && (
          <div className="pt-6 pb-3 px-5 text-center">
            <h1
              className="font-display text-white leading-none"
              style={{
                fontSize: "clamp(50px, 16vw, 84px)",
                textShadow: "4px 4px 0 rgba(0,0,0,0.4)",
                letterSpacing: "-0.01em",
              }}
            >
              PRÉDISEZ
              <br />
              ET GAGNEZ
            </h1>
            <p
              className="font-display text-white uppercase mt-1"
              style={{
                fontSize: "clamp(10px, 2.8vw, 13px)",
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
            <div className="flex justify-center items-center gap-6 mt-4">
              <div
                className="rounded-full overflow-hidden flex-shrink-0"
                style={{
                  width: "clamp(72px, 20vw, 96px)",
                  height: "clamp(72px, 20vw, 96px)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.45)",
                }}
              >
                <Image src="/CDI.png" alt="Ivory Coast" width={96} height={96} className="w-full h-full object-cover" priority />
              </div>
              <div
                className="rounded-full overflow-hidden flex-shrink-0"
                style={{
                  width: "clamp(72px, 20vw, 96px)",
                  height: "clamp(72px, 20vw, 96px)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.45)",
                }}
              >
                <Image src="/Equador.png" alt="Ecuador" width={96} height={96} className="w-full h-full object-cover" priority />
              </div>
            </div>

            {/* Step dots */}
            <div className="flex justify-center gap-2 mt-3">
              {(["register", "predict"] as const).map((s) => (
                <div
                  key={s}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: step === s ? 22 : 8,
                    height: 8,
                    background: step === s ? "white" : "rgba(255,255,255,0.4)",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── FORM CARD — dark panel, sits flush below hero ── */}
        <div
          className="flex-1 flex flex-col"
          style={{
            background: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(6px)",
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            marginTop: step === "success" ? 0 : 8,
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
            <SuccessScreen
              scoreA={finalScores.a}
              scoreB={finalScores.b}
              teamA={matchData.teamA}
              teamB={matchData.teamB}
            />
          )}
        </div>
      </div>
    </div>
  );
}
