"use client";

import { useState } from "react";
import { generateImageAction } from "@/actions/generateImage";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateImageAction(prompt);
      if (result.success && result.image) {
        setGeneratedImage(result.image);
      } else {
        setError(result.error || "Failed to generate image");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `generated-image-${Date.now()}.png`;
    link.click();
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-4xl z-10 space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-white to-pink-400 animate-gradient">
            Imagine Anything
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Generate stunning, AI-powered images from simple text prompts in
            seconds.
          </p>
        </div>

        {/* Input Section */}
        <div className="glass-card p-2 md:p-3 flex flex-col md:flex-row gap-3 shadow-2xl relative">
          <input
            type="text"
            placeholder="A futuristic cybernetic city with neon lights..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            className="input-field border-none bg-transparent focus:ring-0 text-white placeholder:text-gray-500 flex-1 px-6"
            disabled={isGenerating}
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="btn-primary flex items-center justify-center gap-2 group"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <span>Generate</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Display Section */}
        <div className="space-y-6">
          {error && (
            <div className="glass-card bg-red-500/10 border-red-500/20 p-4 text-red-400 text-center animate-shake">
              {error}
            </div>
          )}

          {isGenerating && (
            <div className="glass-card aspect-video w-full flex flex-col items-center justify-center space-y-4 shimmer overflow-hidden">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <div className="absolute inset-0 blur-lg bg-indigo-500/20 rounded-full animate-pulse" />
              </div>
              <p className="text-indigo-300 font-medium animate-pulse">
                Our AI is painting your vision...
              </p>
            </div>
          )}

          {!isGenerating && generatedImage && (
            <div className="glass-card overflow-hidden group relative shadow-2xl transition-all duration-500 hover:scale-[1.01] border-white/10">
              <img
                src={generatedImage}
                alt={prompt}
                className="w-full aspect-video object-cover transition-all duration-700 hover:brightness-110"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-2 group-hover:translate-y-0 transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-between">
                <p className="text-sm text-gray-200 line-clamp-1 italic">
                  &quot;{prompt}&quot;
                </p>
                <button
                  onClick={handleDownload}
                  className="p-2 bg-indigo-500 hover:bg-indigo-400 rounded-lg transition-colors shadow-lg"
                  title="Download Image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {!isGenerating && !generatedImage && !error && (
            <div className="glass-card aspect-video w-full flex flex-col items-center justify-center border-dashed border-white/5 bg-white/[0.01]">
              <div className="p-4 rounded-full bg-white/5 mb-4 group-hover:scale-110 transition-transform duration-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 font-light">
                Your masterpiece will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
