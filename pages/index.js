import { useState } from "react";

const EXAMPLES = {
  spam: `Subject: YOU WON $5,000,000!!! CLAIM NOW!!!

Dear Lucky Winner,

CONGRATULATIONS!! Your email was SELECTED in our international lottery draw. You have WON FIVE MILLION DOLLARS ($5,000,000.00 USD)!!!

To claim your prize IMMEDIATELY, send us your full name, bank account number, and a processing fee of $250 via Western Union.

ACT NOW before your prize expires in 24 HOURS!!!

Click here: http://claim-prize-now-urgent.xyz

Regards,
Dr. James Williams
International Lottery Commission`,

  legit: `Subject: Your order has shipped - Order #84921

Hi Sarah,

Great news — your order has shipped and is on its way!

Order #84921
Items: Blue Linen Shirt (M), Canvas Tote Bag
Estimated delivery: April 28–30

You can track your package using the link in your account dashboard.

If you have any questions, just reply to this email or visit our Help Center.

Thanks for shopping with us,
The Everlane Team`,
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeEmail = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API error");
      setResult(data);
    } catch (err) {
      setError("Something went wrong: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const isSpam = result?.verdict === "SPAM";

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", fontFamily: "'Courier New', monospace", color: "#e8e8e8" }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        textarea:focus { outline: none !important; border-color: #ff8800 !important; box-shadow: 0 0 0 3px rgba(255,136,0,0.15) !important; }
        textarea::placeholder { color: #3a3a4a; }
        .try-btn:hover { background: #1e1e2e !important; border-color: #ff8800 !important; color: #ff8800 !important; }
        .analyze-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(255,136,0,0.5) !important; }
      `}</style>

      <div style={{ background: "#0d0d15", borderBottom: "1px solid #1e1e2e", padding: "24px 40px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: "linear-gradient(135deg, #ff4444, #ff8800)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 0 20px rgba(255,68,68,0.4)" }}>🛡️</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: "bold", letterSpacing: 3, color: "#fff", textTransform: "uppercase" }}>SpamShield</div>
          <div style={{ fontSize: 11, color: "#555", letterSpacing: 2 }}>AI-POWERED EMAIL ANALYZER</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#44ff44", boxShadow: "0 0 8px #44ff44", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, color: "#555", letterSpacing: 2 }}>LIVE</span>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <label style={{ fontSize: 11, letterSpacing: 3, color: "#666", textTransform: "uppercase" }}>Paste Email Content</label>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="try-btn" onClick={() => { setEmail(EXAMPLES.spam); setResult(null); }} style={{ fontSize: 10, letterSpacing: 2, padding: "4px 10px", background: "transparent", border: "1px solid #2a2a3a", color: "#666", borderRadius: 4, cursor: "pointer", textTransform: "uppercase", transition: "all 0.2s", fontFamily: "inherit" }}>Try Spam</button>
              <button className="try-btn" onClick={() => { setEmail(EXAMPLES.legit); setResult(null); }} style={{ fontSize: 10, letterSpacing: 2, padding: "4px 10px", background: "transparent", border: "1px solid #2a2a3a", color: "#666", borderRadius: 4, cursor: "pointer", textTransform: "uppercase", transition: "all 0.2s", fontFamily: "inherit" }}>Try Legit</button>
            </div>
          </div>
          <textarea value={email} onChange={(e) => { setEmail(e.target.value); setResult(null); }} placeholder="Paste the full email here — subject, body, everything..." rows={12} style={{ width: "100%", background: "#0d0d15", border: "1px solid #1e1e2e", borderRadius: 10, color: "#c8c8d8", padding: 18, fontSize: 13, lineHeight: 1.7, resize: "vertical", transition: "all 0.2s", fontFamily: "inherit" }} />
        </div>

        <button className="analyze-btn" onClick={analyzeEmail} disabled={loading || !email.trim()} style={{ width: "100%", padding: 16, borderRadius: 10, border: "none", background: loading || !email.trim() ? "#1a1a24" : "linear-gradient(135deg, #ff8800, #ff4444)", color: loading || !email.trim() ? "#444" : "#fff", fontSize: 12, letterSpacing: 3, fontWeight: "bold", textTransform: "uppercase", cursor: loading || !email.trim() ? "not-allowed" : "pointer", transition: "all 0.25s", boxShadow: loading || !email.trim() ? "none" : "0 4px 20px rgba(255,136,0,0.35)", fontFamily: "inherit" }}>
          {loading ? "⟳  Analyzing..." : "🔍  Analyze Email"}
        </button>

        {error && <div style={{ marginTop: 20, padding: 16, background: "#1a0808", border: "1px solid #440000", borderRadius: 10, color: "#ff6666", fontSize: 13 }}>⚠ {error}</div>}

        {result && (
          <div style={{ marginTop: 28, animation: "fadeIn 0.4s ease" }}>
            <div style={{ borderRadius: 12, padding: "28px 32px", marginBottom: 20, background: isSpam ? "linear-gradient(135deg,#1a0505,#200808)" : "linear-gradient(135deg,#031208,#071a0e)", border: `1px solid ${isSpam ? "#440000" : "#004422"}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ fontSize: 44 }}>{isSpam ? "🚨" : "✅"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 28, fontWeight: "bold", letterSpacing: 4, color: isSpam ? "#ff4444" : "#44ff88", textTransform: "uppercase" }}>{result.verdict}</div>
                  <div style={{ fontSize: 13, color: "#777", marginTop: 4 }}>{result.summary}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, letterSpacing: 2, color: "#444", textTransform: "uppercase", marginBottom: 4 }}>Spam Score</div>
                  <div style={{ fontSize: 36, fontWeight: "bold", color: isSpam ? "#ff4444" : "#44ff88" }}>{result.score}<span style={{ fontSize: 16, color: "#444" }}>/100</span></div>
                </div>
              </div>
              <div style={{ marginTop: 20, height: 6, background: "#0a0a0a", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 3, width: `${result.score}%`, background: isSpam ? "linear-gradient(90deg,#ff8800,#ff2222)" : "linear-gradient(90deg,#00aa44,#44ff88)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: "#333", letterSpacing: 2 }}>
                <span>SAFE</span><span>SUSPICIOUS</span><span>SPAM</span>
              </div>
            </div>

            <div style={{ background: "#0d0d15", border: "1px solid #1e1e2e", borderRadius: 12, padding: "24px 28px" }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: "#444", textTransform: "uppercase", marginBottom: 16 }}>Detection Signals</div>
              {result.reasons?.map((reason, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: i < result.reasons.length - 1 ? "1px solid #141420" : "none" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", marginTop: 6, flexShrink: 0, background: isSpam ? "#ff4444" : "#44ff88" }} />
                  <span style={{ fontSize: 13, color: "#999", lineHeight: 1.6 }}>{reason}</span>
                </div>
              ))}
              <div style={{ marginTop: 16, padding: "10px 14px", background: "#0a0a12", borderRadius: 8, fontSize: 11, color: "#444" }}>
                Confidence: <span style={{ color: "#666" }}>{result.confidence}%</span> · Powered by Claude AI
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
