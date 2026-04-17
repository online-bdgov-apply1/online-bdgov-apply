import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BuildingIcon,
  CheckCircle2Icon,
  CreditCardIcon,
  InfoIcon,
  PhoneCallIcon,
  SaveIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";
import { AdminLayout } from "../components/Layout/AdminLayout";
import { LoadingPage } from "../components/ui/LoadingSpinner";
import { useActor } from "../hooks/useActor";
import {
  getContactConfig,
  getPaymentConfig,
  setContactConfig,
  setPaymentConfig,
} from "../lib/api";
import { useAuthStore } from "../stores/authStore";
import type { ContactConfig, PaymentConfig } from "../types";

export function AdminPaymentsPage() {
  const { actor, isFetching } = useActor();
  const { adminToken } = useAuthStore();
  const queryClient = useQueryClient();

  const [bkash, setBkash] = useState("");
  const [nagad, setNagad] = useState("");
  const [paymentSaved, setPaymentSaved] = useState(false);

  const [contact, setContact] = useState<ContactConfig>({
    helpline: "",
    imo: "",
    whatsapp: "",
    establishYear: "2019",
  });
  const [contactSaved, setContactSaved] = useState(false);

  const { data: config, isLoading: isPaymentLoading } = useQuery<PaymentConfig>(
    {
      queryKey: ["paymentConfig"],
      queryFn: () =>
        actor
          ? getPaymentConfig(actor)
          : Promise.resolve({ bkash: "", nagad: "" }),
      enabled: !!actor && !isFetching,
    },
  );

  const { data: contactData, isLoading: isContactLoading } =
    useQuery<ContactConfig>({
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
      enabled: !!actor && !isFetching,
    });

  useEffect(() => {
    if (config) {
      setBkash(config.bkash ?? "");
      setNagad(config.nagad ?? "");
    }
  }, [config]);

  useEffect(() => {
    if (contactData) {
      setContact({
        helpline: contactData.helpline ?? "",
        imo: contactData.imo ?? "",
        whatsapp: contactData.whatsapp ?? "",
        establishYear: contactData.establishYear ?? "2019",
      });
    }
  }, [contactData]);

  const paymentMutation = useMutation({
    mutationFn: () => {
      if (!actor || !adminToken) throw new Error("No auth");
      return setPaymentConfig(actor, adminToken, bkash.trim(), nagad.trim());
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        setPaymentSaved(true);
        toast.success("পেমেন্ট কনফিগারেশন সংরক্ষিত হয়েছে");
        queryClient.invalidateQueries({ queryKey: ["paymentConfig"] });
        setTimeout(() => setPaymentSaved(false), 3000);
      } else {
        toast.error(result.err);
      }
    },
    onError: () => toast.error("সংরক্ষণ ব্যর্থ হয়েছে"),
  });

  const contactMutation = useMutation({
    mutationFn: () => {
      if (!actor || !adminToken) throw new Error("No auth");
      return setContactConfig(actor, adminToken, {
        helpline: contact.helpline.trim(),
        imo: contact.imo.trim(),
        whatsapp: contact.whatsapp.trim(),
        establishYear: contact.establishYear?.trim() ?? "2019",
      });
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        setContactSaved(true);
        toast.success("যোগাযোগ তথ্য সংরক্ষিত হয়েছে");
        queryClient.invalidateQueries({ queryKey: ["contactConfig"] });
        setTimeout(() => setContactSaved(false), 3000);
      } else {
        toast.error(result.err);
      }
    },
    onError: () => toast.error("সংরক্ষণ ব্যর্থ হয়েছে"),
  });

  const isLoading = isPaymentLoading || isContactLoading;

  if (isLoading)
    return (
      <AdminLayout>
        <LoadingPage />
      </AdminLayout>
    );

  const isPaymentDirty = config
    ? bkash !== (config.bkash ?? "") || nagad !== (config.nagad ?? "")
    : false;

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    paymentMutation.mutate();
  };

  const handleContactSave = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate();
  };

  return (
    <AdminLayout>
      <div className="p-5 sm:p-6 md:p-8">
        <div className="mb-6">
          <h1 className="font-display text-xl font-bold text-foreground">
            পেমেন্ট ও যোগাযোগ সেটিং
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            বিকাশ/নগদ নম্বর, হেল্পলাইন, ইমো, হোয়াটসঅ্যাপ ও প্রতিষ্ঠা সাল পরিচালনা করুন
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* ── Payment Config ─────────────────────────────────────────── */}
          <div className="space-y-5">
            <div className="card-elevated p-5" data-ocid="payment-config-form">
              <div className="mb-4 flex items-center gap-2">
                <CreditCardIcon className="h-4 w-4 text-primary" />
                <h2 className="font-display text-sm font-bold text-foreground">
                  পেমেন্ট নম্বর সেট করুন
                </h2>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                {/* bKash */}
                <div className="space-y-1.5 rounded-lg border-2 border-pink-200 bg-pink-50/50 p-3">
                  <Label
                    htmlFor="bkash-number"
                    className="flex items-center gap-2 text-xs font-semibold text-pink-800"
                  >
                    <span className="inline-flex h-5 w-12 items-center justify-center rounded bg-pink-100 text-[10px] font-bold text-pink-700">
                      bKash
                    </span>
                    বিকাশ নম্বর
                  </Label>
                  <Input
                    id="bkash-number"
                    type="tel"
                    value={bkash}
                    onChange={(e) => setBkash(e.target.value)}
                    placeholder="01852389090"
                    className="h-10 border-pink-300 text-sm focus-visible:ring-pink-400"
                    data-ocid="bkash-number-input"
                  />
                  <p className="text-[10px] text-pink-700">
                    এই নম্বরটি বিকাশ কার্ডে সরাসরি দেখাবে
                  </p>
                </div>

                {/* Nagad */}
                <div className="space-y-1.5 rounded-lg border-2 border-orange-200 bg-orange-50/50 p-3">
                  <Label
                    htmlFor="nagad-number"
                    className="flex items-center gap-2 text-xs font-semibold text-orange-800"
                  >
                    <span className="inline-flex h-5 w-12 items-center justify-center rounded bg-orange-100 text-[10px] font-bold text-orange-700">
                      Nagad
                    </span>
                    নগদ নম্বর
                  </Label>
                  <Input
                    id="nagad-number"
                    type="tel"
                    value={nagad}
                    onChange={(e) => setNagad(e.target.value)}
                    placeholder="01852389090"
                    className="h-10 border-orange-300 text-sm focus-visible:ring-orange-400"
                    data-ocid="nagad-number-input"
                  />
                  <p className="text-[10px] text-orange-700">
                    এই নম্বরটি নগদ কার্ডে সরাসরি দেখাবে
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2.5">
                  <span className="text-xs text-muted-foreground">
                    {paymentSaved ? (
                      <span className="flex items-center gap-1.5 text-primary">
                        <CheckCircle2Icon className="h-3.5 w-3.5" />
                        সংরক্ষণ সম্পন্ন
                      </span>
                    ) : isPaymentDirty ? (
                      "অসংরক্ষিত পরিবর্তন আছে"
                    ) : (
                      "কনফিগারেশন আপ-টু-ডেট"
                    )}
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={
                    paymentMutation.isPending || !bkash.trim() || !nagad.trim()
                  }
                  className="btn-primary w-full gap-2"
                  data-ocid="save-payment-config-btn"
                >
                  <SaveIcon className="h-4 w-4" />
                  {paymentMutation.isPending
                    ? "সংরক্ষণ হচ্ছে..."
                    : "পেমেন্ট নম্বর সংরক্ষণ করুন"}
                </Button>
              </form>
            </div>

            {/* Live preview */}
            <div className="card-elevated p-5" data-ocid="payment-preview">
              <h2 className="mb-3 font-display text-sm font-bold text-foreground">
                কাস্টমার পোর্টালে কার্ডে দেখাবে
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="overflow-hidden rounded-lg border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-card">
                  <div className="bg-pink-600 px-3 py-1.5">
                    <span className="text-xs font-bold text-white">bKash</span>
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] text-pink-700">বিকাশ নম্বর:</p>
                    <p className="font-mono text-sm font-black text-pink-800">
                      {bkash || "সেট করা হয়নি"}
                    </p>
                  </div>
                </div>
                <div className="overflow-hidden rounded-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-card">
                  <div className="bg-orange-500 px-3 py-1.5">
                    <span className="text-xs font-bold text-white">Nagad</span>
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] text-orange-700">নগদ নম্বর:</p>
                    <p className="font-mono text-sm font-black text-orange-800">
                      {nagad || "সেট করা হয়নি"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Contact Config ─────────────────────────────────────────── */}
          <div className="space-y-5">
            <div className="card-elevated p-5" data-ocid="contact-config-form">
              <div className="mb-4 flex items-center gap-2">
                <PhoneCallIcon className="h-4 w-4 text-primary" />
                <h2 className="font-display text-sm font-bold text-foreground">
                  যোগাযোগ নম্বর ও সেটিং
                </h2>
              </div>

              <form onSubmit={handleContactSave} className="space-y-4">
                {/* Helpline */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="helpline"
                    className="flex items-center gap-2 text-xs"
                  >
                    <PhoneCallIcon className="h-3.5 w-3.5 text-primary" />
                    হেল্পলাইন নম্বর
                  </Label>
                  <Input
                    id="helpline"
                    type="tel"
                    value={contact.helpline}
                    onChange={(e) =>
                      setContact((p) => ({ ...p, helpline: e.target.value }))
                    }
                    placeholder="01852389090"
                    className="h-10 text-sm"
                    data-ocid="helpline-number-input"
                  />
                </div>

                {/* WhatsApp */}
                <div className="space-y-1.5 rounded-lg border-2 border-green-200 bg-green-50/50 p-3">
                  <Label
                    htmlFor="whatsapp"
                    className="flex items-center gap-2 text-xs font-semibold text-green-800"
                  >
                    <SiWhatsapp className="h-4 w-4 text-[#25D366]" />
                    WhatsApp নম্বর
                    <span className="ml-auto rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
                      wa.me লিংক
                    </span>
                  </Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    value={contact.whatsapp}
                    onChange={(e) =>
                      setContact((p) => ({ ...p, whatsapp: e.target.value }))
                    }
                    placeholder="01852389090"
                    className="h-10 border-green-300 text-sm focus-visible:ring-green-400"
                    data-ocid="whatsapp-number-input"
                  />
                  <p className="text-[10px] text-green-700">
                    ক্লিক করলে সরাসরি wa.me/{"{880+নম্বর}"} খুলবে
                  </p>
                </div>

                {/* Imo */}
                <div className="space-y-1.5 rounded-lg border-2 border-violet-200 bg-violet-50/50 p-3">
                  <Label
                    htmlFor="imo"
                    className="flex items-center gap-2 text-xs font-semibold text-violet-800"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-100 text-[8px] font-black text-violet-700">
                      imo
                    </span>
                    Imo নম্বর
                    <span className="ml-auto rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold text-violet-700">
                      imo.im লিংক
                    </span>
                  </Label>
                  <Input
                    id="imo"
                    type="tel"
                    value={contact.imo}
                    onChange={(e) =>
                      setContact((p) => ({ ...p, imo: e.target.value }))
                    }
                    placeholder="01852389090"
                    className="h-10 border-violet-300 text-sm focus-visible:ring-violet-400"
                    data-ocid="imo-number-input"
                  />
                  <p className="text-[10px] text-violet-700">
                    ক্লিক করলে সরাসরি imo.im/l/{"{880+নম্বর}"} খুলবে
                  </p>
                </div>

                {/* Establishment Year */}
                <div className="space-y-1.5 rounded-lg border-2 border-primary/20 bg-primary/5 p-3">
                  <Label
                    htmlFor="establishYear"
                    className="flex items-center gap-2 text-xs font-semibold text-primary"
                  >
                    <BuildingIcon className="h-3.5 w-3.5" />
                    প্রতিষ্ঠা সাল (Establishment Year)
                  </Label>
                  <Input
                    id="establishYear"
                    type="text"
                    value={contact.establishYear ?? "2019"}
                    onChange={(e) =>
                      setContact((p) => ({
                        ...p,
                        establishYear: e.target.value,
                      }))
                    }
                    placeholder="2019"
                    className="h-10 border-primary/30 text-sm focus-visible:ring-primary/40"
                    data-ocid="establish-year-input"
                  />
                  <p className="text-[10px] text-primary/70">
                    পোর্টালের নিচে যাচাইকরণ সেকশনে প্রতিষ্ঠা সাল দেখাবে
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2.5">
                  <span className="text-xs text-muted-foreground">
                    {contactSaved ? (
                      <span className="flex items-center gap-1.5 text-primary">
                        <CheckCircle2Icon className="h-3.5 w-3.5" />
                        সংরক্ষণ সম্পন্ন
                      </span>
                    ) : (
                      "যোগাযোগ তথ্য আপডেট করুন"
                    )}
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={contactMutation.isPending}
                  className="btn-primary w-full gap-2"
                  data-ocid="save-contact-config-btn"
                >
                  <SaveIcon className="h-4 w-4" />
                  {contactMutation.isPending
                    ? "সংরক্ষণ হচ্ছে..."
                    : "যোগাযোগ তথ্য সংরক্ষণ করুন"}
                </Button>
              </form>
            </div>

            {/* Info */}
            <div className="flex items-start gap-2.5 rounded-md border border-border bg-muted/30 p-3">
              <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground">কোথায় কী দেখাবে?</p>
                <ul className="mt-1 space-y-1">
                  <li>
                    • <strong>হেল্পলাইন, WhatsApp, Imo</strong> — হেডারের নিচে
                    যোগাযোগ বারে
                  </li>
                  <li>
                    • <strong>বিকাশ/নগদ নম্বর</strong> — পেমেন্ট কার্ডে সরাসরি দৃশ্যমান
                  </li>
                  <li>
                    • <strong>প্রতিষ্ঠা সাল</strong> — পেজের নিচে যাচাইকরণ সেকশনে
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
