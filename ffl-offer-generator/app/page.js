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

const AUDIENCES = [
  { id: "bm_dealer", label: "B&M FFL Dealer", value: "Brick-and-mortar FFL dealers running a physical gun store", pain: "Competing with online retailers, low foot traffic, thin margins, wearing every hat" },
  { id: "bm_500k_2m", label: "Gun Store ($500K-$2M)", value: "Established gun store owners doing $500K to $2M in annual revenue", pain: "Plateaued growth, no marketing system, relying on word of mouth, staff issues" },
  { id: "new_ffl", label: "New FFL Holder", value: "New FFL holders in their first 1-2 years of business", pain: "Overwhelmed by compliance, no customer base yet, burning cash, no systems" },
  { id: "kitchen_table", label: "Kitchen Table FFL", value: "Home-based kitchen table FFL dealers looking to grow or go brick-and-mortar", pain: "Limited inventory, no storefront presence, struggling to scale beyond transfers" },
  { id: "range_owner", label: "Range / Training Facility", value: "Indoor/outdoor range owners and firearms training facility operators", pain: "Filling class seats, membership retention, seasonal swings, liability concerns" },
  { id: "custom", label: "✏️ Custom", value: "", pain: "" },
];

const OFFER_FRAMEWORKS = [
  { id: "free_checklist", label: "Free Checklist", value: "Free checklist / PDF download", cta: "Download now, grab your free copy, get instant access" },
  { id: "free_training", label: "Free Training / Webinar", value: "Free training video or live webinar", cta: "Register now, save your seat, watch the free training" },
  { id: "quiz", label: "Quiz / Assessment", value: "Interactive quiz or self-assessment diagnostic", cta: "Take the free quiz, get your score, find out where you stand" },
  { id: "cheat_sheet", label: "Cheat Sheet / Blueprint", value: "Cheat sheet, blueprint, or playbook download", cta: "Download the blueprint, grab the playbook, get the cheat sheet" },
  { id: "case_study", label: "Case Study", value: "Case study or success story breakdown", cta: "Read the full case study, see how they did it, get the breakdown" },
  { id: "video_series", label: "Free Video Series", value: "Multi-part free video series or mini-course", cta: "Start watching, get free access, enroll in the free series" },
  { id: "strategy_call", label: "Strategy Call", value: "Free strategy call or consultation", cta: "Book your free call, claim your spot, schedule now" },
  { id: "custom_offer", label: "✏️ Custom Offer", value: "", cta: "" },
];

const REFINE_OPTIONS = [
  { value: "", label: "Refine..." },
  { value: "urgent", label: "🔥 More Urgent" },
  { value: "shorter", label: "✂️ Shorter" },
  { value: "angle", label: "🔄 Different Angle" },
  { value: "specific", label: "🔢 More Specific" },
  { value: "conversational", label: "🗣️ More Conversational" },
  { value: "regenerate", label: "⚡ Regenerate" },
];

const REFINE_INSTRUCTIONS = {
  urgent: "Rewrite to be significantly more urgent and scarce. Add time pressure, limited availability, and fear of missing out. Keep the same structure and offer details.",
  shorter: "Rewrite to be 40-50% shorter. Cut the fluff. Keep only the hardest-hitting lines. Same message, fewer words.",
  angle: "Rewrite from a completely different angle. New hook, new framing, new emotional trigger. Same offer and audience, fresh direction.",
  specific: "Rewrite with more specific numbers, data points, timeframes, and concrete details. Replace vague claims with sharp specifics.",
  conversational: "Rewrite to sound more like a real conversation between two dealers. Less polished, more raw. Like texting a buddy who owns a shop.",
  regenerate: "Generate a completely new version. Don't reference the previous version. Start fresh with new hooks and angles.",
};

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

const selectArrow = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236a6a72' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`;
const selectStyle = { width: "100%", padding: "0.8rem 1rem", background: C.inputBg, border: `1px solid ${C.inputBorder}`, borderRadius: 9, color: C.textBright, fontSize: "0.95rem", outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif", appearance: "none", WebkitAppearance: "none", backgroundImage: selectArrow, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center", cursor: "pointer" };
const inputStyle = { width: "100%", padding: "0.8rem 1rem", background: C.inputBg, border: `1px solid ${C.inputBorder}`, borderRadius: 9, color: C.textBright, fontSize: "0.95rem", outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif" };

function buildPrompt(inputs) {
  const { audience, audiencePreset, offer, offerPreset, topic, number, tone, offerType } = inputs;
  const toneLabel = TONES.find((t) => t.id === tone)?.label || tone;
  const preset = AUDIENCES.find((a) => a.id === audiencePreset);
  const painContext = preset && preset.pain ? "\n- Key Pain Points: " + preset.pain : "";
  const offerFw = OFFER_FRAMEWORKS.find((o) => o.id === offerPreset);
  const ctaContext = offerFw && offerFw.cta ? "\n- CTA Style: " + offerFw.cta : "";

  let typeInst = "";
  switch (offerType) {
    case "headlines":
      typeInst = 'Generate 10 killer headline variations using different proven direct response frameworks:\n1. "Attention [Audience]:" pattern\n2. "Are You a [Audience] Who..." question pattern\n3. "Warning:" fear-based pattern\n4. "What If You Could..." curiosity pattern\n5. "The [Number] [Adjective] [Things]..." list pattern\n6. "How [Audience] Are..." pattern\n7. "Stop [Pain Point]" command pattern\n8. "FREE: The [Deliverable] That Shows You..." offer pattern\n9. "Dear [Audience]:" letter pattern\n10. A wildcard creative headline\n\nFor each, include a 1-line subheadline that amplifies the hook. Use a ## heading for each headline number.';
      break;
    case "facebook_ad":
      typeInst = "Generate 3 complete Facebook ad variations. Use a ## heading for each ad. For EACH ad:\n- Hook (first 1-2 scroll-stopping lines)\n- Body (3-5 paragraphs, PAS or AIDA)\n- CTA\n- Headline (ad headline field)\n- Link Description";
      break;
    case "facebook_post":
      typeInst = "Generate 5 organic Facebook post variations designed to drive engagement and leads. Use a ## heading for each post. For EACH post:\n- Opening hook (pattern interrupt first line)\n- Body copy (conversational, value-driven, 3-8 sentences)\n- Call to action (comment, DM, or link click)\n- Suggested post type (text only, image suggestion, or video idea)\n\nMix up the formats: include a story-based post, a question post, a controversial/hot take post, a value bomb/tips post, and a social proof/results post. Write them as ready-to-copy-paste posts, not as ads.";
      break;
    case "email":
      typeInst = "Generate a 3-email nurture sequence. Use a ## heading for each email:\nEmail 1 (send immediately): 3 subject lines, preview text, body, CTA\nEmail 2 (day 2): 3 subject lines, preview text, body, CTA\nEmail 3 (day 3-4): 3 subject lines, preview text, body, CTA";
      break;
    case "landing_page":
      typeInst = "Generate full landing page copy. Use ## headings for each major section:\n- Hero Headline + Subheadline + CTA button\n- Problem Section (3-4 pain points)\n- Solution Section\n- 7-10 benefit bullets\n- Social Proof angles\n- Authority Section\n- 3-4 FAQs\n- Final CTA Section";
      break;
    default:
      typeInst = "Generate a COMPLETE offer copy suite. Use ## headings for each section:\n1. HEADLINES - 5 variations with subheadlines\n2. FACEBOOK AD - 1 complete ad\n3. EMAIL - 1 lead email with subject lines\n4. LANDING PAGE HERO - headline, subheadline, 5 bullets, CTA";
      break;
  }

  return (
    "Generate offer copy using the parameters below. Use ## markdown headers for each distinct piece of copy or numbered item so they are clearly separated as individual sections. Keep formatting clean.\n\nOFFER PARAMETERS:\n- Audience: " +
    audience + "\n- Offer: " + offer + "\n- Topic/Hook: " + topic +
    "\n- Specificity: " + (number || "Your best judgment") +
    "\n- Tone: " + toneLabel + painContext + ctaContext + "\n\n" + typeInst
  );
}

function splitSections(text) {
  if (!text) return [];
  const lines = text.split("\n");
  const sections = [];
  let buf = [];
  for (let i = 0; i < lines.length; i++) {
    const clean = lines[i].replace(/^\*\*(.+)\*\*$/, "$1");
    if ((clean.startsWith("## ") || clean.startsWith("# ")) && buf.length > 0) {
      sections.push(buf.join("\n"));
      buf = [lines[i]];
    } else {
      buf.push(lines[i]);
    }
  }
  if (buf.length > 0) sections.push(buf.join("\n"));
  return sections;
}

function RenderLines({ text }) {
  if (!text) return null;
  const cleanText = text.replace(/\*\*([^*]+)\*\*/g, "%%B%%$1%%EB%%").replace(/\*/g, "").replace(/%%B%%/g, "**").replace(/%%EB%%/g, "**");
  const lines = cleanText.split("\n");
  return lines.map((line, i) => {
    const cl = line.replace(/^\*\*(.+)\*\*$/, "$1");
    if (cl.startsWith("### ")) return <h3 key={i} style={{ fontSize: "1.05rem", fontWeight: 700, color: C.accentMuted, margin: "1.1rem 0 0.35rem" }}>{cl.slice(4).replace(/\*\*/g, "")}</h3>;
    if (cl.startsWith("## ")) return <h2 key={i} style={{ fontSize: "1.3rem", fontWeight: 700, color: C.accent, margin: "1.4rem 0 0.45rem", fontFamily: "'Oswald', sans-serif", borderBottom: `1px solid ${C.accentBorderSoft}`, paddingBottom: "0.35rem" }}>{cl.slice(3).replace(/\*\*/g, "")}</h2>;
    if (cl.startsWith("# ")) return <h1 key={i} style={{ fontSize: "1.65rem", fontWeight: 800, color: "#ffffff", margin: "1.6rem 0 0.55rem", fontFamily: "'Oswald', sans-serif" }}>{cl.slice(2).replace(/\*\*/g, "")}</h1>;
    if (line.startsWith("---")) return <hr key={i} style={{ border: "none", borderTop: `1px solid ${C.accentBorderSoft}`, margin: "1.1rem 0" }} />;
    if (line.trim() === "") return <div key={i} style={{ height: "0.45rem" }} />;
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} style={{ margin: "0.25rem 0", lineHeight: 1.75, color: C.text, fontSize: "1rem" }}>
        {parts.map((part, j) => part.startsWith("**") && part.endsWith("**") ? <strong key={j} style={{ color: "#ffffff", fontWeight: 700 }}>{part.slice(2, -2)}</strong> : <span key={j}>{part.replace(/\*/g, "")}</span>)}
      </p>
    );
  });
}

function SectionCard({ raw, index, onRefineSection, isRefining }) {
  const [copied, setCopied] = useState(false);
  const plainText = raw.replace(/^#+\s*/gm, "").replace(/\*\*/g, "").replace(/\*/g, "").replace(/---/g, "").trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefine = (e) => {
    const val = e.target.value;
    if (!val) return;
    e.target.value = "";
    onRefineSection(index, val);
  };

  return (
    <div style={{ borderBottom: `1px solid ${C.panelBorder}`, paddingBottom: "0.75rem", marginBottom: "0.5rem" }}>
      <RenderLines text={raw} />
      <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.75rem", alignItems: "center" }}>
        <button onClick={handleCopy} style={{ padding: "0.3rem 0.65rem", background: "transparent", border: `1px solid ${C.panelBorder}`, borderRadius: 6, color: copied ? C.accent : C.textDim, fontSize: "0.72rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>
          {copied ? "✅ Copied" : "📋 Copy"}
        </button>
        {isRefining ? (
          <span style={{ fontSize: "0.72rem", color: C.accent, display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ display: "inline-block", width: 14, height: 14, border: `2px solid ${C.accentDim}`, borderTopColor: C.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            Refining...
          </span>
        ) : (
          <select defaultValue="" onChange={handleRefine} style={{ padding: "0.3rem 0.5rem", background: "transparent", border: `1px solid ${C.panelBorder}`, borderRadius: 6, color: C.textDim, fontSize: "0.72rem", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", appearance: "none", WebkitAppearance: "none", backgroundImage: selectArrow, backgroundRepeat: "no-repeat", backgroundPosition: "right 0.4rem center", paddingRight: "1.4rem" }}>
            {REFINE_OPTIONS.map((o) => <option key={o.value} value={o.value} style={{ background: "#1a1a1e", color: "#eaeaea" }}>{o.label}</option>)}
          </select>
        )}
      </div>
    </div>
  );
}

export default function FFLOfferGenerator() {
  const [inputs, setInputs] = useState({ audience: "Brick-and-mortar FFL dealers running a physical gun store", audiencePreset: "bm_dealer", offer: "Free checklist / PDF download", offerPreset: "free_checklist", topic: "", number: "", tone: "curiosity", offerType: "headlines" });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("config");
  const [copyLabel, setCopyLabel] = useState("📋 Copy All");
  const [refiningIdx, setRefiningIdx] = useState(-1);

  const update = (k, v) => setInputs((p) => ({ ...p, [k]: v }));

  const generate = async () => {
    if (!inputs.topic) { setError("Fill in at least the Topic field."); return; }
    if (!inputs.offer) { setError("Select an offer type or enter a custom offer."); return; }
    setError(""); setLoading(true); setOutput(""); setTab("output");
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: buildPrompt(inputs) }) });
      const data = await res.json();
      if (data.error) { setError(data.error); setTab("config"); return; }
      if (data.text) setOutput(data.text);
      else { setError("Empty response. Try again."); setTab("config"); }
    } catch (err) { setError("Generation failed: " + err.toString()); setTab("config"); }
    finally { setLoading(false); }
  };

  const copyAll = () => { navigator.clipboard.writeText(output); setCopyLabel("✅ Copied!"); setTimeout(() => setCopyLabel("📋 Copy All"), 2500); };

  const refineAll = async (key) => {
    if (!key) return;
    setRefiningIdx(-2); setError("");
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: "Here is the full copy:\n\n---\n" + output + "\n---\n\nApply this to ALL sections: " + REFINE_INSTRUCTIONS[key] }) });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      if (data.text) setOutput(data.text);
    } catch (err) { setError("Refinement failed: " + err.toString()); }
    finally { setRefiningIdx(-1); }
  };

  const refineSection = async (idx, key) => {
    setRefiningIdx(idx); setError("");
    const sections = splitSections(output);
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: "Here is one section of copy:\n\n---\n" + sections[idx] + "\n---\n\nRewrite ONLY this section. " + REFINE_INSTRUCTIONS[key] + "\n\nReturn ONLY the rewritten section. Keep the same markdown header format." }) });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      if (data.text) { const ns = [...sections]; ns[idx] = data.text.trim(); setOutput(ns.join("\n\n")); }
    } catch (err) { setError("Refinement failed: " + err.toString()); }
    finally { setRefiningIdx(-1); }
  };

  const fields = [
    { key: "topic", label: "Topic / Core Hook *", ph: "e.g. Getting to top of Google, Doubling walk-in traffic" },
    { key: "number", label: "Number / Specificity", ph: "e.g. 5 hacks, 3 mistakes (optional)" },
  ];

  const sections = splitSections(output);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', sans-serif", color: C.text }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at 30% 0%, rgba(0,186,255,0.04) 0%, transparent 55%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto", padding: "1.75rem 1.5rem 2.5rem" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.35rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: 7, background: `linear-gradient(135deg, ${C.accent}, ${C.accentMuted})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 800, color: "#000", fontFamily: "'Oswald', sans-serif" }}>FFL</div>
          <span style={{ fontSize: "0.72rem", color: C.textMuted, letterSpacing: "0.15em", textTransform: "uppercase" }}>FFL Funnels</span>
        </div>
        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(2rem, 4.5vw, 3rem)", color: "#ffffff", letterSpacing: "0.03em", margin: "0.45rem 0 0.2rem", lineHeight: 1.05 }}>OFFER GENERATOR</h1>
        <p style={{ color: C.textMuted, fontSize: "0.95rem", margin: "0 0 1.35rem" }}>AI-powered offer copy for the firearms industry</p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.45rem", marginBottom: "1.1rem" }}>
          {[{ id: "config", label: "⚙️ Build Offer" }, { id: "output", label: output ? "📋 Copy ✓" : "📋 Copy" }].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "0.65rem", background: tab === t.id ? C.accentDim : "rgba(255,255,255,0.02)", border: `1px solid ${tab === t.id ? C.accentBorder : C.panelBorder}`, borderRadius: 9, color: tab === t.id ? C.accent : C.textDim, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'DM Sans', sans-serif" }}>{t.label}</button>
          ))}
        </div>

        {/* CONFIG */}
        {tab === "config" && (
          <div style={{ background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: 14, padding: "1.5rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.55rem" }}>What are you building?</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))", gap: "0.45rem", marginBottom: "1.5rem" }}>
              {TYPES.map((t) => (
                <button key={t.id} onClick={() => update("offerType", t.id)} style={{ padding: "0.7rem 0.65rem", background: inputs.offerType === t.id ? C.accentDim : "rgba(255,255,255,0.015)", border: `1px solid ${inputs.offerType === t.id ? C.accentBorder : C.panelBorder}`, borderRadius: 9, color: inputs.offerType === t.id ? C.accent : C.textMuted, cursor: "pointer", fontSize: "0.88rem", fontWeight: 600, textAlign: "left", display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "'DM Sans', sans-serif" }}>
                  <span style={{ fontSize: "1.05rem" }}>{t.icon}</span>{t.label}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: "1.1rem" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.4rem" }}>Who are you targeting?</div>
              <select value={inputs.audiencePreset} onChange={(e) => { const id = e.target.value; const p = AUDIENCES.find((a) => a.id === id); update("audiencePreset", id); update("audience", id !== "custom" ? (p?.value || "") : ""); }} style={selectStyle}>
                {AUDIENCES.map((a) => <option key={a.id} value={a.id} style={{ background: "#1a1a1e", color: "#eaeaea" }}>{a.label}</option>)}
              </select>
            </div>
            {inputs.audiencePreset === "custom" && <div style={{ marginBottom: "1.1rem" }}><input type="text" value={inputs.audience} onChange={(e) => update("audience", e.target.value)} placeholder="Describe your target audience..." style={inputStyle} /></div>}

            <div style={{ marginBottom: "1.1rem" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.4rem" }}>Offer Type / Lead Magnet *</div>
              <select value={inputs.offerPreset} onChange={(e) => { const id = e.target.value; const fw = OFFER_FRAMEWORKS.find((o) => o.id === id); update("offerPreset", id); update("offer", id !== "custom_offer" ? (fw?.value || "") : ""); }} style={selectStyle}>
                {OFFER_FRAMEWORKS.map((o) => <option key={o.id} value={o.id} style={{ background: "#1a1a1e", color: "#eaeaea" }}>{o.label}</option>)}
              </select>
            </div>
            {inputs.offerPreset === "custom_offer" && <div style={{ marginBottom: "1.1rem" }}><input type="text" value={inputs.offer} onChange={(e) => update("offer", e.target.value)} placeholder="Describe your offer or lead magnet..." style={inputStyle} /></div>}

            {fields.map((f) => (
              <div key={f.key} style={{ marginBottom: "1.1rem" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.4rem" }}>{f.label}</div>
                <input type="text" value={inputs[f.key]} onChange={(e) => update(f.key, e.target.value)} placeholder={f.ph} style={inputStyle} />
              </div>
            ))}

            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.5rem" }}>Tone</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.5rem" }}>
              {TONES.map((t) => (
                <button key={t.id} onClick={() => update("tone", t.id)} style={{ padding: "0.48rem 0.85rem", background: inputs.tone === t.id ? C.accentDim : "transparent", border: `1px solid ${inputs.tone === t.id ? C.accentBorder : C.inputBorder}`, borderRadius: 20, color: inputs.tone === t.id ? C.accent : C.textDim, cursor: "pointer", fontSize: "0.85rem", fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>{t.label}</button>
              ))}
            </div>

            {error && <div style={{ background: "rgba(200,50,50,0.1)", border: "1px solid rgba(200,50,50,0.25)", borderRadius: 9, padding: "0.65rem 1rem", color: "#e07070", fontSize: "0.9rem", marginBottom: "1rem", wordBreak: "break-word" }}>{error}</div>}

            <button onClick={generate} disabled={loading} style={{ width: "100%", padding: "1.05rem", background: loading ? C.accentDim : `linear-gradient(135deg, ${C.accent}, ${C.accentMuted})`, border: "none", borderRadius: 11, color: loading ? C.accent : "#000", fontSize: "1.1rem", fontWeight: 700, fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em", cursor: loading ? "default" : "pointer" }}>
              {loading ? "⏳ GENERATING..." : "⚡ GENERATE OFFER COPY"}
            </button>
          </div>
        )}

        {/* OUTPUT */}
        {tab === "output" && (
          <div style={{ background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: 14, padding: "1.5rem", minHeight: 320 }}>
            {output && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}>
                <span style={{ fontSize: "0.72rem", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.1em" }}>Your Offer Copy</span>
                <div style={{ display: "flex", gap: "0.45rem" }}>
                  <button onClick={() => setTab("config")} style={{ padding: "0.42rem 0.85rem", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.inputBorder}`, borderRadius: 7, color: C.textMuted, fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Edit</button>
                  <button onClick={copyAll} style={{ padding: "0.42rem 0.85rem", background: C.accentDim, border: `1px solid ${C.accentBorderSoft}`, borderRadius: 7, color: C.accent, fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{copyLabel}</button>
                </div>
              </div>
            )}

            {loading && !output && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 280, gap: "0.85rem" }}>
                <div style={{ width: 44, height: 44, border: `3px solid ${C.accentDim}`, borderTopColor: C.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <p style={{ color: C.textMuted, fontSize: "0.95rem" }}>Crafting your offer copy...</p>
                <p style={{ color: C.textDim, fontSize: "0.85rem" }}>This takes 15-30 seconds</p>
              </div>
            )}

            {!loading && !output && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 280, textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.65rem", opacity: 0.2 }}>✍️</div>
                <p style={{ color: C.textDim, fontSize: "0.95rem" }}>Configure your offer and hit Generate</p>
              </div>
            )}

            {/* Sections with per-section copy + refine */}
            {output && sections.length > 1 && sections.map((sec, idx) => (
              <SectionCard key={idx} raw={sec} index={idx} onRefineSection={refineSection} isRefining={refiningIdx === idx} />
            ))}

            {output && sections.length <= 1 && <RenderLines text={output} />}

            {/* Refine All */}
            {output && (
              <div style={{ marginTop: "1.25rem", borderTop: `1px solid ${C.panelBorder}`, paddingTop: "1rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", whiteSpace: "nowrap" }}>Refine all:</div>
                {refiningIdx === -2 ? (
                  <span style={{ fontSize: "0.8rem", color: C.accent, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ display: "inline-block", width: 16, height: 16, border: `2px solid ${C.accentDim}`, borderTopColor: C.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    Refining everything...
                  </span>
                ) : (
                  <select defaultValue="" onChange={(e) => { refineAll(e.target.value); e.target.value = ""; }} disabled={refiningIdx >= 0} style={{ padding: "0.4rem 0.65rem", background: "transparent", border: `1px solid ${C.panelBorder}`, borderRadius: 7, color: C.textDim, fontSize: "0.78rem", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: refiningIdx >= 0 ? "default" : "pointer", appearance: "none", WebkitAppearance: "none", backgroundImage: selectArrow, backgroundRepeat: "no-repeat", backgroundPosition: "right 0.5rem center", paddingRight: "1.6rem", opacity: refiningIdx >= 0 ? 0.4 : 1 }}>
                    {REFINE_OPTIONS.map((o) => <option key={o.value} value={o.value} style={{ background: "#1a1a1e", color: "#eaeaea" }}>{o.value ? o.label : "Choose refinement..."}</option>)}
                  </select>
                )}
              </div>
            )}

            {error && output && <div style={{ background: "rgba(200,50,50,0.1)", border: "1px solid rgba(200,50,50,0.25)", borderRadius: 9, padding: "0.65rem 1rem", color: "#e07070", fontSize: "0.9rem", marginTop: "1rem", wordBreak: "break-word" }}>{error}</div>}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } input::placeholder { color: #3e3e46; }`}</style>
    </div>
  );
}
