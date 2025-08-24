export async function POST() {
  try {
    const res = new Response(
      JSON.stringify({ message: "Logged out successfully" }),
      { status: 200 }
    );

    // ✅ clear cookie
    res.headers.set(
      "Set-Cookie",
      "admin-auth=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict"
    );

    return res;
  } catch (err) {
    console.error("❌ Logout error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
