"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Trophy } from "lucide-react";
import { toast } from "sonner";

function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "monthly";
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    // Redirect to checkout with plan
    router.push(`/dashboard/subscribe?plan=${plan}`);
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
          <h1 className="font-display text-3xl font-bold text-white">Join GolfHeroes</h1>
          <p className="text-carbon-400 mt-2">
            Plan: <span className="text-gold capitalize">{plan}</span>
          </p>
        </div>

        <div className="bg-carbon-900 border border-carbon-700 rounded-2xl p-8">
          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="John Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
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
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-xs text-carbon-500">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
            <Button type="submit" className="w-full" loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-carbon-400 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-gold hover:text-gold-light">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
