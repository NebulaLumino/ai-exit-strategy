import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { startup, market, strategicFit } = await req.json();
    if (!startup?.trim()) {
      return NextResponse.json({ error: "Startup description is required" }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });

    const marketStr = market || "Not specified";
    const fitStr = strategicFit || "Not specified";
    const prompt = "You are an M&A and exit strategy expert. Generate a comprehensive exit strategy framework.\n\nStartup: " + startup + "\nMarket: " + marketStr + "\nDesired Strategic Fit: " + fitStr + "\n\nPlease generate:\n1. **Exit Options Overview** - Trade sale, IPO, acquisition, SPAC, secondary sale pros/cons\n2. **Ideal Acquisition Profile** - What types of companies would buy this startup and why\n3. **Top 10 Potential Acquisition Targets** - Realistic strategic acquirers by category\n4. **Acquisition Readiness Checklist** - What needs to be in place before pursuing exit\n5. **Valuation Preparation** - How to maximize valuation before exit\n6. **Timing Considerations** - When is the optimal time to exit\n7. **Strategic Buyer vs. Financial Buyer** - Which is better for this startup\n8. **Exit Process Timeline** - Typical M&A process stages and timeline\n9. **Deal Structure Considerations** - Equity vs. cash, earnouts, vest-on-close\n\nFormat with clear headers. Be specific about acquirer types and fit.";

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are an expert M&A advisor and exit strategy specialist with deep knowledge of startup exits and acquisitions.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2800,
    });

    const result = completion.choices[0]?.message?.content || "No framework generated.";
    return NextResponse.json({ result });
  } catch (err: unknown) {
    console.error("Generation error:", err);
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
