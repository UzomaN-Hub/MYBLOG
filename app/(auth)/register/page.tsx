"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Lock, User, Mail, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";
import Link from "next/link";
import { AxiosError } from "axios";

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("All fields are required");
      return false;
    }

    if (formData.username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await authApi.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      
      toast.success("Registration successful!", {
        description: "Your admin account has been created. Please login.",
      });
      
      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
      
      const axiosError = error as AxiosError<{ detail: string }>;
      toast.error("Registration failed", {
        description: axiosError.response?.data?.detail || "Could not create account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return { strength: 0, text: "", color: "" };
    if (password.length < 6) return { strength: 25, text: "Weak", color: "bg-red-500" };
    if (password.length < 10) return { strength: 50, text: "Fair", color: "bg-orange-500" };
    if (password.length < 14) return { strength: 75, text: "Good", color: "bg-yellow-500" };
    return { strength: 100, text: "Strong", color: "bg-emerald-500" };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-blue-50 px-4 py-12">
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
            <CardTitle className="text-2xl font-bold text-center">Create Admin Account</CardTitle>
            <CardDescription className="text-center text-base">
              Register to get started with the admin dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-5">
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                First registered admin becomes super admin automatically
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  className="pl-11 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="pl-11 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isLoading}
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
                  placeholder="Create a strong password"
                  className="pl-11 pr-11 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${strength.color}`}
                      style={{ width: `${strength.strength}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    Password strength: <span className="font-medium">{strength.text}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="pl-11 pr-11 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  disabled={isLoading}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
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
                  Creating account...
                </>
              ) : (
                "Create Admin Account"
              )}
            </Button>

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <Link href="/login" className="w-full">
              <Button 
                type="button"
                variant="outline" 
                className="w-full h-12 border-2 border-gray-200 hover:border-emerald-600 hover:text-emerald-600 font-medium transition-all"
              >
                Sign In Instead
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          By registering, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}