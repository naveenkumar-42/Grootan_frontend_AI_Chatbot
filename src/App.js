import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AiChatBot from "./pages/AiChatBot"; // <-- make sure this path is correct

export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/ai-chat" element={<AiChatBot />} />
        </Routes>
      </div>
    </Router>
  );
}
