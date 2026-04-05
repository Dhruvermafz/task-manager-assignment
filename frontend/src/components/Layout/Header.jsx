"use client";

import React, { useState } from "react";
import { Search, Moon, Sun, User, Menu } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { toggleMobileSidebar } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 w-full h-16 border-b border-border bg-background/60 backdrop-blur-md z-40 flex items-center px-4 md:px-6 justify-between">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden mr-2"
        onClick={toggleMobileSidebar}
      >
        <Menu className="w-5 h-5" strokeWidth={1.5} />
      </Button>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-md"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" strokeWidth={1.5} />
          ) : (
            <Moon className="w-5 h-5" strokeWidth={1.5} />
          )}
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 md:h-10 md:w-10 rounded-full"
            >
              <Avatar className="h-9 w-9 md:h-10 md:w-10">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>
                  <User className="w-4 h-4 md:w-5 md:h-5" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground font-mono truncate">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={logout}
              className="text-destructive cursor-pointer"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
