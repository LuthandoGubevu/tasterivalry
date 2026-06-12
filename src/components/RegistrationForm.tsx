"use client";

import { useState } from "react";

interface Props {
  onSuccess: (data: {
    userId: string;
    matchId: string;
    teamA: string;
    teamB: string;
  }) => void;
}

export default function RegistrationForm({ onSuccess }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      onSuccess(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col w-full max-w-sm mx-auto px-6 py-8">
      <h2
        className="font-display text-white text-center mb-1"
        style={{ fontSize: "clamp(28px, 9vw, 40px)", textShadow: "2px 2px 0 rgba(0,0,0,0.4)" }}
      >
        ENTER YOUR DETAILS
      </h2>
      <p className="text-white/70 text-sm text-center mb-6 uppercase tracking-wide">
        To participate in the prediction
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-white/80 text-xs font-bold uppercase mb-1 tracking-widest">
            Full Name
          </label>
          <input
            type="text"
            required
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-lg px-4 py-3 text-white bg-white/10 border border-white/20 focus:outline-none focus:border-white/60 placeholder-white/30 text-base"
          />
        </div>

        <div>
          <label className="block text-white/80 text-xs font-bold uppercase mb-1 tracking-widest">
            Email Address
          </label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded-lg px-4 py-3 text-white bg-white/10 border border-white/20 focus:outline-none focus:border-white/60 placeholder-white/30 text-base"
          />
        </div>

        <div>
          <label className="block text-white/80 text-xs font-bold uppercase mb-1 tracking-widest">
            Phone Number
          </label>
          <input
            type="tel"
            required
            placeholder="+27 81 234 5678"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="w-full rounded-lg px-4 py-3 text-white bg-white/10 border border-white/20 focus:outline-none focus:border-white/60 placeholder-white/30 text-base"
          />
        </div>

        {error && (
          <p className="text-red-300 text-sm text-center bg-red-900/30 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full py-4 rounded-xl font-display text-2xl uppercase tracking-wide text-white disabled:opacity-50 transition-transform active:scale-95"
          style={{ background: "linear-gradient(135deg, #FF8000, #e06010)" }}
        >
          {loading ? "Loading..." : "Enter My Prediction →"}
        </button>
      </form>
    </div>
  );
}
