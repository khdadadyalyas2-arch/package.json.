import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an intelligent, friendly AI assistant fluent in Persian and English. Provide high-quality, direct answers.",
        },
        ...messages,
      ],
    });

    const reply = completion.choices[0]?.message?.content || "";
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: error.message || "Something went wrong" });
  }
}
