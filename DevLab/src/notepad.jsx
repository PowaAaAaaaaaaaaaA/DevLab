// App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(checkMobile);
  }, []);

  if (isMobile) {
    // ✅ Show a global download screen
    return (
      <div className="w-full h-screen bg-[radial-gradient(circle_at_center,_#9333EA_0%,_#1E1E2E_65%,_#0F0F17_100%)] flex flex-col justify-center items-center text-white text-center p-6 font-exo">
        <h1 className="text-5xl font-bold mb-4">DevLab Mobile</h1>
        <p className="text-lg mb-6 max-w-md">
          DevLab is best experienced through our mobile app.
          Download it now to start your coding adventure!
        </p>
        <a
          href="https://example.com/devlab-app-download"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-2xl shadow-md transition"
        >
          📱 Download DevLab App
        </a>
      </div>
    );
  }

  // ✅ Normal web app routes for desktop
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
