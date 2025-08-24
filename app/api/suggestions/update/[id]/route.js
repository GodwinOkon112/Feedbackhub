// app/api/suggestions/update/[id]/route.js
import dbConnect from "@/lib/mongodb";
import Suggestion from "@/models/Suggestion";

export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const { message, category } = await req.json();

    const updated = await Suggestion.findByIdAndUpdate(
      id,
      { message, category },
      { new: true } // return updated doc
    );

    if (!updated) {
      return new Response(JSON.stringify({ error: "Suggestion not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
