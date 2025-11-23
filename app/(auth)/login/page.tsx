
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authstore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Lock, User, Eye, EyeOff, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { AxiosError } from "axios";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    setIsLoading(true);

    try {
      await login(formData);
      
      toast.success("Login successful!", {
        description: "Welcome back to your dashboard",
      });
      
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      
      const axiosError = error as AxiosError<{ detail: string }>;
      toast.error("Login failed", {
        description: axiosError.response?.data?.detail || "Invalid credentials. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 via-white to-blue-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl mb-4 shadow-lg">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Prime<span className="text-emerald-600">Health</span>Care
          </h1>
          <p className="text-gray-600">Admin Portal</p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center text-base">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className="pl-11 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={isLoading}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-11 pr-11 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isLoading}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link 
                href="/forgot-password" 
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button 
              onClick={handleSubmit}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg hover:shadow-xl transition-all" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  New to the platform?
                </span>
              </div>
            </div>

            <Link href="/register" className="w-full">
              <Button 
                type="button"
                variant="outline" 
                className="w-full h-12 border-2 border-gray-200 hover:border-emerald-600 hover:text-emerald-600 font-medium transition-all"
              >
                Create Admin Account
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          Protected by industry-standard encryption
        </p>
      </div>
    </div>
  );
}