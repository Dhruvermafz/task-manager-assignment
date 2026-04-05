"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLoginUserMutation } from "@/api/userApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login: setJwtInContext } = useAuth();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser({
        email: form.email.trim(),
        password: form.password,
      }).unwrap();

      if (response.success && response.token) {
        // ✅ Store token based on rememberMe
        if (rememberMe) {
          localStorage.setItem("token", response.token);
        } else {
          sessionStorage.setItem("token", response.token);
        }

        // Also update context
        setJwtInContext(response.token);

        toast.success("Login successful!");
        router.push("/");
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (err) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "Invalid credentials or server error";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
            DevHub
          </h1>
          <p className="text-muted-foreground">
            Developer Dashboard & Portfolio
          </p>
        </div>

        <Card className="border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="developer@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  autoComplete="current-password"
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="remember-me">Remember Me</Label>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
