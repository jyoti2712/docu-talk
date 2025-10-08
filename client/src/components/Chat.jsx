import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function Chat({ token, documentId, setDocumentId, messages, setMessages }) {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { "x-auth-token": token, "Content-Type": "multipart/form-data" },
      });
      setDocumentId(res.data.documentId);
      alert("File uploaded successfully!");
    } catch {
      alert("File upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAsk = async () => {
    if (!question || !documentId) return;
    setIsThinking(true);
    const newMessages = [...messages, { sender: "user", text: question }];
    setMessages(newMessages);
    setQuestion("");
    try {
      const res = await axios.post(
        `${API_URL}/api/chat`,
        { question, documentId },
        { headers: { "x-auth-token": token } }
      );
      setMessages([...newMessages, { sender: "ai", text: res.data.answer }]);
    } catch {
      setMessages([...newMessages, { sender: "ai", text: "Something went wrong." }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div>
        <h3 className="font-semibold mb-2 text-lg text-gray-700">Upload Document</h3>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <input
            type="file"
            onChange={handleFileChange}
            className="text-sm rounded-md w-full sm:w-auto"
          />
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      {/* Chat Section */}
      {documentId && (
        <div>
          <h3 className="font-semibold mb-2 text-lg text-gray-700">Ask Your Document</h3>
          <div className="border rounded-lg h-64 sm:h-72 overflow-y-auto p-3 bg-gray-50 mb-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-3 ${msg.sender === "user" ? "text-right" : "text-left"}`}
              >
                {msg.sender === "user" ? (
                  <span className="inline-block px-3 py-2 rounded-lg text-sm sm:text-base bg-indigo-600 text-white">
                    {msg.text}
                  </span>
                ) : (
                  <div className="inline-block px-3 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm sm:text-base whitespace-pre-wrap">
                    <ReactMarkdown>{msg.text.trim().replace(/\n{2,}/g, '\n\n')}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about your document..."
              className="flex-1 border px-3 py-2 rounded-md"
            />
            <button
              onClick={handleAsk}
              disabled={isThinking}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              {isThinking ? "Thinking..." : "Ask"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
