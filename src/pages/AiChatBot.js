import React, { useEffect, useRef, useState } from "react";
import LandingHeader from "../components/LandingHeader";

/**
 * Simplified AiChatBot — cleaner, minimal and attractive UI
 * Place this file in src/pages/AiChatBot.js
 */

export default function AiChatBot() {
  const [conversations, setConversations] = useState([
    { id: 1, title: "Welcome Chat", last: "Say hi to Grootan", created: Date.now() },
  ]);
  const [activeConv] = useState(1);

  const [messages, setMessages] = useState([
    {
      id: "m1",
      role: "assistant",
      text: "Hi — I'm Grootan. I protect privacy by masking PII and redacting images. How can I help?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  // Simple PII mask for display (email & phone)
  function maskPII(text) {
    if (!text) return text;
    return text
      .replace(/([a-zA-Z0-9._%+-])([a-zA-Z0-9._%+-]*?)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
        (m, p1, p2, domain) => `${p1}${"*".repeat(Math.max(p2.length, 3))}@${domain}`)
      .replace(/(\+?\d[\d\-\s().]{6,}\d)/g, (m) => {
        const digits = m.replace(/\D/g, "");
        if (digits.length <= 4) return m;
        return `${"*".repeat(digits.length - 4)}${digits.slice(-4)}`;
      });
  }

  function sendMessage() {
    const raw = input.trim();
    if (!raw && !imagePreview) return;

    if (raw) {
      const userMsg = {
        id: `u-${Date.now()}`,
        role: "user",
        text: maskPII(raw),
        rawText: raw,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((m) => [...m, userMsg]);
    }

    if (imagePreview) {
      const imgMsg = {
        id: `img-${Date.now()}`,
        role: "user",
        image: imagePreview,
        redacted: false,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((m) => [...m, imgMsg]);
      setImagePreview(null);
    }

    setInput("");

    // simulate assistant reply (replace with API)
    setTimeout(() => {
      const reply = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: raw
          ? `I got: "${maskPII(raw)}". I can redact images and extract PII on request.`
          : "Thanks — image received. Use the redact flow to hide PII before sending to backend.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((m) => [...m, reply]);
    }, 700);
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function onFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setImagePreview({ url, name: f.name, size: f.size });
    e.target.value = null;
  }

  return (
    <div className="ai-root">
      <style>{`
        :root{
          --bg:#081b29;
          --card:#112e42;
          --muted: rgba(255,255,255,0.9);
          --accent:#00fa9a;
          --accent-2:#00c441;
        }
        *{box-sizing:border-box}
        body,html,#root{height:100%}
        .ai-root{
          min-height:100vh;
          background: linear-gradient(180deg, rgba(4,18,30,1) 0%, var(--bg) 70%);
          color: #fff;
          font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial;
          display:flex;
          flex-direction:column;
        }

        /* header */
        .ai-header { position: sticky; top:0; z-index:50; background: transparent; padding:8px 20px; }

        /* layout */
        .ai-layout {
          display:grid;
          grid-template-columns: 220px 1fr 300px;
          gap:20px;
          padding:20px;
          align-items:start;
        }

        @media (max-width:1000px) {
          .ai-layout { grid-template-columns: 1fr; padding:12px; }
          .left-col, .right-panel { display:none; }
        }

        /* left sidebar */
        .left-col {
          background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
          border-radius:12px;
          padding:14px;
          border:1px solid rgba(255,255,255,0.04);
          min-height: 60vh;
        }
        .left-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
        .new-btn { background:var(--accent); color:#062017; padding:8px 12px; border-radius:10px; font-weight:700; border:none; cursor:pointer; }
        .conv-list { display:flex; flex-direction:column; gap:8px; margin-top:8px; max-height:56vh; overflow:auto; padding-right:6px; }
        .conv-item { padding:10px; border-radius:10px; cursor:pointer; font-size:14px; display:flex; justify-content:space-between; align-items:center; color:rgba(255,255,255,0.92); }
        .conv-item.active { background: linear-gradient(90deg, rgba(0,196,65,0.06), rgba(0,196,65,0.02)); border:1px solid rgba(0,196,65,0.08); font-weight:700; }

        /* center chat */
        .center-col { display:flex; flex-direction:column; gap:12px; min-height:80vh; }
        .chat-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
          padding:18px;
          border-radius:12px;
          border:1px solid rgba(255,255,255,0.04);
          box-shadow: 0 10px 32px rgba(0,0,0,0.6);
          display:flex;
          flex-direction:column;
          height: calc(100vh - 200px);
        }
        .chat-head { display:flex; align-items:center; gap:12px; margin-bottom:8px; }
        .agent-badge { width:44px; height:44px; border-radius:10px; display:grid; place-items:center; font-weight:800; background: linear-gradient(135deg, rgba(0,196,65,0.12), rgba(0,122,255,0.06)); color:white; }

        .chat-scroll { overflow:auto; padding-right:10px; flex:1; }
        .msg-row { display:flex; gap:12px; margin-bottom:14px; align-items:flex-end; }
        .msg-row.assistant { justify-content:flex-start; }
        .msg-row.user { justify-content:flex-end; }
        .bubble { max-width:72%; padding:14px 16px; border-radius:12px; line-height:1.45; font-size:15px; }
        .bubble.assistant { background: rgba(255,255,255,0.03); color:var(--muted); border:1px solid rgba(255,255,255,0.03); border-bottom-left-radius:6px; }
        .bubble.user { background: linear-gradient(90deg, var(--accent), var(--accent-2)); color:#062017; border-bottom-right-radius:6px; }
        .msg-meta { font-size:12px; color:rgba(255,255,255,0.6); margin-top:8px; text-align:right; }

        /* image preview */
        .img-preview { max-width:320px; border-radius:10px; overflow:hidden; position:relative; border:1px solid rgba(255,255,255,0.04); }
        .img-preview img { display:block; width:100%; height:auto; }

        /* composer */
        .composer { margin-top:12px; display:flex; gap:12px; align-items:flex-end; }
        .input-area { flex:1; display:flex; gap:10px; align-items:center; background: rgba(255,255,255,0.02); padding:12px; border-radius:12px; border:1px solid rgba(255,255,255,0.04); }
        .text-input { width:100%; min-height:48px; max-height:120px; resize:none; border:none; outline:none; background:transparent; color:var(--muted); font-size:15px; }
        .send-btn { background:var(--accent); color:#062017; padding:10px 14px; border-radius:10px; border:none; font-weight:800; cursor:pointer; }

        /* right panel */
        .right-panel { background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent); border-radius:12px; padding:14px; border:1px solid rgba(255,255,255,0.04); min-height:60vh; }
        .badge { display:inline-block; padding:8px 10px; border-radius:999px; background:rgba(0,196,65,0.06); color:var(--accent); font-weight:700; }

        /* responsive */
        @media (max-width:700px) {
          .chat-card { height: calc(100vh - 120px); }
        }
      `}</style>

      <div className="ai-header">
        <LandingHeader />
      </div>

      <div className="ai-layout">
        {/* LEFT */}
        <aside className="left-col">
          <div className="left-top">
            <div style={{ fontWeight: 800 }}>Conversations</div>
            <button
              className="new-btn"
              onClick={() => {
                const id = Date.now();
                setConversations((c) => [{ id, title: "New Chat", last: "Start typing...", created: Date.now() }, ...c]);
              }}
            >
              + New
            </button>
          </div>

          <div className="conv-list">
            {conversations.map((c) => (
              <div key={c.id} className={`conv-item ${c.id === activeConv ? "active" : ""}`}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: "linear-gradient(135deg, rgba(0,196,65,0.12), rgba(0,122,255,0.06))",
                    display: "grid", placeItems: "center", fontWeight: 700
                  }}>{(c.title || "C").slice(0, 1)}</div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ fontWeight: 700 }}>{c.title}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.66)" }}>{c.last}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{new Date(c.created).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* CENTER */}
        <main className="center-col">
          <div className="chat-card" role="region" aria-label="Chat">
            <div className="chat-head">
              <div className="agent-badge">GA</div>
              <div>
                <div style={{ fontWeight: 800 }}>Grootan AI</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.78)" }}>Privacy-first assistant</div>
              </div>
            </div>

            <div className="chat-scroll" aria-live="polite">
              {messages.map((m) => (
                <div key={m.id} className={`msg-row ${m.role === "assistant" ? "assistant" : "user"}`}>
                  {m.role === "assistant" && <div className="agent-badge" style={{ width: 36, height: 36 }}>G</div>}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: m.role === "assistant" ? "flex-start" : "flex-end" }}>
                    {m.image ? (
                      <div className="img-preview">
                        <img src={m.image.url} alt={m.image.name || "uploaded"} />
                        <div style={{ padding: 8, fontSize: 12, color: "rgba(255,255,255,0.8)" }}>{m.image.name}</div>
                        <div className="msg-meta">{m.time}</div>
                      </div>
                    ) : (
                      <div className={`bubble ${m.role === "assistant" ? "assistant" : "user"}`}>
                        {m.text}
                        <div className="msg-meta">{m.time}</div>
                      </div>
                    )}
                  </div>
                  {m.role === "user" && <div className="agent-badge" style={{ width: 36, height: 36 }}>U</div>}
                </div>
              ))}

              <div ref={endRef} style={{ height: 8 }} />
            </div>

            {/* composer */}
            <div>
              <div className="composer">
                <div className="input-area">
                  <textarea
                    className="text-input"
                    placeholder="Type a message... (emails/phones will be masked visually)"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                  />

                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <label style={{ cursor: "pointer", color: "var(--muted)" }}>
                      📷
                      <input type="file" accept="image/*" onChange={onFileChange} style={{ display: "none" }} />
                    </label>
                    <button className="send-btn" onClick={sendMessage}>Send</button>
                  </div>
                </div>
              </div>

              {/* image preview */}
              {imagePreview && (
                <div style={{ marginTop: 10, display: "flex", gap: 12, alignItems: "center" }}>
                  <div className="img-preview" style={{ maxWidth: 140 }}>
                    <img src={imagePreview.url} alt={imagePreview.name} />
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.9)" }}>
                    <div style={{ fontWeight: 800 }}>{imagePreview.name}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{Math.round(imagePreview.size / 1024)} KB</div>
                    <div style={{ marginTop: 8 }}>
                      <button className="new-btn" onClick={() => { setImagePreview(null); }}>Remove</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* RIGHT */}
        <aside className="right-panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 800 }}>Session</div>
            <div className="badge">Privacy on</div>
          </div>

          <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, marginBottom: 12 }}>
            <div><strong>Messages:</strong> {messages.length}</div>
            <div style={{ marginTop: 8 }}><strong>Conversation:</strong> #{activeConv}</div>
          </div>

          <div style={{ marginTop: 18, color: "rgba(255,255,255,0.86)" }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Notes</div>
            <ul style={{ paddingLeft: 18, lineHeight: 1.6 }}>
              <li>PII is masked for display only.</li>
              <li>Images should be redacted before sending in production.</li>
              <li>Replace simulated replies with your backend endpoint.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
