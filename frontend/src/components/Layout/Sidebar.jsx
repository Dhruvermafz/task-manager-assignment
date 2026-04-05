"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  MessageSquare,
  BookOpen,
  Users,
  CheckSquare,
  Wallet,
  PenTool,
  Newspaper,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { isCollapsed, isMobileOpen, toggleSidebar, closeMobileSidebar } =
    useSidebar();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: CheckSquare, label: "Tasks", path: "/tasks" },
    { icon: Users, label: "Users", path: "/users" },
  ];

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      closeMobileSidebar();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full border-r border-border bg-background/95 backdrop-blur-xl z-50 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          "md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-border">
            {!isCollapsed && (
              <h1 className="text-xl font-bold tracking-tight">DevHub</h1>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hidden md:flex ml-auto"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
              ) : (
                <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    isCollapsed && "justify-center",
                  )}
                  title={isCollapsed ? item.label : ""}
                >
                  <Icon className="w-5 h-5 shrink-0" strokeWidth={1.5} />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-border">
            <button
              onClick={() => {
                logout();
                handleNavClick();
              }}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-md w-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200",
                isCollapsed && "justify-center",
              )}
              title={isCollapsed ? "Logout" : ""}
            >
              <LogOut className="w-5 h-5 shrink-0" strokeWidth={1.5} />
              {!isCollapsed && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
