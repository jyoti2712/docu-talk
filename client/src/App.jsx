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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white text-gray-900">
      {/* Header */}
      <header className="flex flex-wrap justify-between items-center p-4 sm:p-5 bg-white shadow-md sticky top-0 z-50">
        <h1 className="text-xl sm:text-2xl font-bold text-indigo-600">Docu-Talk AI</h1>

        <nav className="flex gap-2 sm:gap-3 mt-3 sm:mt-0">
          <button
            onClick={() => setView("chat")}
            className={`px-3 sm:px-4 py-2 rounded-full font-medium text-sm sm:text-base transition ${
              view === "chat"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setView("summarizer")}
            className={`px-3 sm:px-4 py-2 rounded-full font-medium text-sm sm:text-base transition ${
              view === "summarizer"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Summarize
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-3 sm:mt-0 px-3 sm:px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition text-sm sm:text-base"
        >
          Logout
        </button>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto mt-8 sm:mt-10 bg-white p-5 sm:p-8 rounded-2xl shadow-lg w-[95%]">
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
