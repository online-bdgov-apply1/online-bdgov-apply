import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PaymentConfig {
    nagad: string;
    bkash: string;
}
export interface Service {
    id: string;
    active: boolean;
    name: string;
    createdAt: bigint;
    description: string;
    price: number;
    requirements: string;
}
export interface Application {
    id: string;
    dob: string;
    nid: string;
    customerName: string;
    status: string;
    submittedAt: bigint;
    motherName: string;
    permanentAddress: string;
    district: string;
    fatherName: string;
    notes: string;
    phone: string;
    destinationCountry: string;
    presentAddress: string;
    purpose: string;
    refNumber: string;
    transactionId: string;
}
export interface ContactConfig {
    imo: string;
    establishYear: string;
    whatsapp: string;
    helpline: string;
}
export interface backendInterface {
    addService(token: string, name: string, description: string, price: number, requirements: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteService(token: string, id: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getAllServicesAdmin(token: string): Promise<{
        __kind__: "ok";
        ok: Array<Service>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getApplicationByPhone(phone: string): Promise<Array<Application>>;
    getApplicationByRef(ref: string): Promise<Application | null>;
    getApplications(token: string): Promise<{
        __kind__: "ok";
        ok: Array<Application>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getContactConfig(): Promise<ContactConfig>;
    getPaymentConfig(): Promise<PaymentConfig>;
    getServices(): Promise<Array<Service>>;
    getStats(token: string): Promise<{
        __kind__: "ok";
        ok: {
            total: bigint;
            pending: bigint;
            approved: bigint;
            rejected: bigint;
            processing: bigint;
        };
    } | {
        __kind__: "err";
        err: string;
    }>;
    logoutAdmin(token: string): Promise<boolean>;
    setContactConfig(token: string, config: ContactConfig): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setPaymentConfig(token: string, bkash: string, nagad: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    submitApplication(customerName: string, fatherName: string, motherName: string, dob: string, phone: string, nid: string, presentAddress: string, permanentAddress: string, district: string, destinationCountry: string, purpose: string, transactionId: string, notes: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateApplicationStatus(token: string, appId: string, status: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateService(token: string, id: string, name: string, description: string, price: number, requirements: string, active: boolean): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    validateToken(token: string): Promise<boolean>;
    verifyAdmin(username: string, password: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
}
