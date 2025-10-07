import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function Summarizer({ token, documentId, setDocumentId }) {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSummarize = async () => {
    if (!file && !documentId) return alert("Please upload a file first.");
    setIsLoading(true);
    setSummary("");

    try {
      let docIdToSummarize = documentId;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await axios.post(`${API_URL}/api/upload`, formData, {
          headers: { "x-auth-token": token, "Content-Type": "multipart/form-data" },
        });
        docIdToSummarize = uploadRes.data.documentId;
        setDocumentId(docIdToSummarize);
      }

      const res = await axios.post(
        `${API_URL}/api/summarize`,
        { documentId: docIdToSummarize },
        { headers: { "x-auth-token": token } }
      );

      setSummary(res.data.summary);
    } catch {
      setSummary("Failed to generate summary.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="font-semibold mb-3 text-lg text-gray-700">Upload Document to Summarize</h3>
      <div className="flex gap-3 items-center">
        <input type="file" onChange={handleFileChange} className="text-sm" />
        <button
          onClick={handleSummarize}
          disabled={isLoading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          {isLoading ? "Generating..." : "Upload & Summarize"}
        </button>
      </div>

      {summary && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h4 className="font-semibold mb-2 text-gray-700">Summary:</h4>
          <p className="text-gray-800 leading-relaxed">{summary}</p>
        </div>
      )}
    </div>
  );
}

export default Summarizer;
