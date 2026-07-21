"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValid = email.trim().length > 0 && password.trim().length > 0;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    // No backend yet — any credentials "log in" to the mock dashboard.
    router.push("/");
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="Kredibble" width={56} height={56} className="rounded-2xl mb-4" />
          <h1 className="text-2xl font-bold text-kb-text-body">Kredibble Admin</h1>
          <p className="text-sm text-kb-text-muted mt-1">Sign in to manage the platform</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-kb-bg-card border border-kb-border rounded-2xl p-6 shadow-sm"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-kb-text-body mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@kredibble.com"
              className="w-full h-11 rounded-lg border border-kb-border-input px-3 text-sm text-kb-text-body outline-none focus:border-kb-primary"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-kb-text-body mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full h-11 rounded-lg border border-kb-border-input px-3 text-sm text-kb-text-body outline-none focus:border-kb-primary"
            />
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className="w-full h-11 rounded-lg bg-kb-primary text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
