// Reads the Firebase Realtime Database over REST (server-side only).
// Works with public read rules, or with a legacy DB secret once rules are locked.

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
