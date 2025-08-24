import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const auth = req.cookies.get("admin-auth")?.value;
    if (auth !== "true") {
      return new Response(JSON.stringify({ message: "Not authenticated" }), {
        status: 401,
      });
    }

    const { fullName, email, phone, password } = await req.json();
    await dbConnect();

    const updateData = { fullName, email, phone };
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updateData.password = hashed;
    }

    const admin = await Admin.findOneAndUpdate({}, updateData, { new: true });

    return new Response(
      JSON.stringify({ message: "Settings updated successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
