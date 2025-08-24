"use client";
import { useEffect, useState } from "react";
import { analyzeSentiment } from "@/lib/sentiment";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function AnalyticsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    async function fetchSuggestions() {
      try {
        const res = await fetch("/api/suggestions/get");
        const suggestions = await res.json();

        const analyzed = suggestions.map((s) => {
          const { label, score } = analyzeSentiment(s.message);
          return {
            ...s,
            sentiment: label,
            sentimentScore: score,
            category: s.category || "Others",
          };
        });

        setData(analyzed);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSuggestions();
  }, []);

  if (loading) return <p className="text-center">Loading analytics...</p>;

  // Filters
  const filteredData = data.filter((s) => {
    const categoryMatch =
      categoryFilter === "All" || s.category === categoryFilter;
    const date = new Date(s.createdAt);
    const startMatch = startDate ? date >= new Date(startDate) : true;
    const endMatch = endDate ? date <= new Date(endDate) : true;
    return categoryMatch && startMatch && endMatch;
  });

  // Sentiment counts
  const sentimentCounts = filteredData.reduce((acc, s) => {
    acc[s.sentiment] = (acc[s.sentiment] || 0) + 1;
    return acc;
  }, {});
  const sentimentData = [
    { name: "Positive", value: sentimentCounts.positive || 0 },
    { name: "Neutral", value: sentimentCounts.neutral || 0 },
    { name: "Negative", value: sentimentCounts.negative || 0 },
  ];

  // Category counts
  const categoryCounts = filteredData.reduce((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1;
    return acc;
  }, {});
  const categoryData = [
    { name: "Academics", value: categoryCounts.Academics || 0 },
    { name: "Facilities", value: categoryCounts.Facilities || 0 },
    { name: "Others", value: categoryCounts.Others || 0 },
  ];

  // Sentiment over time
  const sentimentOverTime = {};
  filteredData.forEach((s) => {
    const date = new Date(s.createdAt).toISOString().slice(0, 10);
    if (!sentimentOverTime[date])
      sentimentOverTime[date] = {
        date,
        positive: 0,
        neutral: 0,
        negative: 0,
        totalScore: 0,
        count: 0,
      };
    sentimentOverTime[date][s.sentiment]++;
    sentimentOverTime[date].totalScore += s.sentimentScore;
    sentimentOverTime[date].count++;
  });
  const sentimentTimeData = Object.values(sentimentOverTime).map((d) => ({
    ...d,
    avgScore: d.count ? d.totalScore / d.count : 0,
  }));

  // Category vs Sentiment
  const categories = ["Academics", "Facilities", "Others"];
  const categorySentimentData = categories.map((cat) => {
    const filteredCat = filteredData.filter((s) => s.category === cat);
    return {
      name: cat,
      positive: filteredCat.filter((s) => s.sentiment === "positive").length,
      neutral: filteredCat.filter((s) => s.sentiment === "neutral").length,
      negative: filteredCat.filter((s) => s.sentiment === "negative").length,
    };
  });

  // Top suggestions
  const topPositive = filteredData
    .filter((s) => s.sentiment === "positive")
    .sort((a, b) => (b.sentimentScore || 0) - (a.sentimentScore || 0))
    .slice(0, 3);
  const topNegative = filteredData
    .filter((s) => s.sentiment === "negative")
    .sort((a, b) => (a.sentimentScore || 0) - (b.sentimentScore || 0))
    .slice(0, 3);

  const sentimentColors = ["#16a34a", "#6b7280", "#dc2626"];
  const categoryColors = ["#3b82f6", "#f59e0b", "#10b981"];

  return (
    <div className="md:pl-4 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Admin Analytics</h1>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Refine the analytics using category and date range
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="sm:w-1/3">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Academics">Academics</SelectItem>
              <SelectItem value="Facilities">Facilities</SelectItem>
              <SelectItem value="Others">Others</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="sm:w-1/3"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="sm:w-1/3"
          />
        </CardContent>
      </Card>

      {/* Total */}
      <Card>
        <CardHeader>
          <CardTitle>Total Suggestions</CardTitle>
          <CardDescription>
            Overall suggestions within the selected filters
          </CardDescription>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          {filteredData.length}
        </CardContent>
      </Card>

      {/* Charts in grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {sentimentData.map((entry, i) => (
                    <Cell key={i} fill={sentimentColors[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value">
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={categoryColors[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment over time */}
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Over Time</CardTitle>
        </CardHeader>
        <CardContent className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sentimentTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="positive" stroke="#16a34a" />
              <Line type="monotone" dataKey="neutral" stroke="#6b7280" />
              <Line type="monotone" dataKey="negative" stroke="#dc2626" />
              <Line
                type="monotone"
                dataKey="avgScore"
                stroke="#f59e0b"
                strokeDasharray="5 5"
                name="Avg Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category vs Sentiment */}
      <Card>
        <CardHeader>
          <CardTitle>Category vs Sentiment</CardTitle>
        </CardHeader>
        <CardContent className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categorySentimentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="positive" stackId="a" fill="#16a34a" />
              <Bar dataKey="neutral" stackId="a" fill="#6b7280" />
              <Bar dataKey="negative" stackId="a" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top suggestions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Positive Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {topPositive.map((s) => (
                <AccordionItem key={s._id} value={s._id}>
                  <AccordionTrigger>
                    {s.message.slice(0, 50)}...
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">{s.message}</p>
                    <p>
                      <strong>Score:</strong> {s.sentimentScore}
                    </p>
                    <p>
                      <strong>Category:</strong> {s.category}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Negative Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {topNegative.map((s) => (
                <AccordionItem key={s._id} value={s._id}>
                  <AccordionTrigger>
                    {s.message.slice(0, 50)}...
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">{s.message}</p>
                    <p>
                      <strong>Score:</strong> {s.sentimentScore}
                    </p>
                    <p>
                      <strong>Category:</strong> {s.category}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
