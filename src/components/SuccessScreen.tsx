"use client";

interface Props {
  scoreA: number;
  scoreB: number;
  teamA: string;
  teamB: string;
}

export default function SuccessScreen({ scoreA, scoreB, teamA, teamB }: Props) {
  return (
    <div className="flex flex-col w-full max-w-sm mx-auto px-6 py-8 items-center text-center">
      <div className="text-7xl mb-4">🎉</div>

      <h2
        className="text-white text-3xl font-black uppercase italic mb-2"
        style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.5)" }}
      >
        You&apos;re In!
      </h2>
      <p className="text-white/70 text-sm uppercase tracking-wide mb-8">
        Your prediction has been saved
      </p>

      <div
        className="w-full rounded-2xl p-5 mb-6"
        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
      >
        <p className="text-white/60 text-xs uppercase tracking-widest mb-2">
          Your score prediction
        </p>
        <p
          className="text-white text-4xl font-black"
          style={{ textShadow: "3px 3px 0 rgba(0,0,0,0.4)" }}
        >
          {scoreA} — {scoreB}
        </p>
        <p className="text-white/50 text-xs mt-2 uppercase">
          {teamA} vs {teamB}
        </p>
      </div>

      <div
        className="w-full rounded-2xl p-5 mb-8"
        style={{ background: "rgba(244, 124, 32, 0.15)", border: "1px solid rgba(244,124,32,0.4)" }}
      >
        <p className="text-orange-300 text-sm font-bold uppercase tracking-wide mb-1">
          🍗 Win a KFC Voucher
        </p>
        <p className="text-white/70 text-xs leading-relaxed">
          If your prediction is correct, you&apos;ll receive a KFC discount voucher code.
          We&apos;ll reach out to you after the match!
        </p>
      </div>

      <p className="text-white/30 text-xs uppercase tracking-widest">
        Good luck — may the best prediction win!
      </p>
    </div>
  );
}
