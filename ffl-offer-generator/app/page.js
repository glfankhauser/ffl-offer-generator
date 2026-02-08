"use client";

import { useState } from "react";

const TYPES = [
  { id: "headlines", label: "Headlines & Hooks", icon: "🎯" },
  { id: "facebook_ad", label: "Facebook Ad", icon: "📱" },
  { id: "facebook_post", label: "Facebook Post", icon: "📣" },
  { id: "email", label: "Email Sequence", icon: "✉️" },
  { id: "landing_page", label: "Landing Page", icon: "🖥️" },
  { id: "full_suite", label: "Full Suite", icon: "⚡" },
];

const TONES = [
  { id: "urgent", label: "Urgent / Scarcity" },
  { id: "curiosity", label: "Curiosity-Driven" },
  { id: "authority", label: "Authority / Expert" },
  { id: "fomo", label: "Fear of Missing Out" },
  { id: "empathy", label: "Problem-Aware" },
];

const C = {
  accent: "#00baff",
  accentDim: "rgba(0,186,255,0.12)",
  accentBorder: "rgba(0,186,255,0.35)",
  accentBorderSoft: "rgba(0,186,255,0.2)",
  accentMuted: "#0090cc",
  bg: "#0b0b0d",
  panel: "rgba(255,255,255,0.02)",
  panelBorder: "rgba(255,255,255,0.06)",
  text: "#d0d0d0",
  textBright: "#eaeaea",
  textMuted: "#6a6a72",
  textDim: "#4a4a52",
  inputBg: "rgba(0,0,0,0.4)",
  inputBorder: "rgba(255,255,255,0.08)",
};

function buildPrompt(inputs) {
  const { audience, offer, topic, number, tone, offerType } = inputs;
  const toneLabel = TONES.find((t) => t.id === tone)?.label || tone;

  let typeInst = "";
  switch (offerType) {
    case "headlines":
      typeInst =
        'Generate 10 killer headline variations using different proven direct response frameworks:\n1. "Attention [Audience]:" pattern\n2. "Are You a [Audience] Who..." question pattern\n3. "Warning:" fear-based pattern\n4. "What If You Could..." curiosity pattern\n5. "The [Number] [Adjective] [Things]..." list pattern\n6. "How [Audience] Are..." pattern\n7. "Stop [Pain Point]" command pattern\n8. "FREE: The [Deliverable] That Shows You..." offer pattern\n9. "Dear [Audience]:" letter pattern\n10. A wildcard creative headline\n\nFor each, include a 1-line subheadline that amplifies the hook.';
      break;
    case "facebook_ad":
      typeInst =
        "Generate 3 complete Facebook ad variations. For EACH ad:\n- Hook (first 1-2 scroll-stopping lines)\n- Body (3-5 paragraphs, PAS or AIDA)\n- CTA\n- Headline (ad headline field)\n- Link Description";
      break;
    case "facebook_post":
      typeInst =
        "Generate 5 organic Facebook post variations designed to drive engagement and leads. For EACH post:\n- Opening hook (pattern interrupt first line)\n- Body copy (conversational, value-driven, 3-8 sentences)\n- Call to action (comment, DM, or link click)\n- Suggested post type (text only, image suggestion, or video idea)\n\nMix up the formats: include a story-based post, a question post, a controversial/hot take post, a value bomb/tips post, and a social proof/results post. Write them as ready-to-copy-paste posts, not as ads.";
      break;
    case "email":
      typeInst =
        "Generate a 3-email nurture sequence:\nEmail 1 (send immediately): 3 subject lines, preview text, body, CTA\nEmail 2 (day 2): 3 subject lines, preview text, body, CTA\nEmail 3 (day 3-4): 3 subject lines, preview text, body, CTA";
      break;
    case "landing_page":
      typeInst =
        "Generate full landing page copy:\n- Hero Headline + Subheadline + CTA button\n- Problem Section (3-4 pain points)\n- Solution Section\n- 7-10 benefit bullets\n- Social Proof angles\n- Authority Section\n- 3-4 FAQs\n- Final CTA Section";
      break;
    default:
      typeInst =
        "Generate a COMPLETE offer copy suite:\n1. HEADLINES - 5 variations with subheadlines\n2. FACEBOOK AD - 1 complete ad\n3. EMAIL - 1 lead email with subject lines\n4. LANDING PAGE HERO - headline, subheadline, 5 bullets, CTA";
      break;
  }

  return (
    "You are a world-class direct response copywriter for the firearms retail industry (brick-and-mortar FFL dealers / gun store owners). Style: Dan Kennedy, Gary Halbert, Frank Kern. Punchy, benefit-driven, curiosity-inducing. Use AIDA, PAS frameworks. Power words: Free, Proven, Little-Known, Underground, Blueprint, Playbook. Direct no-BS tone. Address them as peers. Use markdown formatting.\n\nCRITICAL FORMATTING RULE: NEVER use em dashes or en dashes in your output. No instances of the characters -- or the unicode em dash or en dash. Use commas, periods, colons, or ellipses instead. Use markdown headers (# and ##) for section titles instead of wrapping text in asterisks. Keep formatting clean and minimal.\n\nOFFER PARAMETERS:\n- Audience: " +
    audience +
    "\n- Offer: " +
    offer +
    "\n- Topic/Hook: " +
    topic +
    "\n- Specificity: " +
    (number || "Your best judgment") +
    "\n- Tone: " +
    toneLabel +
    "\n\n" +
    typeInst
  );
}

function RenderMarkdown({ text }) {
  if (!text) return null;
  // Strip all remaining asterisks that aren't part of valid bold pairs
  const cleanText = text.replace(/\*\*([^*]+)\*\*/g, '%%BOLD%%$1%%ENDBOLD%%')
    .replace(/\*/g, '')
    .replace(/%%BOLD%%/g, '**')
    .replace(/%%ENDBOLD%%/g, '**');
  const lines = cleanText.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        // Strip leading markdown bold from headers
        const cleanLine = line.replace(/^\*\*(.+)\*\*$/, '$1');
        if (cleanLine.startsWith("### "))
          return (
            <h3
              key={i}
              style={{
                fontSize: "1.05rem",
                fontWeight: 700,
                color: C.accentMuted,
                margin: "1.1rem 0 0.35rem",
              }}
            >
              {cleanLine.slice(4).replace(/\*\*/g, '')}
            </h3>
          );
        if (cleanLine.startsWith("## "))
          return (
            <h2
              key={i}
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                color: C.accent,
                margin: "1.4rem 0 0.45rem",
                fontFamily: "'Oswald', sans-serif",
                borderBottom: `1px solid ${C.accentBorderSoft}`,
                paddingBottom: "0.35rem",
              }}
            >
              {cleanLine.slice(3).replace(/\*\*/g, '')}
            </h2>
          );
        if (cleanLine.startsWith("# "))
          return (
            <h1
              key={i}
              style={{
                fontSize: "1.65rem",
                fontWeight: 800,
                color: "#ffffff",
                margin: "1.6rem 0 0.55rem",
                fontFamily: "'Oswald', sans-serif",
              }}
            >
              {cleanLine.slice(2).replace(/\*\*/g, '')}
            </h1>
          );
        if (line.startsWith("---"))
          return (
            <hr
              key={i}
              style={{
                border: "none",
                borderTop: `1px solid ${C.accentBorderSoft}`,
                margin: "1.1rem 0",
              }}
            />
          );
        if (line.trim() === "") return <div key={i} style={{ height: "0.45rem" }} />;
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p
            key={i}
            style={{
              margin: "0.25rem 0",
              lineHeight: 1.75,
              color: C.text,
              fontSize: "1rem",
            }}
          >
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={j} style={{ color: "#ffffff", fontWeight: 700 }}>
                  {part.slice(2, -2)}
                </strong>
              ) : (
                <span key={j}>{part.replace(/\*/g, '')}</span>
              )
            )}
          </p>
        );
      })}
    </>
  );
}

export default function FFLOfferGenerator() {
  const [inputs, setInputs] = useState({
    audience: "B&M FFL Dealers",
    offer: "",
    topic: "",
    number: "",
    tone: "curiosity",
    offerType: "headlines",
  });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("config");
  const [copyLabel, setCopyLabel] = useState("📋 Copy All");

  const update = (k, v) => setInputs((p) => ({ ...p, [k]: v }));

  const generate = async () => {
    if (!inputs.offer || !inputs.topic) {
      setError("Fill in at least the Offer and Topic fields.");
      return;
    }
    setError("");
    setLoading(true);
    setOutput("");
    setTab("output");

    try {
      const prompt = buildPrompt(inputs);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setTab("config");
        return;
      }

      if (data.text) {
        setOutput(data.text);
      } else {
        setError("Empty response. Try again.");
        setTab("config");
      }
    } catch (err) {
      setError("Generation failed: " + err.toString());
      setTab("config");
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    navigator.clipboard.writeText(output);
    setCopyLabel("✅ Copied!");
    setTimeout(() => setCopyLabel("📋 Copy All"), 2500);
  };

  const fields = [
    { key: "audience", label: "Target Audience", ph: "e.g. B&M FFL Dealers, Gun Store Owners" },
    { key: "offer", label: "Your Offer / Lead Magnet *", ph: "e.g. Free checklist, Revenue diagnostic, Free training" },
    { key: "topic", label: "Topic / Core Hook *", ph: "e.g. Getting to top of Google, Doubling walk-in traffic" },
    { key: "number", label: "Number / Specificity", ph: "e.g. 5 hacks, 3 mistakes (optional)" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', sans-serif", color: C.text }}>
      {/* Subtle glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "radial-gradient(ellipse at 30% 0%, rgba(0,186,255,0.04) 0%, transparent 55%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto", padding: "1.75rem 1.5rem 2.5rem" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.35rem" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 7,
              background: `linear-gradient(135deg, ${C.accent}, ${C.accentMuted})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.8rem",
              fontWeight: 800,
              color: "#000",
              fontFamily: "'Oswald', sans-serif",
            }}
          >
            FFL
          </div>
          <span style={{ fontSize: "0.72rem", color: C.textMuted, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            FFL Funnels
          </span>
        </div>
        <h1
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "clamp(2rem, 4.5vw, 3rem)",
            color: "#ffffff",
            letterSpacing: "0.03em",
            margin: "0.45rem 0 0.2rem",
            lineHeight: 1.05,
          }}
        >
          OFFER GENERATOR
        </h1>
        <p style={{ color: C.textMuted, fontSize: "0.95rem", margin: "0 0 1.35rem" }}>
          AI-powered offer copy for the firearms industry
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.45rem", marginBottom: "1.1rem" }}>
          {[
            { id: "config", label: "⚙️ Build Offer" },
            { id: "output", label: output ? "📋 Copy ✓" : "📋 Copy" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1,
                padding: "0.65rem",
                background: tab === t.id ? C.accentDim : "rgba(255,255,255,0.02)",
                border: `1px solid ${tab === t.id ? C.accentBorder : C.panelBorder}`,
                borderRadius: 9,
                color: tab === t.id ? C.accent : C.textDim,
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                transition: "all 0.2s",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* CONFIG TAB */}
        {tab === "config" && (
          <div
            style={{
              background: C.panel,
              border: `1px solid ${C.panelBorder}`,
              borderRadius: 14,
              padding: "1.5rem",
            }}
          >
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: "0.55rem",
              }}
            >
              What are you building?
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))",
                gap: "0.45rem",
                marginBottom: "1.5rem",
              }}
            >
              {TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => update("offerType", t.id)}
                  style={{
                    padding: "0.7rem 0.65rem",
                    background: inputs.offerType === t.id ? C.accentDim : "rgba(255,255,255,0.015)",
                    border: `1px solid ${inputs.offerType === t.id ? C.accentBorder : C.panelBorder}`,
                    borderRadius: 9,
                    color: inputs.offerType === t.id ? C.accent : C.textMuted,
                    cursor: "pointer",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: "1.05rem" }}>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>

            {fields.map((f) => (
              <div key={f.key} style={{ marginBottom: "1.1rem" }}>
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: C.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    marginBottom: "0.4rem",
                  }}
                >
                  {f.label}
                </div>
                <input
                  type="text"
                  value={inputs[f.key]}
                  onChange={(e) => update(f.key, e.target.value)}
                  placeholder={f.ph}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    background: C.inputBg,
                    border: `1px solid ${C.inputBorder}`,
                    borderRadius: 9,
                    color: C.textBright,
                    fontSize: "0.95rem",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "border-color 0.2s",
                  }}
                />
              </div>
            ))}

            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: "0.5rem",
              }}
            >
              Tone
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.5rem" }}>
              {TONES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => update("tone", t.id)}
                  style={{
                    padding: "0.48rem 0.85rem",
                    background: inputs.tone === t.id ? C.accentDim : "transparent",
                    border: `1px solid ${inputs.tone === t.id ? C.accentBorder : C.inputBorder}`,
                    borderRadius: 20,
                    color: inputs.tone === t.id ? C.accent : C.textDim,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.15s",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {error && (
              <div
                style={{
                  background: "rgba(200,50,50,0.1)",
                  border: "1px solid rgba(200,50,50,0.25)",
                  borderRadius: 9,
                  padding: "0.65rem 1rem",
                  color: "#e07070",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                  wordBreak: "break-word",
                }}
              >
                {error}
              </div>
            )}

            <button
              onClick={generate}
              disabled={loading}
              style={{
                width: "100%",
                padding: "1.05rem",
                background: loading
                  ? C.accentDim
                  : `linear-gradient(135deg, ${C.accent}, ${C.accentMuted})`,
                border: "none",
                borderRadius: 11,
                color: loading ? C.accent : "#000",
                fontSize: "1.1rem",
                fontWeight: 700,
                fontFamily: "'Oswald', sans-serif",
                letterSpacing: "0.1em",
                cursor: loading ? "default" : "pointer",
                transition: "all 0.3s",
              }}
            >
              {loading ? "⏳ GENERATING..." : "⚡ GENERATE OFFER COPY"}
            </button>
          </div>
        )}

        {/* OUTPUT TAB */}
        {tab === "output" && (
          <div
            style={{
              background: C.panel,
              border: `1px solid ${C.panelBorder}`,
              borderRadius: 14,
              padding: "1.5rem",
              minHeight: 320,
            }}
          >
            {output && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.1rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: C.textDim,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Your Offer Copy
                </span>
                <div style={{ display: "flex", gap: "0.45rem" }}>
                  <button
                    onClick={() => setTab("config")}
                    style={{
                      padding: "0.42rem 0.85rem",
                      background: "rgba(255,255,255,0.04)",
                      border: `1px solid ${C.inputBorder}`,
                      borderRadius: 7,
                      color: C.textMuted,
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    ← Edit
                  </button>
                  <button
                    onClick={copyAll}
                    style={{
                      padding: "0.42rem 0.85rem",
                      background: C.accentDim,
                      border: `1px solid ${C.accentBorderSoft}`,
                      borderRadius: 7,
                      color: C.accent,
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {copyLabel}
                  </button>
                </div>
              </div>
            )}

            {loading && !output && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 280,
                  gap: "0.85rem",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    border: `3px solid ${C.accentDim}`,
                    borderTopColor: C.accent,
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <p style={{ color: C.textMuted, fontSize: "0.95rem" }}>Crafting your offer copy...</p>
                <p style={{ color: C.textDim, fontSize: "0.85rem" }}>This takes 15-30 seconds</p>
              </div>
            )}

            {!loading && !output && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 280,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "0.65rem", opacity: 0.2 }}>✍️</div>
                <p style={{ color: C.textDim, fontSize: "0.95rem" }}>
                  Configure your offer and hit Generate
                </p>
              </div>
            )}

            {output && <RenderMarkdown text={output} />}
          </div>
        )}
      </div>
    </div>
  );
}
