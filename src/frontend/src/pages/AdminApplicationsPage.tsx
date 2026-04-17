import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardListIcon,
  PhoneIcon,
  SaveIcon,
  SearchIcon,
} from "lucide-react";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "../components/Layout/AdminLayout";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingPage } from "../components/ui/LoadingSpinner";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useActor } from "../hooks/useActor";
import { getApplications, updateApplicationStatus } from "../lib/api";
import { useAuthStore } from "../stores/authStore";
import type { Application, ApplicationStatus } from "../types";

const statusOptions: ApplicationStatus[] = [
  "Pending",
  "Processing",
  "Approved",
  "Rejected",
];

const STATUS_LABEL: Record<string, string> = {
  Pending: "অপেক্ষমান",
  Processing: "প্রক্রিয়াধীন",
  Approved: "অনুমোদিত",
  Rejected: "প্রত্যাখ্যাত",
};

function formatDate(ts: bigint) {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface ExpandedDetailProps {
  app: Application;
  token: string;
  actor: ReturnType<typeof import("../hooks/useActor").useActor>["actor"];
  asTr?: boolean;
}

function ExpandedDetail({
  app,
  token,
  actor,
  asTr = false,
}: ExpandedDetailProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>(app.status);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return updateApplicationStatus(actor, token, app.id, selectedStatus);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        toast.success("স্ট্যাটাস আপডেট হয়েছে");
        queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      } else {
        toast.error(result.err);
      }
    },
    onError: () => toast.error("আপডেট করতে সমস্যা হয়েছে"),
  });

  const field = (label: string, value: string, mono = false) => (
    <div className="flex items-start gap-2 text-xs">
      <span className="w-32 shrink-0 text-muted-foreground">{label}:</span>
      <span
        className={`min-w-0 break-all font-medium text-foreground ${mono ? "font-mono" : ""}`}
      >
        {value || "—"}
      </span>
    </div>
  );

  const inner = (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          গ্রাহকের তথ্য
        </p>
        {field("নাম", app.customerName)}
        {field("ফোন নম্বর", app.phone, true)}
        {field("জাতীয় পরিচয়পত্র", app.nid, true)}
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          আবেদনের তথ্য
        </p>
        {field("গন্তব্য দেশ", app.destinationCountry)}
        {field("উদ্দেশ্য", app.purpose)}
        {field("ট্রানজেকশন আইডি", app.transactionId, true)}
        {field("রেফারেন্স নম্বর", app.refNumber, true)}
        {field("জমার তারিখ", formatDate(app.submittedAt))}
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          স্ট্যাটাস পরিবর্তন
        </p>
        {app.notes && (
          <p className="rounded border border-border bg-card p-2 text-xs text-muted-foreground">
            {app.notes}
          </p>
        )}
        <div className="space-y-2 pt-1">
          <Label className="text-xs font-medium">নতুন স্ট্যাটাস বেছে নিন</Label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="h-9 text-sm" data-ocid="status-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABEL[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || selectedStatus === app.status}
            className="btn-primary flex w-full items-center justify-center gap-1.5"
            data-ocid="save-status-btn"
          >
            <SaveIcon className="h-3.5 w-3.5" />
            {mutation.isPending ? "সংরক্ষণ হচ্ছে..." : "স্ট্যাটাস সংরক্ষণ করুন"}
          </Button>
        </div>
      </div>
    </div>
  );

  if (asTr) {
    return (
      <tr>
        <td
          colSpan={7}
          className="border-b border-border bg-muted/20 px-4 py-4"
        >
          {inner}
        </td>
      </tr>
    );
  }

  return (
    <div className="border-t border-border bg-muted/20 px-4 py-4">{inner}</div>
  );
}

export function AdminApplicationsPage() {
  const { actor, isFetching } = useActor();
  const { adminToken } = useAuthStore();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: applications, isLoading } = useQuery<Application[]>({
    queryKey: ["admin-applications", adminToken],
    queryFn: () =>
      actor && adminToken
        ? getApplications(actor, adminToken)
        : Promise.resolve([]),
    enabled: !!actor && !isFetching && !!adminToken,
  });

  if (isLoading)
    return (
      <AdminLayout>
        <LoadingPage />
      </AdminLayout>
    );

  const apps = applications ?? [];

  const filtered = apps.filter((app) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      app.customerName.toLowerCase().includes(q) ||
      app.phone.includes(q) ||
      app.refNumber.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || app.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const sorted = [...filtered].sort(
    (a, b) => Number(b.submittedAt) - Number(a.submittedAt),
  );

  return (
    <AdminLayout>
      <div className="p-5 sm:p-6 md:p-8">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              আবেদনসমূহ
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              মোট {apps.length}টি আবেদন — সব স্ট্যাটাস পরিচালনা করুন
            </p>
          </div>
          {apps.length > 0 && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              {apps.length}
            </span>
          )}
        </div>

        {/* Filters */}
        <div
          className="mb-4 flex flex-wrap gap-2"
          data-ocid="applications-filters"
        >
          <div className="relative min-w-[200px] flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="নাম, ফোন বা রেফারেন্স..."
              className="h-9 pl-8 text-sm"
              data-ocid="applications-search"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger
              className="h-9 w-36 text-sm"
              data-ocid="status-filter"
            >
              <SelectValue placeholder="সব অবস্থা" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সব অবস্থা</SelectItem>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABEL[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {sorted.length === 0 ? (
          <EmptyState
            title={
              search || filterStatus !== "all"
                ? "কোনো ফলাফল নেই"
                : "কোনো আবেদন নেই"
            }
            description={
              search || filterStatus !== "all"
                ? "ভিন্ন শব্দ বা ফিল্টার দিয়ে চেষ্টা করুন"
                : "এখনো কোনো আবেদন জমা পড়েনি।"
            }
            icon={<ClipboardListIcon className="h-7 w-7" />}
          />
        ) : (
          <div
            className="card-elevated overflow-hidden"
            data-ocid="applications-table"
          >
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      রেফারেন্স
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      গ্রাহকের নাম
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      ফোন
                    </th>
                    <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:table-cell">
                      সেবা
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      তারিখ
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      স্ট্যাটাস
                    </th>
                    <th className="w-10 px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sorted.map((app) => {
                    const isExpanded = expandedId === app.id;
                    return (
                      <Fragment key={app.id}>
                        <tr
                          className="cursor-pointer hover:bg-muted/20"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : app.id)
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            setExpandedId(isExpanded ? null : app.id)
                          }
                          tabIndex={0}
                          data-ocid={`application-row-${app.id}`}
                        >
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                            #{app.refNumber}
                          </td>
                          <td className="max-w-[140px] truncate px-4 py-3 font-medium text-foreground">
                            {app.customerName}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                            {app.phone}
                          </td>
                          <td className="hidden max-w-[160px] truncate px-4 py-3 text-muted-foreground lg:table-cell">
                            {app.destinationCountry}
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {formatDate(app.submittedAt)}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={app.status} />
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {isExpanded ? (
                              <ChevronUpIcon className="h-4 w-4" />
                            ) : (
                              <ChevronDownIcon className="h-4 w-4" />
                            )}
                          </td>
                        </tr>
                        {isExpanded && (
                          <ExpandedDetail
                            app={app}
                            token={adminToken ?? ""}
                            actor={actor}
                            asTr
                          />
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile list */}
            <div className="divide-y divide-border md:hidden">
              {sorted.map((app) => {
                const isExpanded = expandedId === app.id;
                return (
                  <div key={app.id}>
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : app.id)}
                      className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition-smooth hover:bg-muted/30"
                      data-ocid={`application-mobile-${app.id}`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">
                            #{app.refNumber}
                          </span>
                          <StatusBadge status={app.status} />
                        </div>
                        <p className="mt-0.5 font-semibold text-foreground">
                          {app.customerName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {app.destinationCountry}
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <PhoneIcon className="h-3 w-3" />
                            {app.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {formatDate(app.submittedAt)}
                          </span>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUpIcon className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronDownIcon className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                    </button>
                    {isExpanded && (
                      <ExpandedDetail
                        app={app}
                        token={adminToken ?? ""}
                        actor={actor}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
