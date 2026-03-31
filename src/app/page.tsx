"use client";

import { useState } from "react";

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      return <h3 key={i} className="text-base font-bold text-indigo-300 mt-6 mb-2">{trimmed.replace(/\*\*/g, "")}</h3>;
    }
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-8 mb-3">{trimmed.replace("## ","")}</h2>;
    if (trimmed.startsWith("- ")) return <li key={i} className="text-slate-300 text-sm ml-4 mb-1 list-disc">{trimmed.replace("- ","")}</li>;
    if (/^\d+\.\s/.test(trimmed)) return <li key={i} className="text-slate-300 text-sm ml-4 mb-1">{trimmed}</li>;
    if (trimmed === "") return <div key={i} className="h-2" />;
    return <p key={i} className="text-slate-300 text-sm leading-relaxed mb-1">{trimmed}</p>;
  });
}

export default function Home() {
  const [startup, setStartup] = useState("");
  const [market, setMarket] = useState("");
  const [strategicFit, setStrategicFit] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startup.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startup, market, strategicFit }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const accentRgb = "99, 102, 241";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3" style={{ color: `rgb(${accentRgb})` }}>
            Exit Strategy Advisor
          </h1>
          <p className="text-slate-400 text-lg">
            Generate an exit strategy framework with acquisition target mapping and valuation preparation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mb-12">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Startup Description *</label>
            <textarea
              value={startup}
              onChange={(e) => setStartup(e.target.value)}
              placeholder="Describe your startup: what it does, current stage, traction, team, and any notable achievements..."
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Market</label>
            <input
              type="text"
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              placeholder="e.g. B2B SaaS, FinTech, Healthcare IT"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Desired Strategic Fit</label>
            <textarea
              value={strategicFit}
              onChange={(e) => setStrategicFit(e.target.value)}
              placeholder="What kind of strategic buyer would be the best fit? What synergies would make an acquisition compelling?"
              rows={2}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: `rgb(${accentRgb})` }}
          >
            {loading ? "Generating Exit Strategy..." : "Generate Exit Strategy Framework"}
          </button>
        </form>

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-8 text-red-300 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-8">
            <div className="space-y-1">{renderMarkdown(result)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
