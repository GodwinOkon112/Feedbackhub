// app/api/suggestions/delete/[id]/route.js
import dbConnect from "@/lib/mongodb";
import Suggestion from "@/models/Suggestion";
import mongoose from "mongoose";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid suggestion ID" }), {
        status: 400,
      });
    }

    const deleted = await Suggestion.findByIdAndDelete(id);

    if (!deleted) {
      return new Response(JSON.stringify({ error: "Suggestion not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Suggestion deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Delete suggestion error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
