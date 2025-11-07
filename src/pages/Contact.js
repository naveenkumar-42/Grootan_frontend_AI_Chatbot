import React, { useState } from "react";
import LandingHeader from "../components/LandingHeader";

/**
 * Contact.js
 * Simple contact page matching Grootan theme.
 * - Name, email, subject, message fields
 * - Basic validation
 * - Mock submit (replace with fetch/axios call to your backend)
 * - Internal CSS only
 */

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: "idle", msg: "" }); // idle | sending | success | error

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.message.trim()) e.message = "Message is required.";
    return e;
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setStatus({ state: "sending", msg: "Sending…" });

    try {
      // Replace this block with your real API call.
      // Example:
      // await fetch("/api/contact", { method: "POST", headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });

      // Simulate network latency
      await new Promise((res) => setTimeout(res, 800));

      setStatus({ state: "success", msg: "Thanks — your message has been sent. We'll get back to you soon!" });
      setForm({ name: "", email: "", subject: "", message: "" });
      setErrors({});
      // clear success after a while
      setTimeout(() => setStatus({ state: "idle", msg: "" }), 5000);
    } catch (err) {
      console.error(err);
      setStatus({ state: "error", msg: "Something went wrong. Please try again later." });
    }
  }

  return (
    <div className="contact-root">
      <style>{`
        :root{
          --bg:#081b29;
          --card:#112e42;
          --muted: rgba(255,255,255,0.92);
          --accent:#00fa9a;
          --accent-2:#00c441;
        }
        *{box-sizing:border-box}
        body,html,#root{height:100%}
        .contact-root{
          min-height:100vh;
          background: radial-gradient(800px 300px at 8% 12%, rgba(0,150,136,0.04), transparent),
                      linear-gradient(180deg, rgba(4,18,30,1) 0%, var(--bg) 66%);
          color: #fff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial;
          display:flex;
          flex-direction:column;
          align-items:center;
        }

        .page-container {
          width:100%;
          max-width:1000px;
          padding:36px;
        }

        .hero {
          background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
          border:1px solid rgba(255,255,255,0.04);
          border-radius:14px;
          padding:28px;
          display:flex;
          gap:28px;
          align-items:stretch;
          box-shadow: 0 14px 40px rgba(0,0,0,0.5);
        }

        .left {
          flex:1;
        }
        .right {
          width:360px;
          min-width:260px;
        }

        .title {
          font-size:26px;
          font-weight:800;
          margin-bottom:6px;
          color:#fff;
        }
        .lead {
          color: rgba(255,255,255,0.8);
          margin-bottom:18px;
        }

        form { display:flex; flex-direction:column; gap:12px; }

        .row {
          display:flex; gap:12px;
        }
        .field {
          display:flex; flex-direction:column;
        }
        label { font-size:13px; color:rgba(255,255,255,0.85); margin-bottom:6px; font-weight:700; }
        input, textarea {
          background: rgba(255,255,255,0.02);
          border:1px solid rgba(255,255,255,0.04);
          color:var(--muted);
          padding:10px 12px;
          border-radius:10px;
          outline:none;
          font-size:14px;
        }
        textarea { min-height:140px; resize:vertical; }

        .error { color:#ffb4b4; font-size:13px; margin-top:6px; }

        .submit-row { display:flex; gap:12px; align-items:center; margin-top:6px; }
        .btn-primary {
          background: linear-gradient(90deg, var(--accent), var(--accent-2));
          color:#062017;
          padding:10px 16px;
          border-radius:10px;
          border:none;
          font-weight:800;
          cursor:pointer;
        }
        .btn-ghost {
          background: transparent;
          color: rgba(255,255,255,0.92);
          padding:10px 14px;
          border-radius:10px;
          border:1px solid rgba(255,255,255,0.06);
          cursor:pointer;
        }

        .info-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.01), transparent);
          border-radius:12px;
          padding:18px;
          border:1px solid rgba(255,255,255,0.04);
        }
        .info-title { font-weight:800; margin-bottom:8px; color:#fff; }
        .info p { color: rgba(255,255,255,0.86); margin:6px 0; font-size:14px; }

        .small { font-size:13px; color:rgba(255,255,255,0.78); }
        .status { margin-left:8px; font-size:14px; }

        @media (max-width:900px) {
          .hero { flex-direction:column; }
          .right { width:100%; }
          .row { flex-direction:column; }
        }
      `}</style>

      <div className="page-container">
        <div style={{ marginBottom: 18 }}>
          <LandingHeader />
        </div>

        <div className="hero" role="main" aria-labelledby="contact-heading">
          <div className="left" id="contact-heading">
            <div className="title">Contact Grootan</div>
            <div className="lead">Have a question, bug report, or want an enterprise demo? Send us a message and we’ll reply within a few business days.</div>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="field" style={{ flex: 1 }}>
                  <label htmlFor="name">Your name</label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                    placeholder="Jane Doe"
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <div className="error">{errors.name}</div>}
                </div>

                <div className="field" style={{ width: 260 }}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    value={form.email}
                    onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                    placeholder="you@company.com"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <div className="error">{errors.email}</div>}
                </div>
              </div>

              <div className="field">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  value={form.subject}
                  onChange={(e) => setForm((s) => ({ ...s, subject: e.target.value }))}
                  placeholder="Brief subject (optional)"
                />
              </div>

              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                  placeholder="Tell us what's on your mind..."
                  aria-invalid={!!errors.message}
                />
                {errors.message && <div className="error">{errors.message}</div>}
              </div>

              <div className="submit-row">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={status.state === "sending"}
                >
                  {status.state === "sending" ? "Sending…" : "Send message"}
                </button>

                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => {
                    setForm({ name: "", email: "", subject: "", message: "" });
                    setErrors({});
                    setStatus({ state: "idle", msg: "" });
                  }}
                >
                  Reset
                </button>

                <div className="status">
                  {status.state === "success" && <span style={{ color: "#b6ffdc" }}>{status.msg}</span>}
                  {status.state === "error" && <span style={{ color: "#ffb4b4" }}>{status.msg}</span>}
                </div>
              </div>
            </form>
          </div>

          <aside className="right">
            <div className="info-card">
              <div className="info-title">Contact & Support</div>
              <div className="info">
                <p><strong>Email</strong><br />support@grootan.ai</p>
                <p><strong>Office</strong><br />Grootan Labs, Bengaluru</p>
                <p className="small">We typically respond within 1–3 business days.</p>
              </div>
            </div>

            <div style={{ height: 14 }} />

            <div className="info-card">
              <div className="info-title">Security & Privacy</div>
              <p className="small">Grootan is privacy-first — please do not include highly sensitive personal data in messages. For data subject requests, contact privacy@grootan.ai.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
