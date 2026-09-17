"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupAdmin } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid =
    name.trim().length > 1 && email.trim().length > 0 && password.trim().length >= 8 && !isSubmitting;

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid) return;

    setError("");
    setIsSubmitting(true);
    try {
      await signupAdmin({ name: name.trim(), email: email.trim(), password });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create admin account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="Kredibble" width={56} height={56} className="rounded-2xl mb-4" />
          <h1 className="text-2xl font-bold text-kb-text-body">Create Admin Account</h1>
          <p className="text-sm text-kb-text-muted mt-1">Register through the Kredibble backend</p>
        </div>

        <form
          onSubmit={handleSignup}
          className="bg-kb-bg-card border border-kb-border rounded-2xl p-6 shadow-sm"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-kb-text-body mb-2">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nana Adjei"
              className="w-full h-11 rounded-lg border border-kb-border-input px-3 text-sm text-kb-text-body outline-none focus:border-kb-primary"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-kb-text-body mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@kredibble.com"
              className="w-full h-11 rounded-lg border border-kb-border-input px-3 text-sm text-kb-text-body outline-none focus:border-kb-primary"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-kb-text-body mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              className="w-full h-11 rounded-lg border border-kb-border-input px-3 text-sm text-kb-text-body outline-none focus:border-kb-primary"
            />
          </div>

          {error && (
            <p className="mb-4 rounded-lg border border-kb-error/20 bg-kb-error/10 px-3 py-2 text-sm text-kb-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!isValid}
            className="w-full h-11 rounded-lg bg-kb-primary text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>

          <p className="mt-4 text-center text-sm text-kb-text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-kb-primary">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
