import React, { useEffect, useRef, useState } from "react";
import LandingHeader from "../components/LandingHeader";

export default function AiChatBot() {
  // conversations: { id, title, last, created, messages }
  const [conversations, setConversations] = useState(() => [
    {
      id: 1,
      title: "Welcome Chat",
      last: "Say hi to Grootan",
      created: Date.now(),
      messages: [
        {
          id: "m1",
          role: "assistant",
          text:
            "Hi — I'm Grootan. I help redact PII and keep your images private. Try sending an image or asking a question.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    },
  ]);

  const [activeConvId, setActiveConvId] = useState(1);
  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [typing, setTyping] = useState(false);
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const scrollRef = useRef(null);

  

  // scroll to bottom when messages change
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [activeConv?.messages, typing]);

  // Small helper to format time
  function nowTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // PII mask for visual display
  function maskPII(text) {
    if (!text) return text;
    return text
      .replace(
        /([a-zA-Z0-9._%+-])([a-zA-Z0-9._%+-]*?)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
        (m, p1, p2, domain) => `${p1}${"*".repeat(Math.max(p2.length, 3))}@${domain}`
      )
      .replace(/(\+?\d[\d\-\s().]{6,}\d)/g, (m) => {
        const digits = m.replace(/\D/g, "");
        if (digits.length <= 4) return m;
        return `${"*".repeat(digits.length - 4)}${digits.slice(-4)}`;
      });
  }

  // update active conversation messages
  function pushMessageToActive(msg) {
    setConversations((list) =>
      list.map((c) =>
        c.id === activeConvId ? { ...c, messages: [...c.messages, msg], last: msg.text?.slice(0, 40) || "Image" } : c
      )
    );
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
        time: nowTime(),
      };
      pushMessageToActive(userMsg);
    }

    if (imagePreview) {
      const imgMsg = {
        id: `img-${Date.now()}`,
        role: "user",
        image: imagePreview,
        redacted: false,
        text: "[Image]",
        time: nowTime(),
      };
      pushMessageToActive(imgMsg);
      setImagePreview(null);
    }

    setInput("");
    // simulate assistant typing & reply
    setTyping(true);
    setTimeout(() => {
      const replyText =
        raw && raw.length < 200
          ? `I received: "${maskPII(raw)}". I can redact, summarize, or extract entities from images.`
          : "Thanks — I processed the image (demo). Use the redact flow before sending to backend in production.";
      const assistantMsg = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: replyText,
        time: nowTime(),
      };
      pushMessageToActive(assistantMsg);
      setTyping(false);
    }, 800 + Math.random() * 600);
  }

  // keyboard send
  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // image preview
  function onFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setImagePreview({ url, name: f.name, size: f.size });
    e.target.value = null;
  }

  // create new conversation
  function newConversation() {
    const id = Date.now();
    const conv = { id, title: "New Chat", last: "Start typing...", created: Date.now(), messages: [] };
    setConversations((c) => [conv, ...c]);
    setActiveConvId(id);
  }

  // clear current conversation
  function clearConversation() {
    if (!activeConv) return;
    setConversations((list) => list.map((c) => (c.id === activeConv.id ? { ...c, messages: [], last: "Cleared" } : c)));
  }

  // delete current conversation
  function deleteConversation(id) {
    if (!window.confirm("Delete this conversation? This action cannot be undone.")) return;
    setConversations((list) => list.filter((c) => c.id !== id));
    // switch to first remaining
    setTimeout(() => {
      setConversations((list) => {
        if (list.length === 0) {
          const id2 = Date.now();
          setActiveConvId(id2);
          return [{ id: id2, title: "Welcome Chat", last: "Say hi to Grootan", created: Date.now(), messages: [] }];
        }
        setActiveConvId(list[0].id);
        return list;
      });
    }, 0);
  }

  // rename
  function renameConversation(id) {
    const newName = window.prompt("Rename conversation", conversations.find((c) => c.id === id)?.title || "");
    if (newName !== null) {
      setConversations((list) => list.map((c) => (c.id === id ? { ...c, title: newName || c.title } : c)));
    }
  }

  // quick export (copy text)
  function copyConversationText() {
    const c = conversations.find((x) => x.id === activeConvId);
    if (!c) return alert("No conversation");
    const text = c.messages.map((m) => `${m.role.toUpperCase()}: ${m.text || "[image]"} (${m.time})`).join("\n\n");
    navigator.clipboard?.writeText(text).then(
      () => alert("Conversation copied to clipboard"),
      () => alert("Copy failed")
    );
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
          --glass: rgba(255,255,255,0.03);
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

        .ai-header { position: sticky; top:0; z-index:50; background: transparent; padding:10px 18px; }

        .ai-layout {
          display:grid;
          grid-template-columns: 240px 1fr 320px;
          gap:20px;
          padding:18px 24px 80px 24px;
          align-items:start;
        }

        @media (max-width:1000px) {
          .ai-layout { grid-template-columns: 1fr; padding:12px; }
          .left-col, .right-panel { display:none; }
        }

        /* left sidebar */
        .left-col {
          background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
          border-radius:14px;
          padding:14px;
          border:1px solid rgba(255,255,255,0.04);
          min-height: 60vh;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .left-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; gap:8px; }
        .new-btn { background: linear-gradient(90deg, var(--accent), var(--accent-2)); color:#062017; padding:8px 12px; border-radius:10px; font-weight:800; border:none; cursor:pointer; box-shadow: 0 8px 20px rgba(0,196,65,0.08); }
        .conv-list { display:flex; flex-direction:column; gap:10px; margin-top:8px; max-height:66vh; overflow:auto; padding-right:6px; }
        .conv-item { padding:10px; border-radius:10px; cursor:pointer; font-size:14px; display:flex; justify-content:space-between; align-items:center; color:rgba(255,255,255,0.92); transition: transform .12s ease, background .12s; }
        .conv-item:hover { transform: translateY(-4px); background: rgba(255,255,255,0.02); }
        .conv-item.active { background: linear-gradient(90deg, rgba(0,196,65,0.06), rgba(0,196,65,0.02)); border:1px solid rgba(0,196,65,0.08); font-weight:800; }

        .conv-left { display:flex; gap:10px; align-items:center; }
        .conv-icon { width:36px; height:36px; border-radius:8px; display:grid; place-items:center; background: linear-gradient(135deg, rgba(0,196,65,0.12), rgba(0,122,255,0.06)); font-weight:800; }

        /* center chat */
        .center-col { display:flex; flex-direction:column; gap:12px; min-height:80vh; }
        .chat-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
          padding:18px;
          border-radius:14px;
          border:1px solid rgba(255,255,255,0.04);
          box-shadow: 0 12px 40px rgba(0,0,0,0.55);
          display:flex;
          flex-direction:column;
          height: calc(100vh - 220px);
        }
        .chat-head { display:flex; align-items:center; gap:12px; margin-bottom:8px; }
        .agent-badge { width:48px; height:48px; border-radius:12px; display:grid; place-items:center; font-weight:900; background: linear-gradient(135deg, rgba(0,196,65,0.14), rgba(0,122,255,0.06)); color:white; font-size:18px; }

        .chat-scroll { overflow:auto; padding-right:10px; flex:1; display:flex; flex-direction:column; gap:10px; }
        .msg-row { display:flex; gap:12px; margin-bottom:6px; align-items:flex-end; }
        .msg-row.assistant { justify-content:flex-start; }
        .msg-row.user { justify-content:flex-end; }
        .bubble { padding:14px 16px; border-radius:12px; line-height:1.45; font-size:15px; box-shadow: 0 6px 20px rgba(0,0,0,0.35); }
        .bubble.assistant { background: rgba(255,255,255,0.03); color:var(--muted); border:1px solid rgba(255,255,255,0.03); border-bottom-left-radius:6px; }
        .bubble.user { background: linear-gradient(90deg, var(--accent), var(--accent-2)); color:#062017; border-bottom-right-radius:6px; }

        .msg-meta { font-size:12px; color:rgba(255,255,255,0.58); margin-top:8px; text-align:right; }

        /* typing indicator */
        .typing {
          display:inline-flex;
          gap:6px;
          align-items:center;
        }
        .dot {
          width:8px; height:8px; border-radius:999px; background:rgba(255,255,255,0.7); opacity:0.9;
          animation: bounce 1s infinite ease-in-out;
        }
        .dot:nth-child(2) { animation-delay: .15s; }
        .dot:nth-child(3) { animation-delay: .3s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity:.6; }
          40% { transform: translateY(-6px); opacity:1; }
        }

        /* image preview */
        .img-preview { max-width:320px; border-radius:10px; overflow:hidden; position:relative; border:1px solid rgba(255,255,255,0.04); }
        .img-preview img { display:block; width:100%; height:auto; }

        /* composer */
        .composer { margin-top:12px; display:flex; gap:12px; align-items:flex-end; }
        .input-area { flex:1; display:flex; gap:10px; align-items:center; background: rgba(255,255,255,0.02); padding:12px; border-radius:12px; border:1px solid rgba(255,255,255,0.04); }
        .text-input { width:100%; min-height:48px; max-height:120px; resize:none; border:none; outline:none; background:transparent; color:var(--muted); font-size:15px; }
        .send-btn { background: linear-gradient(90deg, var(--accent), var(--accent-2)); color:#062017; padding:10px 14px; border-radius:10px; border:none; font-weight:800; cursor:pointer; box-shadow: 0 10px 30px rgba(0,196,65,0.08); }

        /* composer small controls */
        .mini-btn { background:transparent; border:1px solid rgba(255,255,255,0.04); padding:8px 10px; border-radius:8px; cursor:pointer; color:rgba(255,255,255,0.9); }

        /* right panel */
        .right-panel { background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent); border-radius:14px; padding:14px; border:1px solid rgba(255,255,255,0.04); min-height:60vh; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .badge { display:inline-block; padding:8px 10px; border-radius:999px; background:rgba(0,196,65,0.06); color:var(--accent); font-weight:800; }

        .actions-row { display:flex; gap:8px; margin-top:10px; flex-wrap:wrap; }
        .action-card { padding:10px 12px; border-radius:10px; background: rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.03); cursor:pointer; }

        /* small screens */
        @media (max-width:700px) {
          .chat-card { height: calc(100vh - 140px); }
        }
      `}</style>

  
        <LandingHeader />

      <div className="ai-layout">
        {/* LEFT */}
        <aside className="left-col" aria-label="Conversations">
          <div className="left-top">
            <div style={{ fontWeight: 900, fontSize: 16 }}>Conversations</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="new-btn" onClick={newConversation}>+ New</button>
            </div>
          </div>

          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.78)", marginBottom: 10 }}>Recent</div>

          <div className="conv-list">
            {conversations.map((c) => (
              <div key={c.id} className={`conv-item ${c.id === activeConvId ? "active" : ""}`} onClick={() => setActiveConvId(c.id)}>
                <div className="conv-left">
                  <div className="conv-icon">{(c.title || "C").slice(0, 1)}</div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ fontWeight: 800 }}>{c.title}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.66)" }}>{c.last}</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button className="mini-btn" title="Rename" onClick={(e) => { e.stopPropagation(); renameConversation(c.id); }}>✎</button>
                  <button className="mini-btn" title="Delete" onClick={(e) => { e.stopPropagation(); deleteConversation(c.id); }}>🗑</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, fontSize: 13, color: "rgba(255,255,255,0.72)" }}>
            Pro tip: Masking shown is visual only. Use a server-side redaction workflow for production.
          </div>
        </aside>

        {/* CENTER */}
        <main className="center-col" aria-live="polite">
          <div className="chat-card" role="region" aria-label="Chat card">
            <div className="chat-head">
              <div className="agent-badge">GA</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: 18 }}>{activeConv?.title || "Conversation"}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.78)" }}>{activeConv?.last || "No messages yet"}</div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="mini-btn" onClick={clearConversation}>Clear</button>
                    <button className="mini-btn" onClick={copyConversationText}>Copy</button>
                  </div>
                </div>
              </div>
            </div>

            <div ref={scrollRef} className="chat-scroll">
              {(activeConv?.messages || []).map((m) => (
                <div key={m.id} className={`msg-row ${m.role === "assistant" ? "assistant" : "user"}`}>
                  {m.role === "assistant" && <div className="agent-badge" style={{ width: 40, height: 40 }}>G</div>}

                  <div style={{ display: "flex", flexDirection: "column", alignItems: m.role === "assistant" ? "flex-start" : "flex-end" }}>
                    {m.image ? (
                      <div className="img-preview">
                        <img src={m.image.url} alt={m.image.name} />
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

                  {m.role === "user" && <div className="agent-badge" style={{ width: 40, height: 40 }}>U</div>}
                </div>
              ))}

              {typing && (
                <div className="msg-row assistant">
                  <div className="agent-badge" style={{ width: 40, height: 40 }}>G</div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <div className="bubble assistant">
                      <div className="typing"><span className="dot" /> <span className="dot" /> <span className="dot" /></div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ height: 6 }} />
            </div>

            {/* composer */}
            <div style={{ marginTop: 12 }}>
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
                    <label className="mini-btn" title="Upload image" style={{ cursor: "pointer" }}>
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

                  <div style={{ color: "rgba(255,255,255,0.92)" }}>
                    <div style={{ fontWeight: 900 }}>{imagePreview.name}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{Math.round(imagePreview.size / 1024)} KB</div>
                    <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                      <button className="mini-btn" onClick={() => setImagePreview(null)}>Remove</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* RIGHT */}
        <aside className="right-panel" aria-label="Session controls">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 900 }}>Session</div>
            <div className="badge">Privacy</div>
          </div>

          <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 14 }}>
            <div><strong>Messages:</strong> {activeConv?.messages?.length || 0}</div>
            <div style={{ marginTop: 8 }}><strong>Conversation:</strong> #{activeConv?.id}</div>
            <div style={{ marginTop: 8 }}><strong>Last:</strong> {activeConv?.last}</div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Quick actions</div>
            <div className="actions-row">
              <div className="action-card" onClick={newConversation}>➕ New Chat</div>
              <div className="action-card" onClick={() => clearConversation()}>🧹 Clear Chat</div>
              <div className="action-card" onClick={() => copyConversationText()}>📋 Copy</div>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Notes</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.86)", lineHeight: 1.6 }}>
              • Visual masking only — use server-side redaction for production.<br />
              • Replace the simulated assistant with your backend endpoint.<br />
              • Images should be redacted locally before sending to the model.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
