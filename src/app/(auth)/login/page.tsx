"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Trophy } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-carbon-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-gold rounded-lg flex items-center justify-center">
              <Trophy className="w-4 h-4 text-carbon-950" />
            </div>
            <span className="font-display font-bold text-xl text-white">
              Golf<span className="text-gradient-gold">Heroes</span>
            </span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-white">Welcome back</h1>
          <p className="text-carbon-400 mt-2">Sign in to your account</p>
        </div>

        <div className="bg-carbon-900 border border-carbon-700 rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" size="md" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-carbon-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-gold hover:text-gold-light">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
