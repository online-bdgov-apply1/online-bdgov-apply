import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ActivityIcon,
  CheckCircle2Icon,
  CopyIcon,
  PhoneCallIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";
import { CustomerLayout } from "../components/Layout/CustomerLayout";
import { useActor } from "../hooks/useActor";
import {
  getContactConfig,
  getPaymentConfig,
  submitApplication,
} from "../lib/api";
import type { ContactConfig, PaymentConfig } from "../types";

// ─── Bangladesh Districts ───────────────────────────────────────────────────
const BD_DISTRICTS = [
  "ঢাকা",
  "চট্টগ্রাম",
  "রাজশাহী",
  "খুলনা",
  "বরিশাল",
  "সিলেট",
  "রংপুর",
  "ময়মনসিংহ",
  "গাজীপুর",
  "নারায়ণগঞ্জ",
  "কুমিল্লা",
  "ফেনী",
  "নোয়াখালী",
  "লক্ষ্মীপুর",
  "চাঁদপুর",
  "ব্রাহ্মণবাড়িয়া",
  "হবিগঞ্জ",
  "মৌলভীবাজার",
  "সুনামগঞ্জ",
  "কিশোরগঞ্জ",
  "নেত্রকোণা",
  "জামালপুর",
  "শেরপুর",
  "টাঙ্গাইল",
  "মানিকগঞ্জ",
  "মুন্সীগঞ্জ",
  "নরসিংদী",
  "ফরিদপুর",
  "গোপালগঞ্জ",
  "মাদারীপুর",
  "শরীয়তপুর",
  "রাজবাড়ী",
  "পাবনা",
  "সিরাজগঞ্জ",
  "নাটোর",
  "বগুড়া",
  "জয়পুরহাট",
  "চাঁপাইনবাবগঞ্জ",
  "নওগাঁ",
  "কুষ্টিয়া",
  "মেহেরপুর",
  "চুয়াডাঙ্গা",
  "ঝিনাইদহ",
  "যশোর",
  "মাগুরা",
  "নড়াইল",
  "সাতক্ষীরা",
  "বাগেরহাট",
  "পিরোজপুর",
  "ঝালকাঠি",
  "বরগুনা",
  "পটুয়াখালী",
  "ভোলা",
  "গাইবান্ধা",
  "নীলফামারী",
  "লালমনিরহাট",
  "কুড়িগ্রাম",
  "ঠাকুরগাঁও",
  "পঞ্চগড়",
  "দিনাজপুর",
  "কক্সবাজার",
  "বান্দরবান",
  "রাঙামাটি",
  "খাগড়াছড়ি",
];

// ─── Imo SVG Icon ────────────────────────────────────────────────────────────
function ImoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C6.477 2 2 6.477 2 12c0 2.89 1.228 5.497 3.196 7.35L4 20l1.278-3.758C3.791 14.619 3 13.403 3 12 3 6.477 7.477 2 12 2s9 4.477 9 10-4.477 10-10 10c-1.635 0-3.177-.393-4.537-1.088L3 22l1.175-3.465C2.425 17.18 2 14.644 2 12 2 6.477 6.477 2 12 2zm0 1C6.753 3 2.5 7.253 2.5 12.5c0 2.302.826 4.41 2.188 6.05L3.5 21l2.588-.795A9.5 9.5 0 0012 21.5c5.247 0 9.5-4.253 9.5-9.5S17.247 2.5 12 2.5v.5zm-.5 5h1v6h-1V7.5zm0 7h1v1h-1v-1z" />
    </svg>
  );
}

// ─── Contact Section ─────────────────────────────────────────────────────────
function ContactSection({
  contactConfig,
}: { contactConfig: ContactConfig | undefined }) {
  const formatWhatsApp = (num: string) => {
    const digits = num.replace(/\D/g, "");
    if (digits.startsWith("880")) return digits;
    if (digits.startsWith("0")) return `880${digits.slice(1)}`;
    return `880${digits}`;
  };

  const hasAny =
    contactConfig?.helpline || contactConfig?.imo || contactConfig?.whatsapp;
  if (!hasAny) return null;

  return (
    <section
      className="border-b border-border bg-primary/8 py-4"
      data-ocid="contact-section"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-primary">
          সরাসরি যোগাযোগ করুন
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Helpline */}
          {contactConfig?.helpline && (
            <a
              href={`tel:${contactConfig.helpline}`}
              className="flex items-center gap-2.5 rounded-xl border border-primary/25 bg-card px-4 py-2.5 shadow-sm transition-smooth hover:border-primary/50 hover:bg-primary/5 hover:shadow-md"
              data-ocid="contact-helpline"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <PhoneCallIcon className="h-4.5 w-4.5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-primary">
                  হেল্পলাইন
                </p>
                <p className="font-mono text-sm font-bold text-foreground">
                  {contactConfig.helpline}
                </p>
              </div>
            </a>
          )}

          {/* WhatsApp */}
          {contactConfig?.whatsapp && (
            <a
              href={`https://wa.me/${formatWhatsApp(contactConfig.whatsapp)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-xl border border-green-300 bg-card px-4 py-2.5 shadow-sm transition-smooth hover:border-green-500 hover:bg-green-50 hover:shadow-md"
              data-ocid="contact-whatsapp"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
                <SiWhatsapp className="h-5 w-5 text-[#25D366]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-green-700">
                  WhatsApp
                </p>
                <p className="font-mono text-sm font-bold text-foreground">
                  {contactConfig.whatsapp}
                </p>
              </div>
            </a>
          )}

          {/* Imo */}
          {contactConfig?.imo && (
            <a
              href={`https://imo.im/l/${formatWhatsApp(contactConfig.imo)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-xl border border-violet-300 bg-card px-4 py-2.5 shadow-sm transition-smooth hover:border-violet-500 hover:bg-violet-50 hover:shadow-md"
              data-ocid="contact-imo"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100">
                <ImoIcon className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-violet-700">
                  Imo
                </p>
                <p className="font-mono text-sm font-bold text-foreground">
                  {contactConfig.imo}
                </p>
              </div>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Payment Cards (always visible) ─────────────────────────────────────────
function PaymentCards({
  paymentConfig,
  onPayBkash,
  onPayNagad,
}: {
  paymentConfig: PaymentConfig | undefined;
  onPayBkash: () => void;
  onPayNagad: () => void;
}) {
  const copyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    toast.success("নম্বর কপি করা হয়েছে ✓");
  };

  const bkashNum = paymentConfig?.bkash || "01852389090";
  const nagadNum = paymentConfig?.nagad || "01852389090";

  return (
    <div className="grid gap-4 sm:grid-cols-2" data-ocid="payment-cards">
      {/* bKash Card */}
      <div className="overflow-hidden rounded-xl border-2 border-pink-200 bg-gradient-to-br from-pink-50 via-card to-card shadow-sm">
        <div className="flex items-center gap-2 bg-pink-600 px-4 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <span className="text-[10px] font-black text-white">bK</span>
          </div>
          <span className="font-display text-sm font-bold text-white">
            bKash
          </span>
          <span className="ml-auto text-[10px] font-semibold text-pink-100">
            মোবাইল ব্যাংকিং
          </span>
        </div>
        <div className="p-4">
          <p className="mb-1.5 text-xs font-semibold text-pink-700">
            বিকাশ নম্বর:
          </p>
          <div className="mb-3 flex items-center justify-between gap-2 rounded-lg border border-pink-200 bg-pink-50 px-3 py-2">
            <span className="font-mono text-lg font-black tracking-wider text-pink-800">
              {bkashNum}
            </span>
            <button
              type="button"
              onClick={() => copyNumber(bkashNum)}
              className="flex items-center gap-1 rounded-md border border-pink-300 bg-white px-2 py-1 text-[10px] font-medium text-pink-700 transition-smooth hover:bg-pink-50"
              aria-label="Copy bKash number"
              data-ocid="copy-bkash-number"
            >
              <CopyIcon className="h-3 w-3" />
              কপি
            </button>
          </div>
          <Button
            type="button"
            onClick={onPayBkash}
            className="w-full bg-pink-600 py-2 text-sm font-bold text-white hover:bg-pink-700"
            data-ocid="bkash-pay-btn"
          >
            পেমেন্ট করুন →
          </Button>
        </div>
      </div>

      {/* Nagad Card */}
      <div className="overflow-hidden rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 via-card to-card shadow-sm">
        <div className="flex items-center gap-2 bg-orange-500 px-4 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <span className="text-[10px] font-black text-white">Ng</span>
          </div>
          <span className="font-display text-sm font-bold text-white">
            Nagad
          </span>
          <span className="ml-auto text-[10px] font-semibold text-orange-100">
            ডিজিটাল আর্থিক সেবা
          </span>
        </div>
        <div className="p-4">
          <p className="mb-1.5 text-xs font-semibold text-orange-700">
            নগদ নম্বর:
          </p>
          <div className="mb-3 flex items-center justify-between gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2">
            <span className="font-mono text-lg font-black tracking-wider text-orange-800">
              {nagadNum}
            </span>
            <button
              type="button"
              onClick={() => copyNumber(nagadNum)}
              className="flex items-center gap-1 rounded-md border border-orange-300 bg-white px-2 py-1 text-[10px] font-medium text-orange-700 transition-smooth hover:bg-orange-50"
              aria-label="Copy Nagad number"
              data-ocid="copy-nagad-number"
            >
              <CopyIcon className="h-3 w-3" />
              কপি
            </button>
          </div>
          <Button
            type="button"
            onClick={onPayNagad}
            className="w-full bg-orange-500 py-2 text-sm font-bold text-white hover:bg-orange-600"
            data-ocid="nagad-pay-btn"
          >
            পেমেন্ট করুন →
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Payment Modal ────────────────────────────────────────────────────────────
function PaymentModal({
  open,
  mode,
  onClose,
  paymentConfig,
  onPaid,
}: {
  open: boolean;
  mode: "bkash" | "nagad" | null;
  onClose: () => void;
  paymentConfig: PaymentConfig | null;
  onPaid: (method: "bkash" | "nagad") => void;
}) {
  if (!paymentConfig || !mode) return null;

  const copyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    toast.success("নম্বর কপি করা হয়েছে ✓");
  };

  const activeNum =
    mode === "bkash" ? paymentConfig.bkash : paymentConfig.nagad;
  const isBkash = mode === "bkash";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm" data-ocid="payment-modal">
        <DialogHeader>
          <DialogTitle className="font-display text-base font-bold">
            {isBkash ? "bKash" : "Nagad"} পেমেন্ট নির্দেশনা
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-1">
          <div
            className={`flex items-center gap-3 rounded-lg border p-3 ${
              isBkash
                ? "border-pink-200 bg-pink-50"
                : "border-orange-200 bg-orange-50"
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm ${
                isBkash ? "bg-pink-600" : "bg-orange-500"
              }`}
            >
              <span className="text-[10px] font-black text-white">
                {isBkash ? "bK" : "Ng"}
              </span>
            </div>
            <div>
              <p
                className={`text-sm font-bold ${isBkash ? "text-pink-700" : "text-orange-700"}`}
              >
                {isBkash ? "বিকাশ" : "নগদ"} পেমেন্ট নম্বর
              </p>
              <p className="text-xs text-muted-foreground">
                Send Money / পেমেন্ট করুন
              </p>
            </div>
          </div>

          <div className="rounded-lg border-2 border-border bg-muted/20 p-4">
            <p className="mb-1 text-xs text-muted-foreground">পেমেন্ট নম্বর</p>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-2xl font-bold tracking-widest text-foreground">
                {activeNum || "—"}
              </span>
              <button
                type="button"
                onClick={() => copyNumber(activeNum)}
                className="flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-xs text-muted-foreground transition-smooth hover:border-primary/40 hover:text-foreground"
                aria-label="Copy number"
                data-ocid="copy-payment-number"
              >
                <CopyIcon className="h-3 w-3" />
                কপি
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { text: "উপরের নম্বরে টাকা পাঠান (Send Money)", id: "s1" },
              { text: "ট্রানজেকশন আইডি / TrxID সংগ্রহ করুন", id: "s2" },
              { text: "নিচের ফর্মে ট্রানজেকশন আইডি লিখুন", id: "s3" },
            ].map(({ text, id }, i) => (
              <div
                key={id}
                className="flex items-start gap-2.5 text-xs text-muted-foreground"
              >
                <span
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                    isBkash ? "bg-pink-500" : "bg-orange-500"
                  }`}
                >
                  {i + 1}
                </span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex-1"
              data-ocid="payment-modal-close"
            >
              বন্ধ করুন
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onPaid(mode);
                onClose();
              }}
              className={`flex-1 text-white ${
                isBkash
                  ? "bg-pink-600 hover:bg-pink-700"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
              data-ocid="payment-confirm-btn"
            >
              পেমেন্ট হয়েছে ✓
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Organization Verification Footer ────────────────────────────────────────
function OrgVerificationSection({
  contactConfig,
}: {
  contactConfig: ContactConfig | undefined;
}) {
  const year = contactConfig?.establishYear || "2019";

  return (
    <section
      className="border-t border-border bg-muted/30 py-8"
      data-ocid="org-verification-section"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-xl border border-primary/20 bg-card shadow-sm">
          {/* Header row */}
          <div className="flex items-center gap-2 bg-primary/8 px-5 py-3 border-b border-primary/15">
            <ShieldCheckIcon className="h-5 w-5 text-primary" />
            <h3 className="font-display text-sm font-bold text-foreground">
              সংস্থার যাচাইকরণ তথ্য
            </h3>
            <span className="ml-auto flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
              <CheckCircle2Icon className="h-3 w-3" />
              ভেরিফাইড সংস্থা
            </span>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2">
            {/* Org details */}
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                অনুমোদিত সংস্থা
              </p>
              <h4 className="font-display text-base font-bold leading-tight text-foreground">
                বাহির্গত প্রবাসী সাহায্য অনুদান সংস্থা
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                বিদেশগামী বাংলাদেশি শ্রমিকদের আর্থিক সহায়তা ও অনুদান প্রদানকারী সরকার অনুমোদিত
                সংস্থা।
              </p>
            </div>

            {/* Verification data */}
            <div className="space-y-2">
              {[
                { label: "নিবন্ধন নম্বর", value: "BPASO-2019-0047" },
                { label: "অনুমোদন তারিখ", value: "১২ মার্চ, ২০১৯" },
                { label: "কার্যক্ষেত্র", value: "বিদেশগামী শ্রমিক সহায়তা" },
                { label: "অনুদান সীমা", value: "সর্বোচ্চ ৳৫০,০০০/জন" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-2 rounded-md border border-border bg-muted/20 px-3 py-1.5 text-xs"
                >
                  <span className="font-medium text-muted-foreground">
                    {label}
                  </span>
                  <span className="font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Establishment year banner */}
          <div className="flex items-center justify-center gap-4 border-t border-border bg-primary/5 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🇧🇩</span>
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  প্রতিষ্ঠা সাল
                </p>
                <p className="font-display text-xl font-black text-primary">
                  {year}
                </p>
              </div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                মন্ত্রণালয়
              </p>
              <p className="text-xs font-semibold text-foreground">
                স্বাস্থ্য ও পরিবার কল্যাণ মন্ত্রণালয়
              </p>
              <p className="text-[10px] text-muted-foreground">
                Ministry of Health & Family Welfare
              </p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="flex items-center gap-1">
              <span className="text-lg">🇸🇦</span>
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  সহযোগী দেশ
                </p>
                <p className="text-xs font-semibold text-foreground">
                  সৌদি আরব
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessScreen({
  refNumber,
  onReset,
}: { refNumber: string; onReset: () => void }) {
  const [copied, setCopied] = useState(false);

  const copyRef = () => {
    navigator.clipboard.writeText(refNumber);
    setCopied(true);
    toast.success("রেফারেন্স নম্বর কপি হয়েছে ✓");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div
      className="overflow-hidden rounded-xl border border-primary/20 bg-card shadow-sm"
      data-ocid="success-screen"
    >
      <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <CheckCircle2Icon className="h-9 w-9 text-white" />
        </div>
        <h3 className="font-display text-2xl font-bold text-white">ধন্যবাদ!</h3>
        <p className="mt-1 text-sm text-primary-foreground/80">
          আপনার আবেদন সফলভাবে জমা হয়েছে
        </p>
      </div>

      <div className="border-b border-border bg-muted/20 px-6 py-5">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          আপনার রেফারেন্স নম্বর
        </p>
        <div className="flex items-center justify-between gap-3 rounded-lg border-2 border-primary/20 bg-primary/5 px-4 py-3">
          <span className="font-mono text-lg font-bold tracking-widest text-primary">
            {refNumber}
          </span>
          <button
            type="button"
            onClick={copyRef}
            className="flex items-center gap-1.5 rounded-md border border-primary/30 bg-card px-3 py-1.5 text-xs font-medium text-primary transition-smooth hover:bg-primary/5"
            aria-label="Copy reference number"
            data-ocid="copy-ref-btn"
          >
            <CopyIcon className="h-3.5 w-3.5" />
            {copied ? "কপি হয়েছে ✓" : "কপি করুন"}
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          এই নম্বরটি সংরক্ষণ করুন — পরবর্তীতে আবেদনের অবস্থা জানতে প্রয়োজন হবে
        </p>
      </div>

      <div className="px-6 py-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          পরবর্তী পদক্ষেপ
        </p>
        <div className="space-y-2.5">
          {[
            { id: "s1", text: "আপনার রেফারেন্স নম্বরটি নিরাপদে সংরক্ষণ করুন" },
            {
              id: "s2",
              text: "আবেদন যাচাই পেজে গিয়ে রেফারেন্স বা ফোন নম্বর দিয়ে অবস্থা দেখুন",
            },
            { id: "s3", text: "অনুমোদনের পরে আপনার ফোনে যোগাযোগ করা হবে" },
          ].map(({ id, text }, i) => (
            <div key={id} className="flex items-start gap-2.5 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                {i + 1}
              </span>
              <span className="text-muted-foreground">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border px-6 py-4 sm:flex-row">
        <a
          href="/status"
          className="btn-primary flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium"
          data-ocid="check-status-link"
        >
          <ActivityIcon className="h-4 w-4" />
          আবেদনের অবস্থা যাচাই করুন
        </a>
        <Button
          variant="outline"
          onClick={onReset}
          className="flex-1 text-sm"
          data-ocid="success-reset-btn"
        >
          আরেকটি আবেদন করুন
        </Button>
      </div>
    </div>
  );
}

// ─── Form Types ───────────────────────────────────────────────────────────────
type FormData = {
  fullName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  nid: string;
  phone: string;
  presentAddress: string;
  permanentAddress: string;
  district: string;
  destinationCountry: string;
  purpose: string;
  transactionId: string;
  notes: string;
};

type FormErrors = Partial<Record<keyof Omit<FormData, "notes">, string>>;

function validateForm(d: FormData): FormErrors {
  const e: FormErrors = {};
  if (!d.fullName.trim()) e.fullName = "পূর্ণ নাম প্রয়োজন";
  if (!d.fatherName.trim()) e.fatherName = "পিতার নাম প্রয়োজন";
  if (!d.motherName.trim()) e.motherName = "মাতার নাম প্রয়োজন";
  if (!d.dob.trim()) e.dob = "জন্ম তারিখ প্রয়োজন";
  if (!d.nid.trim()) e.nid = "জাতীয় পরিচয়পত্র নম্বর প্রয়োজন";
  if (!d.phone.trim()) {
    e.phone = "মোবাইল নম্বর প্রয়োজন";
  } else if (!/^01[3-9]\d{8}$/.test(d.phone.trim())) {
    e.phone = "সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01XXXXXXXXX)";
  }
  if (!d.presentAddress.trim()) e.presentAddress = "বর্তমান ঠিকানা প্রয়োজন";
  if (!d.permanentAddress.trim()) e.permanentAddress = "স্থায়ী ঠিকানা প্রয়োজন";
  if (!d.district) e.district = "জেলা নির্বাচন করুন";
  if (!d.destinationCountry.trim())
    e.destinationCountry = "গন্তব্য দেশের নাম প্রয়োজন";
  if (!d.purpose.trim()) e.purpose = "সাহায্যের উদ্দেশ্য লিখুন";
  if (!d.transactionId.trim())
    e.transactionId = "ট্রানজেকশন আইডি প্রয়োজন — আগে পেমেন্ট করুন";
  return e;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function CustomerPortalPage() {
  const { actor } = useActor();
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [paymentModalMode, setPaymentModalMode] = useState<
    "bkash" | "nagad" | null
  >(null);
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormData, boolean>>
  >({});
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    fatherName: "",
    motherName: "",
    dob: "",
    nid: "",
    phone: "",
    presentAddress: "",
    permanentAddress: "",
    district: "",
    destinationCountry: "",
    purpose: "",
    transactionId: "",
    notes: "",
  });

  const { data: paymentConfig } = useQuery({
    queryKey: ["paymentConfig"],
    queryFn: () =>
      actor
        ? getPaymentConfig(actor)
        : Promise.resolve({ bkash: "01852389090", nagad: "01852389090" }),
    enabled: !!actor,
  });

  const { data: contactConfig } = useQuery<ContactConfig>({
    queryKey: ["contactConfig"],
    queryFn: () =>
      actor
        ? getContactConfig(actor)
        : Promise.resolve({
            helpline: "",
            imo: "",
            whatsapp: "",
            establishYear: "2019",
          }),
    enabled: !!actor,
  });

  const mutation = useMutation({
    mutationFn: () => {
      if (!actor) throw new Error("No actor");
      return submitApplication(
        actor,
        formData.fullName.trim(),
        formData.fatherName.trim(),
        formData.motherName.trim(),
        formData.dob.trim(),
        formData.phone.trim(),
        formData.nid.trim(),
        formData.presentAddress.trim(),
        formData.permanentAddress.trim(),
        formData.district,
        formData.destinationCountry.trim(),
        formData.purpose.trim(),
        formData.transactionId.trim(),
        formData.notes.trim(),
      );
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        setSuccessRef(result.ok);
      } else {
        toast.error(`আবেদন ব্যর্থ: ${result.err}`);
      }
    },
    onError: () => toast.error("সার্ভার সংযোগে সমস্যা — পুনরায় চেষ্টা করুন"),
  });

  const errors = validateForm(formData);
  const handleBlur = (field: keyof FormData) =>
    setTouched((p) => ({ ...p, [field]: true }));
  const set =
    (field: keyof FormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setFormData((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allFields: (keyof FormData)[] = [
      "fullName",
      "fatherName",
      "motherName",
      "dob",
      "nid",
      "phone",
      "presentAddress",
      "permanentAddress",
      "district",
      "destinationCountry",
      "purpose",
      "transactionId",
    ];
    setTouched(Object.fromEntries(allFields.map((f) => [f, true])));
    if (Object.keys(errors).length > 0) return;
    mutation.mutate();
  };

  const fieldErr = (field: keyof FormErrors) =>
    touched[field] && errors[field] ? errors[field] : undefined;

  const resetForm = () => {
    setSuccessRef(null);
    setFormData({
      fullName: "",
      fatherName: "",
      motherName: "",
      dob: "",
      nid: "",
      phone: "",
      presentAddress: "",
      permanentAddress: "",
      district: "",
      destinationCountry: "",
      purpose: "",
      transactionId: "",
      notes: "",
    });
    setTouched({});
  };

  if (successRef) {
    return (
      <CustomerLayout>
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
          <SuccessScreen refNumber={successRef} onReset={resetForm} />
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      {/* ── 1. Contact Section (immediately below header) ─────────────── */}
      <ContactSection contactConfig={contactConfig} />

      {/* ── 2. Government Branding / Aid Organization Banner ─────────── */}
      <section
        className="border-b border-border bg-gradient-to-br from-primary/6 via-card to-card"
        data-ocid="portal-hero"
      >
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-2xl rounded-xl border border-primary/20 bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <ShieldCheckIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-primary">
                  বাংলাদেশ সরকার অনুমোদিত
                </p>
                <h2 className="font-display text-base font-bold text-foreground">
                  বাহির্গত প্রবাসী সাহায্য অনুদান সংস্থা
                </h2>
              </div>
              <span className="ml-auto flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                <CheckCircle2Icon className="h-3 w-3" />
                ভেরিফাইড
              </span>
            </div>
            <div className="grid gap-2 border-t border-border pt-3 text-xs text-muted-foreground sm:grid-cols-2">
              {[
                { label: "নিবন্ধন নম্বর", value: "BPASO-2019-0047" },
                { label: "অনুমোদন তারিখ", value: "১২ মার্চ, ২০১৯" },
                { label: "কার্যক্ষেত্র", value: "বিদেশগামী শ্রমিক সহায়তা" },
                { label: "অনুদান সীমা", value: "সর্বোচ্চ ৳৫০,০০০/জন" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="font-medium text-foreground">{label}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Application Form + Payment Cards ───────────────────────── */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <PaymentModal
          open={paymentModalMode !== null}
          mode={paymentModalMode}
          onClose={() => setPaymentModalMode(null)}
          paymentConfig={paymentConfig ?? null}
          onPaid={() => setPaymentModalMode(null)}
        />

        <div
          className="rounded-xl border border-border bg-card shadow-sm"
          data-ocid="application-form-section"
        >
          {/* Form header */}
          <div className="border-b border-border bg-primary/5 px-6 py-5">
            <h2 className="font-display text-lg font-bold text-foreground">
              বিদেশী সাহায্য অনুদান আবেদন ফর্ম
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              সকল তারকা (*) চিহ্নিত তথ্য পূরণ করা বাধ্যতামূলক
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6"
            data-ocid="application-form"
          >
            {/* Section 1: Personal Info */}
            <fieldset className="space-y-4">
              <legend className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                ১. ব্যক্তিগত তথ্য
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs font-semibold">
                    পূর্ণ নাম <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={set("fullName")}
                    onBlur={() => handleBlur("fullName")}
                    placeholder="আপনার পূর্ণ নাম (বাংলায়)"
                    className={`h-10 text-sm ${fieldErr("fullName") ? "border-destructive" : ""}`}
                    data-ocid="form-full-name"
                  />
                  {fieldErr("fullName") && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="form-full-name.field_error"
                    >
                      {fieldErr("fullName")}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="dob" className="text-xs font-semibold">
                    জন্ম তারিখ <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={set("dob")}
                    onBlur={() => handleBlur("dob")}
                    className={`h-10 text-sm ${fieldErr("dob") ? "border-destructive" : ""}`}
                    data-ocid="form-dob"
                  />
                  {fieldErr("dob") && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="form-dob.field_error"
                    >
                      {fieldErr("dob")}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="fatherName" className="text-xs font-semibold">
                    পিতার নাম <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fatherName"
                    value={formData.fatherName}
                    onChange={set("fatherName")}
                    onBlur={() => handleBlur("fatherName")}
                    placeholder="পিতার পূর্ণ নাম"
                    className={`h-10 text-sm ${fieldErr("fatherName") ? "border-destructive" : ""}`}
                    data-ocid="form-father-name"
                  />
                  {fieldErr("fatherName") && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="form-father-name.field_error"
                    >
                      {fieldErr("fatherName")}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="motherName" className="text-xs font-semibold">
                    মাতার নাম <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="motherName"
                    value={formData.motherName}
                    onChange={set("motherName")}
                    onBlur={() => handleBlur("motherName")}
                    placeholder="মাতার পূর্ণ নাম"
                    className={`h-10 text-sm ${fieldErr("motherName") ? "border-destructive" : ""}`}
                    data-ocid="form-mother-name"
                  />
                  {fieldErr("motherName") && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="form-mother-name.field_error"
                    >
                      {fieldErr("motherName")}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="nid" className="text-xs font-semibold">
                    জাতীয় পরিচয়পত্র নম্বর (NID){" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nid"
                    value={formData.nid}
                    onChange={set("nid")}
                    onBlur={() => handleBlur("nid")}
                    placeholder="আপনার NID নম্বর"
                    className={`h-10 text-sm ${fieldErr("nid") ? "border-destructive" : ""}`}
                    data-ocid="form-nid"
                  />
                  {fieldErr("nid") && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="form-nid.field_error"
                    >
                      {fieldErr("nid")}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold">
                    মোবাইল নম্বর <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={set("phone")}
                    onBlur={() => handleBlur("phone")}
                    placeholder="01XXXXXXXXX"
                    className={`h-10 text-sm ${fieldErr("phone") ? "border-destructive" : ""}`}
                    data-ocid="form-phone"
                  />
                  {fieldErr("phone") && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="form-phone.field_error"
                    >
                      {fieldErr("phone")}
                    </p>
                  )}
                </div>
              </div>
            </fieldset>

            {/* Section 2: Address */}
            <fieldset className="space-y-4">
              <legend className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                ২. ঠিকানা ও অবস্থান
              </legend>
              <div className="space-y-1.5">
                <Label
                  htmlFor="presentAddress"
                  className="text-xs font-semibold"
                >
                  বর্তমান ঠিকানা <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="presentAddress"
                  value={formData.presentAddress}
                  onChange={set("presentAddress")}
                  onBlur={() => handleBlur("presentAddress")}
                  placeholder="বর্তমান ঠিকানা লিখুন (গ্রাম/মহল্লা, উপজেলা, জেলা)"
                  className={`min-h-[72px] resize-none text-sm ${fieldErr("presentAddress") ? "border-destructive" : ""}`}
                  data-ocid="form-present-address"
                />
                {fieldErr("presentAddress") && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="form-present-address.field_error"
                  >
                    {fieldErr("presentAddress")}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="permanentAddress"
                  className="text-xs font-semibold"
                >
                  স্থায়ী ঠিকানা <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={set("permanentAddress")}
                  onBlur={() => handleBlur("permanentAddress")}
                  placeholder="স্থায়ী ঠিকানা লিখুন (গ্রাম/মহল্লা, উপজেলা, জেলা)"
                  className={`min-h-[72px] resize-none text-sm ${fieldErr("permanentAddress") ? "border-destructive" : ""}`}
                  data-ocid="form-permanent-address"
                />
                {fieldErr("permanentAddress") && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="form-permanent-address.field_error"
                  >
                    {fieldErr("permanentAddress")}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="district" className="text-xs font-semibold">
                    জেলা <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="district"
                    value={formData.district}
                    onChange={set("district")}
                    onBlur={() => handleBlur("district")}
                    className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${fieldErr("district") ? "border-destructive" : "border-input"}`}
                    data-ocid="form-district"
                  >
                    <option value="">জেলা নির্বাচন করুন</option>
                    {BD_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  {fieldErr("district") && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="form-district.field_error"
                    >
                      {fieldErr("district")}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="destinationCountry"
                    className="text-xs font-semibold"
                  >
                    গন্তব্য দেশ <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="destinationCountry"
                    value={formData.destinationCountry}
                    onChange={set("destinationCountry")}
                    onBlur={() => handleBlur("destinationCountry")}
                    placeholder="যে দেশে যাচ্ছেন (যেমন: সৌদি আরব)"
                    className={`h-10 text-sm ${fieldErr("destinationCountry") ? "border-destructive" : ""}`}
                    data-ocid="form-destination-country"
                  />
                  {fieldErr("destinationCountry") && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="form-destination-country.field_error"
                    >
                      {fieldErr("destinationCountry")}
                    </p>
                  )}
                </div>
              </div>
            </fieldset>

            {/* Section 3: Purpose */}
            <fieldset className="space-y-4">
              <legend className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                ৩. আবেদনের উদ্দেশ্য
              </legend>
              <div className="space-y-1.5">
                <Label htmlFor="purpose" className="text-xs font-semibold">
                  সাহায্যের উদ্দেশ্য <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={set("purpose")}
                  onBlur={() => handleBlur("purpose")}
                  placeholder="কোন কারণে সাহায্যের আবেদন করছেন তা বিস্তারিত লিখুন..."
                  className={`min-h-[100px] resize-none text-sm ${fieldErr("purpose") ? "border-destructive" : ""}`}
                  data-ocid="form-purpose"
                />
                {fieldErr("purpose") && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="form-purpose.field_error"
                  >
                    {fieldErr("purpose")}
                  </p>
                )}
              </div>
            </fieldset>

            {/* Section 4: Payment */}
            <fieldset className="space-y-4">
              <legend className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                ৪. আবেদন ফি পরিশোধ
              </legend>
              <p className="text-sm text-muted-foreground">
                নিচের যেকোনো একটি পদ্ধতিতে আবেদন প্রক্রিয়াকরণ ফি পরিশোধ করুন এবং
                ট্রানজেকশন আইডি সংরক্ষণ করুন:
              </p>

              {/* Payment cards — always visible with numbers */}
              <PaymentCards
                paymentConfig={paymentConfig}
                onPayBkash={() => setPaymentModalMode("bkash")}
                onPayNagad={() => setPaymentModalMode("nagad")}
              />

              <div className="space-y-1.5">
                <Label
                  htmlFor="transactionId"
                  className="text-xs font-semibold"
                >
                  ট্রানজেকশন আইডি <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="transactionId"
                  value={formData.transactionId}
                  onChange={set("transactionId")}
                  onBlur={() => handleBlur("transactionId")}
                  placeholder="পেমেন্টের পর প্রাপ্ত TrxID / ট্রানজেকশন আইডি"
                  className={`h-10 font-mono text-sm ${fieldErr("transactionId") ? "border-destructive" : ""}`}
                  data-ocid="form-transaction-id"
                />
                {fieldErr("transactionId") && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="form-transaction-id.field_error"
                  >
                    {fieldErr("transactionId")}
                  </p>
                )}
              </div>
            </fieldset>

            {/* Section 5: Additional Notes */}
            <fieldset>
              <legend className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                ৫. অতিরিক্ত তথ্য (ঐচ্ছিক)
              </legend>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={set("notes")}
                placeholder="কোনো বিশেষ তথ্য বা মন্তব্য থাকলে লিখুন..."
                className="min-h-[72px] resize-none text-sm"
                data-ocid="form-notes"
              />
            </fieldset>

            {/* Submit */}
            <div className="border-t border-border pt-4">
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="btn-primary w-full gap-2 py-3 text-base"
                data-ocid="form-submit-btn"
              >
                {mutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    আবেদন জমা হচ্ছে...
                  </span>
                ) : (
                  "আবেদন জমা দিন →"
                )}
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                জমা দেওয়ার পর একটি রেফারেন্স নম্বর পাবেন। এটি দিয়ে আবেদনের অবস্থা যাচাই
                করতে পারবেন।
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* ── 4. Organization Verification Section (bottom) ─────────────── */}
      <OrgVerificationSection contactConfig={contactConfig} />
    </CustomerLayout>
  );
}
