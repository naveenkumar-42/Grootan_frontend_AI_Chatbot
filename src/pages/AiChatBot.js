import React, { useEffect, useRef, useState } from "react";
import LandingHeader from "../components/LandingHeader";

/**
 * AiChatBot.js
 * React (JS) component — ChatGPT-like UI for Grootan AI Chatbot
 *
 * Features:
 * - Left sidebar (conversations)
 * - Center chat area (message bubbles, timestamps)
 * - Bottom composer with text input, file (image) upload preview, redact demo
 * - Simple PII masking for user messages (emails & phone numbers)
 * - Internal CSS only (same color theme as landing page)
 *
 * Note: This is UI-only. Replace sendMessage() 'simulateAIResponse' with actual API calls.
 */

export default function AiChatBot() {
  const [conversations, setConversations] = useState([
    { id: 1, title: "Welcome Chat", last: "Hi — start a conversation", created: Date.now() },
  ]);
  const [activeConv, setActiveConv] = useState(1);

  const [messages, setMessages] = useState([
    {
      id: "m1",
      role: "assistant",
      text: "Hello — I'm Grootan. I redact PII in images and keep your chats private. How can I help today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageRedacted, setImageRedacted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const chatEndRef = useRef(null);

  // keep scroll pinned to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  // Basic PII mask for text (emails and phone numbers)
  function maskPII(text) {
    if (!text) return text;
    // mask emails: show first letter and domain
    const emailMasked = text.replace(
      /([a-zA-Z0-9._%+-])([a-zA-Z0-9._%+-]*?)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
      (m, p1, p2, domain) => `${p1}${"*".repeat(Math.max(p2.length, 3))}@${domain}`
    );
    // mask phone numbers (simple global)
    const phoneMasked = emailMasked.replace(
      /(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?[\d-.\s]{6,12}/g,
      (m) => {
        // if contains letters (maybe captured email) skip
        if (/[a-zA-Z]/.test(m)) return m;
        const digits = m.replace(/\D/g, "");
        if (digits.length < 4) return m;
        const last = digits.slice(-4);
        return `${"*".repeat(Math.max(0, digits.length - 4))}${last}`;
      }
    );
    return phoneMasked;
  }

  function sendMessage() {
    const raw = input.trim();
    if (!raw && !imagePreview) return;

    // mask PII for display (this simulates your masking pipeline)
    const safeText = maskPII(raw);

    if (raw) {
      const userMsg = {
        id: `u-${Date.now()}`,
        role: "user",
        text: safeText,
        rawText: raw,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((m) => [...m, userMsg]);
    }

    // if image attached, add an image message (simulate redacted if toggled)
    if (imagePreview) {
      const imgMsg = {
        id: `img-${Date.now()}`,
        role: "user",
        image: imagePreview,
        redacted: imageRedacted,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((m) => [...m, imgMsg]);
      setImagePreview(null);
      setImageRedacted(false);
    }

    setInput("");

    // simulate AI response (replace with real API call)
    setTimeout(() => {
      simulateAIResponse(raw || (imagePreview ? "Image uploaded" : "Empty"));
    }, 700);
  }

  function simulateAIResponse(userText) {
    const reply = {
      id: `b-${Date.now()}`,
      role: "assistant",
      text:
        userText && userText.length < 200
          ? `I received: "${maskPII(userText)}". I can summarize, redact, or act on images you upload. Try asking me to extract information or redact personal data.`
          : `Thanks! I processed the image and redacted obvious PII — nothing sensitive was sent unredacted.`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((m) => [...m, reply]);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // handle image upload preview
  function onFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setImagePreview({ url, name: f.name, size: f.size });
    setImageRedacted(false);
    e.target.value = null;
  }

  // demo redact: visually overlay boxes on preview (not real OCR)
  function toggleRedact() {
    setImageRedacted((r) => !r);
  }

  // new conversation
  function newConversation() {
    const id = Date.now();
    setConversations((c) => [{ id, title: "New Chat", last: "New chat", created: Date.now() }, ...c]);
    setActiveConv(id);
    setMessages([
      {
        id: `m-${Date.now()}`,
        role: "assistant",
        text: "New chat started. I redact PII in images and keep everything private. Ask me anything.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }

  return (
    <div className="ai-root">
      <style>{`
        :root{
          --bg:#081b29;
          --card:#112e42;
          --muted: rgba(255,255,255,0.88);
          --accent:#00fa9a;
          --accent-2:#00c441;
          --glass: rgba(255,255,255,0.03);
          --header-h:72px;
        }
        *{box-sizing:border-box}
        body,html,#root{height:100%}

        .ai-root{
          min-height:100vh;
          background: linear-gradient(180deg, rgba(4,18,30,1) 0%, var(--bg) 70%);
          color: #fff;
          font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          display:flex;
          flex-direction:column;
        }

        /* header */
        .ai-header { position: sticky; top:0; z-index:50; background: transparent; }

        /* layout */
        .ai-layout {
          display:grid;
          grid-template-columns: 280px 1fr 360px;
          gap:20px;
          padding:18px 28px;
          align-items:start;
        }

        /* mobile collapse */
        @media (max-width: 1000px) {
          .ai-layout { grid-template-columns: ${isSidebarOpen ? "220px 1fr" : "1fr"}; }
          .right-panel { display:none; }
        }
        @media (max-width: 700px) {
          .ai-layout { grid-template-columns: 1fr; padding:12px; }
          .left-col { display:none; }
        }

        /* Sidebar (left) */
        .left-col {
          background: rgba(255,255,255,0.02);
          border-radius:12px;
          padding:14px;
          min-height: 60vh;
          border:1px solid rgba(255,255,255,0.04);
          box-shadow: 0 8px 30px rgba(0,0,0,0.6);
        }
        .left-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
        .new-btn { background:var(--accent); color:#062017; padding:8px 12px; border-radius:10px; font-weight:700; border:none; cursor:pointer; }
        .conv-list { display:flex; flex-direction:column; gap:8px; margin-top:6px; max-height:64vh; overflow:auto; padding-right:6px; }
        .conv-item { padding:10px; border-radius:10px; cursor:pointer; font-size:14px; display:flex; justify-content:space-between; align-items:center; gap:8px; color:rgba(255,255,255,0.92); }
        .conv-item:hover { background: rgba(255,255,255,0.02); }
        .conv-item.active { background: linear-gradient(90deg, rgba(0,196,65,0.08), rgba(0,196,65,0.03)); border:1px solid rgba(0,196,65,0.12); color: #eafff0; font-weight:700; }

        /* center chat area */
        .center-col {
          display:flex;
          flex-direction:column;
          gap:12px;
          min-height: 80vh;
        }
        .chat-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
          padding:20px;
          border-radius:12px;
          border:1px solid rgba(255,255,255,0.04);
          box-shadow: 0 10px 32px rgba(0,0,0,0.6);
          display:flex;
          flex-direction:column;
          height: calc(100vh - 220px);
        }
        .chat-scroll {
          overflow:auto;
          padding-right:8px;
        }
        .msg-row { display:flex; gap:12px; margin-bottom:14px; align-items:flex-end; }
        .msg-row.assistant { justify-content:flex-start; }
        .msg-row.user { justify-content:flex-end; }
        .avatar {
          width:44px;
          height:44px;
          border-radius:10px;
          display:inline-grid;
          place-items:center;
          font-weight:800;
          color:white;
          background: linear-gradient(135deg, rgba(0,196,65,0.12), rgba(0,122,255,0.06));
          flex-shrink:0;
        }
        .bubble {
          max-width:72%;
          padding:14px 16px;
          border-radius:12px;
          line-height:1.4;
          font-size:15px;
        }
        .bubble.assistant {
          background: rgba(255,255,255,0.03);
          color:var(--muted);
          border:1px solid rgba(255,255,255,0.03);
          border-bottom-left-radius:4px;
        }
        .bubble.user {
          background: linear-gradient(90deg, var(--accent), var(--accent-2));
          color:#062017;
          border-bottom-right-radius:4px;
        }
        .msg-meta { font-size:12px; color:rgba(255,255,255,0.6); margin-top:6px; }

        /* image message */
        .img-preview {
          max-width:320px;
          border-radius:10px;
          overflow:hidden;
          position:relative;
          border:1px solid rgba(255,255,255,0.04);
        }
        .img-preview img { display:block; width:100%; height:auto; }
        .redact-overlay {
          position:absolute;
          top:0; left:0; right:0; bottom:0;
          pointer-events:none;
        }
        .box { position:absolute; background:rgba(0,0,0,0.5); border:2px solid rgba(255,255,255,0.06); }

        /* composer */
        .composer {
          margin-top:12px;
          display:flex;
          gap:12px;
          align-items:end;
        }
        .input-area {
          flex:1;
          display:flex;
          gap:10px;
          align-items:center;
          background: rgba(255,255,255,0.02);
          padding:12px;
          border-radius:12px;
          border:1px solid rgba(255,255,255,0.04);
        }
        .text-input {
          width:100%;
          min-height:46px;
          max-height:120px;
          resize:none;
          border:none;
          outline:none;
          background:transparent;
          color:var(--muted);
          font-size:15px;
          line-height:1.4;
        }
        .actions { display:flex; gap:8px; align-items:center; }
        .icon-btn { background:transparent; border:1px solid rgba(255,255,255,0.04); padding:8px; border-radius:8px; cursor:pointer; color:rgba(255,255,255,0.88); }

        /* right panel */
        .right-panel {
          background: rgba(255,255,255,0.02);
          border-radius:12px;
          padding:14px;
          border:1px solid rgba(255,255,255,0.04);
          min-height: 60vh;
        }
        .meta-row { display:flex; gap:10px; align-items:center; margin-bottom:10px; }
        .tag { background: rgba(255,255,255,0.03); padding:6px 10px; border-radius:999px; font-size:13px; color:rgba(255,255,255,0.9); }

        /* small screens tweaks */
        @media (max-width:1000px) {
          .ai-layout {
            grid-template-columns: 1fr;
          }
          .left-col { display:none; }
          .right-panel { display:none; }
          .chat-card { height: calc(100vh - 180px); }
        }
      `}</style>

      <div className="ai-header">
        <LandingHeader />
      </div>

      <div className="ai-layout" role="main">
        {/* LEFT: conversations */}
        <aside className="left-col">
          <div className="left-top">
            <div style={{ fontWeight: 800 }}>Conversations</div>
            <button className="new-btn" onClick={newConversation}>+ New</button>
          </div>

          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 8 }}>
            Recent
          </div>

          <div className="conv-list" aria-label="Conversation list">
            {conversations.map((c) => (
              <div
                key={c.id}
                className={`conv-item ${c.id === activeConv ? "active" : ""}`}
                onClick={() => {
                  setActiveConv(c.id);
                  // in a real app you'd load that conversation's messages
                }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg, rgba(0,196,65,0.12), rgba(0,122,255,0.06))",
                    display: "grid", placeItems: "center", fontWeight: 800
                  }}>{c.title?.slice(0,1) || "C"}</div>
                  <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                    <div style={{ fontWeight: 700 }}>{c.title}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.66)" }}>{c.last}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{new Date(c.created).toLocaleDateString()}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, fontSize: 13, color: "rgba(255,255,255,0.72)" }}>
            Tip: upload images and click "Redact" before sending.
          </div>
        </aside>

        {/* CENTER: chat */}
        <section className="center-col">
          <div className="chat-card" role="region" aria-label="Chat messages">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg, rgba(0,196,65,0.12), rgba(0,122,255,0.06))",
                  display: "grid", placeItems: "center", fontWeight: 900
                }}>GA</div>
                <div>
                  <div style={{ fontWeight: 800 }}>Grootan AI</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Privacy-first assistant</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button className="icon-btn" title="Export">Export</button>
                <button
                  className="icon-btn"
                  title="Toggle sidebar"
                  onClick={() => setIsSidebarOpen((s) => !s)}
                >
                  Toggle
                </button>
              </div>
            </div>

            <div className="chat-scroll" style={{ flex: 1 }}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`msg-row ${m.role === "assistant" ? "assistant" : "user"}`}
                  style={{ marginTop: 6 }}
                >
                  {m.role === "assistant" && <div className="avatar">G</div>}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: m.role === "assistant" ? "flex-start" : "flex-end" }}>
                    {m.image ? (
                      <div className="img-preview" role="img" aria-label={m.image.name || "uploaded image"}>
                        <img src={m.image.url} alt={m.image.name || "upload"} />
                        {/* visual redact overlay if redacted */}
                        {m.redacted && (
                          <div className="redact-overlay">
                            {/* Place some demo redaction boxes */}
                            <div className="box" style={{ top: "12%", left: "8%", width: "36%", height: "12%" }} />
                            <div className="box" style={{ top: "42%", left: "20%", width: "48%", height: "12%" }} />
                            <div className="box" style={{ top: "70%", left: "10%", width: "64%", height: "14%" }} />
                          </div>
                        )}
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", padding: 8 }}>{m.redacted ? "Redacted image (demo)" : "Image (unredacted)"}</div>
                      </div>
                    ) : (
                      <div className={`bubble ${m.role === "assistant" ? "assistant" : "user"}`}>
                        {m.text}
                        <div className="msg-meta">{m.time}</div>
                      </div>
                    )}
                  </div>
                  {m.role === "user" && <div className="avatar">U</div>}
                </div>
              ))}

              <div ref={chatEndRef} style={{ height: 6 }} />
            </div>

            {/* composer */}
            <div style={{ marginTop: 12 }}>
              <div className="composer">
                <div className="input-area">
                  <textarea
                    className="text-input"
                    placeholder="Type your message — email/phone will be masked for display. Press Enter to send."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                    <div className="actions">
                      <label className="icon-btn" title="Upload image" style={{ cursor: "pointer" }}>
                        📷
                        <input type="file" accept="image/*" onChange={onFileChange} style={{ display: "none" }} />
                      </label>
                      <button
                        className="icon-btn"
                        onClick={() => {
                          // quick redact toggle for preview before sending
                          setImageRedacted((r) => !r);
                        }}
                      >
                        🛡️ Redact
                      </button>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="new-btn" onClick={sendMessage} style={{ padding: "8px 14px" }}>
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* image preview (before sending) */}
              {imagePreview && (
                <div style={{ marginTop: 10, display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 160 }}>
                    <div className="img-preview" style={{ maxWidth: 160 }}>
                      <img src={imagePreview.url} alt={imagePreview.name} />
                      {imageRedacted && (
                        <div className="redact-overlay">
                          <div className="box" style={{ top: "12%", left: "8%", width: "36%", height: "12%" }} />
                          <div className="box" style={{ top: "42%", left: "20%", width: "48%", height: "12%" }} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ flex: 1, color: "rgba(255,255,255,0.9)" }}>
                    <div style={{ fontWeight: 800 }}>{imagePreview.name}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
                      {Math.round(imagePreview.size / 1024)} KB
                    </div>

                    <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                      <button className="btn-ghost" onClick={toggleRedact}>{imageRedacted ? "Undo Redaction" : "Redact (demo)"}</button>
                      <button
                        className="btn-ghost"
                        onClick={() => {
                          // remove preview
                          setImagePreview(null);
                          setImageRedacted(false);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT: meta / tools */}
        <aside className="right-panel">
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Session Controls</div>
          <div className="meta-row">
            <div className="tag">Model: Grootan-Default</div>
            <div className="tag">Privacy: On-device OCR</div>
          </div>

          <div style={{ marginTop: 12, color: "rgba(255,255,255,0.86)" }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Quick actions</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="icon-btn" onClick={() => alert("Export not implemented")}>Export</button>
              <button className="icon-btn" onClick={() => alert("Clear history not implemented")}>Clear</button>
              <button className="icon-btn" onClick={() => alert("Settings not implemented")}>Settings</button>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Session info</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.82)" }}>
              Messages: <strong>{messages.length}</strong>
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: "rgba(255,255,255,0.82)" }}>
              Active conversation: <strong>{activeConv}</strong>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Security</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.82)" }}>
              PII masking: <strong>enabled</strong>
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: "rgba(255,255,255,0.82)" }}>
              Image redaction: <strong>demo overlay</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
