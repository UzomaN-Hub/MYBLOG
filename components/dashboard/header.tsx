"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/articles": "All Articles",
  "/articles/new": "Create Article",
  "/admins": "Admin Management",
  "/settings": "Settings",
};

export function DashboardHeader() {
  const pathname = usePathname();


  let title = pageTitles[pathname] || "Dashboard";
  
  // Check for edit page pattern: /articles/[id]/edit
  if (pathname.includes("/articles/") && pathname.includes("/edit")) {
    title = "Edit Article";
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left (Title) */}
        <div className="flex items-center gap-4 cursor-pointer">
          {/* Spacer for mobile menu button */}
          <div className="lg:hidden w-10" />
          <h1 className="text-xl font-semibold text-green-800">{title}</h1>
        </div>

        {/* Right (Search & Notifications) */}
        <div className="flex items-center gap-4">
          {/* Search (Hidden on mobile) */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 w-64 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative cursor-pointer">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
        </div>
      </div>
    </header>
  );
}