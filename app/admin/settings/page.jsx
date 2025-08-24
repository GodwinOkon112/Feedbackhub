"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminSettings() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // fetch current admin info on mount
  useEffect(() => {
    async function fetchAdmin() {
      try {
        const res = await fetch("/api/admin/me");
        if (res.ok) {
          const data = await res.json();
          setFullName(data.fullName || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
        } else {
          router.push("/admin/signin");
        }
      } catch (err) {
        console.error(err);
        router.push("/admin/signin");
      }
    }
    fetchAdmin();
  }, [router]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const payload = { fullName, email, phone };
      if (password) payload.password = password;

      const res = await fetch("/api/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setMessage(data.message || (res.ok ? "Updated successfully" : "Error"));

      if (res.ok) {
        setPassword("");
        setConfirmPassword("");
        toast.success("Settings updated successfully");
      } else {
        toast.error(data.message || "Failed to update settings");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Please try again.");
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/signin");
    } catch (err) {
      console.error(err);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="max-w-full mx-auto  md:p-4 ">
      <CardTitle className="text-left text-2xl font-bold  mb-6">
         Settings
      </CardTitle>
      <Card className="shadow-lg">
        <CardHeader></CardHeader>
        <CardContent className="flex flex-col gap-6">
          {message && (
            <Alert
              variant={
                message.toLowerCase().includes("success")
                  ? "success"
                  : "destructive"
              }
            >
              <AlertTitle>
                {message.toLowerCase().includes("success")
                  ? "Success"
                  : "Error"}
              </AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <form
            onSubmit={handleUpdate}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="flex flex-col gap-1">
              <Label>Full Name</Label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Email Address</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Phone Number</Label>
              <Input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>New Password</Label>
              <Input
                type="password"
                value={password}
                placeholder="Leave blank if unchanged"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                placeholder="Leave blank if unchanged"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="md:col-span-2 flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mx-auto"></span>
                ) : (
                  "Update Settings"
                )}
              </Button>

              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
