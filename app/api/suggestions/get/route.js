// app/api/suggestions/route.js
import dbConnect from "@/lib/mongodb";
import Suggestion from "@/models/Suggestion";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const sentiment = searchParams.get("sentiment"); // positive | neutral | negative
    const category = searchParams.get("category"); // Academics | Facilities | Others
    const search = searchParams.get("search"); // free text search

    // Build query dynamically
    const query = {};

    if (sentiment && sentiment !== "All") {
      query.sentiment = sentiment.toLowerCase(); // match stored sentiment
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      query.message = { $regex: search, $options: "i" }; // case-insensitive search
    }

    const suggestions = await Suggestion.find(query).sort({ createdAt: -1 });

    return new Response(JSON.stringify(suggestions), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
