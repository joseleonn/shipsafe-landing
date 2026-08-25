import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Dashboard | SHIPSAFE",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-primary px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
        <p className="mb-8 mt-2 text-sm text-white/50">
          Los números del canal de Meta Ads. Interno.
        </p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
