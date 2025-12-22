"use server";

export async function generateImageAction(prompt: string) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "HUGGINGFACE_API_KEY is not defined in environment variables."
    );
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    return {
      success: true,
      image: `data:image/png;base64,${base64Image}`,
    };
  } catch (error: any) {
    console.error("Image generation error:", error);
    return {
      success: false,
      error: error.message || "Failed to generate image",
    };
  }
}
