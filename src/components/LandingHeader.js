import React from "react";
import "../components/header.css"

export default function LandingHeader() {
  return (
    <header className="header">

      <div className="header-left">
        <img src="/img/icon.png" alt="Grootan logo" className="logo-img" />
        <a className="logo-text" href="/">
          Grootan<span className="logo-highlight">AI</span>
        </a>
      </div>

      <nav className="navbar">
        <a href="/" className="nav-link active">
          Home
        </a>
        <a href="/ai-chat" className="nav-link">
          Chat
        </a>
        <a href="/contact" className="nav-link">
          Contact
        </a>
        <a href="/logout" className="nav-link logout">
          Log-out
        </a>
      </nav>
    </header>
  );
}
