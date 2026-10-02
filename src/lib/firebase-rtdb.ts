// Reads the Firebase Realtime Database over REST (server-side only).
// Works with public read rules, or with a legacy DB secret once rules are locked.

import { formatInvoiceNo, invoicePeriod, invoiceSerial } from "./invoice";
import type { Invoice, InvoiceInput, InvoiceItem } from "./invoice";

const DB_URL = process.env.FIREBASE_DATABASE_URL;
const DB_SECRET = process.env.FIREBASE_DB_SECRET;

export type FirebaseUser = {
  Name?: string;
  username?: string;
  password?: string;
  role?: string;
};

function authSuffix(): string {
  return DB_SECRET ? `?auth=${encodeURIComponent(DB_SECRET)}` : "";
}

export async function readPath<T>(path: string): Promise<T | null> {
  if (!DB_URL) throw new Error("FIREBASE_DATABASE_URL is not set.");
  const res = await fetch(`${DB_URL}/${path}.json${authSuffix()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`RTDB read failed (${res.status})`);
  return (await res.json()) as T | null;
}

export async function writePath(path: string, data: unknown): Promise<void> {
  if (!DB_URL) throw new Error("FIREBASE_DATABASE_URL is not set.");
  const res = await fetch(`${DB_URL}/${path}.json${authSuffix()}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`RTDB write failed (${res.status})`);
}

export async function deletePath(path: string): Promise<void> {
  if (!DB_URL) throw new Error("FIREBASE_DATABASE_URL is not set.");
  const res = await fetch(`${DB_URL}/${path}.json${authSuffix()}`, {
    method: "DELETE",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`RTDB delete failed (${res.status})`);
}

export type Vendor = {
  id: string;
  firmName?: string;
  contactPerson?: string;
  email?: string;
  mobile?: number | string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  gstNumber?: string;
  status?: string;
};

/** Reads /Vendors, dropping the "lastKey" counter and any non-object entries. */
export async function getVendors(): Promise<Vendor[]> {
  const data = await readPath<Record<string, unknown>>("Vendors");
  if (!data) return [];
  return Object.entries(data)
    .filter(([key, value]) => key !== "lastKey" && value !== null && typeof value === "object")
    .map(([id, value]) => ({ id, ...(value as Omit<Vendor, "id">) }));
}

export type VendorInput = Omit<Vendor, "id">;

export async function getVendor(id: string): Promise<Vendor | null> {
  const data = await readPath<Omit<Vendor, "id">>(`Vendors/${id}`);
  if (!data || typeof data !== "object") return null;
  return { id, ...data };
}

/** Adds a vendor at the next numeric key and bumps /Vendors/lastKey. */
export async function createVendor(input: VendorInput): Promise<string> {
  const lastKey = Number((await readPath<number>("Vendors/lastKey")) ?? 0);
  const newKey = lastKey + 1;
  await writePath(`Vendors/${newKey}`, input);
  await writePath("Vendors/lastKey", newKey);
  return String(newKey);
}

export async function updateVendor(id: string, input: VendorInput): Promise<void> {
  await writePath(`Vendors/${id}`, input);
}

export async function deleteVendor(id: string): Promise<void> {
  await deletePath(`Vendors/${id}`);
}

export type Device = {
  id: string;
  deviceIMEI?: number | string;
  MSISDN?: number | string;
  simNumber?: number | string;
  model?: string;
  modelId?: string;
  typeId?: string;
  vendorId?: string;
  status?: string;
  // Resolved names for display:
  typeName?: string;
  modelName?: string;
  vendorName?: string;
};

/** Looks up a value by numeric id in a Firebase array-or-object collection. */
function lookup(collection: unknown, id?: string): string | undefined {
  if (!id || collection == null) return undefined;
  if (Array.isArray(collection)) return collection[Number(id)] ?? undefined;
  return (collection as Record<string, string>)[id];
}

export type DeviceInput = {
  deviceIMEI?: number | string;
  MSISDN?: number | string;
  simNumber?: number | string;
  vendorId?: string;
  typeId?: string;
  modelId?: string;
  model?: string;
  status?: string;
};

export type IdName = { id: string; name: string };

/** Turns a Firebase array/object of string values into {id, name} options. */
function toOptions(collection: unknown): IdName[] {
  if (!collection) return [];
  const entries = Array.isArray(collection)
    ? collection.map((value, index) => [String(index), value] as [string, unknown])
    : Object.entries(collection);
  return entries
    .filter(
      ([key, value]) =>
        key !== "lastKey" &&
        key !== "laskKey" &&
        value !== null &&
        typeof value === "string",
    )
    .map(([id, value]) => ({ id, name: String(value) }));
}

/** Vendor / type / model options for the device form's dropdowns. */
export async function getDeviceOptions(): Promise<{
  vendors: IdName[];
  types: IdName[];
  models: IdName[];
}> {
  const [types, models, vendorsData] = await Promise.all([
    readPath<unknown>("DeviceData/Types"),
    readPath<unknown>("DeviceData/Model"),
    readPath<Record<string, { firmName?: string }>>("Vendors"),
  ]);

  const vendors: IdName[] = vendorsData
    ? Object.entries(vendorsData)
        .filter(([key, value]) => key !== "lastKey" && value !== null && typeof value === "object")
        .map(([id, value]) => ({ id, name: value.firmName ?? id }))
    : [];

  return { vendors, types: toOptions(types), models: toOptions(models) };
}

export async function getDevice(id: string): Promise<Device | null> {
  const data = await readPath<Omit<Device, "id">>(`DeviceData/Devices/${id}`);
  if (!data || typeof data !== "object") return null;
  return { id, ...data };
}

export async function createDevice(input: DeviceInput): Promise<string> {
  const lastKey = Number((await readPath<number>("DeviceData/Devices/laskKey")) ?? 0);
  const newKey = lastKey + 1;
  await writePath(`DeviceData/Devices/${newKey}`, input);
  await writePath("DeviceData/Devices/laskKey", newKey);
  return String(newKey);
}

export async function updateDevice(id: string, input: DeviceInput): Promise<void> {
  await writePath(`DeviceData/Devices/${id}`, input);
}

const numify = (value: string) => (/^\d+$/.test(value) ? Number(value) : value);

/** Builds a device record from a form body, resolving the model name from modelId. */
export async function deviceInputFromBody(
  body: Record<string, unknown>,
): Promise<DeviceInput> {
  const str = (key: string) => String(body?.[key] ?? "").trim();
  const modelId = str("modelId");
  const { models } = await getDeviceOptions();
  const modelName = models.find((m) => m.id === modelId)?.name ?? "";

  return {
    deviceIMEI: numify(str("deviceIMEI")),
    MSISDN: numify(str("MSISDN")),
    // SIM/ICCID numbers are ~19-20 digits — beyond JS safe-integer range, so
    // store as a string to keep every digit (a number would truncate them).
    simNumber: str("simNumber"),
    vendorId: str("vendorId"),
    typeId: str("typeId"),
    modelId,
    model: modelName,
    status: str("status") || "Active",
  };
}

export async function deleteDevice(id: string): Promise<void> {
  await deletePath(`DeviceData/Devices/${id}`);
}

/** Reads /DeviceData/Devices and resolves vendor/type/model names. */
export async function getDevices(): Promise<Device[]> {
  const [devicesData, types, models, vendorsData] = await Promise.all([
    readPath<Record<string, unknown>>("DeviceData/Devices"),
    readPath<unknown>("DeviceData/Types"),
    readPath<unknown>("DeviceData/Model"),
    readPath<Record<string, { firmName?: string }>>("Vendors"),
  ]);
  if (!devicesData) return [];

  return Object.entries(devicesData)
    .filter(([key, value]) => key !== "laskKey" && key !== "lastKey" && value !== null && typeof value === "object")
    .map(([id, value]) => {
      const d = value as Omit<Device, "id">;
      return {
        id,
        ...d,
        typeName: lookup(types, d.typeId),
        modelName: lookup(models, d.modelId) ?? d.model,
        vendorName: d.vendorId && vendorsData ? vendorsData[d.vendorId]?.firmName : undefined,
      };
    });
}

/** Firebase stores arrays as numeric-keyed objects — normalise both shapes. */
function toArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value.filter((entry) => entry != null);
  if (value && typeof value === "object") return Object.values(value);
  return [];
}

function toItems(value: unknown): InvoiceItem[] {
  return toArray(value).map((entry) => {
    const item = (entry ?? {}) as Partial<InvoiceItem>;
    return {
      name: String(item.name ?? ""),
      hsn: String(item.hsn ?? ""),
      qty: Number(item.qty ?? 0),
      unit: String(item.unit ?? "PCS"),
      rate: Number(item.rate ?? 0),
      taxRate: Number(item.taxRate ?? 0),
    };
  });
}

function toInvoice(id: string, data: Partial<InvoiceInput>): Invoice {
  const str = (value: unknown) => String(value ?? "");
  return {
    id,
    invoiceNo: str(data.invoiceNo),
    invoiceDate: str(data.invoiceDate),
    dueDate: str(data.dueDate),
    billName: str(data.billName),
    billAddress: str(data.billAddress),
    billGstin: str(data.billGstin),
    billMobile: str(data.billMobile),
    placeOfSupply: str(data.placeOfSupply),
    shipSame: data.shipSame !== false,
    shipName: str(data.shipName),
    shipAddress: str(data.shipAddress),
    items: toItems(data.items),
    discount: Number(data.discount ?? 0),
    receivedAmount: Number(data.receivedAmount ?? 0),
    notes: str(data.notes),
    status: (data.status ?? "unpaid") as Invoice["status"],
    createdAt: str(data.createdAt),
  };
}

/** Reads /Invoices, newest first. */
export async function getInvoices(): Promise<Invoice[]> {
  const data = await readPath<Record<string, unknown>>("Invoices");
  if (!data) return [];

  return Object.entries(data)
    .filter(([key, value]) => key !== "lastKey" && value !== null && typeof value === "object")
    .map(([id, value]) => toInvoice(id, value as Partial<InvoiceInput>))
    .sort((a, b) => Number(b.id) - Number(a.id));
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  const data = await readPath<Partial<InvoiceInput>>(`Invoices/${id}`);
  if (!data || typeof data !== "object") return null;
  return toInvoice(id, data);
}

/** Suggests the next invoice number: this month's highest serial plus one.
    Derived from the stored numbers rather than a counter, so a hand-edited or
    deleted invoice can't leave the sequence stranded. */
export async function nextInvoiceNumber(): Promise<string> {
  const period = invoicePeriod();
  const invoices = await getInvoices();

  const highest = invoices.reduce((max, invoice) => {
    const serial = invoiceSerial(invoice.invoiceNo, period);
    return serial !== null && serial > max ? serial : max;
  }, 0);

  return formatInvoiceNo(period, highest + 1);
}

/** The id of an invoice already using this number, or null. `exceptId` lets an
    edit keep its own number without colliding with itself. */
export async function findInvoiceByNumber(
  invoiceNo: string,
  exceptId?: string,
): Promise<string | null> {
  const wanted = invoiceNo.trim().toLowerCase();
  if (!wanted) return null;

  const invoices = await getInvoices();
  const clash = invoices.find(
    (invoice) =>
      invoice.id !== exceptId && invoice.invoiceNo.trim().toLowerCase() === wanted,
  );
  return clash?.id ?? null;
}

export async function createInvoice(input: InvoiceInput): Promise<string> {
  const lastKey = Number((await readPath<number>("Invoices/lastKey")) ?? 0);
  const newKey = lastKey + 1;
  await writePath(`Invoices/${newKey}`, input);
  await writePath("Invoices/lastKey", newKey);
  return String(newKey);
}

export async function updateInvoice(id: string, input: InvoiceInput): Promise<void> {
  await writePath(`Invoices/${id}`, input);
}

export async function deleteInvoice(id: string): Promise<void> {
  await deletePath(`Invoices/${id}`);
}

/** Builds a storable invoice from a form/JSON body, coercing every field. */
export function invoiceInputFromBody(body: Record<string, unknown>): InvoiceInput {
  const str = (key: string) => String(body?.[key] ?? "").trim();
  const num = (key: string) => {
    const value = Number(body?.[key]);
    return Number.isFinite(value) ? value : 0;
  };

  const items = toItems(body?.items)
    // Drop blank rows the form may have left behind.
    .filter((item) => item.name || item.rate || item.hsn);

  const shipSame = body?.shipSame !== false && body?.shipSame !== "false";

  return {
    invoiceNo: str("invoiceNo"),
    invoiceDate: str("invoiceDate"),
    dueDate: str("dueDate"),
    billName: str("billName"),
    billAddress: str("billAddress"),
    billGstin: str("billGstin"),
    billMobile: str("billMobile"),
    placeOfSupply: str("placeOfSupply"),
    shipSame,
    shipName: shipSame ? str("billName") : str("shipName"),
    shipAddress: shipSame ? str("billAddress") : str("shipAddress"),
    items,
    discount: num("discount"),
    receivedAmount: num("receivedAmount"),
    notes: str("notes"),
    status: (str("status") || "unpaid") as InvoiceInput["status"],
    createdAt: str("createdAt") || new Date().toISOString(),
  };
}

export type AdminCheck =
  | { status: "ok"; user: FirebaseUser }
  | { status: "invalid" } // no username/password match
  | { status: "forbidden" }; // matched but not an admin

/** Verifies credentials against /Users and requires role === "admin". */
export async function checkAdminCredentials(
  username: string,
  password: string,
): Promise<AdminCheck> {
  const users = await readPath<Record<string, FirebaseUser>>("Users");
  if (!users) return { status: "invalid" };

  const match = Object.values(users).find(
    (u) => u?.username === username && u?.password === password,
  );
  if (!match) return { status: "invalid" };
  if ((match.role ?? "").toLowerCase() !== "admin") return { status: "forbidden" };

  return { status: "ok", user: match };
}
