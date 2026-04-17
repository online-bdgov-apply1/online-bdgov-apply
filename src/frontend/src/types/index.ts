export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  requirements: string;
  active: boolean;
}

export interface Application {
  id: string;
  refNumber: string;
  customerName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  phone: string;
  nid: string;
  presentAddress: string;
  permanentAddress: string;
  district: string;
  destinationCountry: string;
  purpose: string;
  transactionId: string;
  notes: string;
  status: string;
  submittedAt: bigint;
}

export interface PaymentConfig {
  bkash: string;
  nagad: string;
}

export interface ContactConfig {
  helpline: string;
  imo: string;
  whatsapp: string;
  establishYear: string;
}

export interface AdminStats {
  total: bigint;
  pending: bigint;
  processing: bigint;
  approved: bigint;
  rejected: bigint;
}

export type ApplicationStatus =
  | "Pending"
  | "Processing"
  | "Approved"
  | "Rejected";

export type BackendResult<T> =
  | { __kind__: "ok"; ok: T }
  | { __kind__: "err"; err: string };
