"use client";

import { useState } from "react";
import { Button } from "./Button";
import {
  emptyContactValues,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactValues,
} from "@/lib/contact-schema";

type Status = "idle" | "submitting" | "success" | "error";

const fields: {
  name: ContactField;
  label: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
}[] = [
  { name: "name", label: "Full name", type: "text", placeholder: "Ravi Sharma", autoComplete: "name" },
  { name: "email", label: "Work email", type: "email", placeholder: "ravi@company.com", autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", placeholder: "+91-9461587155", autoComplete: "tel" },
  { name: "fleetSize", label: "Number of vehicles", type: "number", placeholder: "12" },
];

const inputClass =
  "w-full rounded-lg border bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-signal-400 focus:outline-none";

export default function ContactForm() {
  const [values, setValues] = useState<ContactValues>(emptyContactValues);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  function update(field: ContactField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateContact(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Request failed");

      setValues(emptyContactValues);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-signal-500/30 bg-signal-500/10 p-8 text-center"
      >
        <h2 className="text-xl font-semibold text-ink">Thanks — we have your request.</h2>
        <p className="mt-3 text-sm leading-relaxed text-body">
          A Fleet Vaults specialist will call you within one working day to schedule
          your demo.
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-line bg-surface p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          const errorId = `${field.name}-error`;
          const hasError = Boolean(errors[field.name]);

          return (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-body"
              >
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                min={field.type === "number" ? 1 : undefined}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                value={values[field.name]}
                onChange={(event) => update(field.name, event.target.value)}
                aria-invalid={hasError}
                aria-describedby={hasError ? errorId : undefined}
                className={`mt-2 ${inputClass} ${
                  hasError ? "border-red-400" : "border-line"
                }`}
              />
              {hasError && (
                <p id={errorId} className="mt-1.5 text-xs text-red-400">
                  {errors[field.name]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5">
        <label htmlFor="message" className="block text-sm font-medium text-body">
          What do you need to track?
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="We run 12 trucks between Jaipur and Jodhpur and keep losing time on unplanned halts."
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`mt-2 ${inputClass} ${
            errors.message ? "border-red-400" : "border-line"
          }`}
        />
        {errors.message && (
          <p id="message-error" className="mt-1.5 text-xs text-red-400">
            {errors.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <p role="alert" className="mt-5 text-sm text-red-400">
          Something went wrong sending your message. Please try again, or email us at
          info@fleetvaults.com.
        </p>
      )}

      <Button type="submit" disabled={status === "submitting"} className="mt-7 w-full sm:w-auto">
        {status === "submitting" ? "Sending…" : "Request a demo"}
      </Button>
    </form>
  );
}
