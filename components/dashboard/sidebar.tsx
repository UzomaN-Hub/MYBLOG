"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authstore";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  Plus,
  List,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Articles",
    icon: FileText,
    children: [
      { name: "All Articles", href: "/Adminarticles", icon: List },
      { name: "Create New", href: "/Adminarticles/newpage", icon: Plus },
    ],
  },
  {
    name: "Admins",
    href: "/admins",
    icon: Users,
    superAdminOnly: true,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(["Articles"]);

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isChildActive = (children: { href: string }[]) =>
    children?.some((child) => pathname === child.href || pathname.startsWith(child.href + "/"));

  const handleLogout = () => {
    toast.success("Logged out successfully");
    setTimeout(() => logout(), 500);
  };

  const closeMobile = () => setMobileOpen(false);

 
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-white">
            Prime<span className="text-emerald-500">Health</span>Care
          </h1>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          // Hide super admin only items
          if (item.superAdminOnly && !user?.is_super_admin) return null;

          // Item with children and dropdown
          if (item.children) {
            const isExpanded = expandedItems.includes(item.name);
            const hasActiveChild = isChildActive(item.children);

            return (
              <div key={item.name}>
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    hasActiveChild
                      ? "bg-emerald-600/20 text-emerald-500"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.name}</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>

                {/* Children */}
                {isExpanded && (
                  <div className="mt-1 ml-4 pl-4 border-l border-gray-800 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={closeMobile}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive(child.href) || pathname.startsWith(child.href + "/")
                            ? "bg-emerald-600 text-white"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        )}
                      >
                        <child.icon className="w-4 h-4" />
                        <span>{child.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // Regular items that has no children
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={closeMobile}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-emerald-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-3 border-t border-gray-800">
        {user && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-white truncate">
              {user.username}
            </p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
            {user.is_super_admin && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-amber-500/20 text-amber-500 text-xs rounded-full">
                Super Admin
              </span>
            )}
          </div>
        )}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 rounded-lg text-white shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={closeMobile}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 transform transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={closeMobile}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-40 w-72 bg-gray-900">
        {sidebarContent}
      </aside>
    </>
  );
}