// app/api/suggestions/add/route.js
import dbConnect from "@/lib/mongodb";
import Suggestion from "@/models/Suggestion";
import { analyzeSentiment } from "../../../../lib/sentiment"; // ✅ Make sure path is correct

export async function POST(req) {
  try {
    await dbConnect();

    const { message, category } = await req.json();

    if (!message || message.trim() === "") {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
      });
    }

    // Run sentiment analysis
    const { label, score } = analyzeSentiment(message);

    // Save new suggestion with sentiment
    const newSuggestion = await Suggestion.create({
      message,
      category: category || "Others",
      sentiment: label, // ✅ saves 'positive', 'neutral', 'negative'
      sentimentScore: score, // ✅ saves numeric score
    });

    return new Response(JSON.stringify(newSuggestion), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
