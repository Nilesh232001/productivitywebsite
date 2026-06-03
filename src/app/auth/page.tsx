"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LogIn, Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();

      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        if (data.user && data.session) {
          await ensureProfile(data.user.id, fullName || email.split("@")[0]);
        }

        if (data.session) {
          window.location.href = "/";
          return;
        }

        setSuccess(true);
        setEmail("");
        setPassword("");
        setFullName("");
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          setError(signInError.message);
          return;
        }

        if (!data.user) {
          setError("Sign in completed, but no user session was returned. Please try again.");
          return;
        }

        await ensureProfile(
          data.user.id,
          data.user.user_metadata?.full_name || email.split("@")[0]
        );

        window.location.href = "/";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest to-forest/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 bg-forest rounded-lg flex items-center justify-center">
              <LogIn className="h-6 w-6 text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-ink text-center mb-2">Personal OS</h1>
          <p className="text-ink/60 text-center text-sm mb-8">
            {isSignUp ? "Create your account" : "Welcome back"}
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-ink mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/60 hover:text-ink"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-coral/10 border border-coral/30 rounded-lg p-3 text-coral text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-forest/10 border border-forest/30 rounded-lg p-3 text-forest text-sm">
                Check your email to confirm your account!
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest hover:bg-forest/90 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 mt-6"
            >
              {loading
                ? "Loading..."
                : isSignUp
                  ? "Create Account"
                  : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-line text-center">
            <p className="text-sm text-ink/60">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="text-forest font-medium hover:underline"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>

        <p className="text-white/60 text-xs text-center mt-8">
          © 2026 Personal OS. Your productivity command center.
        </p>
      </div>
    </div>
  );
}

async function ensureProfile(userId: string, fullName: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        full_name: fullName,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata"
      },
      { onConflict: "id" }
    );

  if (error) {
    throw new Error(`Could not prepare your profile: ${error.message}`);
  }
}
