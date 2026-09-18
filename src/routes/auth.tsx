import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Studio Login | sNeha's Makeover" },
      { name: "description", content: "Private studio login for sNeha's Makeover administrators." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Studio Login | sNeha's Makeover" },
      { property: "og:description", content: "Private studio login for administrators." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (err) throw err;
        if (data.session) navigate({ to: "/admin", replace: true });
        else setMessage("Account created. Check your email to confirm, then sign in.");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        navigate({ to: "/admin", replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-black px-5 py-32 text-off-white">
      <div className="w-full max-w-md border border-gold/30 p-8">
        <p className="eyebrow text-gold">sNeha&apos;s Makeover</p>
        <h1 className="mt-4 font-serif text-3xl">Studio admin</h1>
        <p className="mt-3 text-sm text-off-white/60">
          {mode === "signin"
            ? "Sign in to manage gallery, offers and products."
            : "Create the studio admin account using an approved email address."}
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="text-xs uppercase tracking-[0.18em] text-off-white/60">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border border-white/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-xs uppercase tracking-[0.18em] text-off-white/60"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border border-white/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-gold"
            />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {message ? <p className="text-sm text-gold-light">{message}</p> : null}

          <button type="submit" disabled={busy} className="btn btn-gold w-full disabled:opacity-60">
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setMessage(null);
          }}
          className="mt-6 text-xs uppercase tracking-[0.18em] text-gold hover:underline"
        >
          {mode === "signin" ? "Create admin account" : "Back to sign in"}
        </button>
      </div>
    </section>
  );
}
