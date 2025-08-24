import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();
    const { username, password, fullName, email } = await req.json();

    if (!username || !password || !fullName || !email) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }

    const existing = await Admin.findOne({ username });
    if (existing) {
      return new Response(JSON.stringify({ message: "Admin already exists" }), {
        status: 400,
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      username,
      password: hashed,
      fullName,
      email,
    });

    return new Response(
      JSON.stringify({
        message: "Admin created successfully",
        admin: {
          id: newAdmin._id,
          username: newAdmin.username,
          fullName: newAdmin.fullName,
          email: newAdmin.email,
        },
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
