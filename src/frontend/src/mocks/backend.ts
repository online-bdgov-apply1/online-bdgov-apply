import type { backendInterface } from "../backend";

const mockApp = (overrides: Partial<{
  id: string; customerName: string; phone: string; nid: string; serviceId: string;
  status: string; transactionId: string; refNumber: string; notes: string; submittedAt: bigint;
  fatherName: string; motherName: string; dob: string; presentAddress: string;
  permanentAddress: string; district: string; destinationCountry: string; purpose: string;
}> = {}) => ({
  id: "app-001",
  customerName: "মোঃ রহিম উদ্দিন",
  fatherName: "মোঃ করিম উদ্দিন",
  motherName: "রহিমা বেগম",
  dob: "1985-06-15",
  phone: "01711234567",
  nid: "1234567890123",
  serviceId: "svc-001",
  presentAddress: "গ্রাম: পূর্বপাড়া, উপজেলা: কিশোরগঞ্জ সদর",
  permanentAddress: "গ্রাম: পূর্বপাড়া, উপজেলা: কিশোরগঞ্জ সদর",
  district: "কিশোরগঞ্জ",
  destinationCountry: "সৌদি আরব",
  purpose: "বিদেশগামী শ্রমিক সহায়তার জন্য আবেদন",
  status: "Pending",
  transactionId: "BKS123456789",
  refNumber: "REF-2024-001",
  notes: "",
  submittedAt: BigInt(Date.now() - 86400000),
  ...overrides,
});

export const mockBackend: backendInterface = {
  verifyAdmin: async (_username: string, _password: string) => ({
    __kind__: "ok" as const,
    ok: "mock-admin-token-123",
  }),

  validateToken: async (_token: string) => true,

  logoutAdmin: async (_token: string) => true,

  getServices: async () => [
    {
      id: "svc-001",
      name: "স্বাস্থ্য কার্ড নিবন্ধন",
      description: "জাতীয় স্বাস্থ্য কার্ডের জন্য নিবন্ধন করুন এবং সরকারি স্বাস্থ্য সেবা উপভোগ করুন।",
      price: 500,
      requirements: "জাতীয় পরিচয়পত্র, পাসপোর্ট সাইজের ছবি, মোবাইল নম্বর",
      active: true,
      createdAt: BigInt(Date.now()),
    },
    {
      id: "svc-002",
      name: "বিশেষজ্ঞ চিকিৎসা রেফারেল",
      description: "সরকারি হাসপাতালে বিশেষজ্ঞ চিকিৎসকের কাছে রেফারেল সেবা।",
      price: 300,
      requirements: "স্বাস্থ্য কার্ড, পূর্ববর্তী প্রেসক্রিপশন",
      active: true,
      createdAt: BigInt(Date.now()),
    },
    {
      id: "svc-003",
      name: "টিকা কার্যক্রম নিবন্ধন",
      description: "সরকারি টিকা কার্যক্রমে নিবন্ধন করুন এবং বিনামূল্যে টিকা নিন।",
      price: 0,
      requirements: "জাতীয় পরিচয়পত্র বা জন্ম নিবন্ধন সনদ",
      active: true,
      createdAt: BigInt(Date.now()),
    },
    {
      id: "svc-004",
      name: "মেডিকেল সার্টিফিকেট",
      description: "সরকারি মেডিকেল সার্টিফিকেট প্রাপ্তির জন্য আবেদন করুন।",
      price: 750,
      requirements: "জাতীয় পরিচয়পত্র, স্বাস্থ্য পরীক্ষার রিপোর্ট",
      active: true,
      createdAt: BigInt(Date.now()),
    },
  ],

  getAllServicesAdmin: async (_token: string) => ({
    __kind__: "ok" as const,
    ok: [
      {
        id: "svc-001",
        name: "স্বাস্থ্য কার্ড নিবন্ধন",
        description: "জাতীয় স্বাস্থ্য কার্ডের জন্য নিবন্ধন করুন এবং সরকারি স্বাস্থ্য সেবা উপভোগ করুন।",
        price: 500,
        requirements: "জাতীয় পরিচয়পত্র, পাসপোর্ট সাইজের ছবি, মোবাইল নম্বর",
        active: true,
        createdAt: BigInt(Date.now()),
      },
      {
        id: "svc-002",
        name: "বিশেষজ্ঞ চিকিৎসা রেফারেল",
        description: "সরকারি হাসপাতালে বিশেষজ্ঞ চিকিৎসকের কাছে রেফারেল সেবা।",
        price: 300,
        requirements: "স্বাস্থ্য কার্ড, পূর্ববর্তী প্রেসক্রিপশন",
        active: true,
        createdAt: BigInt(Date.now()),
      },
      {
        id: "svc-003",
        name: "টিকা কার্যক্রম নিবন্ধন",
        description: "সরকারি টিকা কার্যক্রমে নিবন্ধন করুন এবং বিনামূল্যে টিকা নিন।",
        price: 0,
        requirements: "জাতীয় পরিচয়পত্র বা জন্ম নিবন্ধন সনদ",
        active: false,
        createdAt: BigInt(Date.now()),
      },
    ],
  }),

  addService: async (_token, _name, _desc, _price, _reqs) => ({
    __kind__: "ok" as const,
    ok: "Service added",
  }),

  updateService: async (_token, _id, _name, _desc, _price, _reqs, _active) => ({
    __kind__: "ok" as const,
    ok: "Service updated",
  }),

  deleteService: async (_token, _id) => ({
    __kind__: "ok" as const,
    ok: "Service deleted",
  }),

  getApplications: async (_token: string) => ({
    __kind__: "ok" as const,
    ok: [
      mockApp({ id: "app-001", refNumber: "REF-2024-001", status: "Pending" }),
      mockApp({
        id: "app-002",
        customerName: "ফাতেমা বেগম",
        fatherName: "আবুল হোসেন",
        phone: "01812345678",
        nid: "9876543210987",
        serviceId: "svc-002",
        destinationCountry: "মালয়েশিয়া",
        status: "Approved",
        transactionId: "NGD987654321",
        refNumber: "REF-2024-002",
        notes: "পূর্ববর্তী রিপোর্ট সংযুক্ত",
        submittedAt: BigInt(Date.now() - 172800000),
      }),
      mockApp({
        id: "app-003",
        customerName: "আব্দুল করিম",
        fatherName: "মোঃ সালাম",
        phone: "01912345678",
        nid: "5678901234567",
        serviceId: "svc-004",
        status: "Processing",
        transactionId: "BKS111222333",
        refNumber: "REF-2024-003",
        submittedAt: BigInt(Date.now() - 3600000),
      }),
    ],
  }),

  getApplicationByPhone: async (_phone: string) => [
    mockApp({ id: "app-001", refNumber: "REF-2024-001", status: "Pending" }),
  ],

  getApplicationByRef: async (_ref: string) =>
    mockApp({ id: "app-001", refNumber: "REF-2024-001", status: "Pending" }),

  submitApplication: async (
    _name, _fatherName, _motherName, _dob, _phone, _nid,
    _presentAddr, _permanentAddr, _district, _destCountry, _purpose, _txId, _notes,
  ) => ({
    __kind__: "ok" as const,
    ok: "REF-2024-NEW001",
  }),

  updateApplicationStatus: async (_token, _appId, _status) => ({
    __kind__: "ok" as const,
    ok: "Status updated",
  }),

  getPaymentConfig: async () => ({
    bkash: "01712345678",
    nagad: "01812345678",
  }),

  setPaymentConfig: async (_token, _bkash, _nagad) => ({
    __kind__: "ok" as const,
    ok: "Payment config updated",
  }),

  getContactConfig: async () => ({
    helpline: "01911223344",
    imo: "01911223344",
    whatsapp: "8801911223344",
    establishYear: "2019",
  }),

  setContactConfig: async (_token, _config) => ({
    __kind__: "ok" as const,
    ok: "Contact config updated",
  }),

  getStats: async (_token: string) => ({
    __kind__: "ok" as const,
    ok: {
      total: BigInt(47),
      pending: BigInt(12),
      approved: BigInt(28),
      rejected: BigInt(4),
      processing: BigInt(3),
    },
  }),
};
