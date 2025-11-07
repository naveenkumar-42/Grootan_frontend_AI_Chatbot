import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingHeader from "../components/LandingHeader";

export default function LandingPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState("");

  function submitEmail(e) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailMsg("Please enter a valid email.");
      return;
    }
    // TODO: replace with real API call
    setEmailMsg("Thanks — we'll reach out soon!");
    setEmail("");
    setTimeout(() => setEmailMsg(""), 5000);
  }

  return (
    <div className="lp-root">
      <style>{`
        :root{
          --bg:#081b29;
          --card:#112e42;
          --muted: rgba(255,255,255,0.88);
          --accent:#00fa9a;
          --accent-2:#00c441;
          --glass: rgba(255,255,255,0.03);
        }

        *{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{height:100%}

        .lp-root{
          min-height:100vh;
          background: radial-gradient(1200px 480px at 8% 12%, rgba(0,150,136,0.06), transparent),
                      linear-gradient(180deg, rgba(4,18,30,1) 0%, var(--bg) 66%);
          color: #fff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          display:flex;
          flex-direction:column;
          align-items:center;
          text-align:center;
        }

        /* outer container with roomy sides */
        .container {
          width:100%;
          max-width:1400px;
          padding:48px 36px;
        }

        /* Hero - much more roomy */
        .hero {
          margin-top:34px;
          display:grid;
          grid-template-columns: 1fr 520px;
          gap:48px;
          height:100hv;
          align-items:center;
          justify-items:center;
        }

        .hero-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 18px 60px rgba(3,12,20,0.65);
          border-radius: 22px;
          padding:56px;
          width:100%;
          max-width:880px;
          text-align:left;
          color:var(--muted);
          overflow:hidden;
        }

        .eyebrow {
          display:inline-block;
          background: var(--glass);
          color: var(--accent);
          padding:8px 14px;
          border-radius:999px;
          font-weight:700;
          margin-bottom:22px;
          font-size:13px;
          letter-spacing:0.6px;
        }

        .hero-title{
          font-size:44px;
          line-height:1.02;
          color:white;
          margin-bottom:18px;
          font-weight:800;
        }

        .hero-lead{
          color: rgba(255,255,255,0.88);
          margin-bottom:28px;
          font-size:18px;
          line-height:1.7;
          max-width:760px;
        }

        .cta-row { display:flex; gap:16px; align-items:center; flex-wrap:wrap; margin-bottom:28px; }

        .btn-primary {
          background: linear-gradient(90deg, var(--accent), var(--accent-2));
          color: #00210b;
          padding:14px 24px;
          border-radius:14px;
          font-weight:800;
          border:none;
          cursor:pointer;
          box-shadow: 0 12px 40px rgba(0,196,65,0.12);
          transition: transform .18s ease, box-shadow .18s;
          font-size:16px;
        }
        .btn-primary:hover{ transform: translateY(-4px); box-shadow: 0 22px 48px rgba(0,196,65,0.18); }

        .btn-ghost{
          background: transparent;
          border:1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.94);
          padding:12px 18px;
          border-radius:12px;
          font-weight:700;
          font-size:15px;
        }

        .hero-features{
          display:flex;
          gap:18px;
          margin-top:22px;
          flex-wrap:wrap;
        }

        .small-feature{
          display:flex;
          gap:12px;
          align-items:flex-start;
          background: rgba(255,255,255,0.02);
          padding:12px 14px;
          border-radius:12px;
          border:1px solid rgba(255,255,255,0.02);
        }
        .small-feature b{ color:var(--accent); font-size:15px; margin-bottom:4px; display:block; }

        .stats {
          display:flex;
          gap:20px;
          justify-content:flex-start;
          margin-top:28px;
        }
        .stat {
          background: rgba(255,255,255,0.02);
          padding:14px 18px;
          border-radius:14px;
          text-align:center;
          border:1px solid rgba(255,255,255,0.02);
          min-width:140px;
        }
        .stat .num { font-weight:900; font-size:22px; color:white; }
        .stat .label { font-size:13px; color:rgba(255,255,255,0.76); margin-top:6px; }

        /* Visual - larger with more padding */
        .hero-visual {
          width:100%;
          max-width:520px;
          background: linear-gradient(180deg, rgba(0,0,0,0.14), rgba(255,255,255,0.02));
          border-radius:18px;
          padding:28px;
          border:1px solid rgba(255,255,255,0.04);
          box-shadow: 0 16px 48px rgba(2,8,15,0.6);
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .visual-placeholder{
          width:100%;
          height:420px;
          border-radius:14px;
          background:
            linear-gradient(135deg, rgba(0,196,65,0.08), rgba(0,122,255,0.06)),
            linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
          display:flex;
          align-items:center;
          justify-content:center;
          color:rgba(255,255,255,0.9);
          flex-direction:column;
          gap:14px;
          padding:22px;
          text-align:center;
        }

        .visual-illustration {
          width:220px;
          height:220px;
          border-radius:22px;
          background: radial-gradient(circle at 20% 20%, rgba(0,255,170,0.12), transparent 10%),
                      linear-gradient(135deg, rgba(0,196,65,0.22), rgba(0,122,255,0.16));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
        }

        /* Features grid - more spacious */
        .features-section {
          margin-top:56px;
          display:grid;
          gap:26px;
          grid-template-columns: repeat(3, 1fr);
        }
        .feature-card {
          padding:28px;
          background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
          border-radius:14px;
          color:var(--muted);
          border:1px solid rgba(255,255,255,0.04);
          transition: transform .22s ease, box-shadow .22s;
        }
        .feature-card:hover{ transform: translateY(-10px); box-shadow: 0 28px 60px rgba(0,0,0,0.5); }
        .feature-icon {
          width:62px; height:62px; border-radius:14px; display:inline-grid; align-items:center; justify-content:center;
          background: rgba(255,255,255,0.02); color:var(--accent); font-weight:900; margin-bottom:14px; font-size:22px;
        }
        .feature-card h4{ color:white; margin-bottom:12px; font-size:18px; }
        .feature-card p{ color:rgba(255,255,255,0.88); font-size:15px; line-height:1.6; }

        /* Testimonials - richer layout */
        .testimonials {
          margin-top:46px;
          display:grid;
          grid-template-columns: repeat(3, 1fr);
          gap:22px;
          align-items:stretch;
          justify-content:center;
        }
        .testimonial {
          padding:22px;
          border-radius:14px;
          background: linear-gradient(180deg, rgba(255,255,255,0.01), transparent);
          border:1px solid rgba(255,255,255,0.04);
          display:flex;
          flex-direction:column;
          gap:12px;
        }
        .meta { display:flex; gap:12px; align-items:center; }
        .avatar { width:52px; height:52px; border-radius:10px; background: linear-gradient(135deg, rgba(0,196,65,0.12), rgba(0,122,255,0.06)); display:inline-grid; place-items:center; font-weight:800; color:white; }
        .testimony-quote { color: rgba(255,255,255,0.9); margin-bottom:6px; font-size:15px; line-height:1.6; }
        .testimony-person { font-weight:800; color:var(--accent); font-size:13px; }
        .testimony-role { font-size:13px; color:rgba(255,255,255,0.76); }

        .rating { color: #ffd166; font-weight:700; }

        /* CTA bar - roomy & expanded */
        .cta-bar {
          margin-top:56px;
          background: linear-gradient(90deg, rgba(0,0,0,0.18), rgba(0,0,0,0.08));
          border-radius:14px;
          padding:22px;
          display:flex;
          gap:24px;
          align-items:center;
          justify-content:space-between;
          flex-wrap:wrap;
          border:1px solid rgba(255,255,255,0.03);
        }
        .cta-left { text-align:left; min-width:360px; }
        .cta-left h3 { margin-bottom:8px; font-size:20px; color:white; }
        .cta-left p { margin:0; color:rgba(255,255,255,0.86); font-size:15px; }

        .cta-right { display:flex; flex-direction:column; gap:10px; align-items:flex-end; }
        .email-input { padding:10px 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.08); background: rgba(0,0,0,0.25); color:white; outline:none; min-width:220px; }
        .email-btn { padding:10px 12px; border-radius:8px; border:none; background:var(--accent); color:#062017; font-weight:700; cursor:pointer; }
        .email-note { font-size:13px; color:rgba(255,255,255,0.75); }

        .lp-footer { margin:64px 0; color:rgba(255,255,255,0.72); font-size:15px; }

        /* Responsive */
        @media (max-width: 1100px) {
          .hero { grid-template-columns: 1fr; gap:28px; }
          .visual-placeholder{ height:360px; }
          .features-section { grid-template-columns: repeat(2, 1fr); }
          .testimonials { grid-template-columns: repeat(2, 1fr); }
          .container { padding:36px 24px; }
        }
        @media (max-width: 640px) {
          .features-section { grid-template-columns: 1fr; }
          .visual-placeholder{ height:260px;}
          .hero-card{ padding:28px;}
          .hero-title{ font-size:30px;}
          .container { padding:28px 16px; }
          .cta-bar { flex-direction:column; align-items:center; gap:12px; text-align:center; }
          .cta-right { align-items:center; }
          .testimonials { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="container">
        <LandingHeader />

        {/* Hero */}
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-card">
            <div className="eyebrow">Privacy-first • OCR Redaction • Secure AI</div>
            <h1 id="hero-heading" className="hero-title">Grootan AI — Secure, Private Conversations</h1>
            <p className="hero-lead">
              Grootan AI scans images locally to detect and redact sensitive information (PII) before anything leaves your device.
              Chat with confidence — your data stays private, secure, and in control.
            </p>

            <div className="cta-row">
              <button className="btn-primary" onClick={() => navigate("/chat")}>Start Secure Chat</button>
              <button className="btn-ghost" onClick={() => navigate("/docs")}>View Docs</button>
            </div>

            <div className="hero-features">
              <div className="small-feature">
                <div style={{fontWeight:800, color:'var(--accent)'}}>Local OCR</div>
                <div style={{fontSize:14, color:'rgba(255,255,255,0.82)'}}>Detects text & PII on-device</div>
              </div>
              <div className="small-feature">
                <div style={{fontWeight:800, color:'var(--accent)'}}>Manual Review</div>
                <div style={{fontSize:14, color:'rgba(255,255,255,0.82)'}}>Confirm redactions before send</div>
              </div>
              <div className="small-feature">
                <div style={{fontWeight:800, color:'var(--accent)'}}>Encrypted Transport</div>
                <div style={{fontSize:14, color:'rgba(255,255,255,0.82)'}}>End-to-end secure backend</div>
              </div>
            </div>

            <div className="stats" style={{marginTop:28}}>
              <div className="stat">
                <div className="num">99.99%</div>
                <div className="label">Uptime</div>
              </div>
              <div className="stat">
                <div className="num">0</div>
                <div className="label">Unredacted uploads</div>
              </div>
              <div className="stat">
                <div className="num"><span style={{color:'var(--accent)'}}>Local</span></div>
                <div className="label">On-device OCR</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-placeholder" role="img" aria-label="Grootan illustration">
              <div className="visual-illustration" />
              <div style={{fontWeight:800, fontSize:20}}>Grootan AI</div>
              <div style={{color:'rgba(255,255,255,0.82)', fontSize:14}}>Privacy-focused conversation studio</div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="features-section" aria-labelledby="features-heading">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h4>Privacy by Design</h4>
            <p>PII detection & redaction happen locally. You approve anything we send.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h4>Fast OCR</h4>
            <p>Optimized text detection and rapid redaction, even on large images.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h4>Contextual AI</h4>
            <p>Context-aware replies that preserve privacy and provide helpful answers.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔗</div>
            <h4>Secure Backend</h4>
            <p>Encrypted transport and minimal storage policies for uploaded redacted files.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧰</div>
            <h4>Developer Friendly</h4>
            <p>Easy REST endpoints, webhook support, and developer tooling to integrate quickly.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h4>Analytics</h4>
            <p>Session analytics and usage stats without exposing sensitive content.</p>
          </div>
        </section>

        {/* Testimonials */}
        <section style={{marginTop:42}}>
          <h3 style={{color:'var(--accent)', marginBottom:18}}>Trusted by early adopters</h3>
          <div className="testimonials">
            <div className="testimonial">
              <div className="meta">
                <div className="avatar">PR</div>
                <div>
                  <div className="testimony-person">Priya R.</div>
                  <div className="testimony-role">ML Engineer — SecureData Labs</div>
                </div>
              </div>
              <div className="testimony-quote">"Grootan made it safe to share images with our AI pipeline — redaction is precise and easy to approve."</div>
              <div className="rating">★★★★★</div>
            </div>

            <div className="testimonial">
              <div className="meta">
                <div className="avatar">RS</div>
                <div>
                  <div className="testimony-person">Rohit S.</div>
                  <div className="testimony-role">Product Lead — FinVision</div>
                </div>
              </div>
              <div className="testimony-quote">"Local PII detection saved us months of compliance work. Seamless integration."</div>
              <div className="rating">★★★★★</div>
            </div>

            <div className="testimonial">
              <div className="meta">
                <div className="avatar">AM</div>
                <div>
                  <div className="testimony-person">Ananya M.</div>
                  <div className="testimony-role">CTO — HealthAI</div>
                </div>
              </div>
              <div className="testimony-quote">"The chat experience is fast and the security posture is top-notch."</div>
              <div className="rating">★★★★★</div>
            </div>
          </div>
        </section>

        {/* CTA bar */}
        <section className="cta-bar" style={{marginTop:48}}>
          <div className="cta-left">
            <h3>Ready to protect your data with Grootan?</h3>
            <p>Start a secure session or explore the docs to see how it fits your stack.</p>
            <div style={{marginTop:12}}>
              <button className="btn-primary" onClick={() => navigate("/chat")}>Start Secure Chat</button>
              <button className="btn-ghost" style={{marginLeft:12}} onClick={() => navigate("/docs")}>Documentation</button>
            </div>
          </div>

          <div className="cta-right">
            <div style={{fontWeight:800, fontSize:16}}>Get early access / Request a demo</div>
            <form onSubmit={submitEmail} style={{display:'flex', gap:8, alignItems:'center'}}>
              <input
                className="email-input"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="email-btn" type="submit">Request</button>
            </form>
            {emailMsg && <div className="email-note" role="status" style={{marginTop:8}}>{emailMsg}</div>}
            <div className="email-note" style={{marginTop:8}}>We’ll never share your email. By signing up you agree to our privacy policy.</div>
          </div>
        </section>

        <div className="lp-footer">© {new Date().getFullYear()} Grootan AI — Built with ❤️</div>
      </div>
    </div>
  );
}
