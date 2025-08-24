"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  async function fetchSuggestions() {
    try {
      setLoading(true);
      const res = await fetch("/api/suggestions/get");
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      toast.error("Failed to fetch suggestions");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/suggestions/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Suggestion deleted!");
        setSuggestions((prev) => prev.filter((s) => s._id !== id));
      } else {
        toast.error("Failed to delete suggestion");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete suggestion");
    } finally {
      setModalOpen(false);
      setDeleteTarget(null);
    }
  }

  const filteredSuggestions = suggestions.filter((s) => {
    const msg = s.message || "";
    const sentiment = s.sentiment || "neutral";
    const category = s.category || "Others";

    const matchesSearch = msg.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSentiment =
      sentimentFilter === "All" ||
      sentiment.toLowerCase() === sentimentFilter.toLowerCase();
    const matchesCategory =
      categoryFilter === "All" || category === categoryFilter;

    return matchesSearch && matchesSentiment && matchesCategory;
  });

  if (loading) return <p className="text-center">Loading suggestions...</p>;

  return (
    <div className=" md:pl-4 min-h-[80vh] space-y-8">
      <h1 className="text-2xl font-bold ">Suggestions</h1>

      {/* Filters Section */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search suggestions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sm:w-1/3"
            />

            <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
              <SelectTrigger className="sm:w-1/3">
                <SelectValue placeholder="Filter by Sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Sentiments</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>

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
          </div>
        </CardContent>
      </Card>

      {/* Suggestions List */}
      <div className="grid gap-4">
        {filteredSuggestions.length === 0 ? (
          <p className="text-center text-gray-500">
            No suggestions match your filters.
          </p>
        ) : (
          filteredSuggestions.map((s) => {
            const sentiment = (s.sentiment || "neutral").toLowerCase();
            const sentimentColor =
              sentiment === "positive"
                ? "bg-green-100 text-green-700"
                : sentiment === "negative"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700";

            return (
              <Card
                key={s._id}
                className="shadow-sm hover:shadow-md transition"
              >
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-medium">
                    {s.message.slice(0, 60)}
                    {s.message.length > 60 ? "..." : ""}
                  </CardTitle>
                  <Badge className={sentimentColor}>
                    {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    <strong>Category:</strong>{" "}
                    <Badge variant="secondary">{s.category}</Badge>
                  </p>
                  <p className="text-sm leading-relaxed">{s.message}</p>

                  {/* Delete Button + Dialog */}
                  <Dialog
                    open={modalOpen && deleteTarget === s._id}
                    onOpenChange={setModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="secondary"
                        className="bg-gray-800 text-white hover:bg-gray-700"
                        onClick={() => setDeleteTarget(s._id)}
                      >
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this suggestion? This
                          action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setModalOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(s._id)}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
