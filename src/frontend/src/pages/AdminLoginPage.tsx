import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  EyeIcon,
  EyeOffIcon,
  HeartPulseIcon,
  LockIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { verifyAdmin } from "../lib/api";
import { useAuthStore } from "../stores/authStore";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const { login } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: () => {
      if (!actor) throw new Error("No connection");
      return verifyAdmin(actor, username, password);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        login(result.ok);
        toast.success("লগইন সফল হয়েছে");
        navigate({ to: "/admin" });
      } else {
        toast.error("ব্যবহারকারী নাম বা পাসওয়ার্ড সঠিক নয়");
      }
    },
    onError: () => {
      toast.error("সংযোগ সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      {/* Government top bar */}
      <div className="bg-primary px-4 py-2">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <HeartPulseIcon className="h-3.5 w-3.5 text-primary-foreground/90" />
            <span className="text-xs font-medium text-primary-foreground/90">
              গণপ্রজাতন্ত্রী বাংলাদেশ সরকার — স্বাস্থ্য ও পরিবার কল্যাণ মন্ত্রণালয়
            </span>
          </div>
          <span className="hidden text-xs text-primary-foreground/70 sm:block">
            Ministry of Health and Family Welfare
          </span>
        </div>
      </div>

      {/* Branded header */}
      <header className="border-b border-border bg-card px-4 py-4 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <div className="flex items-center gap-1.5 text-2xl leading-none">
            <span title="বাংলাদেশ">🇧🇩</span>
            <span title="সৌদি আরব">🇸🇦</span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary shadow-sm">
            <HeartPulseIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-base font-bold text-foreground sm:text-lg">
              স্বাস্থ্য ও পরিবার কল্যাণ মন্ত্রণালয়
            </h1>
            <p className="text-xs text-muted-foreground">
              Ministry of Health and Family Welfare — সরকারি স্বাস্থ্যসেবা পোর্টাল
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            {/* Card header stripe */}
            <div className="bg-primary px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/15">
                  <ShieldCheckIcon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-primary-foreground">
                    অ্যাডমিন প্যানেল
                  </h2>
                  <p className="text-xs text-primary-foreground/75">
                    Admin Control Panel Login
                  </p>
                </div>
              </div>
            </div>

            {/* Form body */}
            <div className="px-6 py-6" data-ocid="admin-login-panel">
              <div className="mb-5 flex items-start gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2.5">
                <LockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  এই প্যানেলে শুধুমাত্র অনুমোদিত প্রশাসকরা প্রবেশ করতে পারবেন। অননুমোদিত
                  প্রবেশ শাস্তিযোগ্য অপরাধ।
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="username"
                    className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    ব্যবহারকারী নাম (Username)
                  </Label>
                  <Input
                    id="username"
                    autoComplete="username"
                    required
                    placeholder="আপনার ব্যবহারকারী নাম লিখুন"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-11 text-sm"
                    data-ocid="admin-username-input"
                    disabled={mutation.isPending}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="password"
                    className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    পাসওয়ার্ড (Password)
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      placeholder="আপনার পাসওয়ার্ড লিখুন"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 pr-11 text-sm"
                      data-ocid="admin-password-input"
                      disabled={mutation.isPending}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={
                    mutation.isPending || !username.trim() || !password.trim()
                  }
                  className="h-11 w-full font-semibold"
                  data-ocid="admin-login-btn"
                >
                  {mutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                      যাচাই করা হচ্ছে...
                    </span>
                  ) : (
                    "লগইন করুন"
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} স্বাস্থ্য ও পরিবার কল্যাণ মন্ত্রণালয়
            </p>
            <p className="mt-1 text-xs text-muted-foreground/60">
              Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-muted-foreground"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
