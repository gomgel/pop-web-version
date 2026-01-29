"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RootPage() {
  const [plant, setPlant] = useState("2000");
  const [emplCode, setEmplCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isLoggedIn, setLogin } = useAuthStore();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/master/table");
    }
  }, [isLoggedIn, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!emplCode || !password) {
      setError("Please enter both employee code and password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plant, emplCode, password }),
      });

      const data = await res.json();
      if (data.success) {
        setLogin(data.userInfo);
        // useEffect will handle the redirect
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) return null; // Avoid flicker before useEffect redirect

  return (
    <div className="min-h-screen flex items-center justify-center bg-black dark font-sans uppercase">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-900 to-black pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md p-8 space-y-8 animate-in fade-in zoom-in duration-500 ml-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white tracking-widest mb-2">LOGIN</h1>
          <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-900/40 border border-red-900 text-red-100 px-4 py-2 rounded text-xs animate-pulse">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plant" className="text-xs text-stone-400 font-semibold tracking-wider">PLANT UNIT</Label>
              <Select value={plant} onValueChange={setPlant}>
                <SelectTrigger className="w-full bg-stone-900/50 border-stone-800 text-white h-12 focus:ring-blue-600">
                  <SelectValue placeholder="SELECT PLANT" />
                </SelectTrigger>
                <SelectContent className="bg-stone-900 border-stone-800 text-white">
                  <SelectItem value="2000">2000 - 유구공장</SelectItem>
                  <SelectItem value="2001">2001 - 인천공장</SelectItem>
                  <SelectItem value="2002">2002 - 포천공장</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emplCode" className="text-xs text-stone-400 font-semibold tracking-wider">EMPLOYEE CODE</Label>
              <Input
                id="emplCode"
                placeholder="ENTER CODE"
                className="bg-stone-900/50 border-stone-800 text-white h-12 focus:ring-blue-600"
                value={emplCode}
                onChange={(e) => setEmplCode(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs text-stone-400 font-semibold tracking-wider">PASSWORD</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-stone-900/50 border-stone-800 text-white h-12 focus:ring-blue-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-stone-200 text-black font-bold h-12 tracking-widest transition-all duration-300 transform hover:scale-[1.02]"
            >
              {loading ? "AUTHENTICATING..." : "SIGN IN"}
            </Button>

            <div className="flex justify-between items-center text-[10px] text-stone-500 tracking-tighter">
              <button type="button" className="hover:text-blue-500 transition-colors uppercase underline decoration-stone-800 underline-offset-4">Forgot password?</button>
              <button type="button" className="hover:text-blue-500 transition-colors uppercase underline decoration-stone-800 underline-offset-4">Create account</button>
            </div>
          </div>
        </form>

        {/* Footer Subtle Text */}
        <div className="text-center pt-8">
          <p className="text-[10px] text-stone-600 tracking-[0.2em] font-light">SYSTEM ACCESS RESTRICTED</p>
        </div>
      </div>
    </div>
  );
}
