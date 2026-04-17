import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  ClockIcon,
  PackageIcon,
  RefreshCwIcon,
  TrendingUpIcon,
} from "lucide-react";
import { AdminLayout } from "../components/Layout/AdminLayout";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingPage } from "../components/ui/LoadingSpinner";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useActor } from "../hooks/useActor";
import { getApplications, getServices } from "../lib/api";
import { useAuthStore } from "../stores/authStore";
import type { Application } from "../types";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  colorIcon: string;
  colorBg: string;
  colorText: string;
  ocid: string;
}

function StatCard({
  label,
  value,
  icon: Icon,
  colorIcon,
  colorBg,
  colorText,
  ocid,
}: StatCardProps) {
  return (
    <div
      className="card-elevated flex items-center gap-4 p-5 transition-smooth hover:shadow-md"
      data-ocid={ocid}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorBg}`}
      >
        <Icon className={`h-6 w-6 ${colorIcon}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`mt-0.5 font-display text-3xl font-bold ${colorText}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-500",
  Processing: "bg-blue-500",
  Approved: "bg-green-500",
  Rejected: "bg-destructive",
};

const STATUS_LABELS: Record<string, string> = {
  Pending: "অপেক্ষমান",
  Processing: "প্রক্রিয়াধীন",
  Approved: "অনুমোদিত",
  Rejected: "প্রত্যাখ্যাত",
};

export function AdminDashboardPage() {
  const { actor, isFetching } = useActor();
  const { adminToken } = useAuthStore();

  const {
    data: applications,
    isLoading: appsLoading,
    refetch,
  } = useQuery<Application[]>({
    queryKey: ["admin-applications", adminToken],
    queryFn: () =>
      actor && adminToken
        ? getApplications(actor, adminToken)
        : Promise.resolve([]),
    enabled: !!actor && !isFetching && !!adminToken,
  });

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => (actor ? getServices(actor) : Promise.resolve([])),
    enabled: !!actor && !isFetching,
  });

  if (appsLoading || servicesLoading) {
    return (
      <AdminLayout>
        <LoadingPage />
      </AdminLayout>
    );
  }

  const apps = applications ?? [];
  const svcs = services ?? [];

  const stats = {
    total: apps.length,
    pending: apps.filter((a) => a.status === "Pending").length,
    processing: apps.filter((a) => a.status === "Processing").length,
    approved: apps.filter((a) => a.status === "Approved").length,
    rejected: apps.filter((a) => a.status === "Rejected").length,
    activeServices: svcs.filter((s) => s.active).length,
  };

  const recentApps = [...apps]
    .sort((a, b) => Number(b.submittedAt) - Number(a.submittedAt))
    .slice(0, 8);

  const statBreakdown = [
    { key: "Pending", count: stats.pending },
    { key: "Processing", count: stats.processing },
    { key: "Approved", count: stats.approved },
    { key: "Rejected", count: stats.rejected },
  ];

  return (
    <AdminLayout>
      <div className="p-5 sm:p-6 md:p-8">
        {/* Page header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              ড্যাশবোর্ড
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              স্বাস্থ্য ও পরিবার কল্যাণ মন্ত্রণালয় — সামগ্রিক পর্যালোচনা
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition-smooth hover:text-foreground"
            aria-label="রিফ্রেশ"
            data-ocid="dashboard-refresh"
          >
            <RefreshCwIcon className="h-4 w-4" />
            রিফ্রেশ
          </button>
        </div>

        {/* Stats grid — 5 cards */}
        <div
          className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5"
          data-ocid="stats-grid"
        >
          <StatCard
            label="মোট আবেদন"
            value={stats.total}
            icon={ClipboardListIcon}
            colorBg="bg-primary/10"
            colorIcon="text-primary"
            colorText="text-primary"
            ocid="stat-total"
          />
          <StatCard
            label="অপেক্ষমান"
            value={stats.pending}
            icon={ClockIcon}
            colorBg="bg-yellow-50"
            colorIcon="text-yellow-600"
            colorText="text-yellow-600"
            ocid="stat-pending"
          />
          <StatCard
            label="প্রক্রিয়াধীন"
            value={stats.processing}
            icon={TrendingUpIcon}
            colorBg="bg-blue-50"
            colorIcon="text-blue-600"
            colorText="text-blue-600"
            ocid="stat-processing"
          />
          <StatCard
            label="অনুমোদিত"
            value={stats.approved}
            icon={CheckCircle2Icon}
            colorBg="bg-green-50"
            colorIcon="text-green-600"
            colorText="text-green-600"
            ocid="stat-approved"
          />
          <StatCard
            label="প্রত্যাখ্যাত"
            value={stats.rejected}
            icon={AlertCircleIcon}
            colorBg="bg-destructive/10"
            colorIcon="text-destructive"
            colorText="text-destructive"
            ocid="stat-rejected"
          />
        </div>

        {/* Bottom section */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Status breakdown */}
          <div
            className="card-elevated p-5 lg:col-span-1"
            data-ocid="status-breakdown"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-sm font-bold text-foreground">
                স্ট্যাটাস বিবরণ
              </h2>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                <PackageIcon className="mr-1 inline-block h-3 w-3" />
                {stats.activeServices} সক্রিয় সেবা
              </span>
            </div>
            <div className="space-y-3">
              {statBreakdown.map(({ key, count }) => {
                const pct =
                  stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={key}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {STATUS_LABELS[key]}
                      </span>
                      <span className="font-medium text-foreground">
                        {count}{" "}
                        <span className="text-muted-foreground">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-smooth ${STATUS_COLORS[key]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent applications */}
          <div
            className="card-elevated overflow-hidden lg:col-span-2"
            data-ocid="recent-applications"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="font-display text-sm font-bold text-foreground">
                সাম্প্রতিক আবেদন
              </h2>
              <Link
                to="/admin/applications"
                className="text-xs font-medium text-primary hover:underline"
              >
                সব দেখুন →
              </Link>
            </div>
            {recentApps.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  title="কোনো আবেদন নেই"
                  description="এখনো কোনো আবেদন জমা পড়েনি।"
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        রেফারেন্স
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        নাম
                      </th>
                      <th className="hidden px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:table-cell">
                        সেবা
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        স্ট্যাটাস
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentApps.map((app: Application) => (
                      <tr
                        key={app.id}
                        className="hover:bg-muted/20"
                        data-ocid={`recent-app-${app.id}`}
                      >
                        <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                          #{app.refNumber}
                        </td>
                        <td className="max-w-[120px] truncate px-4 py-2.5 font-medium text-foreground">
                          {app.customerName}
                        </td>
                        <td className="hidden max-w-[140px] truncate px-4 py-2.5 text-muted-foreground sm:table-cell">
                          {app.destinationCountry}
                        </td>
                        <td className="px-4 py-2.5">
                          <StatusBadge status={app.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
