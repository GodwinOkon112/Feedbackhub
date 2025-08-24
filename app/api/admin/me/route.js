import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function GET(req) {
  try {
    // Check if admin-auth cookie exists
    const auth = req.cookies.get("admin-auth")?.value;
    if (auth !== "true") {
      return new Response(JSON.stringify({ message: "Not authenticated" }), {
        status: 401,
      });
    }

    await dbConnect();
    const admin = await Admin.findOne({}); // You can fetch specific admin if needed
    if (!admin) {
      return new Response(JSON.stringify({ message: "Admin not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone || "",
        username: admin.username,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
