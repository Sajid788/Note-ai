"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { DashboardBackground } from "@/components/layout/DashboardBackground";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { login, register } from "@/redux/authApi";
import { validateLogin, validateRegister } from "@/lib/validation";
import { toast } from "@/lib/toast";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors =
      mode === "login"
        ? validateLogin(email, password)
        : validateRegister(name, email, password);

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      toast.error(firstError || "Please fix the errors below");
      return;
    }

    setLoading(true);

    try {
      let data;
      if (mode === "login") {
        data = await login(email.trim(), password);
        toast.success("Welcome back!");
      } else {
        data = await register(name.trim(), email.trim(), password);
        toast.success("Account created successfully!");
      }
      dispatch(setUser(data));
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030304] px-4 py-12">
      <DashboardBackground />

      <div className="relative w-full max-w-[420px] animate-fade-in-up">
        <div className="mb-10 text-center">
          <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-violet-500/30 blur-xl" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-xl shadow-violet-500/30 ring-1 ring-white/20">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-gradient text-3xl font-bold tracking-tight">
            Smart Notes
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Your minimal AI-powered workspace
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <h2 className="mb-1 text-lg font-semibold text-white">
            {mode === "login" ? "Welcome back" : "Get started"}
          </h2>
          <p className="mb-6 text-sm text-zinc-500">
            {mode === "login"
              ? "Sign in to access your notes"
              : "Create your free account"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {mode === "register" && (
              <Input
                id="name"
                label="Full name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={fieldErrors.name}
              />
            )}
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
            />
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
            />
            {mode === "register" && !fieldErrors.password && (
              <p className="text-xs text-zinc-600">
                Min 8 characters with a special character (!@#$% etc.)
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm disabled:opacity-50 disabled:hover:transform-none"
            >
              {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-black" />
              )}
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-zinc-500">
            {mode === "login" ? (
              <>
                No account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-violet-400 hover:text-violet-300"
                >
                  Sign up free
                </Link>
              </>
            ) : (
              <>
                Have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-violet-400 hover:text-violet-300"
                >
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
