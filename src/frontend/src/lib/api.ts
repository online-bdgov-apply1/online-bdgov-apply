import type { createActor } from "../backend";
import type {
  Application,
  ContactConfig,
  PaymentConfig,
  Service,
} from "../types";

// Public APIs
export async function getServices(
  actor: ReturnType<typeof createActor>,
): Promise<Service[]> {
  return actor.getServices();
}

export async function getPaymentConfig(
  actor: ReturnType<typeof createActor>,
): Promise<PaymentConfig> {
  return actor.getPaymentConfig();
}

export async function getContactConfig(
  actor: ReturnType<typeof createActor>,
): Promise<ContactConfig> {
  return actor.getContactConfig();
}

export async function submitApplication(
  actor: ReturnType<typeof createActor>,
  customerName: string,
  fatherName: string,
  motherName: string,
  dob: string,
  phone: string,
  nid: string,
  presentAddress: string,
  permanentAddress: string,
  district: string,
  destinationCountry: string,
  purpose: string,
  transactionId: string,
  notes: string,
): Promise<{ __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }> {
  return actor.submitApplication(
    customerName,
    fatherName,
    motherName,
    dob,
    phone,
    nid,
    presentAddress,
    permanentAddress,
    district,
    destinationCountry,
    purpose,
    transactionId,
    notes,
  );
}

export async function getApplicationByPhone(
  actor: ReturnType<typeof createActor>,
  phone: string,
): Promise<Application[]> {
  return actor.getApplicationByPhone(phone);
}

export async function getApplicationByRef(
  actor: ReturnType<typeof createActor>,
  ref: string,
): Promise<Application | null> {
  return actor.getApplicationByRef(ref);
}

// Admin APIs
export async function verifyAdmin(
  actor: ReturnType<typeof createActor>,
  username: string,
  password: string,
): Promise<{ __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }> {
  return actor.verifyAdmin(username, password);
}

export async function validateToken(
  actor: ReturnType<typeof createActor>,
  token: string,
): Promise<boolean> {
  return actor.validateToken(token);
}

export async function getAllServicesAdmin(
  actor: ReturnType<typeof createActor>,
  _token: string,
): Promise<Service[]> {
  return actor.getServices();
}

export async function addService(
  actor: ReturnType<typeof createActor>,
  token: string,
  name: string,
  description: string,
  price: number,
  requirements: string,
): Promise<{ __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }> {
  return actor.addService(token, name, description, price, requirements);
}

export async function updateService(
  actor: ReturnType<typeof createActor>,
  token: string,
  id: string,
  name: string,
  description: string,
  price: number,
  requirements: string,
  active: boolean,
): Promise<{ __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }> {
  return actor.updateService(
    token,
    id,
    name,
    description,
    price,
    requirements,
    active,
  );
}

export async function deleteService(
  actor: ReturnType<typeof createActor>,
  token: string,
  id: string,
): Promise<{ __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }> {
  return actor.deleteService(token, id);
}

export async function setPaymentConfig(
  actor: ReturnType<typeof createActor>,
  token: string,
  bkash: string,
  nagad: string,
): Promise<{ __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }> {
  return actor.setPaymentConfig(token, bkash, nagad);
}

export async function setContactConfig(
  actor: ReturnType<typeof createActor>,
  token: string,
  config: ContactConfig,
): Promise<{ __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }> {
  return actor.setContactConfig(token, config);
}

export async function getApplications(
  actor: ReturnType<typeof createActor>,
  token: string,
): Promise<Application[]> {
  const result = await actor.getApplications(token);
  if (result.__kind__ === "ok") return result.ok;
  throw new Error(result.err);
}

export async function updateApplicationStatus(
  actor: ReturnType<typeof createActor>,
  token: string,
  appId: string,
  status: string,
): Promise<{ __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }> {
  return actor.updateApplicationStatus(token, appId, status);
}
