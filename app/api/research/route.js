export async function POST(req) {
  const { company } = await req.json();

  if (!company || company.trim().length < 2) {
    return Response.json({ error: "Company name required" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  const prompt = `You are a corporate treasury analyst at ABSL AMC India. Research "${company.trim()}" and return intel for an AMC pitch. CRITICAL: Return ONLY raw valid JSON. No markdown. No backticks. Keep ALL strings under 50 words. Structure: {"company_name":"","sector":"","hq":"","tags":["","",""],"revenue":"","revenue_year":"FY24","cash_balance":"","investable_surplus":"","employees":"","investment_profile":"2 sentences.","pitch_score":75,"key_contacts":[{"name":"","role":"","email":"","notes":"","type":"cfo"}],"amc_relationships":[{"amc":"","products":"","strength":"Strong","aum":""}],"recommended_products":[{"product":"","rationale":"","pitch_hook":""}],"watch_points":[""]} Rules: 3 contacts max, 4 AMC relationships (include ABSL), 3 products, 4 watch points, return ONLY JSON`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return Response.json({ error: data.error?.message || "API error" }, { status: 500 });
    }

    const raw = data.content.map(c => c.text || "").join("");
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return Response.json({ error: "Could not parse response" }, { status: 500 });

    const cleaned = match[0]
      .replace(/[\u0000-\u001F\u007F]/g, " ")
      .replace(/,\s*([}\]])/g, "$1");

    return Response.json(JSON.parse(cleaned));
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
