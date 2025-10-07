import React, { useState, useEffect } from "react";
import Auth from "./components/Auth";
import Chat from "./components/Chat";
import Summarizer from "./components/Summarizer";
import './index.css';

function App() {
  const [token, setToken] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [view, setView] = useState("chat");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const handleLogout = () => {
    setToken(null);
    setDocumentId(null);
    localStorage.removeItem("token");
  };

  if (!token) return <Auth setToken={setToken} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
      <header className="flex justify-between items-center p-5 bg-white shadow-md sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-indigo-600">Docu-Talk AI</h1>

        <nav className="flex gap-3">
          <button
            onClick={() => setView("chat")}
            className={`px-4 py-2 rounded-full font-medium transition ${
              view === "chat"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Chat with Document
          </button>
          <button
            onClick={() => setView("summarizer")}
            className={`px-4 py-2 rounded-full font-medium transition ${
              view === "summarizer"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Summarize Document
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>

      <main className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">
        {view === "chat" ? (
          <Chat token={token} documentId={documentId} setDocumentId={setDocumentId} />
        ) : (
          <Summarizer token={token} documentId={documentId} setDocumentId={setDocumentId} />
        )}
      </main>
    </div>
  );
}

export default App;
