"use client";
import { useState } from "react";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [downloadLink, setDownloadLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quality, setQuality] = useState("high"); // Default: High quality

  const handleConvert = async () => {
    setLoading(true);
    setError(null);
    setDownloadLink(null);

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: videoUrl.trim(), quality }),
      });

      if (!response.ok) {
        throw new Error("Failed to convert video");
      }

      const data = await response.json();
      if (data.downloadUrl) {
        setDownloadLink(data.downloadUrl);
      } else {
        setError("Failed to get download link. Try again later.");
      }
      
    } catch (err) {
      console.error("❌ Error:", err);
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-3xl font-bold text-center text-white">YouTube to MP3</h1>

        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Paste YouTube URL here..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />

          {/* Audio Quality Selection */}
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            className="p-3 rounded-lg bg-gray-800 text-white"
          >
            <option value="low">Low (64K)</option>
            <option value="medium">Medium (128K)</option>
            <option value="high">High (192K)</option>
          </select>

          <button
            onClick={handleConvert}
            disabled={loading}
            className={`p-3 rounded-lg font-semibold transition-colors ${
              loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {loading ? "Processing..." : "Convert Now"}
          </button>

          {error && <p className="text-red-400 text-center animate-pulse">{error}</p>}

          {downloadLink && (
            <a
              href={downloadLink}
              className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-center font-semibold transition-colors"
              download
            >
              Download MP3
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
