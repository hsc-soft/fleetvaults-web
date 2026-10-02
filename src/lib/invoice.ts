// Invoice domain: the seller profile printed on every bill, line-item maths,
// the GST split, and the rupees-in-words line.

/** The firm that issues every invoice. Edit this block to reboard the bill. */
export const SELLER = {
  // The registered entity that bills; Fleet Vaults is its product brand.
  name: "Veer Softtech",
  addressLines: [
    "P.No A-80, F.No-S3, Dadudayal Nagar, Near ISKCON Temple,",
    "Mansarovar, Jaipur, Rajasthan, 302020",
  ],
  gstin: "08BEKPC1597K1Z5",
  pan: "BEKPC1597K",
  mobile: "9461587155",
  email: "info@fleetvaults.com",
  /** Home state — decides CGST+SGST (intra-state) vs IGST (inter-state). */
  state: "Rajasthan",
  bank: {
    accountName: "VEER SOFTTECH",
    bankName: "HDFC Bank Limited, Shipra Path, Mansarovar",
    ifsc: "HDFC0005141",
    // A string, not a number — 14 digits would be fine, but account numbers
    // are identifiers and leading zeros must survive.
    accountNo: "50200118163589",
  },
  terms: [
    "Goods once sold will not be taken back or exchanged.",
    "All disputes are subject to Jaipur jurisdiction only.",
    "Product warranty as per company policy.",
    "Delivery charges will be extra.",
    "Payment 100% advance.",
  ],
} as const;

export type InvoiceItem = {
  name: string;
  hsn: string;
  qty: number;
  unit: string;
  /** Rate per unit, before tax. */
  rate: number;
  /** GST percentage, e.g. 18. */
  taxRate: number;
};

export type InvoiceStatus = "draft" | "unpaid" | "partial" | "paid";

export type Invoice = {
  id: string;
  invoiceNo: string;
  /** ISO yyyy-mm-dd. */
  invoiceDate: string;
  dueDate: string;

  billName: string;
  billAddress: string;
  billGstin: string;
  billMobile: string;
  placeOfSupply: string;

  /** When true the ship-to block mirrors bill-to. */
  shipSame: boolean;
  shipName: string;
  shipAddress: string;

  items: InvoiceItem[];
  /** Flat rupee discount, deducted after tax (matches the printed format). */
  discount: number;
  receivedAmount: number;
  notes: string;
  status: InvoiceStatus;
  createdAt: string;
};

export type InvoiceInput = Omit<Invoice, "id">;

export const round2 = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

/** Indian digit grouping, and no trailing ".00" — matches the printed bill. */
export function money(value: number): string {
  const rounded = round2(value);
  return rounded.toLocaleString("en-IN", {
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export type ItemTotals = InvoiceItem & {
  taxable: number;
  tax: number;
  amount: number;
};

export type HsnRow = {
  hsn: string;
  taxRate: number;
  taxable: number;
  /** Half the GST rate intra-state, the whole rate for IGST. */
  splitRate: number;
  /** CGST intra-state, the whole IGST otherwise. */
  cgst: number;
  /** SGST intra-state, zero otherwise. The two halves always sum to `tax`,
      so a rate like 18% on ₹1,037.29 splits 518.65 / 518.64, not 518.65 twice. */
  sgst: number;
  tax: number;
};

export type InvoiceTotals = {
  items: ItemTotals[];
  qty: number;
  taxable: number;
  tax: number;
  gross: number;
  discount: number;
  total: number;
  received: number;
  balance: number;
  intraState: boolean;
  hsnRows: HsnRow[];
};

const norm = (value: string) => value.trim().toLowerCase();

/** Runs the line-item maths and groups tax by HSN for the summary table. */
export function calcInvoice(
  invoice: Pick<
    Invoice,
    "items" | "discount" | "receivedAmount" | "placeOfSupply"
  >,
): InvoiceTotals {
  const items: ItemTotals[] = invoice.items.map((item) => {
    const taxable = round2(item.qty * item.rate);
    const tax = round2((taxable * item.taxRate) / 100);
    return { ...item, taxable, tax, amount: round2(taxable + tax) };
  });

  const sum = (pick: (item: ItemTotals) => number) =>
    round2(items.reduce((total, item) => total + pick(item), 0));

  const taxable = sum((item) => item.taxable);
  const tax = sum((item) => item.tax);
  const gross = sum((item) => item.amount);
  const discount = round2(invoice.discount || 0);
  const total = round2(gross - discount);
  const received = round2(invoice.receivedAmount || 0);

  // Place of supply blank means "same state" — the common case.
  const intraState =
    !invoice.placeOfSupply.trim() ||
    norm(invoice.placeOfSupply) === norm(SELLER.state);

  // One summary row per HSN + rate pair.
  const grouped = new Map<string, HsnRow>();
  for (const item of items) {
    const hsn = item.hsn.trim() || "—";
    const key = `${hsn}|${item.taxRate}`;
    const row = grouped.get(key) ?? {
      hsn,
      taxRate: item.taxRate,
      taxable: 0,
      splitRate: 0,
      cgst: 0,
      sgst: 0,
      tax: 0,
    };
    row.taxable = round2(row.taxable + item.taxable);
    row.tax = round2(row.tax + item.tax);
    grouped.set(key, row);
  }

  const hsnRows = [...grouped.values()].map((row) => {
    // Round one half, derive the other, so the pair reconciles to the total.
    const cgst = intraState ? round2(row.tax / 2) : row.tax;
    return {
      ...row,
      splitRate: intraState ? round2(row.taxRate / 2) : row.taxRate,
      cgst,
      sgst: intraState ? round2(row.tax - cgst) : 0,
    };
  });

  return {
    items,
    qty: round2(items.reduce((total, item) => total + item.qty, 0)),
    taxable,
    tax,
    gross,
    discount,
    total,
    received,
    balance: round2(total - received),
    intraState,
    hsnRows,
  };
}

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];

const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty",
  "Ninety",
];

function underHundred(value: number): string {
  if (value < 20) return ONES[value];
  const tens = TENS[Math.floor(value / 10)];
  const ones = value % 10;
  return ones ? `${tens} ${ONES[ones]}` : tens;
}

function underThousand(value: number): string {
  const hundreds = Math.floor(value / 100);
  const rest = value % 100;
  const parts: string[] = [];
  if (hundreds) parts.push(ONES[hundreds], "Hundred");
  if (rest) parts.push(underHundred(rest));
  return parts.join(" ");
}

/** Indian numbering — crore, lakh, thousand. */
function wholeInWords(value: number): string {
  if (value === 0) return "Zero";

  const crore = Math.floor(value / 10000000);
  const lakh = Math.floor((value % 10000000) / 100000);
  const thousand = Math.floor((value % 100000) / 1000);
  const rest = value % 1000;

  const parts: string[] = [];
  if (crore) parts.push(`${wholeInWords(crore)} Crore`);
  if (lakh) parts.push(`${underHundred(lakh)} Lakh`);
  if (thousand) parts.push(`${underHundred(thousand)} Thousand`);
  if (rest) parts.push(underThousand(rest));
  return parts.join(" ");
}

/** e.g. 5300 → "Five Thousand Three Hundred Rupees". */
export function amountInWords(value: number): string {
  const rounded = round2(Math.abs(value));
  const rupees = Math.floor(rounded);
  const paise = Math.round((rounded - rupees) * 100);

  const sign = value < 0 ? "Minus " : "";
  const words = `${sign}${wholeInWords(rupees)} Rupees`;
  return paise ? `${words} and ${underHundred(paise)} Paise` : words;
}

/** Today in the seller's timezone as yyyy-mm-dd, whatever the server's TZ is.
    Computed on the server and passed down, so hydration can't disagree. */
export function todayInIndia(offsetDays = 0): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Invoice numbers read VS-YYYYMMNNNN — firm initials, the month the bill
    belongs to, then a serial that restarts at 0001 each month. The YYYYMM
    keeps them unique across months even though the serial repeats. */
export const INVOICE_PREFIX = "VS-";
const SERIAL_DIGITS = 4;

/** The "VS-YYYYMM" part for a given IST date (default: today). */
export function invoicePeriod(isoDate: string = todayInIndia()): string {
  return `${INVOICE_PREFIX}${isoDate.slice(0, 4)}${isoDate.slice(5, 7)}`;
}

export function formatInvoiceNo(period: string, serial: number): string {
  return `${period}${String(serial).padStart(SERIAL_DIGITS, "0")}`;
}

/** The serial inside an invoice number, or null if it isn't from this period. */
export function invoiceSerial(invoiceNo: string, period: string): number | null {
  if (!invoiceNo.startsWith(period)) return null;
  const serial = invoiceNo.slice(period.length);
  return /^\d+$/.test(serial) ? Number(serial) : null;
}

/** 2026-09-13 → 13/09/2026, the format the bill prints. */
export function formatDate(iso: string): string {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-");
  return year && month && day ? `${day}/${month}/${year}` : iso;
}

export const emptyItem = (): InvoiceItem => ({
  name: "",
  hsn: "",
  qty: 1,
  unit: "PCS",
  rate: 0,
  taxRate: 18,
});
