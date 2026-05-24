"use client";
import { useState, useCallback } from "react";

const C = {
  bg: "#07070f", s1: "#0f0f1a", s2: "#16162a", s3: "#1c1c2e",
  b1: "#252538", b2: "#32324a", b3: "#505068",
  t1: "#e8e8f4", t2: "#9090b0", t3: "#606080",
  acc: "#7c6fff", grn: "#3ecf8e", amb: "#f5a623", red: "#ff4f6a", blu: "#4a9eff",
};

const ini = n => (n || "").split(" ").filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join("");
const sc  = s => +s >= 75 ? C.grn : +s >= 50 ? C.amb : C.red;
const dc  = r => { const l = (r || "").toLowerCase(); return l.includes("strong") ? C.grn : l.includes("medium") ? C.amb : C.red; };
const avBg = t => t === "cfo" ? "rgba(245,166,35,.15)" : t === "treasury" ? "rgba(62,207,142,.15)" : "rgba(144,144,176,.1)";
const avCl = t => t === "cfo" ? C.amb : t === "treasury" ? C.grn : C.t2;

const QUICK = [
  "Zomato", "Reliance Industries", "TCS", "Infosys", "HDFC Bank",
  "NHPC", "ITC", "Wipro", "Bajaj Finance", "Maruti Suzuki",
  "Asian Paints", "DLF", "Havells", "NTPC", "Pidilite",
  "Nestle India", "Kotak Mahindra Bank", "L&T", "Zen Technologies",
  "Power Grid", "Sun Pharma", "Adani Ports", "Tata Steel",
  "Coal India", "Britannia", "Dabur", "Godrej Consumer", "Ultratech Cement",
];

function SecHead({ children }) {
  return (
    <div style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: ".08em", color: C.t3, textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
      {children}
      <div style={{ flex: 1, height: 1, background: C.b1 }} />
    </div>
  );
}

function MetricCard({ label, value, sub }) {
  return (
    <div style={{ background: C.s2, border: `1px solid ${C.b1}`, borderRadius: 10, padding: "12px 14px" }}>
      <div style={{ fontSize: 11, color: C.t3, marginBottom: 5 }}>{label}</div>
      <div style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.3, color: C.t1 }}>{value || "—"}</div>
      {sub && <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [query, setQuery]   = useState("");
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [data, setData]     = useState(null);
  const [error, setError]   = useState("");
  const [tab, setTab]       = useState("overview");

  const research = useCallback(async (q) => {
    const company = (q || query).trim();
    if (!company) return;
    setLoading(true); setError(""); setData(null); setTab("overview");

    const msgs = [
      `Connecting to AI…`,
      `Researching ${company}…`,
      `Analysing AMC relationships…`,
      `Building pitch strategy…`,
    ];
    let i = 0;
    setLoadMsg(msgs[0]);
    const iv = setInterval(() => { i = Math.min(i + 1, msgs.length - 1); setLoadMsg(msgs[i]); }, 1400);

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Research failed");
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      clearInterval(iv);
      setLoading(false);
    }
  }, [query]);

  const qs = name => { setQuery(name); research(name); };

  const tabs = [
    { k: "overview", label: "Overview" },
    { k: "contacts", label: "Treasury Contacts" },
    { k: "amc",      label: "AMC Relationships" },
    { k: "pitch",    label: "Pitch Strategy" },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.t1, fontFamily: "'Inter', 'Segoe UI', sans-serif", fontSize: 14, padding: "1.5rem 1.25rem 5rem" }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes fade  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        input::placeholder { color: #505068; }
        .chip:hover { border-color: #7c6fff !important; color: #e8e8f4 !important; }
        .tab-item:hover { color: #e8e8f4 !important; }
        .row-hover:hover td { background: #16162a !important; }
      `}</style>

      <div style={{ maxWidth: 940, margin: "0 auto" }}>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.75rem", paddingBottom: "1.25rem", borderBottom: `1px solid ${C.b1}` }}>
          <div style={{ width: 36, height: 36, background: C.acc, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#fff", flexShrink: 0 }}>AB</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.3px" }}>Corporate Intel &amp; Pitch Engine</div>
            <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>ABSL AMC — Live AI research for any Indian listed company</div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 10, fontFamily: "monospace", background: "rgba(62,207,142,.12)", color: C.grn, border: "1px solid rgba(62,207,142,.3)", padding: "3px 10px", borderRadius: 4, display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.grn, animation: "pulse 1.5s infinite" }} />
            LIVE AI
          </div>
        </div>

        {/* ── SEARCH ── */}
        <div style={{ background: C.s1, border: `1px solid ${C.b1}`, borderRadius: 14, padding: "1.25rem", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && research()}
              placeholder="Type ANY Indian listed company — Sun Pharma, Coal India, Adani Ports, Tata Steel…"
              style={{ flex: 1, height: 48, background: C.s2, border: `1px solid ${C.b2}`, borderRadius: 10, color: C.t1, fontSize: 14, padding: "0 16px", outline: "none", fontFamily: "inherit" }}
            />
            <button
              onClick={() => research()}
              disabled={loading}
              style={{ height: 48, padding: "0 26px", background: loading ? C.b2 : C.acc, color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", whiteSpace: "nowrap", transition: "background .2s" }}
            >
              {loading ? "Researching…" : "⟶ Research"}
            </button>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: C.t3, fontFamily: "monospace", flexShrink: 0 }}>try →</span>
            {QUICK.map(n => (
              <span key={n} className="chip" onClick={() => qs(n)}
                style={{ fontSize: 12, padding: "4px 12px", borderRadius: 99, border: `1px solid ${C.b2}`, background: C.s2, color: C.t2, cursor: "pointer", transition: "all .15s" }}>
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* ── LOADING ── */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.s1, border: `1px solid ${C.b1}`, borderRadius: 12, padding: "1.25rem", color: C.t2, fontSize: 13, marginBottom: "1rem" }}>
            <div style={{ width: 20, height: 20, border: `2px solid ${C.b2}`, borderTopColor: C.acc, borderRadius: "50%", animation: "spin .7s linear infinite", flexShrink: 0 }} />
            <span>{loadMsg}</span>
          </div>
        )}

        {/* ── ERROR ── */}
        {error && !loading && (
          <div style={{ background: "rgba(255,79,106,.08)", border: "1px solid rgba(255,79,106,.25)", borderRadius: 12, padding: "1rem 1.25rem", color: "#ff8080", fontSize: 13, marginBottom: "1rem" }}>
            ⚠ {error} — Please try again.
          </div>
        )}

        {/* ── RESULT ── */}
        {data && !loading && (
          <div style={{ background: C.s1, border: `1px solid ${C.b1}`, borderRadius: 16, overflow: "hidden", animation: "fade .4s ease" }}>

            {/* Company Header */}
            <div style={{ padding: "1.5rem", background: `linear-gradient(135deg,${C.s1},${C.s2})`, borderBottom: `1px solid ${C.b1}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 54, height: 54, borderRadius: 13, background: `linear-gradient(135deg,${C.acc},#a78bfa)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#fff", flexShrink: 0, boxShadow: "0 4px 16px rgba(124,111,255,.3)" }}>
                  {ini(data.company_name)}
                </div>
                <div>
                  <div style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.2 }}>{data.company_name}</div>
                  <div style={{ fontSize: 12, color: C.t2, marginTop: 4 }}>{data.sector} · {data.hq}</div>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 8 }}>
                    {(data.tags || []).map(t => <span key={t} style={{ fontSize: 10, fontFamily: "monospace", padding: "2px 8px", borderRadius: 4, border: `1px solid ${C.b2}`, color: C.t3 }}>{t}</span>)}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "center", background: C.s3, border: `1px solid ${C.b2}`, borderRadius: 12, padding: "14px 22px", minWidth: 105 }}>
                <div style={{ fontSize: 10, fontFamily: "monospace", color: C.t3, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>Pitch Score</div>
                <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1, color: sc(data.pitch_score) }}>{data.pitch_score}</div>
                <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>/100</div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", background: C.s2, borderBottom: `1px solid ${C.b1}`, padding: "0 1.5rem", overflowX: "auto" }}>
              {tabs.map(t => (
                <div key={t.k} className="tab-item" onClick={() => setTab(t.k)}
                  style={{ padding: "11px 18px", fontSize: 13, color: tab === t.k ? C.acc : C.t2, cursor: "pointer", borderBottom: `2px solid ${tab === t.k ? C.acc : "transparent"}`, marginBottom: -1, fontWeight: tab === t.k ? 600 : 400, whiteSpace: "nowrap", transition: "color .15s" }}>
                  {t.label}
                </div>
              ))}
            </div>

            <div style={{ padding: "1.5rem" }}>

              {/* OVERVIEW */}
              {tab === "overview" && (
                <div>
                  <SecHead>Financials</SecHead>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 8, marginBottom: "1.5rem" }}>
                    <MetricCard label="Revenue"           value={data.revenue}            sub={data.revenue_year} />
                    <MetricCard label="Cash & Equivalents" value={data.cash_balance}       />
                    <MetricCard label="Investable Surplus" value={data.investable_surplus} />
                    <MetricCard label="Employees"          value={data.employees}          />
                  </div>
                  <SecHead>Treasury Profile</SecHead>
                  <div style={{ fontSize: 13, lineHeight: 1.85, color: C.t2, background: C.s2, border: `1px solid ${C.b1}`, borderRadius: 10, padding: "14px 16px", marginBottom: "1.5rem" }}>
                    {data.investment_profile}
                  </div>
                  <SecHead>Watch Points</SecHead>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {(data.watch_points || []).map((w, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "rgba(245,166,35,.05)", border: "1px solid rgba(245,166,35,.15)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.t2, lineHeight: 1.5 }}>
                        <span style={{ color: C.amb, flexShrink: 0 }}>⚠</span><span>{w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CONTACTS */}
              {tab === "contacts" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 10 }}>
                  {(data.key_contacts || []).map((c, i) => (
                    <div key={i} style={{ background: C.s2, border: `1px solid ${C.b1}`, borderRadius: 12, padding: 16, display: "flex", gap: 12 }}>
                      <div style={{ width: 42, height: 42, borderRadius: "50%", background: avBg(c.type), color: avCl(c.type), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                        {ini(c.name)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: C.t2, marginTop: 2 }}>{c.role}</div>
                        {c.email && <div style={{ fontSize: 11, color: C.blu, marginTop: 4 }}>✉ {c.email}</div>}
                        <div style={{ fontSize: 12, color: C.t3, marginTop: 8, lineHeight: 1.6, borderTop: `1px solid ${C.b1}`, paddingTop: 8 }}>{c.notes}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* AMC RELATIONSHIPS */}
              {tab === "amc" && (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr>
                        {["AMC", "Products", "Relationship", "Est. AUM"].map(h => (
                          <th key={h} style={{ textAlign: "left", fontSize: 10, fontFamily: "monospace", letterSpacing: ".05em", color: C.t3, padding: "0 14px 12px", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(data.amc_relationships || []).map((a, i) => (
                        <tr key={i} className="row-hover" style={{ borderTop: `1px solid ${C.b1}` }}>
                          <td style={{ padding: "12px 14px", fontWeight: 600 }}>{a.amc}</td>
                          <td style={{ padding: "12px 14px", color: C.t2, fontSize: 12 }}>{a.products}</td>
                          <td style={{ padding: "12px 14px" }}>
                            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: dc(a.strength), marginRight: 6, verticalAlign: "middle" }} />
                            {a.strength}
                          </td>
                          <td style={{ padding: "12px 14px", color: C.t2, fontFamily: "monospace", fontSize: 11 }}>{a.aum}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* PITCH STRATEGY */}
              {tab === "pitch" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {(data.recommended_products || []).map((p, i) => (
                    <div key={i} style={{ background: C.s2, border: `1px solid ${C.b1}`, borderRadius: 13, padding: 18 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>✦ {p.product}</span>
                        {i === 0 && (
                          <span style={{ fontSize: 10, fontFamily: "monospace", background: "rgba(62,207,142,.15)", color: C.grn, border: "1px solid rgba(62,207,142,.3)", padding: "3px 10px", borderRadius: 4 }}>
                            ★ BEST FIT
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 13, color: C.t2, lineHeight: 1.8, marginBottom: 14 }}>{p.rationale}</div>
                      <div style={{ fontSize: 10, fontFamily: "monospace", color: C.t3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>Opening pitch line</div>
                      <div style={{ background: C.s3, borderLeft: `3px solid ${C.acc}`, borderRadius: "0 8px 8px 0", padding: "12px 16px", fontSize: 13, color: C.t1, lineHeight: 1.8, fontStyle: "italic" }}>
                        {p.pitch_hook}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!data && !loading && !error && (
          <div style={{ textAlign: "center", padding: "4rem 0", color: C.t3, fontSize: 13 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 15, color: C.t2, marginBottom: 6 }}>Search any Indian listed company</div>
            <div>Type a name above or click any chip to generate the full intel report</div>
          </div>
        )}

      </div>
    </div>
  );
}
