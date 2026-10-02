import Image from "next/image";
import logo from "../../../../public/brand/veer-softtech-logo.png";
import stamp from "../../../../public/brand/veer-softtech-stamp.png";
import {
  SELLER,
  amountInWords,
  calcInvoice,
  formatDate,
  money,
  type Invoice,
} from "@/lib/invoice";

// The printed bill. Layout mirrors a standard Indian GST tax invoice, so the
// borders are drawn explicitly rather than left to a card style — this is the
// one place in the app that has to survive a printer.

const line = "border-slate-700";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <p className="leading-snug">
      <span className="font-semibold text-slate-900">{label}</span>{" "}
      <span className="text-slate-800">{value}</span>
    </p>
  );
}

/** Bill-to / ship-to block. */
function Party({
  heading,
  name,
  address,
  gstin,
  mobile,
  placeOfSupply,
}: {
  heading: string;
  name: string;
  address: string;
  gstin?: string;
  mobile?: string;
  placeOfSupply?: string;
}) {
  return (
    <div className="p-3">
      <p className="text-[11px] tracking-wide text-slate-600">{heading}</p>
      <p className="mt-1 text-sm font-bold uppercase text-slate-900">{name || "—"}</p>
      {address && (
        <p className="mt-1 flex gap-1 text-[11px] leading-snug">
          <span className="shrink-0 font-semibold text-slate-900">Address:</span>
          <span className="whitespace-pre-line text-slate-800">{address}</span>
        </p>
      )}
      <div className="mt-1 space-y-0.5 text-[11px]">
        {gstin && (
          <span className="mr-4 inline-block">
            <span className="font-semibold text-slate-900">GSTIN:</span>{" "}
            <span className="text-slate-800">{gstin}</span>
          </span>
        )}
        {placeOfSupply && (
          <span className="inline-block">
            <span className="font-semibold text-slate-900">Place of Supply:</span>{" "}
            <span className="text-slate-800">{placeOfSupply}</span>
          </span>
        )}
        {mobile && <Field label="Mobile:" value={mobile} />}
      </div>
    </div>
  );
}

export default function InvoiceDocument({ invoice }: { invoice: Invoice }) {
  const totals = calcInvoice(invoice);
  const taxLabel = totals.intraState ? ["CGST", "SGST"] : ["IGST", ""];

  return (
    <div className="print-sheet mx-auto w-full max-w-[860px] bg-white p-6 text-slate-900 sm:p-8">
      <p className="mb-3 text-center text-sm font-bold uppercase tracking-wide">
        Tax Invoice
      </p>

      <div className={`border ${line}`}>
        {/* Seller + invoice meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Logo sits on its own line so the wide lockup gets full width,
              with the name and address stacked beneath it. */}
          <div className={`border-b ${line} p-3 sm:border-b-0 sm:border-r`}>
            <Image
              src={logo}
              alt={SELLER.name}
              sizes="260px"
              className="h-11 w-auto object-contain object-left"
            />
            <div className="mt-2 text-[11px]">
              <p className="text-base font-bold leading-tight text-slate-900">
                {SELLER.name}
              </p>
              {SELLER.addressLines.map((text) => (
                <p key={text} className="leading-snug text-slate-800">
                  {text}
                </p>
              ))}
              <div className="mt-1.5 flex flex-wrap gap-x-6 gap-y-0.5">
                <Field label="GSTIN:" value={SELLER.gstin} />
                <Field label="Mobile:" value={SELLER.mobile} />
              </div>
            </div>
          </div>

          {/* One row per field, split evenly so the rules line up with the
              seller block beside it. */}
          <div className="flex h-full flex-col text-[11px]">
            {[
              ["Invoice No.", invoice.invoiceNo || "—"],
              ["Invoice Date", formatDate(invoice.invoiceDate)],
              ["Due Date", formatDate(invoice.dueDate)],
            ].map(([label, value], index) => (
              <div
                key={label}
                className={`flex flex-1 items-center justify-between gap-3 px-3 py-2 ${
                  index < 2 ? `border-b ${line}` : ""
                }`}
              >
                <span className="font-bold text-slate-900">{label}</span>
                <span className="text-slate-800">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bill to / ship to */}
        <div className={`grid grid-cols-1 border-t ${line} sm:grid-cols-2`}>
          <div className={`border-b ${line} sm:border-b-0 sm:border-r`}>
            <Party
              heading="BILL TO"
              name={invoice.billName}
              address={invoice.billAddress}
              gstin={invoice.billGstin}
              mobile={invoice.billMobile}
              placeOfSupply={invoice.placeOfSupply}
            />
          </div>
          <Party
            heading="SHIP TO"
            name={invoice.shipSame ? invoice.billName : invoice.shipName}
            address={invoice.shipSame ? invoice.billAddress : invoice.shipAddress}
          />
        </div>

        {/* Line items */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-[11px]">
            <thead>
              <tr className={`border-y ${line} bg-slate-100 text-center font-bold text-slate-900`}>
                <th className={`border-r ${line} px-2 py-2 font-bold`}>S.NO.</th>
                <th className={`border-r ${line} px-2 py-2 font-bold`}>ITEMS</th>
                <th className={`border-r ${line} px-2 py-2 font-bold`}>HSN</th>
                <th className={`border-r ${line} px-2 py-2 font-bold`}>QTY.</th>
                <th className={`border-r ${line} px-2 py-2 font-bold`}>RATE</th>
                <th className={`border-r ${line} px-2 py-2 font-bold`}>TAX</th>
                <th className="px-2 py-2 font-bold">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {totals.items.map((item, index) => (
                <tr key={index} className="align-top">
                  <td className={`border-r ${line} px-2 py-2 text-center`}>{index + 1}</td>
                  <td className={`border-r ${line} px-2 py-2`}>{item.name}</td>
                  <td className={`border-r ${line} px-2 py-2 text-right`}>{item.hsn || "—"}</td>
                  <td className={`border-r ${line} px-2 py-2 text-right`}>
                    {money(item.qty)} {item.unit}
                  </td>
                  <td className={`border-r ${line} px-2 py-2 text-right`}>{money(item.rate)}</td>
                  <td className={`border-r ${line} px-2 py-2 text-right`}>
                    {money(item.tax)}
                    <span className="block text-[10px] text-slate-500">({money(item.taxRate)}%)</span>
                  </td>
                  <td className="px-2 py-2 text-right">{money(item.amount)}</td>
                </tr>
              ))}

              {/* Keeps the ruled column lines running down the page, like a printed pad. */}
              <tr aria-hidden="true">
                <td className={`border-r ${line} h-40 print:h-28`} />
                <td className={`border-r ${line}`} />
                <td className={`border-r ${line}`} />
                <td className={`border-r ${line}`} />
                <td className={`border-r ${line}`} />
                <td className={`border-r ${line}`} />
                <td />
              </tr>

              {totals.discount > 0 && (
                <tr className="font-semibold italic">
                  <td className={`border-r ${line} px-2 py-2`} />
                  <td className={`border-r ${line} px-2 py-2 text-right`}>Discount</td>
                  <td className={`border-r ${line} px-2 py-2 text-center`}>-</td>
                  <td className={`border-r ${line} px-2 py-2 text-center`}>-</td>
                  <td className={`border-r ${line} px-2 py-2 text-center`}>-</td>
                  <td className={`border-r ${line} px-2 py-2 text-center`}>-</td>
                  <td className="px-2 py-2 text-right">- ₹ {money(totals.discount)}</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className={`border-y ${line} bg-slate-100 font-bold`}>
                <td className={`border-r ${line} px-2 py-2`} />
                <td className={`border-r ${line} px-2 py-2 text-right`}>TOTAL</td>
                <td className={`border-r ${line} px-2 py-2`} />
                <td className={`border-r ${line} px-2 py-2 text-right`}>{money(totals.qty)}</td>
                <td className={`border-r ${line} px-2 py-2`} />
                <td className={`border-r ${line} px-2 py-2 text-right`}>₹ {money(totals.tax)}</td>
                <td className="px-2 py-2 text-right">₹ {money(totals.total)}</td>
              </tr>
              <tr className="font-bold">
                <td className={`border-r ${line} px-2 py-2`} />
                <td className={`border-r ${line} px-2 py-2 text-right`}>RECEIVED AMOUNT</td>
                <td className={`border-r ${line} px-2 py-2`} />
                <td className={`border-r ${line} px-2 py-2`} />
                <td className={`border-r ${line} px-2 py-2`} />
                <td className={`border-r ${line} px-2 py-2`} />
                <td className="px-2 py-2 text-right">₹ {money(totals.received)}</td>
              </tr>
              {totals.balance !== 0 && (
                <tr className={`border-t ${line} font-bold`}>
                  <td className={`border-r ${line} px-2 py-2`} />
                  <td className={`border-r ${line} px-2 py-2 text-right`}>BALANCE DUE</td>
                  <td className={`border-r ${line} px-2 py-2`} />
                  <td className={`border-r ${line} px-2 py-2`} />
                  <td className={`border-r ${line} px-2 py-2`} />
                  <td className={`border-r ${line} px-2 py-2`} />
                  <td className="px-2 py-2 text-right">₹ {money(totals.balance)}</td>
                </tr>
              )}
            </tfoot>
          </table>
        </div>
      </div>

      {/* HSN / tax summary */}
      <div className={`mt-3 overflow-x-auto border ${line}`}>
        <table className="w-full min-w-[640px] border-collapse text-[11px]">
          <thead>
            <tr className={`border-b ${line} bg-slate-100 text-center`}>
              <th rowSpan={2} className={`border-r ${line} px-2 py-2 font-bold`}>
                HSN/SAC
              </th>
              <th rowSpan={2} className={`border-r ${line} px-2 py-2 font-bold`}>
                Taxable Value
              </th>
              <th colSpan={2} className={`border-b border-r ${line} px-2 py-1 font-bold`}>
                {taxLabel[0]}
              </th>
              {totals.intraState && (
                <th colSpan={2} className={`border-b border-r ${line} px-2 py-1 font-bold`}>
                  {taxLabel[1]}
                </th>
              )}
              <th rowSpan={2} className="px-2 py-2 font-bold">
                Total Tax Amount
              </th>
            </tr>
            <tr className={`border-b ${line} bg-slate-100 text-center`}>
              <th className={`border-r ${line} px-2 py-1 font-bold`}>Rate</th>
              <th className={`border-r ${line} px-2 py-1 font-bold`}>Amount</th>
              {totals.intraState && (
                <>
                  <th className={`border-r ${line} px-2 py-1 font-bold`}>Rate</th>
                  <th className={`border-r ${line} px-2 py-1 font-bold`}>Amount</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {totals.hsnRows.map((row) => (
              <tr key={`${row.hsn}-${row.taxRate}`}>
                <td className={`border-r ${line} px-2 py-2`}>{row.hsn}</td>
                <td className={`border-r ${line} px-2 py-2 text-right`}>{money(row.taxable)}</td>
                <td className={`border-r ${line} px-2 py-2 text-right`}>{money(row.splitRate)}%</td>
                <td className={`border-r ${line} px-2 py-2 text-right`}>{money(row.cgst)}</td>
                {totals.intraState && (
                  <>
                    <td className={`border-r ${line} px-2 py-2 text-right`}>{money(row.splitRate)}%</td>
                    <td className={`border-r ${line} px-2 py-2 text-right`}>{money(row.sgst)}</td>
                  </>
                )}
                <td className="px-2 py-2 text-right">₹ {money(row.tax)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Amount in words */}
      <div className={`mt-3 border ${line} p-3 text-[11px]`}>
        <p className="font-bold text-slate-900">Total Amount (in words)</p>
        <p className="mt-0.5 text-slate-800">{amountInWords(totals.total)}</p>
      </div>

      {/* Bank, terms, signature */}
      <div className={`mt-3 grid grid-cols-1 border ${line} text-[11px] sm:grid-cols-3`}>
        <div className={`border-b ${line} p-3 sm:border-b-0 sm:border-r`}>
          <p className="font-bold text-slate-900">Bank Details</p>
          <div className="mt-1 space-y-0.5">
            <Field label="Name:" value={SELLER.bank.accountName || "—"} />
            <Field label="IFSC Code:" value={SELLER.bank.ifsc || "—"} />
            <Field label="Account No:" value={SELLER.bank.accountNo || "—"} />
            <Field label="Bank:" value={SELLER.bank.bankName || "—"} />
          </div>
        </div>

        <div className={`border-b ${line} p-3 sm:border-b-0 sm:border-r`}>
          <p className="font-bold text-slate-900">Terms and Conditions</p>
          <ol className="mt-1 space-y-0.5 text-slate-800">
            {SELLER.terms.map((term, index) => (
              <li key={term} className="leading-snug">
                {index + 1}. {term}
              </li>
            ))}
          </ol>
        </div>

        {/* The stamp already reads "FOR VEER SOFTTECH … Proprietor", so the
            caption below it stays short rather than repeating the firm name. */}
        <div className="flex flex-col items-center justify-end p-3 text-center">
          <Image
            src={stamp}
            alt={`Authorised signatory for ${SELLER.name}`}
            sizes="200px"
            className="h-[4.5rem] w-auto max-w-full object-contain"
          />
          <p className="mt-1.5 text-slate-800">Authorised Signatory</p>
        </div>
      </div>

      {invoice.notes && (
        <div className={`mt-3 border ${line} p-3 text-[11px]`}>
          <p className="font-bold text-slate-900">Notes</p>
          <p className="mt-0.5 whitespace-pre-line text-slate-800">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
}
