"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/Sidebar";
import MobileNavbar from "@/components/MobileNavbar"; // ✅ import mobile nav

export default  function AdminLayout({ children }) {
  const pathname = usePathname();

  // ✅ Make sure all paths start with "/"
  const hideSidebarPaths = ["/admin/signin", "/admin/signup", "/admin/auth"];
  const shouldHideSidebar = hideSidebarPaths.includes(pathname);

  return (
    <div className=" min-h-screen">
    <SidebarProvider>
      <div className="min-h-screen flex  w-full">
        {/* ✅ Mobile Navbar (always present on small screens) */}
        {!shouldHideSidebar && <MobileNavbar />}

        {/* ✅ Desktop Sidebar */}
        {!shouldHideSidebar && (
          <aside className="fixed inset-y-0 left-0  w-60 hidden md:flex flex-col bg-white shadow-lg">
            <Sidebar />
          </aside>
        )}

        {/* Main content */}
        <main
          className={`flex-1 p-6 transition-all w-[100%]  ${
            !shouldHideSidebar ? "md:ml-60" : "ml-0"
          }`}
        >
          {/* add padding-top so content is not hidden behind mobile nav */}
          <div className="w-full   mx-auto pt-16 md:pt-0">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
    </div>
  );
}
