export async function POST(req) {
  const { company } = await req.json();

  if (!company || company.trim().length < 2) {
    return Response.json({ error: "Company name required" }, { status: 400 });
  }

  const prompt = `You are a corporate treasury analyst at ABSL AMC India. Research "${company.trim()}" and return intel for an AMC pitch.

CRITICAL: Return ONLY raw valid JSON. No markdown. No backticks. No explanation. Must be 100% valid and complete JSON.
Keep ALL string values SHORT (under 50 words each) so JSON stays within limits.

Return exactly this structure:
{"company_name":"","sector":"","hq":"City, State","tags":["","",""],"revenue":"₹X Cr","revenue_year":"FY24","cash_balance":"₹X Cr","investable_surplus":"₹X Cr est.","employees":"~X","investment_profile":"2 sentences on treasury style and risk appetite.","pitch_score":75,"key_contacts":[{"name":"","role":"","email":"","notes":"Under 20 words.","type":"cfo"}],"amc_relationships":[{"amc":"","products":"","strength":"Strong","aum":"₹X Cr est."}],"recommended_products":[{"product":"ABSL X Fund","rationale":"Under 20 words why it fits.","pitch_hook":"One sentence to CFO with rupee amount and bps."}],"watch_points":["Under 15 words each."]}

Rules:
- key_contacts: 3 items max
- amc_relationships: 4 items, MUST include Aditya Birla Sun Life AMC
- recommended_products: exactly 3 items  
- watch_points: 4 items max
- pitch_score: integer 0-100
- Return ONLY the JSON object, nothing else`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return Response.json({ error: err.error?.message || "API error" }, { status: 500 });
    }

    const data = await response.json();
    const raw = data.content.map(c => c.text || "").join("");
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return Response.json({ error: "Could not parse response" }, { status: 500 });

    const cleaned = match[0]
      .replace(/[\u0000-\u001F\u007F]/g, " ")
      .replace(/,\s*([}\]])/g, "$1");

    const parsed = JSON.parse(cleaned);
    return Response.json(parsed);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
