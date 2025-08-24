"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#22c55e", "#eab308", "#ef4444"]; // positive, neutral, negative

export default function SentimentCharts() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    positive: 0,
    neutral: 0,
    negative: 0,
    total: 0,
  });
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/admin/sentiments?days=30");
        const data = await res.json();
        setCounts(data);
        setSeries(data.byDay || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) {
    return (
      <Card className="shadow">
        <CardContent className="p-6">Loading sentiment…</CardContent>
      </Card>
    );
  }

  const pieData = [
    { name: "Positive", value: counts.positive },
    { name: "Neutral", value: counts.neutral },
    { name: "Negative", value: counts.negative },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Sentiment Snapshot</h2>
          <div className="w-full h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Sentiment (Last 30 Days)
          </h2>
          <div className="w-full h-72">
            <ResponsiveContainer>
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="positive" />
                <Line type="monotone" dataKey="neutral" />
                <Line type="monotone" dataKey="negative" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
