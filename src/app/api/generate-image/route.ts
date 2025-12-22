import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt }: { prompt: string } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (!process.env.HF_TOKEN) {
      return NextResponse.json(
        { error: "HF_TOKEN is not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Hugging Face API error: ${response.statusText}`
      );
    }

    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());
    const base64Image = buffer.toString("base64");
    const mimeType = blob.type || "image/webp";

    return NextResponse.json({
      imageUrl: `data:${mimeType};base64,${base64Image}`,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Image Generation Error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
