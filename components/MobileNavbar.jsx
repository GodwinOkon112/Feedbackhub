"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Lightbulb,
  BarChart3,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", Icon: Home },
  { label: "Suggestions", href: "/admin/suggestions", Icon: Lightbulb },
  { label: "Analytics", href: "/admin/analytics", Icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", Icon: Settings },
];

export default function MobileNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/signout", { method: "POST" });
    router.push("/auth");
  };

  return (
    <nav className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 z-50 border-b border-gray-800">
      <div className="flex items-center justify-between h-16 px-4">
        <span className="text-lg font-bold text-white tracking-wide">
          FeedBackHub
        </span>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-64 bg-gray-900 border-l border-gray-800 p-0"
          >
            <SheetHeader className="px-4 py-4 border-b border-gray-800">
              <SheetTitle className="text-white text-lg">
                FeedBackHub
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col mt-2">
              {navItems.map(({ label, href, Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors
                      ${
                        isActive
                          ? "bg-gray-800 text-white font-semibold"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
