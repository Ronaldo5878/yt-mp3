import { useState } from "react";

export default function Converter() {
  const [url, setUrl] = useState("");

  const handleConvert = () => {
    console.log("Converting:", url);
    // Here, we will call the backend later to process the conversion
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">YouTube to MP3 Converter</h1>
      <input
        type="text"
        placeholder="Enter YouTube URL"
        className="w-80 p-3 rounded-lg text-black"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        onClick={handleConvert}
        className="mt-4 bg-blue-500 px-6 py-2 rounded-lg text-white hover:bg-blue-700"
      >
        Convert to MP3
      </button>
    </div>
  );
}
