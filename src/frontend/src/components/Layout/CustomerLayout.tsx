import { Link, useLocation } from "@tanstack/react-router";

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export function CustomerLayout({ children }: CustomerLayoutProps) {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "আবেদন করুন" },
    { to: "/status", label: "আবেদন যাচাই" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* ── Top Government Banner ─────────────────────────────────────── */}
      <div className="gov-banner-gradient px-4 py-2">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-2">
          <span className="text-[11px] font-semibold tracking-wide text-white/90">
            গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
          </span>
          <span className="h-3 w-px bg-white/30" />
          <span className="text-[11px] text-white/70">
            People's Republic of Bangladesh
          </span>
        </div>
      </div>

      {/* ── Main Government Header ────────────────────────────────────── */}
      <header className="border-b-4 border-primary bg-card shadow-subtle">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            {/* Bangladesh Flag / Emblem */}
            <div className="flex flex-col items-center gap-0.5">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-primary/20 shadow-sm"
                title="বাংলাদেশ"
                aria-label="Bangladesh emblem"
              >
                <span className="text-4xl leading-none">🇧🇩</span>
              </div>
              <span className="text-[9px] font-bold text-primary">BD</span>
            </div>

            {/* Center: Name block */}
            <div className="flex-1 text-center">
              {/* Official seal row */}
              <div className="mb-1 flex items-center justify-center gap-2">
                <div className="h-px flex-1 bg-primary/20" />
                <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-0.5">
                  {/* Verified checkmark */}
                  <svg
                    className="h-3.5 w-3.5 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[10px] font-bold text-primary">
                    সরকার অনুমোদিত ✓
                  </span>
                </div>
                <div className="h-px flex-1 bg-primary/20" />
              </div>

              {/* Bangla name */}
              <h1 className="font-display text-lg font-black leading-tight text-foreground sm:text-xl">
                বাংলাদেশ জাতীয় স্বাস্থ্য সেবা
              </h1>
              {/* English name */}
              <p className="font-display text-sm font-bold text-primary sm:text-base">
                Bangladesh National Health Services
              </p>
              {/* Short name badge */}
              <div className="mt-1 flex items-center justify-center gap-2">
                <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-black tracking-widest text-primary-foreground">
                  BNHS
                </span>
                <span className="text-[10px] text-muted-foreground">
                  স্বাস্থ্য ও পরিবার কল্যাণ মন্ত্রণালয় অনুমোদিত
                </span>
              </div>
            </div>

            {/* Saudi Arabia Flag */}
            <div className="flex flex-col items-center gap-0.5">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-primary/20 shadow-sm"
                title="সৌদি আরব"
                aria-label="Saudi Arabia emblem"
              >
                <span className="text-4xl leading-none">🇸🇦</span>
              </div>
              <span className="text-[9px] font-bold text-primary">SA</span>
            </div>
          </div>
        </div>

        {/* ── Sub-nav ─────────────────────────────────────────────────── */}
        <div className="border-t border-border bg-primary/5">
          <div className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-4 py-1 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex-shrink-0 rounded-sm px-3 py-1.5 text-sm font-medium transition-smooth ${
                  location.pathname === link.to
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
                data-ocid={`nav-${link.to === "/" ? "apply" : "status"}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🇧🇩</span>
              <span className="text-xs text-muted-foreground">
                Bangladesh National Health Services (BNHS) ©{" "}
                {new Date().getFullYear()}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
