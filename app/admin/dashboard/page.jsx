"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

export default function AdminDashboard() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all suggestions
  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/suggestions/get");
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      toast.error("Failed to fetch suggestions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  // Delete suggestion
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this suggestion?")) return;

    try {
      const res = await fetch(`/api/suggestions/delete/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Deleted successfully");
      fetchSuggestions();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Chart data (group by category)
  const categoryData = ["Academics", "Facilities", "Others"].map((cat) => ({
    name: cat,
    value: suggestions.filter((s) => s.category === cat).length,
  }));

  // Suggestions over time (bar chart)
  const timeData = suggestions.reduce((acc, s) => {
    const date = new Date(s.createdAt).toLocaleDateString();
    const found = acc.find((item) => item.date === date);
    if (found) {
      found.count++;
    } else {
      acc.push({ date, count: 1 });
    }
    return acc;
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div className="md:p-4 min-h-screen ">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* ✅ Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Suggestions</p>
          <h2 className="text-2xl font-bold">{suggestions.length}</h2>
        </Card>
        <Card className="p-4 shadow-sm">
          <p className="text-sm text-gray-500">Academics</p>
          <h2 className="text-2xl font-bold">
            {categoryData.find((c) => c.name === "Academics")?.value || 0}
          </h2>
        </Card>
        <Card className="p-4 shadow-sm">
          <p className="text-sm text-gray-500">Facilities</p>
          <h2 className="text-2xl font-bold">
            {categoryData.find((c) => c.name === "Facilities")?.value || 0}
          </h2>
        </Card>
        <Card className="p-4 shadow-sm">
          <p className="text-sm text-gray-500">Others</p>
          <h2 className="text-2xl font-bold">
            {categoryData.find((c) => c.name === "Others")?.value || 0}
          </h2>
        </Card>
      </div>

      {/* ✅ Search bar */}
      <div className="mb-6">
        <Input
          placeholder="Search suggestions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ✅ Recent Suggestions */}
      <Card className="mb-6 shadow-lg">
        <CardContent>
          <h2 className="text-lg font-semibold mb-4 py-4">
            Recent Suggestions
          </h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Message</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suggestions
                  .filter((s) =>
                    s.message.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .slice(0, 5) // ✅ Only show 5 recent
                  .map((s) => (
                    <TableRow key={s._id}>
                      <TableCell>{s.message}</TableCell>
                      <TableCell>{s.category}</TableCell>
                      <TableCell>
                        {new Date(s.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(s._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ✅ Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="shadow-lg">
          <CardContent>
            <h2 className="text-lg font-semibold mb-4 py-4">
              Suggestions by Category
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart - Suggestions over time */}
        <Card className="shadow-lg">
          <CardContent>
            <h2 className="text-lg font-semibold mb-4 py-4">
              Suggestions Over Time
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
