import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Suggestion from "@/models/Suggestion";

/**
 * GET /api/admin/sentiments?days=30
 * Returns { positive, neutral, negative, total, byDay: [{date, positive, neutral, negative}] }
 */
export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "30", 10);

    const since = new Date();
    since.setDate(since.getDate() - days);

    // Counts by label (all-time)
    const countsAgg = await Suggestion.aggregate([
      {
        $group: {
          _id: "$sentiment",
          count: { $sum: 1 },
        },
      },
    ]);

    const counts = { positive: 0, neutral: 0, negative: 0 };
    countsAgg.forEach((row) => (counts[row._id] = row.count));

    // Trend by day for the window
    const trendAgg = await Suggestion.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            sentiment: "$sentiment",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.day": 1 } },
    ]);

    // reshape: {date, positive, neutral, negative}
    const byDayMap = new Map();
    trendAgg.forEach(({ _id: { day, sentiment }, count }) => {
      if (!byDayMap.has(day))
        byDayMap.set(day, { date: day, positive: 0, neutral: 0, negative: 0 });
      byDayMap.get(day)[sentiment] = count;
    });
    const byDay = Array.from(byDayMap.values());

    const total = counts.positive + counts.neutral + counts.negative;

    return NextResponse.json({ ...counts, total, byDay });
  } catch (err) {
    console.error("Sentiment stats error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
