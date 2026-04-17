import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CalendarIcon,
  FileTextIcon,
  HashIcon,
  PhoneIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { CustomerLayout } from "../components/Layout/CustomerLayout";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useActor } from "../hooks/useActor";
import { getApplicationByPhone, getApplicationByRef } from "../lib/api";
import type { Application } from "../types";

function formatDate(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

function ApplicationCard({ app }: { app: Application }) {
  return (
    <div
      className="card-elevated overflow-hidden"
      data-ocid={`application-result-${app.refNumber}`}
    >
      {/* Header strip */}
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <HashIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-mono text-xs font-bold tracking-wider text-foreground">
            {app.refNumber}
          </span>
        </div>
        <StatusBadge status={app.status} />
      </div>

      {/* Details grid */}
      <div className="grid gap-3 p-4 sm:grid-cols-2">
        <InfoRow
          icon={<UserIcon className="h-3.5 w-3.5" />}
          label="গ্রাহকের নাম"
          value={app.customerName}
        />
        <InfoRow
          icon={<FileTextIcon className="h-3.5 w-3.5" />}
          label="গন্তব্য দেশ"
          value={app.destinationCountry}
        />
        <InfoRow
          icon={<PhoneIcon className="h-3.5 w-3.5" />}
          label="মোবাইল নম্বর"
          value={app.phone}
        />
        <InfoRow
          icon={<CalendarIcon className="h-3.5 w-3.5" />}
          label="আবেদনের তারিখ"
          value={formatDate(app.submittedAt)}
        />
      </div>
    </div>
  );
}

export function StatusCheckPage() {
  const { actor } = useActor();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Application[] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || !actor) return;

    setIsLoading(true);
    setSearched(false);
    setResults(null);

    try {
      const isRef = trimmed.toUpperCase().startsWith("TXN-");
      if (isRef) {
        const result = await getApplicationByRef(actor, trimmed.toUpperCase());
        setResults(result ? [result] : []);
      } else {
        const apps = await getApplicationByPhone(actor, trimmed);
        setResults(apps);
      }
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
      setSearched(true);
    }
  };

  const handleReset = () => {
    setQuery("");
    setResults(null);
    setSearched(false);
  };

  return (
    <CustomerLayout>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {/* Page header */}
        <div
          className="mb-8 rounded-md border border-border bg-card p-6 shadow-sm"
          data-ocid="status-check-header"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <SearchIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground sm:text-xl">
                আবেদনের অবস্থা যাচাই করুন
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                ফোন নম্বর বা রেফারেন্স নম্বর দিয়ে আবেদনের বর্তমান অবস্থা জানুন
              </p>
            </div>
          </div>
        </div>

        {/* Search form */}
        <div className="card-elevated mb-6 p-5" data-ocid="status-search-form">
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="search-input" className="text-sm font-medium">
                ফোন নম্বর অথবা রেফারেন্স নম্বর
              </Label>
              <div className="flex gap-2">
                <Input
                  id="search-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="০১XXXXXXXXX অথবা TXN-XXXXXXXX"
                  className="h-10 flex-1 font-mono text-sm"
                  autoComplete="off"
                  data-ocid="status-search-input"
                />
                <Button
                  type="submit"
                  disabled={!query.trim() || isLoading || !actor}
                  className="btn-primary h-10 gap-2 px-5"
                  data-ocid="status-search-btn"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <SearchIcon className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">
                    {isLoading ? "খোঁজা হচ্ছে..." : "অনুসন্ধান"}
                  </span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                ফোন নম্বর:{" "}
                <span className="font-mono font-medium text-foreground">
                  01700000000
                </span>{" "}
                · রেফারেন্স:{" "}
                <span className="font-mono font-medium text-foreground">
                  TXN-20240101-ABC1
                </span>
              </p>
            </div>
          </form>
        </div>

        {/* Loading */}
        {isLoading && (
          <div
            className="flex flex-col items-center gap-3 py-12"
            data-ocid="status-loading"
          >
            <LoadingSpinner size="lg" />
            <p className="text-sm text-muted-foreground">অনুসন্ধান করা হচ্ছে...</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && searched && results !== null && (
          <div data-ocid="status-results">
            {results.length === 0 ? (
              <div
                className="flex flex-col items-center gap-4 rounded-md border border-border bg-card px-6 py-12 text-center"
                data-ocid="status-no-results"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <SearchIcon className="h-7 w-7 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-display text-base font-semibold text-foreground">
                    কোনো আবেদন পাওয়া যায়নি
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    প্রদত্ত তথ্য দিয়ে কোনো আবেদন খুঁজে পাওয়া যায়নি।
                    <br />
                    সঠিক ফোন নম্বর বা রেফারেন্স নম্বর দিয়ে আবার চেষ্টা করুন।
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  data-ocid="status-retry-btn"
                >
                  আবার চেষ্টা করুন
                </Button>
              </div>
            ) : (
              <div className="space-y-3" data-ocid="status-results-list">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {results.length}টি
                  </span>{" "}
                  আবেদন পাওয়া গেছে
                </p>
                {results.map((app) => (
                  <ApplicationCard key={app.id} app={app} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Status legend — shown before any search */}
        {!searched && !isLoading && (
          <div
            className="rounded-md border border-border bg-muted/30 p-4"
            data-ocid="status-legend"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              আবেদনের অবস্থার ধরন
            </p>
            <div className="flex flex-wrap gap-2">
              {["Pending", "Processing", "Approved", "Rejected"].map(
                (status) => (
                  <StatusBadge key={status} status={status} />
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
