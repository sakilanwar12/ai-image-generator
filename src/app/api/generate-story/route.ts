import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { prompt }: { prompt: string } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const storyPrompt = `
      Create a short children's story based on: "${prompt}".
      The story should have exactly 4 pages.
      For each page, provide:
      1. 'text': A few sentences of the story.
      2. 'imagePrompt': A detailed, descriptive prompt for an AI image generator to illustrate this specific page. Keep the character descriptions consistent across pages. Use a vibrant, magical, storybook illustration style.

      Return the response in this exact JSON format:
      {
        "title": "Story Title",
        "pages": [
          { "text": "...", "imagePrompt": "..." },
          ...
        ]
      }
    `;

    const result = await model.generateContent(storyPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json(JSON.parse(text));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Story Generation Error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
