"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function SuggestionPage() {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("Others");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Suggestion message is required!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/suggestions/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, category }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      toast.success("✅ Suggestion submitted successfully!");
      setMessage("");
      setCategory("Others");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-6 shadow-xl rounded-2xl">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4 text-center">
            Submit Your Suggestion
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Enter your suggestion..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px]"
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Academics">Academics</SelectItem>
                <SelectItem value="Facilities">Facilities</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="w-full rounded-none " disabled={loading}>
              {loading ? "Submitting..." : "Submit Suggestion"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
